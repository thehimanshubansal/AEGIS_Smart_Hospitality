# Hospitality Management System (Aegis)

A premium, enterprise-grade hospitality management ecosystem designed for seamless guest experiences, efficient staff coordination, and robust administrative oversight. Built with a cinematic design language and cutting-edge web technologies.

## 🌟 Key Features

### 🏨 Guest Portal
- **Cinematic Dashboard**: A glassmorphic interface for personal trip management.
- **Interactive Floor Maps**: High-resolution layouts with real-time location awareness.
- **Rapid Reporting & SOS**: Instant communication for guest needs and emergencies.
- **Secure Messaging**: Direct line to hotel staff and concierge services.

### 🛡️ Staff & Admin Portals
- **Tactical Command Center**: Real-time staff tracking and assignment management.
- **Assignments Workflow**: Dynamic task allocation and status monitoring.
- **Administrative Control**: Global settings, analytics, and user management.
- **Camera Relay**: Integrated video streaming for property security.

### ⚡ Advanced Technologies
- **AI-Powered Insights**: Leveraging Google Gemini for intelligent assistance.
- **Real-time Connectivity**: WebSockets (Socket.io) for instant updates.
- **PWA Ready**: Offline support and home-screen installation via Serwist.
- **QR Integration**: Seamless check-ins and asset tracking.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.2 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with Framer Motion animations.
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/).
- **Backend Services**: [Firebase](https://firebase.google.com/) (Auth, Analytics, Data Connect).
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/).
- **Containerization**: [Docker](https://www.docker.com/) for consistent deployment.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS)
- Docker (for database and deployment)
- A PostgreSQL instance

### 2. Environment Setup
Create a `.env` file in the root directory (referencing `.env.example` if available) with the following:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
...

# AI
GEMINI_API_KEY=your_gemini_key

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hospitality_db"
```

### 3. Installation
```bash
npm install
```

### 4. Database Migration
```bash
npx prisma migrate dev
```

### 5. Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Project Structure

- `src/app`: Next.js App Router (Guest, Staff, and Admin routes).
- `src/components`: Reusable UI components with glassmorphic styling.
- `prisma`: Database schema and migration files.
- `deploy`: Deployment configurations for GCP and Oracle Cloud (MediaMTX).
- `public`: Assets, icons, and floor maps.
- `scripts`: Utility scripts (e.g., Prisma client assurance).

---

## 🚢 Deployment

The project is configured for deployment via **Docker** and **Cloud Run**.
- Use the provided `Dockerfile` for containerization.
- Deployment scripts and configurations are located in the `deploy/` directory.

## 📖 Documentation

Technical documentation is managed via **Natural Docs**.
- Configuration: `Project.txt`
- Output: `docs/html/`

---

## 📄 License
This project is licensed under the ISC License.
