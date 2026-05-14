<div align="center">
  
# 🛡️ AEGIS SMART HOSPITALITY
**[Rapid Crisis Response] Accelerated Emergency Response and Crisis Coordination**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase Data Connect](https://img.shields.io/badge/Firebase_Data_Connect-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](#)

> **Aegis** is an AI-powered tactical hospitality OS merging premium guest services with mission-critical security. Powered by Google Gemini, it features live CCTV biometric auditing, dynamic A* evacuation routing, and an industry-first Triple-Link SOS grid (Internet/IP/BLE) ensuring unbreakable communication during emergencies.

</div>

---

## 📖 Table of Contents
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Unique Selling Propositions (USPs)](#-unique-selling-propositions-usps)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Phased Implementation Roadmap](#-phased-implementation-roadmap)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Team](#-team)

---

## 🚨 The Problem
Modern hospitality systems suffer from fragmented communication and a total lack of spatial awareness. 
- **Delayed Service & SOS Response:** Operations rely on reactive measures, leaving critical security blind spots. 
- **Hazardous Blind Navigation:** During emergencies like fires, guests have no real-time guidance away from active threats.
- **Vulnerable Connectivity:** Standard emergency apps fail completely if the building loses Wi-Fi or Internet access.
- **Disorganized Staffing:** Highly inefficient manual task delegation wastes time during critical incidents.

## 💡 The Solution
Aegis bridges the gap between luxury guest experiences and military-grade administrative control. By leveraging **Generative AI (Google Gemini)**, **Live WebSockets**, and **Interactive Spatial Graphs**, Aegis transforms raw facility data into autonomous, real-time operational intelligence.

---

## 🚀 Unique Selling Propositions (USPs)
The Aegis platform is built on 4 core pillars:

1. **Generative Infrastructure (AI Blueprinting):** Gemini Vision autonomously transforms static PDF/PNG blueprints into intelligent 2D routing graphs, eliminating tedious manual property setup.
2. **Adaptive Evacuation:** A live-syncing A* engine that recalculates safe exit routes in real-time to steer guests away from AI-detected hazard zones.
3. **Triple-Link Connectivity:** An industry-first fallback grid (**Internet → Local IP → BLE Mesh**) that maintains emergency audio and location sync during total network blackouts.
4. **Real-Time Logistics:** Sub-meter indoor telemetry and WebSockets enable millisecond-accurate tracking for rapid, coordinated staff-to-guest deployment.

---

## ✨ Key Features

### 🏨 For Guests (The Experience)
- **Frictionless PWA:** App-free, instant access via QR Tokenization.
- **Interactive Floor Maps:** Live-routed evacuation maps right on their device.
- **Instant SOS:** One-touch emergency broadcast that opens a live WebRTC audio bridge to the command center.
- **Rapid Issue Reporting:** Direct chat and ticket reporting to administration.

### 👔 For Staff (The Execution)
- **Agent Workforce Hub:** 1-click staff registration generating credentials and printable QR-login digital IDs.
- **Live Task Assignment:** Proximity-based automated workflow dispatching.
- **Biometric / QR Secure Login:** Deep security enforcement for physical access.
- **Push-to-Talk Radio:** WebRTC comms replacing clunky traditional radios.

### 🛡️ For Admins (The Oversight)
- **Tactical Command Center:** A unified dashboard merging hotel operations and security.
- **The Neural Engine:** Live CCTV integration (via MediaMTX) continuously audited by Gemini for weapon, smoke, and biometric threat detection.
- **AI Sentinel Reports:** Automated post-incident intelligence generation and summaries.

---

## 🏗 System Architecture

The Aegis ecosystem is highly decoupled and scalable, utilizing a microservices approach:

1. **User & Frontend Layer:** Next.js (App Router) powering role-based Progressive Web Apps (Guest, Staff, Admin).
2. **Identity Gateway:** Firebase Auth with strict RBAC, QR Tokenization, and Biometric Facial Hashes.
3. **Connectivity Hub:** Socket.io for millisecond-latency telemetry, combined with MediaMTX for WebRTC/HLS camera relay.
4. **Intelligence Engine:** Google Gemini parsing 2D floor plans + custom A* Pathfinding calculating real-time evasion routes.
5. **Data Foundation:** Firebase Data Connect mapping robust relational schemas to **PostgreSQL (AlloyDB)**, with Firestore handling signaling.
6. **Edge/IoT Layer:** ESP32 BLE Beacons tracking movement, and CCTV hardware passing RTSP streams to the AI agents.

---

## 💻 Tech Stack

- **Frontend & UX:** Next.js 15 (React 19), Tailwind CSS v4, Framer Motion, Serwist (PWA)
- **Backend & Real-Time:** Node.js, Socket.io (WebSockets), WebRTC
- **Video Streaming:** MediaMTX (RTSP to WebRTC/HLS relay), WHEP Player
- **Database & Cloud:** PostgreSQL (AlloyDB via Firebase Data Connect), Firebase Auth, Cloud Run, Docker
- **Multimodal AI / LLM:** Google Generative AI (Gemini 2.5 Flash / 3.0 Vision)
- **Edge / IoT (Hardware):** ESP32 BLE Beacons, Standard 1080p CCTV Cameras, Smoke/Thermal Sensors

---

## 🗺️ Phased Implementation Roadmap

### Phase 1: The Prototype *(Completed)*
*Establishing the routing logic, spatial awareness, and core authentication entirely through software.*
- [x] **AI Blueprint Generator:** Gemini Vision parses 2D floor plans.
- [x] **Virtual A* Pathfinding:** Core static routing logic established.
- [x] **Facial Biometric Agent:** Edge-based enrollment and validation.
- [x] **Frictionless PWA:** Cross-platform web app access without downloads.
- [x] **Cloud-Based SOS:** WebRTC audio/video over standard internet.
- [x] **Agent Workforce Hub:** 1-click staff registration and QR Digital IDs.

### Phase 2: The MVP *(Current State)*
*Moving from static simulation to live edge-inference. Introducing custom machine learning models.*
- [x] **YOLO-Powered Threat Microservice:** Fine-tuned on COCO + Weapon/Fire datasets for hazard detection.
- [x] **Multi-Agent AI Monitoring:** AI swarm automating log analysis and alerts.
- [x] **Dynamic Hazard Rerouting:** A* pathfinding now reacts live to YOLO camera feeds.
- [x] **Dual-Link SOS:** Emergency comms auto-switch between Internet → Local IP.

### Phase 3: The Enterprise *(Future Target)*
*Fusing physical IoT hardware with deep-learning time-series models for a predictive perimeter.*
- [ ] **Deep Learning Engine:** LSTM & Autoencoders for behavioral anomaly detection.
- [ ] **True Hardware IPS:** Sub-meter physical tracking via ESP32 BLE Mesh.
- [ ] **LiDAR-BLE Spatial Mapping:** Zero-touch autonomous coordinate calibration for beacon installation.
- [ ] **Triple-Link SOS (Blackout Protocol):** Full resiliency adding BLE mesh as the ultimate fallback.
- [ ] **Native Mobile Ecosystem:** Transition from PWA to dedicated iOS/Android applications (React Native/Capacitor).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Firebase CLI (for Data Connect emulators)
- A Google Cloud Project with Gemini API enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aegis-ai-platform.git
   cd aegis-ai-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the keys listed in the [Environment Variables](#-environment-variables) section below.

4. **Start the Firebase Data Connect Emulator (Optional for local DB testing):**
   ```bash
   firebase emulators:start --only dataconnect,auth
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Environment Variables

Required keys for `.env.local`:

```env
# Google / Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Real-Time Sockets & Video Streaming
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server-url
NEXT_PUBLIC_MEDIAMTX_PRIMARY_WEBRTC_BASE_URL=http://localhost:8889
NEXT_PUBLIC_MEDIAMTX_PRIMARY_HLS_BASE_URL=http://localhost:8888
MEDIAMTX_API_URL=http://localhost:9997
```

---

## 👥 Team: Cipher Agents
**Google Solution Challenge - Build with AI**

- Sourav Kumar (Team Leader)
- Himanshu Bansal
- Swapn Kumar

*Built with ❤️ for a safer, smarter hospitality experience.*
