import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/** Password for all seeded users (email/password login). */
const SEED_PASSWORD = "Password123!";

async function ensureCredentialAccount(userId: string, passwordHash: string) {
  const existing = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
  });
  if (existing) return;
  await prisma.account.create({
    data: {
      id: randomUUID(),
      userId,
      accountId: userId,
      providerId: "credential",
      password: passwordHash,
    },
  });
}

async function main() {
  console.log("🌱 Starting database seeding...");

  const passwordHash = await hashPassword(SEED_PASSWORD);

  // Create users with different roles
  const users = await Promise.all([
    // Admin user
    prisma.user.upsert({
      where: { email: "admin@skillbridge.com" },
      update: {},
      create: {
        id: "admin-001",
        name: "Admin User",
        email: "admin@skillbridge.com",
        emailVerified: true,
        role: "ADMIN",
        image: "https://i.pravatar.cc/150?img=1",
      },
    }),

    // Tutors
    prisma.user.upsert({
      where: { email: "john.tutor@skillbridge.com" },
      update: {},
      create: {
        id: "tutor-001",
        name: "John Smith",
        email: "john.tutor@skillbridge.com",
        emailVerified: true,
        role: "TUTOR",
        image: "https://i.pravatar.cc/150?img=12",
      },
    }),

    prisma.user.upsert({
      where: { email: "sarah.tutor@skillbridge.com" },
      update: {},
      create: {
        id: "tutor-002",
        name: "Sarah Johnson",
        email: "sarah.tutor@skillbridge.com",
        emailVerified: true,
        role: "TUTOR",
        image: "https://i.pravatar.cc/150?img=5",
      },
    }),

    prisma.user.upsert({
      where: { email: "michael.tutor@skillbridge.com" },
      update: {},
      create: {
        id: "tutor-003",
        name: "Michael Chen",
        email: "michael.tutor@skillbridge.com",
        emailVerified: true,
        role: "TUTOR",
        image: "https://i.pravatar.cc/150?img=8",
      },
    }),

    prisma.user.upsert({
      where: { email: "emily.tutor@skillbridge.com" },
      update: {},
      create: {
        id: "tutor-004",
        name: "Emily Davis",
        email: "emily.tutor@skillbridge.com",
        emailVerified: true,
        role: "TUTOR",
        image: "https://i.pravatar.cc/150?img=9",
      },
    }),

    // Students
    prisma.user.upsert({
      where: { email: "alice.student@skillbridge.com" },
      update: {},
      create: {
        id: "student-001",
        name: "Alice Williams",
        email: "alice.student@skillbridge.com",
        emailVerified: true,
        role: "STUDENT",
        image: "https://i.pravatar.cc/150?img=20",
      },
    }),

    prisma.user.upsert({
      where: { email: "bob.student@skillbridge.com" },
      update: {},
      create: {
        id: "student-002",
        name: "Bob Martinez",
        email: "bob.student@skillbridge.com",
        emailVerified: true,
        role: "STUDENT",
        image: "https://i.pravatar.cc/150?img=15",
      },
    }),

    prisma.user.upsert({
      where: { email: "charlie.student@skillbridge.com" },
      update: {},
      create: {
        id: "student-003",
        name: "Charlie Brown",
        email: "charlie.student@skillbridge.com",
        emailVerified: true,
        role: "STUDENT",
        image: "https://i.pravatar.cc/150?img=33",
      },
    }),

    prisma.user.upsert({
      where: { email: "diana.student@skillbridge.com" },
      update: {},
      create: {
        id: "student-004",
        name: "Diana Garcia",
        email: "diana.student@skillbridge.com",
        emailVerified: false,
        role: "STUDENT",
        image: "https://i.pravatar.cc/150?img=25",
      },
    }),

    // Regular users
    prisma.user.upsert({
      where: { email: "user1@skillbridge.com" },
      update: {},
      create: {
        id: "user-001",
        name: "Test User One",
        email: "user1@skillbridge.com",
        emailVerified: false,
        role: "USER",
      },
    }),

    prisma.user.upsert({
      where: { email: "user2@skillbridge.com" },
      update: {},
      create: {
        id: "user-002",
        name: "Test User Two",
        email: "user2@skillbridge.com",
        emailVerified: true,
        role: "USER",
        image: "https://i.pravatar.cc/150?img=40",
      },
    }),
  ]);

  console.log(`✅ Created/Updated ${users.length} users`);

  // Ensure every seeded user has a credential account (password: Password123!)
  const seededUserIds = [
    "admin-001",
    "tutor-001",
    "tutor-002",
    "tutor-003",
    "tutor-004",
    "student-001",
    "student-002",
    "student-003",
    "student-004",
    "user-001",
    "user-002",
  ];
  for (const userId of seededUserIds) {
    await ensureCredentialAccount(userId, passwordHash);
  }
  console.log(`✅ Credential accounts set (password: ${SEED_PASSWORD})`);

  // Create tutor profiles for tutors
  const tutorProfiles = await Promise.all([
    prisma.tutorProfile.upsert({
      where: { userId: "tutor-001" },
      update: {},
      create: {
        userId: "tutor-001",
        biography:
          "Experienced Mathematics tutor with 10+ years of teaching experience. Specializing in calculus and algebra.",
        qualifications: "PhD in Mathematics, MIT",
        profileImage: "https://i.pravatar.cc/150?img=12",
      },
    }),

    prisma.tutorProfile.upsert({
      where: { userId: "tutor-002" },
      update: {},
      create: {
        userId: "tutor-002",
        biography:
          "Professional English language tutor. Native speaker with TEFL certification. Love helping students improve their communication skills.",
        qualifications: "MA in English Literature, BA in Education",
        profileImage: "https://i.pravatar.cc/150?img=5",
      },
    }),

    prisma.tutorProfile.upsert({
      where: { userId: "tutor-003" },
      update: {},
      create: {
        userId: "tutor-003",
        biography:
          "Computer Science expert specializing in programming languages, data structures, and algorithms. Former software engineer at Google.",
        qualifications: "MS Computer Science, Stanford University",
        profileImage: "https://i.pravatar.cc/150?img=8",
      },
    }),

    prisma.tutorProfile.upsert({
      where: { userId: "tutor-004" },
      update: {},
      create: {
        userId: "tutor-004",
        biography:
          "Physics and Chemistry tutor with a passion for making science fun and accessible. 8 years of tutoring experience.",
        qualifications: "BSc Physics, MSc Chemistry",
        profileImage: "https://i.pravatar.cc/150?img=9",
      },
    }),
  ]);

  console.log(`✅ Created/Updated ${tutorProfiles.length} tutor profiles`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Mathematics" },
      update: {},
      create: {
        name: "Mathematics",
        description: "Algebra, Calculus, Geometry, Statistics, and more",
      },
    }),

    prisma.category.upsert({
      where: { name: "Science" },
      update: {},
      create: {
        name: "Science",
        description: "Physics, Chemistry, Biology, Environmental Science",
      },
    }),

    prisma.category.upsert({
      where: { name: "Programming" },
      update: {},
      create: {
        name: "Programming",
        description: "Python, JavaScript, Java, C++, Web Development",
      },
    }),

    prisma.category.upsert({
      where: { name: "Languages" },
      update: {},
      create: {
        name: "Languages",
        description: "English, Spanish, French, Mandarin, and more",
      },
    }),

    prisma.category.upsert({
      where: { name: "Business" },
      update: {},
      create: {
        name: "Business",
        description: "Economics, Accounting, Management, Marketing",
      },
    }),
  ]);

  console.log(`✅ Created/Updated ${categories.length} categories`);

  // Link tutors to categories (by unique category name)
  await prisma.tutorProfile.update({
    where: { userId: "tutor-001" },
    data: { categories: { set: [{ name: "Mathematics" }] } },
  });
  await prisma.tutorProfile.update({
    where: { userId: "tutor-002" },
    data: { categories: { set: [{ name: "Languages" }] } },
  });
  await prisma.tutorProfile.update({
    where: { userId: "tutor-003" },
    data: {
      categories: { set: [{ name: "Programming" }, { name: "Mathematics" }] },
    },
  });
  await prisma.tutorProfile.update({
    where: { userId: "tutor-004" },
    data: { categories: { set: [{ name: "Science" }] } },
  });
  console.log("✅ Linked tutor profiles to categories");

  // Clear and recreate availability for seeded tutors (idempotent re-run)
  const tutorProfileIds = tutorProfiles.map((p) => p.id);
  await prisma.availability.deleteMany({
    where: { tutorId: { in: tutorProfileIds } },
  });

  await prisma.availability.createMany({
    data: [
      {
        tutorId: tutorProfiles[0].id,
        dayOfWeek: "Tuesday",
        startTime: new Date("2026-02-03T09:00:00Z"),
        endTime: new Date("2026-02-03T17:00:00Z"),
      },
      {
        tutorId: tutorProfiles[0].id,
        dayOfWeek: "Thursday",
        startTime: new Date("2026-02-05T09:00:00Z"),
        endTime: new Date("2026-02-05T17:00:00Z"),
      },
      {
        tutorId: tutorProfiles[1].id,
        dayOfWeek: "Wednesday",
        startTime: new Date("2026-02-04T10:00:00Z"),
        endTime: new Date("2026-02-04T18:00:00Z"),
      },
      {
        tutorId: tutorProfiles[2].id,
        dayOfWeek: "Friday",
        startTime: new Date("2026-02-06T13:00:00Z"),
        endTime: new Date("2026-02-06T21:00:00Z"),
      },
      {
        tutorId: tutorProfiles[3].id,
        dayOfWeek: "Monday",
        startTime: new Date("2026-02-02T09:00:00Z"),
        endTime: new Date("2026-02-02T17:00:00Z"),
      },
      {
        tutorId: tutorProfiles[3].id,
        dayOfWeek: "Saturday",
        startTime: new Date("2026-02-07T10:00:00Z"),
        endTime: new Date("2026-02-07T16:00:00Z"),
      },
    ],
  });
  console.log("✅ Created availability slots");

  // Dummy bookings (students -> tutors)
  const existingBookings = await prisma.booking.count();
  if (existingBookings === 0) {
    await prisma.booking.createMany({
      data: [
        {
          studentId: "student-001",
          tutorId: tutorProfiles[0].id,
          sessionDate: new Date("2026-02-10T14:00:00Z"),
          sessionLink: "https://meet.example.com/abc123",
          status: "COMPLETED",
        },
        {
          studentId: "student-001",
          tutorId: tutorProfiles[2].id,
          sessionDate: new Date("2026-02-15T16:00:00Z"),
          status: "PENDING",
        },
        {
          studentId: "student-002",
          tutorId: tutorProfiles[1].id,
          sessionDate: new Date("2026-02-12T10:00:00Z"),
          sessionLink: "https://meet.example.com/def456",
          status: "COMPLETED",
        },
        {
          studentId: "student-003",
          tutorId: tutorProfiles[3].id,
          sessionDate: new Date("2026-02-18T11:00:00Z"),
          status: "PENDING",
        },
      ],
    });
    console.log("✅ Created dummy bookings");
  }

  // Dummy reviews
  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    await prisma.review.createMany({
      data: [
        {
          studentId: "student-001",
          tutorId: tutorProfiles[0].id,
          rating: "5",
          comment: "Excellent math tutor! Cleared all my doubts.",
        },
        {
          studentId: "student-002",
          tutorId: tutorProfiles[1].id,
          rating: "5",
          comment: "Sarah is very patient and great at explaining grammar.",
        },
        {
          studentId: "student-001",
          tutorId: tutorProfiles[2].id,
          rating: "4",
          comment: "Solid programming session, would book again.",
        },
      ],
    });
    console.log("✅ Created dummy reviews");
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log("");
  console.log("📋 Seeded login credentials (email / password):");
  console.log("   Admin:  admin@skillbridge.com / " + SEED_PASSWORD);
  console.log("   Tutor:  john.tutor@skillbridge.com / " + SEED_PASSWORD);
  console.log("   Tutor:  sarah.tutor@skillbridge.com / " + SEED_PASSWORD);
  console.log("   Student: alice.student@skillbridge.com / " + SEED_PASSWORD);
  console.log("   Student: bob.student@skillbridge.com / " + SEED_PASSWORD);
  console.log("   (All seeded users use password: " + SEED_PASSWORD + ")");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
