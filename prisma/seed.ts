import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const SECRET = process.env.NEXTAUTH_SECRET ?? "gms-fallback-secret-change-in-prod";
function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding comprehensive GMS demo data...");

  // ── CLEANUP (reverse FK order) ──────────────────────────────────────────────
  await prisma.score.deleteMany();
  await prisma.scheduleSlot.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.accreditation.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.judgeAssignment.deleteMany();
  await prisma.eventActivity.deleteMany();
  await prisma.event.deleteMany();
  await prisma.document.deleteMany();
  await prisma.vaccination.deleteMany();
  await prisma.riderHorse.deleteMany();
  await prisma.horse.deleteMany();
  await prisma.rider.deleteMany();
  await prisma.ring.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notificationTemplate.deleteMany();
  await prisma.user.deleteMany();

  // ── TENANT ───────────────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: "equievent-pro" },
    update: { name: "EquiEvent Premium" },
    create: { name: "EquiEvent Premium", slug: "equievent-pro" },
  });

  // ── USERS ────────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@equievent.com",
      name: "Alexandra Sterling",
      hashedPassword: hashPassword("Admin@123"),
      role: "SUPER_ADMIN",
      tenantId: tenant.id,
      isActive: true,
    },
  });

  const judge1 = await prisma.user.create({
    data: {
      email: "maria.rodriguez@equievent.com",
      name: "Maria Rodriguez",
      hashedPassword: hashPassword("Admin@123"),
      role: "JUDGE",
      tenantId: tenant.id,
      isActive: true,
    },
  });

  const judge2 = await prisma.user.create({
    data: {
      email: "james.blackwood@equievent.com",
      name: "Dr. James Blackwood",
      hashedPassword: hashPassword("Admin@123"),
      role: "JUDGE",
      tenantId: tenant.id,
      isActive: true,
    },
  });

  const judge3 = await prisma.user.create({
    data: {
      email: "sophie.laurent@equievent.com",
      name: "Sophie Laurent",
      hashedPassword: hashPassword("Admin@123"),
      role: "JUDGE",
      tenantId: tenant.id,
      isActive: true,
    },
  });

  // ── VENUES & RINGS ────────────────────────────────────────────────────────────
  const venue1 = await prisma.venue.create({
    data: {
      name: "Global Equestrian Park",
      address: "1200 Equi Blvd, Ocala, FL 34470",
      tenantId: tenant.id,
      rings: {
        create: [
          { name: "Arena A — Grand Prix Ring" },
          { name: "Arena B — Hunter Ring" },
          { name: "Arena C — Practice / Warm-Up" },
        ],
      },
    },
    include: { rings: true },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: "Wellington Polo & Equestrian Club",
      address: "3667 Polo Club Rd, Wellington, FL 33414",
      tenantId: tenant.id,
      rings: {
        create: [
          { name: "International Dressage Arena" },
          { name: "Derby Field" },
        ],
      },
    },
    include: { rings: true },
  });

  const venue3 = await prisma.venue.create({
    data: {
      name: "Thunderhill Equestrian Center",
      address: "890 Bluegrass Lane, Lexington, KY 40503",
      tenantId: tenant.id,
      rings: {
        create: [
          { name: "Olympic Cross-Country Course" },
          { name: "Show Jumping Arena" },
        ],
      },
    },
    include: { rings: true },
  });

  const ringGrandPrix = venue1.rings.find((r) => r.name.includes("Grand Prix"))!;
  const ringHunter    = venue1.rings.find((r) => r.name.includes("Hunter"))!;
  void venue2.rings.find((r) => r.name.includes("Dressage"));

  // ── ACTIVITIES WITH SCORING CRITERIA ─────────────────────────────────────────
  const actJumping = await prisma.activity.create({
    data: {
      name: "Show Jumping",
      description: "Technical obstacle course with timed rounds and jump-off.",
      criteria: [
        { key: "technique",  label: "Jumping Technique",   maxScore: 30, weight: 0.30 },
        { key: "rhythm",     label: "Rhythm & Balance",    maxScore: 25, weight: 0.25 },
        { key: "impulsion",  label: "Impulsion & Energy",  maxScore: 25, weight: 0.25 },
        { key: "obedience",  label: "Horse Obedience",     maxScore: 20, weight: 0.20 },
      ],
    },
  });

  const actDressage = await prisma.activity.create({
    data: {
      name: "Dressage",
      description: "Precision movements showcasing horse and rider harmony.",
      criteria: [
        { key: "piaffe",        label: "Piaffe & Passage",          maxScore: 25, weight: 0.25 },
        { key: "extended_trot", label: "Extended Trot",             maxScore: 25, weight: 0.25 },
        { key: "shoulder_in",   label: "Shoulder-In & Travers",     maxScore: 25, weight: 0.25 },
        { key: "freestyle",     label: "Freestyle Choreography",    maxScore: 25, weight: 0.25 },
      ],
    },
  });

  const actCrossCountry = await prisma.activity.create({
    data: {
      name: "Cross-Country",
      description: "Endurance and jumping across natural terrain obstacles.",
      criteria: [
        { key: "time_faults", label: "Time Faults",    maxScore: 30, weight: 0.30 },
        { key: "jump_faults", label: "Jump Faults",    maxScore: 40, weight: 0.40 },
        { key: "style",       label: "Style & Control",maxScore: 30, weight: 0.30 },
      ],
    },
  });

  const actHunter = await prisma.activity.create({
    data: {
      name: "Hunter Under Saddle",
      description: "Flat class judged on way of going and overall impression.",
      criteria: [
        { key: "movement",      label: "Quality of Movement", maxScore: 35, weight: 0.35 },
        { key: "way_of_going",  label: "Way of Going",        maxScore: 35, weight: 0.35 },
        { key: "attitude",      label: "Attitude & Manners",  maxScore: 30, weight: 0.30 },
      ],
    },
  });

  const actEventing = await prisma.activity.create({
    data: {
      name: "Combined Eventing",
      description: "Three-phase competition: dressage, cross-country, and show jumping.",
      criteria: [
        { key: "dressage_phase", label: "Dressage Phase",       maxScore: 40, weight: 0.40 },
        { key: "xc_phase",       label: "Cross-Country Phase",  maxScore: 35, weight: 0.35 },
        { key: "sj_phase",       label: "Show Jumping Phase",   maxScore: 25, weight: 0.25 },
      ],
    },
  });

  // ── RIDERS (15 unique) ────────────────────────────────────────────────────────
  const riderDefs = [
    { first: "Isabella", last: "Monteiro",      email: "isabella.monteiro@riders.com",   license: "LIC-2001", nat: "Brazilian",   club: "Haras São Paulo",          dob: "1995-03-14", gender: "Female" },
    { first: "James",    last: "Whitfield",     email: "james.whitfield@riders.com",     license: "LIC-2002", nat: "American",    club: "Whitfield Stables",        dob: "1988-07-22", gender: "Male"   },
    { first: "Amara",    last: "Diallo",        email: "amara.diallo@riders.com",        license: "LIC-2003", nat: "Senegalese",  club: "Dakar Equestrian Club",    dob: "1999-11-05", gender: "Female" },
    { first: "Luca",     last: "Ferretti",      email: "luca.ferretti@riders.com",       license: "LIC-2004", nat: "Italian",     club: "Scuderia Milano",          dob: "1992-04-18", gender: "Male"   },
    { first: "Hana",     last: "Nakamura",      email: "hana.nakamura@riders.com",       license: "LIC-2005", nat: "Japanese",    club: "Tokyo Equine Club",        dob: "2001-08-30", gender: "Female" },
    { first: "Ethan",    last: "Calloway",      email: "ethan.calloway@riders.com",      license: "LIC-2006", nat: "Australian",  club: "Southern Cross Stables",   dob: "1990-12-03", gender: "Male"   },
    { first: "Valentina",last: "Cruz",          email: "valentina.cruz@riders.com",      license: "LIC-2007", nat: "Argentine",   club: "Polo Buenos Aires",        dob: "1997-06-21", gender: "Female" },
    { first: "Oliver",   last: "Ashford",       email: "oliver.ashford@riders.com",      license: "LIC-2008", nat: "British",     club: "Royal Windsor Stables",    dob: "1985-09-15", gender: "Male"   },
    { first: "Priya",    last: "Sharma",        email: "priya.sharma@riders.com",        license: "LIC-2009", nat: "Indian",      club: "Mumbai Equestrian Club",   dob: "2000-02-28", gender: "Female" },
    { first: "Noah",     last: "Bergström",     email: "noah.bergstrom@riders.com",      license: "LIC-2010", nat: "Swedish",     club: "Gothenburg Riding Club",   dob: "1994-10-10", gender: "Male"   },
    { first: "Sofia",    last: "Papadopoulos",  email: "sofia.papadopoulos@riders.com",  license: "LIC-2011", nat: "Greek",       club: "Athens Equestrian",        dob: "1998-05-07", gender: "Female" },
    { first: "Marcus",   last: "Okonkwo",       email: "marcus.okonkwo@riders.com",      license: "LIC-2012", nat: "Nigerian",    club: "Lagos Horse Club",         dob: "1991-01-25", gender: "Male"   },
    { first: "Chloe",    last: "Beaumont",      email: "chloe.beaumont@riders.com",      license: "LIC-2013", nat: "French",      club: "Chantilly Écurie",         dob: "2002-07-14", gender: "Female" },
    { first: "Aiden",    last: "MacLeod",       email: "aiden.macleod@riders.com",       license: "LIC-2014", nat: "Scottish",    club: "Highland Riders",          dob: "1996-03-29", gender: "Male"   },
    { first: "Yuki",     last: "Tanaka",        email: "yuki.tanaka@riders.com",         license: "LIC-2015", nat: "Japanese",    club: "Osaka Riding Academy",     dob: "1993-11-18", gender: "Female" },
  ];

  // ── HORSES (15 unique) ────────────────────────────────────────────────────────
  const horseDefs = [
    { name: "Viento Azul",      breed: "Andalusian",                    color: "Grey",         gender: "Stallion", owner: "Isabella Monteiro", license: "H-4001", fei: "FEI-8801" },
    { name: "Thunder Ridge",    breed: "Thoroughbred",                  color: "Bay",          gender: "Gelding",  owner: "James Whitfield",   license: "H-4002", fei: "FEI-8802" },
    { name: "Sahara Star",      breed: "Arabian",                       color: "Chestnut",     gender: "Mare",     owner: "Amara Diallo",      license: "H-4003", fei: "FEI-8803" },
    { name: "Il Magnifico",     breed: "Italian Warmblood",             color: "Dark Bay",     gender: "Stallion", owner: "Luca Ferretti",     license: "H-4004", fei: "FEI-8804" },
    { name: "Sakura Wind",      breed: "Japanese Sport Horse",          color: "Palomino",     gender: "Mare",     owner: "Hana Nakamura",     license: "H-4005", fei: "FEI-8805" },
    { name: "Outback Legend",   breed: "Australian Stock Horse",        color: "Roan",         gender: "Gelding",  owner: "Ethan Calloway",    license: "H-4006", fei: "FEI-8806" },
    { name: "Pampas Dream",     breed: "Criollo",                       color: "Buckskin",     gender: "Mare",     owner: "Valentina Cruz",    license: "H-4007", fei: "FEI-8807" },
    { name: "Royal Highness",   breed: "British Warmblood",             color: "Black",        gender: "Gelding",  owner: "Oliver Ashford",    license: "H-4008", fei: "FEI-8808" },
    { name: "Monsoon Magic",    breed: "Marwari",                       color: "Dapple Grey",  gender: "Stallion", owner: "Priya Sharma",      license: "H-4009", fei: "FEI-8809" },
    { name: "Nordic Frost",     breed: "Swedish Warmblood",             color: "White",        gender: "Gelding",  owner: "Noah Bergström",    license: "H-4010", fei: "FEI-8810" },
    { name: "Aegean Breeze",    breed: "Greek Warmblood",               color: "Fleabitten",   gender: "Mare",     owner: "Sofia Papadopoulos",license: "H-4011", fei: "FEI-8811" },
    { name: "Lagos Pride",      breed: "Barb Horse",                    color: "Bay",          gender: "Stallion", owner: "Marcus Okonkwo",    license: "H-4012", fei: "FEI-8812" },
    { name: "Arc de Triomphe",  breed: "Selle Français",                color: "Chestnut",     gender: "Mare",     owner: "Chloe Beaumont",    license: "H-4013", fei: "FEI-8813" },
    { name: "Highland Spirit",  breed: "Clydesdale Sport Cross",        color: "Brown",        gender: "Gelding",  owner: "Aiden MacLeod",     license: "H-4014", fei: "FEI-8814" },
    { name: "Fuji Storm",       breed: "Kiso Horse",                    color: "Dark Chestnut",gender: "Stallion", owner: "Yuki Tanaka",       license: "H-4015", fei: "FEI-8815" },
  ];

  const riders: any[] = [];
  const horses: any[] = [];

  for (let i = 0; i < 15; i++) {
    const rd = riderDefs[i];
    const hd = horseDefs[i];

    const rider = await prisma.rider.create({
      data: {
        firstName: rd.first,
        lastName: rd.last,
        email: rd.email,
        licenseNumber: rd.license,
        nationality: rd.nat,
        clubName: rd.club,
        dateOfBirth: new Date(rd.dob),
        gender: rd.gender,
        phone: `+1-555-${String(1000 + i).padStart(4, "0")}`,
        feiId: `FEI-R${7000 + i}`,
        emergencyContact: `${rd.first}'s Emergency Contact`,
        emergencyPhone: `+1-555-${String(9000 + i).padStart(4, "0")}`,
        consentGiven: true,
        consentDate: new Date("2026-01-15"),
        status: "ACTIVE",
        tenantId: tenant.id,
        vaccinations: {
          create: [
            { vaccine: "Influenza (EquiFlu)", date: new Date("2025-09-01"), expiryDate: new Date("2026-09-01"), status: "VERIFIED" },
            { vaccine: "Tetanus Toxoid",      date: new Date("2025-06-15"), expiryDate: new Date("2027-06-15"), status: "VERIFIED" },
          ],
        },
        documents: {
          create: [
            { name: "FEI Rider License",      url: `https://docs.equievent.com/riders/${rd.license}.pdf` },
            { name: "Insurance Certificate",   url: `https://docs.equievent.com/insurance/${rd.license}.pdf` },
          ],
        },
      },
    });

    const horse = await prisma.horse.create({
      data: {
        name: hd.name,
        breed: hd.breed,
        color: hd.color,
        gender: hd.gender,
        licenseNumber: hd.license,
        feiId: hd.fei,
        ownerName: hd.owner,
        dateOfBirth: new Date(`${2010 + Math.floor(i / 3)}-${String((i % 12) + 1).padStart(2, "0")}-01`),
        status: "ACTIVE",
        tenantId: tenant.id,
        vaccinations: {
          create: [
            { vaccine: "EHV-1/4 (Rhinopneumonitis)", date: new Date("2025-10-01"), expiryDate: new Date("2026-04-01"), status: "VERIFIED" },
            { vaccine: "West Nile Virus",             date: new Date("2025-08-15"), expiryDate: new Date("2026-08-15"), status: "VERIFIED" },
            { vaccine: "Strangles (Pinnacle IT)",     date: new Date("2025-07-01"), expiryDate: new Date("2026-07-01"), status: "VERIFIED" },
          ],
        },
      },
    });

    await prisma.riderHorse.create({ data: { riderId: rider.id, horseId: horse.id } });
    riders.push(rider);
    horses.push(horse);
  }

  // ── EVENTS ───────────────────────────────────────────────────────────────────
  const pastEvent = await prisma.event.create({
    data: {
      name: "Spring Classic 2026",
      slug: "spring-classic-2026",
      description: "The premier opening competition of the 2026 equestrian season, held at the Global Equestrian Park.",
      discipline: "Show Jumping",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-03-03"),
      tenantId: tenant.id,
      venueId: venue1.id,
      status: "PUBLISHED",
      isPublic: true,
    },
  });

  const mainEvent = await prisma.event.create({
    data: {
      name: "National Championship 2026",
      slug: "national-champs-2026",
      description: "The flagship national championship featuring top riders and world-class horses from across the country.",
      discipline: "Show Jumping",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-04-07"),
      tenantId: tenant.id,
      venueId: venue1.id,
      status: "PUBLISHED",
      isPublic: true,
    },
  });

  const upcomingEvent = await prisma.event.create({
    data: {
      name: "Summer Dressage Cup 2026",
      slug: "summer-dressage-2026",
      description: "An exclusive dressage competition at the prestigious Wellington Polo & Equestrian Club.",
      discipline: "Dressage",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-06-18"),
      tenantId: tenant.id,
      venueId: venue2.id,
      status: "SCHEDULED",
      isPublic: true,
    },
  });

  const draftEvent = await prisma.event.create({
    data: {
      name: "Autumn Eventing Series 2026",
      slug: "autumn-eventing-2026",
      description: "Three-phase eventing competition across Thunderhill's challenging cross-country terrain.",
      discipline: "Eventing",
      startDate: new Date("2026-10-10"),
      endDate: new Date("2026-10-14"),
      tenantId: tenant.id,
      venueId: venue3.id,
      status: "DRAFT",
      isPublic: false,
    },
  });

  // ── EVENT ACTIVITIES ──────────────────────────────────────────────────────────
  const eaSpringJumping = await prisma.eventActivity.create({ data: { eventId: pastEvent.id,    activityId: actJumping.id,      fee: 200 } });
  const eaMainJumping   = await prisma.eventActivity.create({ data: { eventId: mainEvent.id,    activityId: actJumping.id,      fee: 350 } });
  const eaMainHunter    = await prisma.eventActivity.create({ data: { eventId: mainEvent.id,    activityId: actHunter.id,       fee: 200 } });
  const eaDressage      = await prisma.eventActivity.create({ data: { eventId: upcomingEvent.id,activityId: actDressage.id,     fee: 300 } });
  await prisma.eventActivity.create({ data: { eventId: draftEvent.id, activityId: actEventing.id,     fee: 400 } });
  await prisma.eventActivity.create({ data: { eventId: draftEvent.id, activityId: actCrossCountry.id, fee: 275 } });

  // ── JUDGE ASSIGNMENTS ─────────────────────────────────────────────────────────
  const jaSpringJump  = await prisma.judgeAssignment.create({ data: { eventId: pastEvent.id,    userId: judge1.id, activityId: eaSpringJumping.id } });
  const jaMainJump1   = await prisma.judgeAssignment.create({ data: { eventId: mainEvent.id,    userId: judge1.id, activityId: eaMainJumping.id   } });
  const jaMainJump2   = await prisma.judgeAssignment.create({ data: { eventId: mainEvent.id,    userId: judge2.id, activityId: eaMainJumping.id   } });
  const jaMainHunter  = await prisma.judgeAssignment.create({ data: { eventId: mainEvent.id,    userId: judge3.id, activityId: eaMainHunter.id    } });
  await prisma.judgeAssignment.create({ data: { eventId: upcomingEvent.id, userId: judge2.id, activityId: eaDressage.id } });

  // ── JUDGE SCORE TABLES ────────────────────────────────────────────────────────
  // National Championship — Show Jumping (10 riders, panel of 2 judges)
  const jumpScores = [
    { c: { technique: 28, rhythm: 24, impulsion: 24, obedience: 19 }, total: 95.0, pct: 95.0,
      r1: "Outstanding! Perfect technique and effortless rhythm. Clear winner.",
      r2: "Panel agrees — exceptional combination. Best of the day." },
    { c: { technique: 27, rhythm: 23, impulsion: 22, obedience: 18 }, total: 90.0, pct: 90.0,
      r1: "Exceptional form over the oxers. Clear rhythm throughout.",
      r2: "Strong performance, narrowly behind the leader." },
    { c: { technique: 26, rhythm: 22, impulsion: 23, obedience: 18 }, total: 89.0, pct: 89.0,
      r1: "Good impulsion. Minor rhythm break after the water complex.",
      r2: "Good impulsion, second panel concurs. Minor deductions at combination." },
    { c: { technique: 25, rhythm: 22, impulsion: 21, obedience: 19 }, total: 87.0, pct: 87.0,
      r1: "Strong performance. Minor hesitation at fence 8 but recovered well.",
      r2: "Consistent round. Hesitation noted, recovered with composure." },
    { c: { technique: 25, rhythm: 21, impulsion: 22, obedience: 18 }, total: 86.0, pct: 86.0,
      r1: "Very competitive. Lacks just a touch of sparkle in the jump-off.",
      r2: "Competitive pair. Good obedience shown throughout." },
    { c: { technique: 24, rhythm: 21, impulsion: 20, obedience: 18 }, total: 83.0, pct: 83.0,
      r1: "Well-prepared. Horse very responsive to aids.",
      r2: "Solid round. Horse listened well; rider's position good." },
    { c: { technique: 23, rhythm: 20, impulsion: 21, obedience: 18 }, total: 82.0, pct: 82.0,
      r1: "Consistent round but needs to work on technical turns.",
      r2: "Consistent performance. Technical improvements would elevate the score." },
    { c: { technique: 23, rhythm: 21, impulsion: 20, obedience: 18 }, total: 82.0, pct: 82.0,
      r1: "Solid obedience. Nice relationship between horse and rider.",
      r2: "Competitive effort. Good partnership evident." },
    { c: { technique: 22, rhythm: 19, impulsion: 21, obedience: 16 }, total: 78.0, pct: 78.0,
      r1: "Young combination with great potential. Some technical errors to address.",
      r2: "Promise shown despite errors. Will improve with experience." },
    { c: { technique: 21, rhythm: 18, impulsion: 19, obedience: 15 }, total: 73.0, pct: 73.0,
      r1: "Challenging day. Horse appeared unsettled during warm-up.",
      r2: "Horse was reactive today. We expect better from this pair." },
  ];

  // National Championship — Hunter Under Saddle (8 riders, judge 3)
  const hunterScores = [
    { c: { movement: 33, way_of_going: 32, attitude: 29 }, total: 94.0, pct: 94.0,
      r: "Picture-perfect hunter. Flawless performance — a joy to judge." },
    { c: { movement: 32, way_of_going: 31, attitude: 28 }, total: 91.0, pct: 91.0,
      r: "Exceptional mover with effortless carriage. Top of the class." },
    { c: { movement: 31, way_of_going: 29, attitude: 27 }, total: 87.0, pct: 87.0,
      r: "Wonderful attitude and fluid transitions. Lovely horse." },
    { c: { movement: 30, way_of_going: 30, attitude: 26 }, total: 86.0, pct: 86.0,
      r: "Elegant way of going, very consistent throughout the class." },
    { c: { movement: 29, way_of_going: 28, attitude: 26 }, total: 83.0, pct: 83.0,
      r: "Nice manners, slightly stiff in the left bend. Good effort." },
    { c: { movement: 29, way_of_going: 27, attitude: 26 }, total: 82.0, pct: 82.0,
      r: "Good mover with pleasant attitude. Needs more consistency." },
    { c: { movement: 27, way_of_going: 28, attitude: 25 }, total: 80.0, pct: 80.0,
      r: "Solid mover with pleasant attitude. Could lengthen stride." },
    { c: { movement: 26, way_of_going: 25, attitude: 24 }, total: 75.0, pct: 75.0,
      r: "Young horse showing promise. Needs more mileage." },
  ];

  // Spring Classic — Show Jumping (8 riders, judge 1)
  const springScores = [
    { c: { technique: 27, rhythm: 23, impulsion: 22, obedience: 19 }, total: 91.0, pct: 91.0,
      r: "Season opener winner. Brilliant form — a confident, polished round." },
    { c: { technique: 25, rhythm: 22, impulsion: 23, obedience: 18 }, total: 88.0, pct: 88.0,
      r: "Power and precision combined. Strong opening to the season." },
    { c: { technique: 26, rhythm: 22, impulsion: 21, obedience: 18 }, total: 87.0, pct: 87.0,
      r: "Strong opener. Clean round with great connection." },
    { c: { technique: 24, rhythm: 21, impulsion: 22, obedience: 17 }, total: 84.0, pct: 84.0,
      r: "Very competitive. Good preparation evident throughout." },
    { c: { technique: 24, rhythm: 21, impulsion: 20, obedience: 18 }, total: 83.0, pct: 83.0,
      r: "Well-composed round. Technical turns could be crisper." },
    { c: { technique: 24, rhythm: 20, impulsion: 21, obedience: 16 }, total: 81.0, pct: 81.0,
      r: "Confident performance from this young combination." },
    { c: { technique: 22, rhythm: 19, impulsion: 20, obedience: 17 }, total: 78.0, pct: 78.0,
      r: "Reliable pair, consistent but lacking expression." },
    { c: { technique: 20, rhythm: 18, impulsion: 19, obedience: 15 }, total: 72.0, pct: 72.0,
      r: "Horse struggled with the triple combination. Worked through it." },
  ];

  // ── NATIONAL CHAMPIONSHIP — SHOW JUMPING (10 riders) ─────────────────────────
  for (let i = 0; i < 10; i++) {
    const rider = riders[i];
    const horse = horses[i];
    const ring  = i % 2 === 0 ? ringGrandPrix : ringHunter;
    const slotStart = new Date(new Date("2026-04-02T08:00:00Z").getTime() + i * 25 * 60_000);
    const slotEnd   = new Date(slotStart.getTime() + 20 * 60_000);

    const regStatus     = i < 2 ? "CONFIRMED" : i < 9 ? "SUBMITTED" : "DRAFT";
    const payStatus     = i < 9 ? "PAID" : "PENDING";
    const checkInStatus = i < 4 ? "CHECKED_IN" : i < 7 ? "SCANNED" : "PENDING";

    await prisma.registration.create({
      data: {
        eventId: mainEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        eventActivityId: eaMainJumping.id,
        status: regStatus,
        totalFee: 350,
        termsAccepted: true,
        submittedAt: regStatus !== "DRAFT" ? new Date("2026-03-15") : null,
        tenantId: tenant.id,
        payments: { create: { amount: 350, status: payStatus, tenantId: tenant.id } },
      },
    });

    await prisma.checkIn.create({
      data: {
        eventId: mainEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        qrToken: `NATCHAMP26-J-${rider.licenseNumber}`,
        status: checkInStatus,
        scannedAt: checkInStatus !== "PENDING" ? new Date("2026-04-02T07:30:00Z") : null,
        scannedBy: checkInStatus !== "PENDING" ? admin.id : null,
        docStatus: i < 6 ? "VERIFIED" : "PENDING",
      },
    });

    await prisma.accreditation.create({
      data: {
        riderId: rider.id,
        eventId: mainEvent.id,
        tenantId: tenant.id,
        type: "RIDER",
        status: i < 6 ? "ISSUED" : "PENDING",
        badgeNumber: `NAT26-J${String(1000 + i).padStart(4, "0")}`,
        accessZones: ["ARENA", "STABLES", "WARM_UP", "MEDIA"],
        issuedAt: i < 6 ? new Date("2026-03-20") : null,
        expiresAt: new Date("2026-04-08"),
        qrCode: `QR-NAT26-J-${rider.licenseNumber}`,
      },
    });

    const slot = await prisma.scheduleSlot.create({
      data: {
        eventId: mainEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        ringId: ring.id,
        startTime: slotStart,
        endTime: slotEnd,
        hasConflict: false,
      },
    });

    const sd = jumpScores[i];

    // Judge 1 scores all 10
    await prisma.score.create({
      data: {
        scheduleSlotId:    slot.id,
        eventActivityId:   eaMainJumping.id,
        judgeAssignmentId: jaMainJump1.id,
        criteriaScores:    sd.c,
        totalScore:        sd.total,
        percentage:        sd.pct,
        remarks:           sd.r1,
        submittedAt:       new Date("2026-04-02T14:00:00Z"),
        submittedBy:       judge1.id,
        scoreHash:         crypto.createHash("md5").update(`j1-${slot.id}-${sd.total}`).digest("hex"),
      },
    });

    // Judge 2 (panel) scores riders 0-4 as well (split panel)
    if (i < 5) {
      const variation = (Math.random() * 3 - 1.5);
      await prisma.score.create({
        data: {
          scheduleSlotId:    slot.id,
          eventActivityId:   eaMainJumping.id,
          judgeAssignmentId: jaMainJump2.id,
          criteriaScores: {
            technique: Math.max(18, sd.c.technique + Math.floor(Math.random() * 3 - 1)),
            rhythm:    Math.max(15, sd.c.rhythm    + Math.floor(Math.random() * 3 - 1)),
            impulsion: Math.max(16, sd.c.impulsion + Math.floor(Math.random() * 3 - 1)),
            obedience: Math.max(13, sd.c.obedience + Math.floor(Math.random() * 3 - 1)),
          },
          totalScore:        parseFloat((sd.total + variation).toFixed(1)),
          percentage:        parseFloat((sd.pct   + variation).toFixed(1)),
          remarks:           sd.r2,
          submittedAt:       new Date("2026-04-02T14:30:00Z"),
          submittedBy:       judge2.id,
          scoreHash:         crypto.createHash("md5").update(`j2-${slot.id}-${sd.total}`).digest("hex"),
        },
      });
    }
  }

  // ── NATIONAL CHAMPIONSHIP — HUNTER UNDER SADDLE (8 riders) ──────────────────
  for (let i = 0; i < 8; i++) {
    const rider = riders[i + 5];
    const horse = horses[i + 5];
    const slotStart = new Date(new Date("2026-04-03T09:00:00Z").getTime() + i * 18 * 60_000);
    const slotEnd   = new Date(slotStart.getTime() + 15 * 60_000);

    await prisma.registration.create({
      data: {
        eventId: mainEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        eventActivityId: eaMainHunter.id,
        status: "SUBMITTED",
        totalFee: 200,
        termsAccepted: true,
        submittedAt: new Date("2026-03-18"),
        tenantId: tenant.id,
        payments: { create: { amount: 200, status: "PAID", tenantId: tenant.id } },
      },
    });

    const slot = await prisma.scheduleSlot.create({
      data: {
        eventId: mainEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        ringId: ringHunter.id,
        startTime: slotStart,
        endTime: slotEnd,
        hasConflict: false,
      },
    });

    const sd = hunterScores[i];
    await prisma.score.create({
      data: {
        scheduleSlotId:    slot.id,
        eventActivityId:   eaMainHunter.id,
        judgeAssignmentId: jaMainHunter.id,
        criteriaScores:    sd.c,
        totalScore:        sd.total,
        percentage:        sd.pct,
        remarks:           sd.r,
        submittedAt:       new Date("2026-04-03T15:00:00Z"),
        submittedBy:       judge3.id,
        scoreHash:         crypto.createHash("md5").update(`j3-hunter-${slot.id}-${sd.total}`).digest("hex"),
      },
    });
  }

  // ── SPRING CLASSIC — SHOW JUMPING (past event, 8 riders) ──────────────────────
  for (let i = 0; i < 8; i++) {
    const rider = riders[i + 4];
    const horse = horses[i + 4];
    const slotStart = new Date(new Date("2026-03-02T08:00:00Z").getTime() + i * 30 * 60_000);
    const slotEnd   = new Date(slotStart.getTime() + 25 * 60_000);

    await prisma.registration.create({
      data: {
        eventId: pastEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        eventActivityId: eaSpringJumping.id,
        status: "CONFIRMED",
        totalFee: 200,
        termsAccepted: true,
        submittedAt: new Date("2026-02-10"),
        tenantId: tenant.id,
        payments: { create: { amount: 200, status: "PAID", tenantId: tenant.id } },
      },
    });

    await prisma.checkIn.create({
      data: {
        eventId: pastEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        qrToken:  `SPRING26-${rider.licenseNumber}`,
        status:   "CHECKED_IN",
        scannedAt: new Date("2026-03-02T07:15:00Z"),
        scannedBy: admin.id,
        docStatus: "VERIFIED",
      },
    });

    await prisma.accreditation.create({
      data: {
        riderId:     rider.id,
        eventId:     pastEvent.id,
        tenantId:    tenant.id,
        type:        "RIDER",
        status:      "ISSUED",
        badgeNumber: `SPR26-${String(1000 + i).padStart(4, "0")}`,
        accessZones: ["ARENA", "STABLES"],
        issuedAt:    new Date("2026-02-25"),
        expiresAt:   new Date("2026-03-04"),
        qrCode:      `QR-SPR26-${rider.licenseNumber}`,
      },
    });

    const slot = await prisma.scheduleSlot.create({
      data: {
        eventId: pastEvent.id,
        riderId: rider.id,
        horseId: horse.id,
        ringId:  ringGrandPrix.id,
        startTime: slotStart,
        endTime:   slotEnd,
        hasConflict: false,
      },
    });

    const sd = springScores[i];
    await prisma.score.create({
      data: {
        scheduleSlotId:    slot.id,
        eventActivityId:   eaSpringJumping.id,
        judgeAssignmentId: jaSpringJump.id,
        criteriaScores:    sd.c,
        totalScore:        sd.total,
        percentage:        sd.pct,
        remarks:           sd.r,
        submittedAt:       new Date("2026-03-02T17:00:00Z"),
        submittedBy:       judge1.id,
        scoreHash:         crypto.createHash("md5").update(`spring-${slot.id}-${sd.total}`).digest("hex"),
      },
    });
  }

  // ── SUMMER DRESSAGE CUP — Pre-registrations (no scores yet) ──────────────────
  for (let i = 0; i < 6; i++) {
    await prisma.registration.create({
      data: {
        eventId: upcomingEvent.id,
        riderId: riders[i + 2].id,
        horseId: horses[i + 2].id,
        eventActivityId: eaDressage.id,
        status: i < 4 ? "SUBMITTED" : "DRAFT",
        totalFee: 300,
        termsAccepted: i < 4,
        submittedAt: i < 4 ? new Date("2026-04-01") : null,
        tenantId: tenant.id,
        payments: {
          create: { amount: 300, status: i < 4 ? "PAID" : "PENDING", tenantId: tenant.id },
        },
      },
    });
  }

  // ── NOTIFICATION TEMPLATES ─────────────────────────────────────────────────────
  await prisma.notificationTemplate.createMany({
    data: [
      {
        triggerKey: "WELCOME",
        subject:    "Welcome to EquiEvent — Your Journey Begins",
        bodyEmail:  "Hi {{name}}, welcome to the EquiEvent platform! Your account is ready.",
        bodySms:    "Welcome to EquiEvent, {{name}}! You're all set.",
        isActive:   true,
        channels:   ["EMAIL", "SMS"],
      },
      {
        triggerKey: "REGISTRATION_CONFIRMED",
        subject:    "Registration Confirmed — {{eventName}}",
        bodyEmail:  "Dear {{name}}, your registration for {{eventName}} is confirmed. Entry fee: ${{fee}}.",
        bodySms:    "Confirmed: {{name}} entered for {{eventName}}.",
        isActive:   true,
        channels:   ["EMAIL", "SMS"],
      },
      {
        triggerKey: "SCORE_PUBLISHED",
        subject:    "Your Score is Ready — {{eventName}}",
        bodyEmail:  "Hi {{name}}, your score for {{activityName}} at {{eventName}}: {{score}} pts ({{pct}}%).",
        isActive:   true,
        channels:   ["EMAIL"],
      },
      {
        triggerKey: "CHECKIN_REMINDER",
        subject:    "Check-In Reminder — {{eventName}} starts tomorrow",
        bodyEmail:  "Hi {{name}}, check-in for {{eventName}} opens at 07:00 AM tomorrow. Your QR code: {{qrToken}}.",
        bodySms:    "Reminder: Check-in for {{eventName}} is tomorrow at 7AM.",
        isActive:   true,
        channels:   ["EMAIL", "SMS"],
      },
      {
        triggerKey: "BADGE_ISSUED",
        subject:    "Your Accreditation Badge is Ready — {{badgeNumber}}",
        bodyEmail:  "Your badge {{badgeNumber}} for {{eventName}} has been issued. Access zones: {{zones}}.",
        isActive:   true,
        channels:   ["EMAIL"],
      },
    ],
  });

  // ── AUDIT LOGS ────────────────────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      { tenantId: tenant.id, userId: admin.id,  action: "PLATFORM_SEED",   entityType: "SYSTEM",       entityId: "seed-v3", newValues: { version: 3, riders: 15, horses: 15, events: 4, scores: 31 } },
      { tenantId: tenant.id, userId: admin.id,  action: "event.publish",   entityType: "Event",        entityId: mainEvent.id,     newValues: { status: "PUBLISHED", name: "National Championship 2026" } },
      { tenantId: tenant.id, userId: admin.id,  action: "event.publish",   entityType: "Event",        entityId: pastEvent.id,     newValues: { status: "PUBLISHED", name: "Spring Classic 2026" } },
      { tenantId: tenant.id, userId: judge1.id, action: "score.submit",    entityType: "Score",        entityId: "batch-nat-jump", newValues: { count: 10, event: "National Championship 2026", activity: "Show Jumping" } },
      { tenantId: tenant.id, userId: judge2.id, action: "score.submit",    entityType: "Score",        entityId: "batch-nat-jump2",newValues: { count: 5,  event: "National Championship 2026", activity: "Show Jumping (Panel)" } },
      { tenantId: tenant.id, userId: judge3.id, action: "score.submit",    entityType: "Score",        entityId: "batch-hunter",   newValues: { count: 8,  event: "National Championship 2026", activity: "Hunter Under Saddle" } },
      { tenantId: tenant.id, userId: judge1.id, action: "score.submit",    entityType: "Score",        entityId: "batch-spring",   newValues: { count: 8,  event: "Spring Classic 2026",        activity: "Show Jumping" } },
      { tenantId: tenant.id, userId: admin.id,  action: "checkin.scan",    entityType: "CheckIn",      entityId: "batch-nat",      newValues: { count: 7,  event: "National Championship 2026" } },
      { tenantId: tenant.id, userId: admin.id,  action: "checkin.scan",    entityType: "CheckIn",      entityId: "batch-spring",   newValues: { count: 8,  event: "Spring Classic 2026" } },
      { tenantId: tenant.id, userId: admin.id,  action: "accreditation.issue", entityType: "Accreditation", entityId: "batch-nat", newValues: { count: 6,  event: "National Championship 2026" } },
    ],
  });

  // ── SUMMARY ───────────────────────────────────────────────────────────────────
  const scoreCount = await prisma.score.count();
  const regCount   = await prisma.registration.count();
  console.log("✅ Seeding complete!");
  console.log(`   Tenant  : ${tenant.name}`);
  console.log(`   Users   : 4  (1 admin · 3 judges)`);
  console.log(`   Venues  : 3  · Rings: 7`);
  console.log(`   Activities: 5 (all with scoring criteria)`);
  console.log(`   Events  : 4  (past · ongoing · upcoming · draft)`);
  console.log(`   Riders  : 15 · Horses: 15`);
  console.log(`   Regs    : ${regCount}`);
  console.log(`   Scores  : ${scoreCount} (with per-criterion breakdowns + judge remarks)`);
  console.log(`   Login   : admin@equievent.com / Admin@123`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
