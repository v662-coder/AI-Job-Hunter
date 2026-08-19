
---

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
cd dashboard && npm install && cd ..
```

### 2. Configure environment
```bash
cp .env.example .env
```
Fill in `.env` with:
- `GROQ_API_KEY` — free key from [console.groq.com/keys](https://console.groq.com/keys)
- `MONGODB_URI` — free cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 3. Add your resume
Drop a `.pdf` or `.docx` file into `data/resumes/`.

### 4. Run it

Open **three terminals**:

```bash
# Terminal 1 — API server
npm run server

# Terminal 2 — Dashboard
cd dashboard && npm run dev
# → open http://localhost:5173

# Terminal 3 — Pipeline (scrape + match + apply)
npm start


First run: log in to Naukri manually in the browser window that opens (session is saved for future runs).

### 5. Review & approve
Once matching finishes, open the dashboard, review scored jobs, and click **Approve** on the ones you want. Run `npm start` again — approved jobs get applied to automatically.

---

## 🧭 Typical Workflow

1. `npm start` → scrapes fresh listings, scores them against your resume
2. Open dashboard → filter by **Matched**, review AI's match score + skill gaps
3. Click **Approve** on jobs you like, **Skip** on the rest
4. `npm start` again → applies to approved jobs, uploads resume, handles screening popups
5. Check **Applied** tab (or `screenshots/applied-*.png`) for proof

---

## 🛠️ Tech Stack

**Backend:** Node.js, Playwright, Express, Mongoose
**AI:** Groq (`openai/gpt-oss-20b`) — free, OpenAI-SDK compatible
**Database:** MongoDB Atlas
**Frontend:** React (Vite), Axios
**Resume parsing:** pdf-parse, mammoth

---

## 🗺️ Development Status

- [x] Phase 1 — Foundation (Config, Logger, Utils, Browser Layer)
- [x] Phase 2 — Authentication & Session Management
- [x] Phase 3 — Job Scraping (multi-role, experience + recency filters)
- [x] Phase 4 — AI Resume Matching
- [x] Phase 5 — Human Review + Auto Apply
- [x] Phase 6 — Dashboard (React + Express + MongoDB)

---

## ⚠️ Notes

- Applications are capped per run (`maxApplicationsPerRun` in `src/config/settings.js`) to avoid triggering platform bot-detection.
- Screening questions that need custom answers pause automation for manual input.
- This tool automates job discovery and applying — it does not guarantee interviews or outcomes.