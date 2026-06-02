🎓 AcadAlert: AI-Powered Academic Digital Twin
🌍 Live Architecture: 3-Tier Microservice (React Native + Node.js + FastAPI)
▶️ Video Walkthrough: [Insert Google Drive/YouTube Link Here]
📦 Download APK: [Insert Link to your app-debug.apk]

The Problem
Traditional university student portals are passive. They rely on students to actively log in to check their attendance and grades. By the time a student realizes their attendance has dropped below university minimums, it is often too late, leading to academic probation or unnecessary backlogs. Furthermore, faculty lack early-warning systems to identify at-risk students before midterms.

The Solution
An active, AI-driven Academic Digital Twin that constantly monitors student metrics in the background. Instead of waiting for students to check their portals, AcadAlert pushes critical interventions directly to their lock screens.

Built on a decoupled microservice architecture, the system features:

The ML Inference Engine: A Python FastAPI microservice that analyzes attendance velocity, historical backlogs, and test scores to predict dropout risk.

The Notification Engine: A Node.js backend running a node-cron daemon that actively scans the Supabase database and triggers Firebase Cloud Messaging (FCM) payloads the minute a deadline passes.

Role-Based Dashboards: A React Native frontend providing distinct, secure experiences for both Students (analytics and task tracking) and Faculty (class-wide risk assessment).

🚀 "Extra Mile" Engineering Features Implemented
Smart Push Notification Deduplication: Implemented memory-bank validation in the Node.js cron job using JavaScript Sets. This intercepts overlapping database triggers and mathematically guarantees a device only receives a single FCM push payload, eliminating notification spam.

Contextual AI Guardrails: The dashboard doesn't just output raw ML data. It features hardcoded enterprise guardrails that detect specific edge cases—such as a student having a safe overall 83% attendance, but a failing 60% in a single Elective—prompting the UI to recommend preparing a "Condonation Request."

Time-Series Analytics: Implemented dynamic React Native line charts that map a student's historical performance trajectory rather than just showing a static current percentage.

Live Token Refresh Lifecycle: Engineered a secure login/logout lifecycle that dynamically overwrites hardware device tokens in the cloud, preventing failed Firebase push attempts to "ghost" devices.

🗄️ System Architecture & Repositories
Because this is a microservice architecture, the codebase is split into three purpose-built repositories:

📱 Frontend (This Repo): React Native mobile application.

⚙️ Core Backend ([Link to your Node.js Repo]): Express.js API, Supabase Database routing, and the node-cron Firebase push engine.

🧠 ML Microservice ([Link to your FastAPI Repo]): Python inference server hosting the risk-assessment models.

Tech Stack
Frontend: React Native, Expo, React Navigation, Chart Kit

Backend: Node.js, Express.js, node-cron

Machine Learning: Python, FastAPI, Uvicorn

Database & Auth: Supabase (PostgreSQL)

Push Notifications: Firebase Cloud Messaging (FCM) Admin SDK

Setup Instructions (Local Development)
If you wish to run the full three-tier architecture locally, please clone all three repositories and follow the sequence below.

1. Start the ML Microservice (Terminal 1)

Bash
git clone <your-ml-repo-url>
cd acadalert-ml
source venv/bin/activate
python -m uvicorn dropout_prediction:app --port 8000 --reload
2. Start the Core Backend (Terminal 2)

Bash
git clone <your-backend-repo-url>
cd acadalert-backend
npm install
# Ensure .env contains SUPABASE_URL, SUPABASE_KEY, and Firebase Admin credentials
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