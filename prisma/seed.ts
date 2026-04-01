import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "equievent-pro" },
    update: {},
    create: {
      name: "EquiEvent Pro",
      slug: "equievent-pro",
    },
  });

  // 2. Create Admin User
  await prisma.user.upsert({
    where: { id: "demo-admin-id" }, // Using fixed ID for demo consistency
    update: {},
    create: {
      id: "demo-admin-id",
      email: "admin@equievent.com",
      name: "Admin User",
      role: "SUPER_ADMIN",
      tenantId: tenant.id,
    },
  });

  // 3. Create Venues
  const venue1 = await prisma.venue.create({
    data: {
      name: "Royal Equestrian Center",
      address: "123 Gallop Ln, Ocala, FL",
      tenantId: tenant.id,
      rings: {
        create: [
          { name: "Grand Prix Arena" },
          { name: "Hunter Ring 1" },
        ],
      },
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: "Sunrise Park",
      address: "456 Meadow St, Lexington, KY",
      tenantId: tenant.id,
      rings: {
        create: [
          { name: "Indoor Arena" },
        ],
      },
    },
  });

  // 4. Create Activities
  const jumping = await prisma.activity.create({
    data: {
      name: "Show Jumping",
      description: "Obstacle clearance within time limits",
    },
  });

  const dressage = await prisma.activity.create({
    data: {
      name: "Dressage",
      description: "Artistic horse training exhibition",
    },
  });

  // 5. Create Events
  const upcomingEvent = await prisma.event.create({
    data: {
      name: "Spring Jumping Cup",
      slug: "spring-jumping-2026",
      description: "An exciting spring jumping tournament.",
      discipline: "Jumping",
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-05-17"),
      status: "PUBLISHED",
      isPublic: true,
      tenantId: tenant.id,
      venueId: venue1.id,
      activities: {
        create: [
          { activityId: jumping.id, fee: 150 },
        ],
      },
    },
  });

  const pastEvent = await prisma.event.create({
    data: {
      name: "Winter Dressage Classic",
      slug: "winter-dressage-2025",
      description: "The premier winter dressage event.",
      discipline: "Dressage",
      startDate: new Date("2025-12-10"),
      endDate: new Date("2025-12-12"),
      status: "COMPLETED",
      isPublic: true,
      tenantId: tenant.id,
      venueId: venue2.id,
      activities: {
        create: [
          { activityId: dressage.id, fee: 200 },
        ],
      },
    },
  });

  // 6. Create Riders & Horses
  const riderNames = ["John Doe", "Jane Smith", "Alice Cooper", "Bob Brown"];
  const horseNames = ["Thunder", "Starlight", "Shadow", "Goldie"];

  for (let i = 0; i < riderNames.length; i++) {
    const rider = await prisma.rider.create({
      data: {
        firstName: riderNames[i].split(" ")[0],
        lastName: riderNames[i].split(" ")[1],
        email: `${riderNames[i].toLowerCase().replace(" ", ".")}@example.com`,
        licenseNumber: `LIC-${1000 + i}`,
        tenantId: tenant.id,
        status: "ACTIVE",
      },
    });

    const horse = await prisma.horse.create({
      data: {
        name: horseNames[i],
        licenseNumber: `H-${2000 + i}`,
        breed: "Warmblood",
        tenantId: tenant.id,
      },
    });

    // Link rider and horse
    await prisma.riderHorse.create({
      data: {
        riderId: rider.id,
        horseId: horse.id,
      },
    });

    // Create a registration for the upcoming event
    await prisma.registration.create({
      data: {
        eventId: upcomingEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        status: "SUBMITTED",
        totalFee: 150,
        tenantId: tenant.id,
        payments: {
          create: {
            amount: 150,
            status: "PAID",
            tenantId: tenant.id,
          },
        },
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
