# SecureHer — Complete Project Documentation

**Application Name:** SecureHer  
**Application ID:** `org.secureher.app`  
**Web Deployment:** `https://her-a955f.web.app`  
**Backend API:** FastAPI (`http://localhost:8000` / Production Serverless)  
**Document Classification:** Academic Project Specification & System Architectural Reference  
**Generated Date:** October 14, 2026  

---

## Table of Contents
1. **Chapter 1 — Project Overview**
2. **Chapter 2 — Technology Stack**
3. **Chapter 3 — Complete Project Folder Structure**
4. **Chapter 4 — System Architecture**
5. **Chapter 5 — Every Application Module in Detail**
6. **Chapter 6 — SOS System: Complete Technical Explanation**
7. **Chapter 7 — Database and Data Model**
8. **Chapter 8 — Backend and API Documentation**
9. **Chapter 9 — Installation Prerequisites**
10. **Chapter 10 — Exact Instructions to Run the Project Locally**
11. **Chapter 11 — Environment Variables and Configuration**
12. **Chapter 12 — Firebase Setup from Scratch**
13. **Chapter 13 — Android & PWA Setup**
14. **Chapter 14 — Testing and Verification**
15. **Chapter 15 — Build and Deployment**
16. **Chapter 16 — Security and Privacy**
17. **Chapter 17 — Troubleshooting Handbook**
18. **Chapter 18 — Project Workflows and Use Cases**
19. **Chapter 19 — Limitations and Future Scope**
20. **Chapter 20 — Glossary and References**

---

# Chapter 1 — Project Overview

### 1.1 Project Title
**SecureHer — Next-Generation Women Safety, Emergency Dispatch, and Personal Health Platform**

### 1.2 Problem Statement
Women worldwide face recurring safety vulnerabilities during daily commutes, isolated travels, and emergency situations. Conventional safety solutions suffer from key systemic shortcomings:
1. **High False-Alarm Rates:** Accidental single taps triggering panic alerts.
2. **Unreliable GPS Reporting:** Applications broadcasting stale, unverified, or default fallback coordinates (e.g. city centers) instead of true device GPS.
3. **Over-reliance on Paid SMS Gateways:** Third-party cloud SMS providers (Twilio, AWS SNS) introduce recurrent subscription costs, delivery latency, and rate limits.
4. **Fragmented Ecosystems:** Women are forced to maintain separate apps for emergency SOS, travel monitoring, evidence collection, and reproductive healthcare.

### 1.3 Motivation and Background
SecureHer was conceptualized to provide a unified, zero-recurring-cost, privacy-first security platform. By combining client-side Web Crypto forensics, direct native Android telephony (`SmsManager`), Firebase Cloud Messaging (FCM), and localized OpenStreetMap facility routing, SecureHer ensures women retain full agency over their personal safety.

### 1.4 Objectives
- Provide a 3-second hold-to-activate emergency SOS trigger to prevent false alarms.
- Dispatch free, direct cellular SMS through the device's native SIM card on Android.
- Deliver real-time, low-latency push notifications via Firebase Cloud Messaging (FCM) to trusted contact devices.
- Deliver verified real-time GPS tracking with explicit accuracy bounds (high, moderate, poor, stale) and zero fake coordinate fallbacks.
- Provide a Trusted Journey module with arrival monitoring, midnight date-crossover handling, and check-in confirmation.
- Enable tamper-evident evidence capture sealed with client-side SHA-256 cryptographic hashes.
- Maintain a single responsive codebase powering the Website, installable PWA, and native Android application.

### 1.5 Scope and Limitations
- **Current Scope:** Fully operational Single Page Application (SPA), Progressive Web App (PWA) with offline emergency calling, Capacitor Android integration, and FastAPI backend.
- **Physical Limitations:** Direct cellular SMS requires a physical Android device equipped with an active cellular SIM card. Ordinary web browsers cannot send direct background SMS due to browser sandbox security models; on web/PWA platforms, a prepared `sms:` URI fallback or 112 direct calling is provided.

---

# Chapter 2 — Technology Stack

### 2.1 Core Technologies Table
| Category | Technology | Version | File Manifest / Location | Architectural Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `18.3.1` | `package.json` | Component-based interactive UI rendering & state management |
| **Frontend Runtime** | React DOM | `18.3.1` | `package.json` | Web DOM reconciliation |
| **Build & Tooling** | Vite | `5.4.21` | `vite.config.js` | Ultra-fast ESM development server & Rollup production bundler |
| **Client Routing** | React Router DOM | `6.30.6` | `src/routes/AppRoutes.jsx` | Client-side declarative routing and protected auth guards |
| **Mobile Native Bridge**| Capacitor Core / Android | `6.0.0` | `capacitor.config.json` | Native Android telephony bridge and Web-to-Native container |
| **Icons & Design** | Lucide React | `0.378.0` | `src/components/*` | Consistent, accessible iconography |
| **Maps & Geospatial** | MapLibre GL | `6.13.0` | `src/pages/Safety/LocationPage.jsx` | Open-source vector map rendering and accuracy circles |
| **Backend Framework** | FastAPI | `>=0.111.0` | `backend/main.py` | Asynchronous RESTful API for push notifications & AI router |
| **ASGI Web Server** | Uvicorn | `>=0.30.0` | `backend/requirements.txt` | Production-grade async server |
| **Cloud & Database** | Firebase Modular SDK | `10.14.1` | `src/services/firebase/firebase.js` | Auth, Firestore real-time NoSQL DB, and FCM messaging |
| **Server Admin** | Firebase Admin Python | `7.7.0` | `backend/main.py` | Token verification & FCM multicast push notification dispatch |
| **Forensic PDF** | jsPDF & AutoTable | `4.2.1` / `5.0.8` | `src/services/pdf/incidentReportPdfService.js` | Offline client-side PDF incident report generation |
| **PWA & Offline** | Service Worker & Manifest | W3C Standard | `public/sw.js`, `public/manifest.json` | Offline asset caching and standalone homescreen installation |

---

# Chapter 3 — Complete Project Folder Structure

```
D:\Project\SecureHer\
├── android/                         # Capacitor Native Android Studio Project
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml      # Android permissions (SEND_SMS, READ_PHONE_STATE)
│   │   └── java/org/secureher/app/
│   │       ├── MainActivity.java    # BridgeActivity registering native plugins
│   │       └── DirectSmsPlugin.java # Native SmsManager plugin for direct SIM dispatch
├── backend/                         # Python FastAPI Backend
│   ├── main.py                      # REST API endpoints (/api/health, /api/sos/push, etc.)
│   └── requirements.txt             # Backend dependencies (FastAPI, uvicorn, firebase-admin)
├── public/                          # Static Web & PWA Assets
│   ├── manifest.json                # Web App Manifest for PWA installation
│   ├── sw.js                        # Service worker with offline caching & helpline fallback
│   ├── offline.html                 # Offline fallback page with emergency direct dial
│   └── favicon.svg, icon-*.png      # Maskable and standard application icons
├── src/                             # React Application Source Code
│   ├── components/                  # Reusable UI components (Button, Card, Badge, Modal)
│   ├── context/                     # Application State Management
│   │   ├── AuthContext.jsx          # Firebase Auth state, login, signup, user profile
│   │   └── SafetyContext.jsx        # GPS engine, native SMS, FCM push, alarm controller
│   ├── pages/                       # Application Views
│   │   ├── Auth/                    # LoginPage, SignupPage, ForgotPasswordPage
│   │   ├── Dashboard/               # DashboardPage (Action cards, safety status)
│   │   ├── Landing/                 # LandingPage, Hero, Features, Testimonials
│   │   ├── Safety/                  # SOSPage, JourneyPage, LocationPage, ContactsPage, etc.
│   │   ├── Community/               # CommunityPage (Peer posts, anonymous discussions)
│   │   └── Profile/ & Settings/     # User profile details and application preferences
│   ├── routes/                      # ProtectedRoute.jsx and AppRoutes.jsx
│   ├── services/                    # Decoupled Business & API Logic
│   │   ├── api/safetyApi.js         # Backend client for FCM push and health checks
│   │   ├── audio/sosAlarm.js        # Web Audio API emergency siren synthesizer
│   │   ├── firebase/                # firebase.js, firestoreService.js, fcmService.js
│   │   ├── map/mapUtils.js          # Geodesic GPS accuracy circle calculations
│   │   ├── pdf/                     # Incident report forensic PDF generation
│   │   ├── permissionService.js     # Hardware GPS freshness & accuracy engine
│   │   └── sms/smsService.js        # Platform-aware native SMS and Web fallback dispatcher
│   ├── index.css                    # Design tokens, CSS variables, and fluid typography
│   └── main.jsx                     # Application entry point
├── capacitor.config.json            # Capacitor application configuration
├── firebase.json                    # Firebase Hosting, Firestore rules, and rewrites
├── firestore.rules                  # Strict user-isolated Firestore security rules
├── package.json                     # Frontend npm scripts & dependencies
├── vite.config.js                   # Vite configuration
└── test_*.mjs / test_*.py           # Comprehensive automated test suites (10 suites)
```

---

# Chapter 4 — System Architecture

### 4.1 High-Level Architecture Overview
SecureHer operates on a tripartite architecture:
1. **Client Tier (Web / PWA / Android):** React Single Page Application wrapped in Capacitor for native mobile execution.
2. **Cloud Tier (Google Firebase):** Authentication services, real-time Firestore database listeners, and cloud storage.
3. **Application Server Tier (FastAPI):** Asynchronous microservice handling server-side Firebase ID token validation, Firebase Admin Cloud Messaging multicast, and journey sharing.

```mermaid
graph TD
    User([User Device]) -->|Interacts| Client[SecureHer React SPA / PWA]
    Client -->|Native Calls| Capacitor[Capacitor Bridge & DirectSmsPlugin]
    Capacitor -->|Direct GSM/LTE| Carrier[Cellular Carrier Radio / SIM]
    Carrier -->|Free Direct SMS| ContactPhone([Emergency Contact Phone])
    
    Client -->|Client SDK| FirebaseAuth[Firebase Authentication]
    Client -->|Real-time Snapshot| Firestore[(Cloud Firestore DB)]
    
    Client -->|HTTPS Bearer Token| FastAPI[FastAPI Backend Server]
    FastAPI -->|Firebase Admin SDK| FCM[Firebase Cloud Messaging]
    FCM -->|Push Notification| ContactDevice([Trusted Contact Device])
```

---

# Chapter 5 — Every Application Module in Detail

### 5.1 Authentication Module (`LoginPage.jsx`, `SignupPage.jsx`)
- **Purpose:** Secure identity management with email/password and Google Sign-In.
- **Data Isolation:** User sessions generate a unique Firebase `uid`. All profile and emergency data is stored under `users/{uid}`.
- **Error Handling:** Client-side error parser (`parseAuthError`) maps raw Firebase codes (e.g. `auth/invalid-credential`) into clear messages.

### 5.2 Emergency SOS Broadcast (`SOSPage.jsx`, `SafetyContext.jsx`)
- **Purpose:** 1-tap or 3-second hold emergency trigger.
- **Channels:** Sounds local Web Audio API alarm siren, dispatches native Android cellular SMS, triggers FCM push notifications, and logs forensic audit events in Firestore.
- **Status:** **Implemented & Fully Operational.**

### 5.3 Live Safety Map & Geodesic Circles (`LocationPage.jsx`, `mapUtils.js`)
- **Purpose:** Displays the user's real-time position on MapLibre vector maps using MapTiler tiles.
- **Accuracy Engine:** Generates true geodesic 64-vertex circular polygons showing GPS error margins (high: <20m, moderate: 20-100m, poor: >100m).
- **Status:** **Implemented & Verified.**

### 5.4 Trusted Journey Monitoring (`JourneyPage.jsx`)
- **Purpose:** Commute tracking with live ETA countdowns, check-in prompts, and overdue escalation.
- **Reliability Engine:** Full timezone-aware ISO 8601 epoch handling. Seamlessly handles journeys crossing midnight or changing AM/PM boundaries without string comparison bugs.
- **Status:** **Implemented & Verified.**

### 5.5 Nearby Emergency Services (`NearbyServicesPage.jsx`)
- **Purpose:** Queries OpenStreetMap Overpass API for verified police stations, hospitals, clinics, and fire stations within a 5km radius.
- **Reliability Guard:** Strictly waits for authentic GPS coordinates; never queries using synthetic fallback coordinates.
- **Status:** **Implemented & Verified.**

### 5.6 Tamper-Evident Evidence Vault (`EvidenceCameraPage.jsx`, `EvidenceHistoryPage.jsx`)
- **Purpose:** Captures photos/audio recordings sealed with browser Web Crypto SHA-256 integrity digests. Generates downloadable forensic incident report PDFs.
- **Status:** **Implemented & Verified.**

### 5.7 Fake Call Simulation (`FakeCallPage.jsx`)
- **Purpose:** Simulates incoming phone calls with realistic ringtones, vibration, caller name customization, and interactive voice synthesis to facilitate discreet departures from unsafe situations.
- **Status:** **Implemented & Verified.**

---

# Chapter 6 — SOS System: Complete Technical Explanation

### 6.1 Trigger Mechanics & Deduplication
1. **Hold Duration:** Requires a continuous 2.5–3.0 second hold (or a deliberate 2-tap confirmation within 3 seconds) to prevent accidental pocket activations.
2. **Concurrency Lock:** Managed via `isSosInFlightRef.current`. Rapid multiple taps while a dispatch is in-flight are rejected.

### 6.2 Dual-Channel Alert Architecture

#### Channel 1: Free Native Android SMS (`DirectSmsPlugin.java`, `smsService.js`)
- **Hardware Integration:** Executes via Android's `SmsManager.sendTextMessage()` or `sendMultipartTextMessage()`.
- **Zero Third-Party Cost:** Uses the user's existing cellular carrier SIM plan without paid gateways.
- **Permission Management:** Requests `android.permission.SEND_SMS` and checks `android.permission.READ_PHONE_STATE`.
- **Honest Telemetry:** Reports status as `dispatched_to_carrier` (handed to carrier radio); never claims false delivery without carrier receipt.
- **Web / PWA Fallback:** On web browsers where background SMS is restricted by browser security policies, the app sets status to `unsupported_platform` and displays an instant `sms:` URI composer button alongside the 112 dialer.

#### Channel 2: Firebase Cloud Messaging (FCM) Push Alert (`fcmService.js`, `backend/main.py`)
- **Device Registration:** Device tokens are stored under `users/{uid}/devices/{deviceId}`.
- **Server Dispatch:** FastAPI verifies the user's Firebase Bearer ID token and broadcasts a high-priority multicast push alert using `firebase_admin.messaging.send_each_for_multicast()`.
- **Graceful Degradation:** If trusted contacts have not registered FCM devices, the system records `no_registered_devices` without failing the emergency SOS.

---

# Chapter 7 — Database and Data Model

All user data is strictly scoped under `users/{uid}` in Cloud Firestore:

```
users/{uid}
├── emergencyContacts/{contactId}   # Priority, name, phone, email, relationship
├── safetyEvents/{eventId}          # Type (SOS), coordinates, accuracy, SMS status, push status
├── journeys/{journeyId}            # Title, destination, startAt, expectedArrivalAt, status
├── incidentReports/{reportId}      # Title, description, SHA-256 hash, evidence IDs
└── devices/{deviceId}              # FCM token, platform (web/android), lastSeen
```

### Security Rules Enforcement (`firestore.rules`)
```javascript
match /users/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
  match /{allSubcollections=**} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
}
```

---

# Chapter 8 — Backend and API Documentation

| Endpoint | Method | Authentication | Request Model | Response Summary |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | None | Returns backend status, FCM configuration readiness, and UTC timestamp. |
| `/api/sos/push` | `POST` | `Bearer <Firebase_ID_Token>` | `SOSPushRequest` | Dispatches FCM push notifications to trusted contact device tokens. |
| `/api/journey/share` | `POST` | `Bearer <Firebase_ID_Token>` | `JourneyShareRequest` | Sends journey progress updates to designated recipient. |

---

# Chapter 9 — Installation Prerequisites

### Required Software
1. **Node.js:** v18.0.0 or later (Tested with Node.js v24.19.0).
2. **Python:** v3.10 to v3.13 (Tested with Python 3.13.0).
3. **Git:** v2.30 or later.
4. **Web Browser:** Google Chrome (v120+) or modern Chromium browser.
5. **Android Studio (Optional, for native Android):** Android SDK Platform 34+, Android Build Tools, and JDK 17+.

---

# Chapter 10 — Exact Instructions to Run the Project Locally

### Step 1: Clone and Navigate to Project
```powershell
cd D:\Project\SecureHer
```

### Step 2: Install Frontend Dependencies
```powershell
npm install
```

### Step 3: Run Frontend Development Server
```powershell
npm run dev
```
*Open `http://localhost:5173` in Google Chrome.*

### Step 4: Run Backend Server (In a New Terminal Window)
```powershell
cd D:\Project\SecureHer\backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*Backend API will run at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.*

---

# Chapter 11 — Environment Variables and Configuration

### Frontend (`.env.local` in project root)
```env
VITE_FIREBASE_API_KEY=AIzaSyDRxHv6y7RfjFjDq468wkYT0i8Z24usO-0
VITE_FIREBASE_AUTH_DOMAIN=her-a955f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=her-a955f
VITE_FIREBASE_STORAGE_BUCKET=her-a955f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=778742880549
VITE_FIREBASE_APP_ID=1:778742880549:web:f9b68fa938b6528d4ae2cc
VITE_FIREBASE_MEASUREMENT_ID=G-WF5E4M7963
VITE_MAPTILER_API_KEY=BE8E5HFWGrNH05pGD0M4
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env` optional for local dev)
```env
FIREBASE_API_KEY=AIzaSyDRxHv6y7RfjFjDq468wkYT0i8Z24usO-0
FIREBASE_PROJECT_ID=her-a955f
# Optional: Set service account JSON string for real server-side FCM dispatch
FIREBASE_SERVICE_ACCOUNT_JSON=
```

---

# Chapter 12 — Firebase Setup from Scratch
1. Navigate to [Firebase Console](https://console.firebase.google.com/) and create a project named `her-a955f`.
2. Enable **Authentication** with Email/Password and Google sign-in providers.
3. Enable **Cloud Firestore** in production mode and deploy `firestore.rules`.
4. Enable **Firebase Cloud Messaging (FCM)** in project settings.

---

# Chapter 13 — Android & PWA Setup

### Running Native Android Project
```powershell
# 1. Build Vite production bundle
npm run build

# 2. Sync web assets into Android container
npx cap sync android

# 3. Open project in Android Studio
npx cap open android
```

### Google Play Store Policy Notice
Direct SMS requires `SEND_SMS` permission. Under Google Play Developer Program policies, apps using `SEND_SMS` must qualify under specific use-case exceptions (Physical Safety / Emergency Alert) and submit a Permission Declaration Form.

---

# Chapter 14 — Testing and Verification

### Test Suite Execution Summary
| Test Suite File | Command | Scope Tested | Result |
| :--- | :--- | :--- | :--- |
| `test_native_sms_sos.mjs` | `node test_native_sms_sos.mjs` | SMS text formatting, phone validation, PWA fallback | **PASS (7/7)** |
| `test_backend_endpoints.py`| `python test_backend_endpoints.py`| Token auth, empty tokens, FCM batch push | **PASS (5/5)** |
| `test_gps_accuracy_engine.mjs` | `node test_gps_accuracy_engine.mjs` | Freshness windows, accuracy categories (<20m high) | **PASS (4/4)** |
| `test_map_utils.mjs` | `node test_map_utils.mjs` | Geodesic 64-vertex accuracy polygon generator | **PASS (3/3)** |
| `test_trusted_journey_engine.mjs` | `node test_trusted_journey_engine.mjs`| AM/PM boundaries, midnight date crossover | **PASS (5/5)** |
| `test_e2e_integration.mjs` | `node test_e2e_integration.mjs` | Full cross-module lifecycle & audit compliance | **PASS (10/10)** |
| `test_pwa_validation.mjs` | `node test_pwa_validation.mjs` | Web manifest, service worker, offline fallback | **PASS (5/5)** |
| `test_pdf_generation.mjs` | `node test_pdf_generation.mjs` | jsPDF forensic evidence report generation | **PASS (5/5)** |
| `test_markdown_render.mjs` | `node test_markdown_render.mjs`| Markdown safety guide sanitized rendering | **PASS (2/2)** |
| `run_browser_public_test.mjs` | `node run_browser_public_test.mjs` | Real Google Chrome (v155) public flows & viewports | **PASS (7/7)** |

---

# Chapter 15 — Build and Deployment

### Production Deployment
- **Frontend:** Built via `npm run build` and hosted on **Firebase Hosting** (`her-a955f.web.app`).
- **Deploy Command:** `firebase deploy --only hosting`
- **PWA Capabilities:** Tested against Lighthouse PWA criteria, providing standalone installability and offline caching via `sw.js`.

---

# Chapter 16 — Security and Privacy

1. **Authentication Boundary:** All sensitive endpoints require Firebase Bearer token verification.
2. **Zero Inferred Coordinates:** Emergency dispatches never inject synthetic fallback coordinates.
3. **Client-Side Cryptography:** Evidence files are digested with SHA-256 via browser Web Crypto API before storage.
4. **Least-Privilege Database:** Firestore rules prevent cross-tenant data access.

---

# Chapter 17 — Troubleshooting Handbook

| Problem | Root Cause | Solution |
| :--- | :--- | :--- |
| `uvicorn: command not found` | Python scripts folder not in Windows PATH | Run via module launcher: `python -m uvicorn main:app --reload --port 8000` |
| `Direct SMS Unsupported` on Web | Browser sandbox security model blocks direct cellular radio | Expected on Web/PWA. Tap the provided `Open SMS Composer` button or call 112. |
| `No active SIM card detected` | Android device has no cellular SIM installed | Insert valid SIM card with SMS plan into the test phone. |
| Firebase 401 Unauthorized | Token expired or invalid | Sign out and sign in again to refresh client credentials. |

---

# Chapter 18 — Project Workflows and Use Cases

### Primary SOS Workflow
1. User presses and holds the emergency button for 3 seconds on `SOSPage.jsx`.
2. Web Audio API siren alarm begins sounding.
3. GPS engine requests immediate high-accuracy fix.
4. Native Android layer verifies SIM and dispatches cellular SMS with Google Maps coordinates.
5. FastAPI backend broadcasts FCM push notifications to registered trusted devices.
6. A safety event audit record is written to Firestore (`users/{uid}/safetyEvents`).

---

# Chapter 19 — Limitations and Future Scope
- **Current Limitation:** Direct background SMS is exclusive to native Android devices with an active SIM card.
- **Future Scope:** Implement Apple iOS native wrapper using Capacitor iOS, Bluetooth Low Energy (BLE) physical SOS panic button integration, and machine-learning audio danger detection.

---

# Chapter 20 — Glossary and References
- **PWA:** Progressive Web App
- **FCM:** Firebase Cloud Messaging
- **SPA:** Single Page Application
- **SmsManager:** Android platform API for direct SMS dispatching
- **Official Documentation:**
  - React: `https://react.dev`
  - Vite: `https://vitejs.dev`
  - Firebase: `https://firebase.google.com/docs`
  - FastAPI: `https://fastapi.tiangolo.com`
  - Capacitor: `https://capacitorjs.com/docs`
