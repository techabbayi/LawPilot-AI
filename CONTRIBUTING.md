# Contributing to LawPilot AI

Thank you for your interest in contributing to **LawPilot AI**! We welcome open-source contributions from developers, legal technologists, security auditors, and UX designers around the world.

---

## 📜 Developer Code of Conduct

All contributors must adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating.

---

## 🛠️ Work Areas & Contribution Domains

We actively look for contributions in the following 5 technical work areas:

1. **UI & UX Design System** (`components/`, `app/`): Modern CSS, Lucide React icons, accessible ARIA controls.
2. **Security & Cryptography** (`lib/privacy/`, `middleware.ts`): AES-256 BYOK encryption, zero-retention data wiping.
3. **Add-on Features & Integrations** (`app/api/`): Webhook connectors, third-party legal APIs.
4. **Bug Fixes & Reliability** (`lib/`, `app/`): Resolving edge cases, improving TypeScript safety.
5. **RAG Vector Engine & AI Gateway** (`lib/ai/vectorSearch.ts`, `lib/ai/gateway.ts`): Multi-LLM fallback routing, vector embedding math.

---

## 🚀 How to Submit a Pull Request (PR)

1. **Fork & Clone Repository**
   ```bash
   git clone https://github.com/techabbayi/LawPilot-AI.git
   cd LawPilot-AI
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Verify TypeScript & Linting**
   Ensure zero errors before submitting:
   ```bash
   npx tsc --noEmit
   ```

5. **Commit Your Changes**
   Sign your commits using Developer Certificate of Origin (DCO):
   ```bash
   git commit -s -m "feat: description of your change"
   ```

6. **Submit PR on GitHub**
   Push to your fork and open a Pull Request against `main` at [https://github.com/techabbayi/LawPilot-AI/pulls](https://github.com/techabbayi/LawPilot-AI/pulls).

---

## 📋 Pull Request Review Criteria

Every PR is reviewed within **24 hours**. To be merged, your PR must:
- [x] Pass `npx tsc --noEmit` with 0 type errors.
- [x] Use `lucide-react` vector icons (no raw emojis).
- [x] Include signed-off commit (`git commit -s`).
