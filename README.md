# ⚖️ LawPilot AI — Enterprise Legal Intelligence & Multi-LLM Gateway

> **Privacy-First, Self-Hostable Legal AI Infrastructure & Document Intelligence System**  
> *Engineered for legal teams, law firms, corporate counsel, and enterprise compliance departments.*

[![GitHub License](https://img.shields.io/badge/license-MIT%20%2F%20Apache--2.0-blue.svg)](https://github.com/techabbayi/LawPilot-AI/blob/main/LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v8-green.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/techabbayi/LawPilot-AI/pulls)

---

## 🌟 Key Platform Features

### 📐 1. 128D Dense Vector RAG Engine & Semantic Search Pipeline
- **Sliding-Window Semantic Chunking**: Automatically breaks complex legal contracts into overlapping text chunks to preserve clause boundaries and prevent context fragment truncation.
- **128-Dimensional Vector Embedding**: Generates dense 128-dimensional floating-point vector embeddings using n-gram feature hashing and L2 vector space normalization.
- **Cosine Similarity Search**: Performs high-speed Cosine Similarity dot-product calculations to retrieve precise clause citations directly into the LLM context window.

### 🧠 2. Multi-LLM AI Gateway & BYOK Encryption
- **Frontier AI Model Support**: Native integration with `Gemini 3 Flash Preview` (`gemini-3-flash-preview`), `Gemini 1.5 Flash`, `Gemini 2.0 Flash`, `Groq Llama 3.3 70B`, `OpenRouter Unified API`, `OpenAI GPT-4o`, and `DeepSeek R1`.
- **Intra-Provider Fallback Cascade**: Automatic zero-downtime failover between models if rate limits (429) or quota errors occur.
- **AES-256-CBC Encrypted Storage**: Bring Your Own Key (BYOK) database credential encryption with cryptographic salt derivation.

### 🛡️ 3. Privacy-First PII & Corporate Data Sanitizer (USP)
- **Automated Masking Layer**: Intercepts and sanitizes sensitive data before prompts reach external AI API endpoints:
  - **Credit Card Numbers** → `[MASKED_CREDIT_CARD]`
  - **Indian PAN Card Numbers** → `[MASKED_PAN_NUMBER]`
  - **Indian Aadhaar Numbers** → `[MASKED_AADHAAR_NUMBER]`
  - **Indian Corporate CIN Registration** → `[MASKED_CIN_REGISTRATION]`
  - **GSTIN Identification** → `[MASKED_GSTIN_NUMBER]`
  - **LLPIN Numbers** → `[MASKED_LLPIN_NUMBER]`
  - **Emails & Phone Numbers** → `[MASKED_EMAIL_ADDRESS]`, `[MASKED_PHONE_NUMBER]`

### 📜 4. Autonomous Document Vault & OCR Engine
- **Multi-Format Parsing**: Extracts text from PDF, DOCX, DOC, TXT, and scanned images using Tesseract OCR.
- **Vault Controls**: 200 MB maximum file upload limit with page restrictions, category tags, and customizable auto-purge retention policies (1d, 7d, 30d, 90d, indefinite).

### 🤖 5. AI Legal Assistant with Contextual Guidance
- **Interactive Chat**: Persistent MongoDB chat session storage with real-time active model indicator badges.
- **Polished Table & Rich Text UI**: Markdown table parsing with automatic risk badges (🔴 High, 🟡 Medium, 🟢 Low).
- **Feedback & Personalization**: Integrated Like/Dislike feedback matrix for adaptive response tuning.

### ⚙️ 6. Super Admin Governance Command Center
- **Super Admin Isolation**: Dedicated `/admin/*` command center featuring 100% live system performance telemetry, Razorpay INR subscription analytics, user role controls, and immutable audit logs.

---

## 🚀 Quick Setup & Local Installation

### Prerequisites
- **Node.js**: v18.0 or higher
- **MongoDB**: Local MongoDB server or MongoDB Atlas URI
- **npm** or **pnpm**

### Step-by-Step Installation

1. **Clone the Repository**
```bash
git clone https://github.com/techabbayi/LawPilot-AI.git
cd LawPilot-AI
```

2. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure Environment Variables**
Create `.env.local` or `.env` in the root project directory:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/lawpilot_db
JWT_SECRET=lawpilot_enterprise_secure_jwt_secret_key_2026_x900
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Verify TypeScript Build**
```bash
npx tsc --noEmit
```

5. **Launch Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Vanilla CSS + Tailwind CSS v3.4 |
| **Icons** | Lucide React |
| **RAG & Vector Search** | 128D Dense Vector Embeddings + Cosine Dot Product Math |
| **Database** | MongoDB + Mongoose v8 |
| **AI Infrastructure** | Google Gemini (v1beta API), Groq API, OpenRouter API |
| **Encryption & Security** | Node.js Crypto (AES-256-CBC, PBKDF2), bcryptjs |

---

## 🤝 Open Source Contribution Guidelines

We welcome contributions across 5 primary technical domains:
1. **UI & UX Design System** (`components/`, `app/`)
2. **Security & Cryptographic Hardening** (`lib/privacy/`, `middleware.ts`)
3. **Add-on Features & Integrations** (`app/api/`)
4. **Bug Fixes & Reliability** (`lib/`, `app/`)
5. **RAG Vector Engine & AI Gateway** (`lib/ai/vectorSearch.ts`, `lib/ai/gateway.ts`)

Official Repository: [https://github.com/techabbayi/LawPilot-AI.git](https://github.com/techabbayi/LawPilot-AI.git)

---

## 📄 License & Contact

Distributed under the **MIT License** and **Apache License 2.0**.  
- **Author & Maintainer**: [techabbayi](https://github.com/techabbayi)  
- **Contact Email**: `srssltd@protonmail.com`  
- **Official Repository**: [https://github.com/techabbayi/LawPilot-AI.git](https://github.com/techabbayi/LawPilot-AI.git)
