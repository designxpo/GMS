import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const SECRET = process.env.NEXTAUTH_SECRET ?? "gms-fallback-secret-change-in-prod";
function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

async function main() {
  console.log("Starting full-platform seeding...");

  // 1. Setup Tenant & Admin
  const tenantId = "1";
  const tenant = await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: "EquiEvent Premium",
      slug: "equievent-pro",
    },
  });

  const admin = await prisma.user.upsert({
    where: { id: "demo-admin-id" },
    update: { hashedPassword: hashPassword("Admin@123") },
    create: {
      id: "demo-admin-id",
      email: "admin@equievent.com",
      name: "Super Admin",
      hashedPassword: hashPassword("Admin@123"),
      role: "SUPER_ADMIN",
      tenantId: tenant.id,
    },
  });

  // 2. Setup Logistics (Venues & Rings)
  const venue = await prisma.venue.create({
    data: {
      name: "Global Equestrian Park",
      address: "Equi St, Ocala, FL",
      tenantId: tenant.id,
      rings: {
        create: [
          { name: "Arena A (Main)" },
          { name: "Arena B (Hunter)" },
          { name: "Warm-up Ring" },
        ],
      },
    },
  });
  const rings = await prisma.ring.findMany({ where: { venueId: venue.id } });

  // 3. Setup Activities
  const jumping = await prisma.activity.create({
    data: {
      name: "Show Jumping",
      description: "Obstacle course with timed rounds.",
    },
  });
  const dressage = await prisma.activity.create({
    data: {
      name: "Dressage",
      description: "Precision movements and artistic training.",
    },
  });

  // 4. Setup Events
  const ongoingEvent = await prisma.event.upsert({
    where: { slug: "national-champs-2026" },
    update: {
      status: "PUBLISHED",
      isPublic: true,
      discipline: "Jumping",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    create: {
      name: "National Championship 2026",
      slug: "national-champs-2026",
      status: "PUBLISHED",
      isPublic: true,
      discipline: "Jumping",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tenantId: tenant.id,
      venueId: venue.id,
      activities: {
        create: [
          { activityId: jumping.id, fee: 250 },
        ],
      },
    },
  });

  const eventActivity = await prisma.eventActivity.findFirst({ where: { eventId: ongoingEvent.id } });

  // 5. Setup Participants (Riders & Horses)
  const riders = [];
  const horses = [];
  const firstNames = ["Mike", "Sarah", "Chris", "Emma", "Daniel"];
  const lastNames = ["Johnson", "Baker", "Miller", "Taylor", "Davis"];
  const horseNames = ["Blueberry", "Stardust", "Apollo", "Legacy", "Titan"];

  for (let i = 0; i < 5; i++) {
    const r = await prisma.rider.create({
      data: {
        firstName: firstNames[i],
        lastName: lastNames[i],
        email: `${firstNames[i].toLowerCase()}@example.com`,
        licenseNumber: `LIC-${5000 + i}`,
        tenantId: tenant.id,
        status: "ACTIVE",
        vaccinations: {
          create: { vaccine: "EquiFlu", date: new Date(), status: "VERIFIED" }
        },
        documents: {
          create: { name: "Rider License", url: "https://example.com/doc.pdf" }
        }
      },
    });
    riders.push(r);

    const h = await prisma.horse.create({
      data: {
        name: horseNames[i],
        breed: "Dutch Warmblood",
        licenseNumber: `H-${7000 + i}`,
        tenantId: tenant.id,
        vaccinations: {
          create: { vaccine: "EHV-1", date: new Date(), status: "VERIFIED" }
        }
      },
    });
    horses.push(h);

    await prisma.riderHorse.create({
      data: { riderId: r.id, horseId: h.id },
    });

    // 6. Registrations & Payments
    const registration = await prisma.registration.create({
      data: {
        eventId: ongoingEvent.id,
        riderId: r.id,
        horseId: h.id,
        eventActivityId: eventActivity!.id,
        status: i === 0 ? "CONFIRMED" : "SUBMITTED",
        totalFee: 250,
        tenantId: tenant.id,
        payments: {
          create: { amount: 250, status: "PAID", tenantId: tenant.id }
        },
      },
    });

    // 7. Check-ins & Accreditations
    await prisma.checkIn.create({
      data: {

        eventId: ongoingEvent.id,
        riderId: r.id,
        horseId: h.id,
        qrToken: `QR-${registration.id}`,
        status: i === 0 ? "SCANNED" : "PENDING",
      },
    });

    await prisma.accreditation.create({
      data: {
        riderId: r.id,
        eventId: ongoingEvent.id,
        tenantId: tenant.id,
        type: "RIDER",
        status: i === 0 ? "ISSUED" : "PENDING",
        badgeNumber: `BADGE-${9000 + r.id.substring(0,4)}`,
        accessZones: ["STAFF", "ARENA", "STABLES"],
      },
    });

    // 8. Scheduling & Scoring
    const slot = await prisma.scheduleSlot.create({
      data: {
        eventId: ongoingEvent.id,
        riderId: r.id,
        horseId: h.id,
        ringId: rings[0].id,
        startTime: new Date(Date.now() + i * 3600000),
        endTime: new Date(Date.now() + (i + 1) * 3600000),
      },
    });

    if (i >= 0) {
      // Ensure judge assignment exists for this activity
      const judge = await prisma.judgeAssignment.upsert({
        where: { id: `judge-1-${eventActivity!.id}` },
        update: {},
        create: { 
          id: `judge-1-${eventActivity!.id}`,
          eventId: ongoingEvent.id, 
          userId: admin.id, 
          activityId: eventActivity!.id 
        }
      });

      // Randomized score for leaderboard variety
      const baseScore = 75 + (Math.random() * 20); 
      await prisma.score.upsert({
        where: { 
          scheduleSlotId_judgeAssignmentId: {
            scheduleSlotId: slot.id,
            judgeAssignmentId: judge.id
          }
        },
        update: {
          totalScore: parseFloat(baseScore.toFixed(1)),
          percentage: parseFloat(baseScore.toFixed(1)),
        },
        create: {
          scheduleSlotId: slot.id,
          eventActivityId: eventActivity!.id,
          judgeAssignmentId: judge.id,
          totalScore: parseFloat(baseScore.toFixed(1)),
          percentage: parseFloat(baseScore.toFixed(1)),
          remarks: "Strong performance with clear rhythm.",
          submittedAt: new Date(),
          submittedBy: admin.id,
        }
      });
    }
  }


  // 9. System (Notifications & Audits)
  await prisma.notificationTemplate.upsert({
    where: { triggerKey: "WELCOME" },
    update: {},
    create: {
      triggerKey: "WELCOME",
      subject: "Welcome to BSV",
      bodyEmail: "Hi {{name}}, welcome to the platform!",
    }
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: admin.id,
      action: "PLATFORM_SEED",
      entityType: "SYSTEM",
      entityId: "1",
      newValues: { message: "Initial platform seed completed" },
    }
  });

  console.log("Full-platform seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
