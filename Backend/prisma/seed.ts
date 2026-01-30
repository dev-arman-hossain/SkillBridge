import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

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

  const availabilities = await Promise.all([
    // Tutor 001 - Available Tuesday 9am-5pm
    prisma.availability.create({
      data: {
        tutorId: tutorProfiles[0].id,
        dayOfWeek: "Tuesday",
        startTime: new Date("2026-02-03T09:00:00Z"),
        endTime: new Date("2026-02-03T17:00:00Z"),
      },
    }),

    // Tutor 001 - Available Thursday 9am-5pm
    prisma.availability.create({
      data: {
        tutorId: tutorProfiles[0].id,
        dayOfWeek: "Thursday",
        startTime: new Date("2026-02-05T09:00:00Z"),
        endTime: new Date("2026-02-05T17:00:00Z"),
      },
    }),

    // Tutor 002 - Available Wednesday 10am-6pm
    prisma.availability.create({
      data: {
        tutorId: tutorProfiles[1].id,
        dayOfWeek: "Wednesday",
        startTime: new Date("2026-02-04T10:00:00Z"),
        endTime: new Date("2026-02-04T18:00:00Z"),
      },
    }),

    // Tutor 003 - Available Friday 1pm-9pm
    prisma.availability.create({
      data: {
        tutorId: tutorProfiles[2].id,
        dayOfWeek: "Friday",
        startTime: new Date("2026-02-06T13:00:00Z"),
        endTime: new Date("2026-02-06T21:00:00Z"),
      },
    }),

    // Tutor 004 - Available Monday 9am-5pm
    prisma.availability.create({
      data: {
        tutorId: tutorProfiles[3].id,
        dayOfWeek: "Monday",
        startTime: new Date("2026-02-02T09:00:00Z"),
        endTime: new Date("2026-02-02T17:00:00Z"),
      },
    }),

    // Tutor 004 - Available Saturday 10am-4pm
    prisma.availability.create({
      data: {
        tutorId: tutorProfiles[3].id,
        dayOfWeek: "Saturday",
        startTime: new Date("2026-02-07T10:00:00Z"),
        endTime: new Date("2026-02-07T16:00:00Z"),
      },
    }),
  ]);

  console.log(`✅ Created ${availabilities.length} availability slots`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
