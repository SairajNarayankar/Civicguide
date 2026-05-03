# 🗳️ CivicGuide — AI-Powered Election Process Assistant

<div align="center">

![CivicGuide Banner](https://img.shields.io/badge/CivicGuide-Election%20Assistant-4f8ef7?style=for-the-badge&logo=google-chrome&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%202.0%20Flash-AI%20Powered-blue?style=for-the-badge&logo=google&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Deployed-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![React](https://img.shields.io/badge/React%2019-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A nonpartisan, AI-powered web assistant that helps citizens understand how elections work — registration, voting methods, timelines, ballot counting, and more.**

🌐 **[Live Demo](https://civicguide-467404040481.us-central1.run.app)** &nbsp;|&nbsp; 📖 **[How It Works](#how-it-works)** &nbsp;|&nbsp; 🚀 **[Deploy Your Own](#deploy-your-own)**

</div>

---

## 🏆 Hack2Skills: Virtual PromptWars

> This project was built as part of **[Hack2Skills: Virtual PromptWars](https://hack2skills.com)** — a national-level prompt engineering program **powered by Google Cloud**.
>
> The challenge: design an interactive AI assistant for civic education using prompt engineering, Google Cloud infrastructure, and modern web technologies.

<div align="center">

![Hack2Skills](https://img.shields.io/badge/Hack2Skills-Virtual%20PromptWars-orange?style=for-the-badge)
![Powered by Google Cloud](https://img.shields.io/badge/Powered%20By-Google%20Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

</div>

---

## ✨ What is CivicGuide?

CivicGuide is a **fully deployed, production-grade AI chatbot** that makes the election process easy to understand for every citizen. It is strictly nonpartisan — it never discusses candidates or parties, only how elections work.

Whether you're a first-time voter, a student, or just curious about how democracy functions, CivicGuide gives you clear, structured, step-by-step answers in seconds.

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🤖 **AI-Powered Chat** | Gemini 2.0 Flash answers any election process question in real time |
| 📋 **Quick Topic Cards** | One-click access to the most common civic questions |
| 🔀 **Open/Close Sidebar** | Smooth animated sidebar with toggle button and backdrop |
| 🗂️ **Conversation History** | Full context maintained across the entire conversation |
| ⚖️ **Strictly Nonpartisan** | System prompt engineered to never discuss candidates or parties |
| 📱 **Fully Responsive** | Works seamlessly on desktop and mobile |
| ♿ **Accessible** | Proper ARIA labels, keyboard navigation, screen reader support |
| 🔒 **Secure by Design** | API key stored in GCP Secret Manager, never exposed to frontend |

---

## 🖥️ Demo

```
Hi, I'm CivicGuide 🗳️ — your nonpartisan guide to understanding 
how elections work. Ask me anything about registration, voting 
methods, timelines, how votes are counted, and more.
```

**Quick Topics available out of the box:**
- 📋 How to Register to Vote
- 📅 Complete Election Timeline
- 🗳️ Voting Methods (in-person, mail-in, early voting)
- 🔢 How Votes Are Counted & Verified
- ⚖️ Primary vs General Election
- 🏛️ How the Electoral College Works

---

## 🏗️ Architecture

```
User Browser
     │
     ▼
React Frontend (Vite + CSS-in-JS)
     │  /api/chat
     ▼
Express.js Server (Node.js)
     │
     ├── GCP Secret Manager ──► GEMINI_API_KEY
     │
     ▼
Google Gemini 2.0 Flash API
     │
     ▼
AI Response → User
```

**Hosted on:** Google Cloud Run (serverless, auto-scaling, pay-per-use)
**Container:** Docker (multi-stage build)
**Secrets:** GCP Secret Manager
**Image Registry:** Google Container Registry

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, CSS-in-JS |
| **Backend** | Node.js, Express.js |
| **AI Model** | Google Gemini 2.0 Flash |
| **Hosting** | Google Cloud Run |
| **Containerization** | Docker (multi-stage build) |
| **Secret Management** | GCP Secret Manager |
| **CI/CD** | Google Cloud Build |
| **Font** | Playfair Display + Source Sans 3 |

---

## 🚀 Deploy Your Own

### Prerequisites
- [Node.js 20+](https://nodejs.org)
- [Google Cloud CLI](https://cloud.google.com/sdk)
- [Google Gemini API Key](https://aistudio.google.com/apikey) (free tier available)
- A GCP project with billing enabled

### 1. Clone the Repository

```bash
git clone https://github.com/SairajNarayankar/Civicguide.git
cd Civicguide
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Create a local .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

### 4. Run Locally

```bash
# Build the React frontend
npm run build

# Start the server
npm start

# Visit http://localhost:8080
```

### 5. Deploy to Google Cloud Run

```bash
# Set your GCP project
gcloud config set project YOUR_PROJECT_ID

# Store your API key securely
echo -n "your_gemini_api_key" | gcloud secrets create GEMINI_API_KEY --data-file=-

# Grant Cloud Run access to the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/civicguide .

# Deploy to Cloud Run
gcloud run deploy civicguide \
  --image gcr.io/YOUR_PROJECT_ID/civicguide \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --memory 512Mi \
  --port 8080
```

---

## 📁 Project Structure

```
civicguide/
├── src/
│   ├── App.jsx          # Main CivicGuide component (all UI + logic)
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── server.js            # Express server + Gemini API proxy
├── Dockerfile           # Multi-stage Docker build
├── .gitignore           # Excludes node_modules, dist, .env
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

---

## 🔐 Security

- ✅ Gemini API key stored in **GCP Secret Manager** — never in code or environment files
- ✅ API calls proxied through the backend — key never exposed to the browser
- ✅ `.env` and `dist/` excluded from git via `.gitignore`
- ✅ System prompt engineered to prevent political bias or harmful outputs
- ✅ CORS enabled only for expected origins

---

## 💡 Prompt Engineering Highlights

The core of CivicGuide is a carefully engineered system prompt that:

- **Enforces nonpartisanship** — refuses to discuss candidates, parties, or opinions
- **Structures responses** — forces numbered steps and bullet points for clarity
- **Sets geographic defaults** — defaults to US elections when no country is specified
- **Controls tone** — warm, friendly, jargon-free language for all literacy levels
- **Handles edge cases** — gracefully redirects off-topic or politically sensitive questions

---

## 📊 Cost Estimate (GCP)

| Resource | Cost |
|---|---|
| Cloud Run (first 2M requests/month) | **Free** |
| Gemini API (free tier) | **Free** (1,500 req/day) |
| Secret Manager | ~$0.06/month |
| Cloud Build | **Free** (first 120 min/day) |
| **Total** | **~$0/month** for low traffic |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open an issue for bugs or feature requests
- Submit a pull request with improvements
- Suggest new Quick Topics or languages

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Sairaj Narayankar**

[![GitHub](https://img.shields.io/badge/GitHub-SairajNarayankar-181717?style=for-the-badge&logo=github)](https://github.com/SairajNarayankar)

---

<div align="center">

Built with ❤️ for civic education &nbsp;|&nbsp; Powered by **Google Gemini** &nbsp;|&nbsp; Deployed on **Google Cloud**

🗳️ *Understanding democracy starts with understanding the process.*

</div>
