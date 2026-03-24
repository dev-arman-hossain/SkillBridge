# SkillBridge 🚀

**Bridging the Gap Between Knowledge and Learning**

SkillBridge is a modern, full-stack platform designed to connect students with expert tutors. Whether you're looking to master a new skill or share your expertise, SkillBridge provides a seamless interface for scheduling, learning, and growth.

---

## ✨ Core Features

- 🔐 **Advanced Authentication:** Secure user management powered by `better-auth`.
- 👨‍🏫 **Tutor Profiles:** Detailed profiles showcasing biographies, qualifications, and areas of expertise.
- 📁 **Smart Categorization:** Easily browse and find tutors across various learning categories.
- 📅 **Availability Management:** Tutors can manage their schedules, and students can see real-time availability.
- 🎫 **Seamless Booking:** Integrated booking system for scheduling and managing learning sessions.
- ⭐ **Review & Rating System:** Build trust within the community through transparent feedback.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://reactjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Forms:** [TanStack Form](https://tanstack.com/form/latest)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Auth:** [better-auth](https://better-auth.com/)
- **Logging:** [Morgan](https://github.com/expressjs/morgan)

---

## 📂 Project Structure

```bash
SkillBridge/
├── Backend/          # Node.js Express server with Prisma ORM
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # API logic, controllers, and services
│   └── ...
└── Frontend/         # Next.js web application
    ├── src/          # App router, components, and hooks
    ├── public/       # Static assets
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SkillBridge
   ```

2. **Setup Backend:**
   ```bash
   cd Backend
   npm install
   # Create a .env file and add your DATABASE_URL
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../Frontend
   npm install
   # Create a .env.local file if needed
   npm run dev
   ```

---

## 📜 Available Scripts

### Backend
- `npm run dev`: Starts the server with Prisma migrations and nodemon.
- `npm run build`: Generates Prisma client and compiles TypeScript.
- `npm run start`: Starts the production server.
- `npm run seed`: Seeds the database with initial data.

### Frontend
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production bundle.
- `npm run lint`: Runs ESLint for code quality checks.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the **ISC License**.
