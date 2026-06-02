# 🎓 AcadAlert: AI-Powered Academic Digital Twin

🌍 **Live Architecture:** 3-Tier Microservice (React Native + Node.js + FastAPI)

▶️ **Video Walkthrough:** [Teacher Walkthrough](https://drive.google.com/file/d/1nHNo77CZVPv1OEJYqB5Yz0hUyT8kMagv/view?usp=drive_link)
[Student Walkthrough](https://drive.google.com/file/d/1zNq9z6sm-FNRvsaMedfp8T_STH_EeyJM/view?usp=drive_link)

📦📦 **Download APK:** [Click here to download AcadAlert v1.0.0](https://drive.google.com/file/d/1z_8cVcRr9GM2qZrXxJVa3Jr0d6WBz7da/view?usp=drive_link)

### The Problem
Traditional university student portals are passive. They rely on students to actively log in to check their attendance and grades. By the time a student realizes their attendance has dropped below university minimums, it is often too late, leading to academic probation or unnecessary backlogs. Furthermore, faculty lack early-warning systems to identify at-risk students before midterms.

### The Solution
An active, AI-driven Academic Digital Twin that constantly monitors student metrics in the background. Instead of waiting for students to check their portals, AcadAlert pushes critical interventions directly to their lock screens. 

Built on a decoupled microservice architecture, the system features:
* **The ML Inference Engine:** A Python FastAPI microservice that analyzes attendance velocity, historical backlogs, and test scores to predict dropout risk.
* **The Notification Engine:** A Node.js backend running a `node-cron` daemon that actively scans the Supabase database and triggers Firebase Cloud Messaging (FCM) payloads the minute a deadline passes.
* **Role-Based Dashboards:** A React Native frontend providing distinct, secure experiences for both Students (analytics and task tracking) and Faculty (class-wide risk assessment).

### 🚀 Engineering Highlights & System Architecture
* **Decoupled 3-Tier Microservice Architecture:** Engineered a highly modular, independent ecosystem utilizing a React Native mobile client, a Node.js/Express orchestration layer, and a dedicated FastAPI Python machine learning service to ensure non-blocking, high-speed data inferences.
* **Hybrid AI & Heuristic Micro-Analysis:** The risk engine combines a Scikit-learn predictive model (calculating LOW/MED/HIGH dropout probabilities) with a deterministic, algebraic heuristic engine. This allows the dashboard to generate highly specific, context-aware recovery paths (e.g., dynamically calculating exact attendance deficits required to meet a 75% university threshold).
* **Automated Daemon & FCM Deduplication:** Designed a continuous Node-cron orchestration job that actively monitors PostgreSQL for impending deadlines. Implemented strict memory-bank validation to intercept overlapping database triggers, mathematically guaranteeing single-delivery Firebase Cloud Messaging (FCM) push payloads to active hardware tokens.
* **Time-Series Digital Twin Analytics:** Built a robust data visualization layer. Instead of static percentage snapshots, the dashboard maps historical attendance velocity and logs weekly study consistency, providing educators with a true, real-time "Digital Twin" of student study habits.


### 🗄️ System Architecture & Repositories
Because this is a microservice architecture, the codebase is split into three purpose-built repositories:
1.  **📱 Frontend (This Repo):** React Native mobile application.
2.  **⚙️ Core Backend:** [Link to Node.js Repo Here](https://github.com/AcadAlert-Team/acadalert-backend)]
3.  **🧠 ML Microservice:** [Link to FastAPI Repo Here](https://github.com/AcadAlert-Team/acadalert-ml)]

### Tech Stack
* **Frontend:** React Native, Expo, React Navigation, Chart Kit
* **Backend:** Node.js, Express.js, node-cron
* **Machine Learning:** Python, FastAPI, Uvicorn
* **Database & Auth:** Supabase (PostgreSQL)
* **Push Notifications:** Firebase Cloud Messaging (FCM) Admin SDK

### Setup Instructions (Local Development)
If you wish to run the full three-tier architecture locally, please clone all three repositories and follow the sequence below.

**1. Start the ML Microservice (Terminal 1)**
```bash
git clone <your-ml-repo-url>
cd acadalert-ml
source venv/bin/activate
python -m uvicorn dropout_prediction:app --port 8000 --reload
2. Start the Core Backend (Terminal 2)

Bash
git clone <your-backend-repo-url>
cd acadalert-backend
npm install
# Ensure .env contains SUPABASE_URL, SUPABASE_KEY, and Firebase credentials
npm start 
3. Create Local Tunnel (Terminal 3)

Bash
ngrok http 5001
# Copy the resulting https:// URL
4. Launch the Mobile App (Terminal 4)

Bash
git clone <your-mobile-repo-url>
cd acadalert-mobile
npm install
# Update API_BASE_URL in config with the Ngrok URL
npx react-native run-android
