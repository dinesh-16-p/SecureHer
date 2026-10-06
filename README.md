# SecureHer — AI-Based Women Safety & Health Application

**Your Safety. Your Health. Your Community.**

SecureHer is a comprehensive, production-quality final-year project designed to unify women's physical safety, emergency alert broadcasting, reproductive health tracking, and peer community support into a single, high-trust platform.

---

## 🌟 Key Features

### 🛡️ Women Safety & SOS
- **1-Tap Emergency SOS:** Press-and-hold (2–3 seconds) activation to prevent false alarms, capturing instant live GPS coordinates.
- **Trusted Emergency Circle:** Manage prioritized emergency contacts who receive automatic push & SMS location alerts.
- **Live Location Sharing:** Share real-time GPS coordinates with safe arrival confirmations and safe route boundary alerts.
- **Verified Emergency Helplines:** Instant direct calling for National Emergency (112), Women Helpline (1091), Police, Ambulance, and Legal Aid.

### 💖 Women's Health & Wellness
- **Cycle & Period Tracker:** Monitor cycle duration, period start/end dates, and view estimated upcoming period windows.
- **4-Phase Cycle Monitoring:** Comprehensive biological insights for Menstrual, Follicular, Ovulatory, and Luteal phases.
- **7-Day Mood & Symptom Journal:** Log daily emotions and symptoms with privacy-first encryption.
- **Medication & Supplement Reminders:** Custom notifications and dosage logs for daily prescriptions and vitamins.
- **Doctor Appointment Scheduler:** Track gynecologist and healthcare specialist visits with doctor notes.

### 🤝 Community & Support
- **Supportive Peer Network:** Moderated discussion space to share safety recommendations and health advice.
- **Privacy & Anonymity Controls:** Choice between verified handle or total anonymity; exact locations are never exposed publicly.

---

## 🎨 Brand & Design System

SecureHer adheres strictly to a feminine, modern, safe, healthcare- and AI-inspired color system:

- **Primary (Deep Plum):** `#5B214F`
- **Secondary (Elegant Rose):** `#C75B7A`
- **Accent (Soft Blush):** `#F6DDE5`
- **Background (Warm Off-White):** `#FFF9FB`
- **Card (White):** `#FFFFFF`
- **Text (Deep Charcoal):** `#29212A`
- **Health Accent (Soft Mauve):** `#9B6B8F`
- **Emergency (Emergency Red):** `#D92D3A` *(Reserved strictly for SOS actions)*

---

## 🛠️ Technology Stack

- **Frontend:** React (v18), Vite, JavaScript
- **Icons:** Lucide React
- **Styling:** Custom CSS Design System with CSS Variables, Glassmorphism, and Fluid Typography
- **Backend / Cloud:** Firebase Modular SDK (v10)
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Storage
  - Firebase Hosting
- **Routing:** React Router DOM (v6)

---

## 📁 Project Structure

```
SecureHer/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── SectionHeading.jsx
│   │   ├── layout/
│   │   │   └── Footer.jsx
│   │   └── navigation/
│   │       └── Navbar.jsx
│   ├── constants/
│   │   └── theme.js
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── Dashboard/
│   │   │   └── DashboardPage.jsx
│   │   └── Landing/
│   │       ├── CommunitySection.jsx
│   │       ├── CtaSection.jsx
│   │       ├── HealthSection.jsx
│   │       ├── HeroSection.jsx
│   │       ├── HowItWorksSection.jsx
│   │       ├── LandingPage.jsx
│   │       ├── SafetySection.jsx
│   │       └── WhySection.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   └── firebase/
│   │       └── firebase.js
│   ├── styles/
│   │   └── theme.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone & Navigate
```bash
git clone https://github.com/dinesh-16-p/SecureHer.git
cd SecureHer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and supply your Firebase credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🔒 Firebase Security Rules
Security rules are configured in `firestore.rules` ensuring user health data and emergency events remain private and accessible only by authorized owners.

---

## 🚀 Future Scope
- Integration with Python Flask/FastAPI AI danger detection backend.
- Mobile application wrap using React Native / Capacitor.

---

## 👥 GitHub Repository
[SecureHer GitHub Repository](https://github.com/dinesh-16-p/SecureHer)
