# AI Journal – Project Functionality Document

> *A clean, simple space to write, reflect, and crush your goals — powered by AI.*

---

## 1. What AI Journal Is All About

**AI Journal** is a modern journaling app inspired by [750words.com](https://750words.com/).  
It’s built to help you stay consistent with your writing, understand yourself better, and make real progress toward your goals.

The experience is **simple and peaceful**, while the AI works quietly in the background to give you insights like:
- Summaries of what you wrote
- Mood and emotion tracking
- Smart search so you can ask questions like *"When was I happiest this year?"*

The idea is to create something that feels **effortless and private**, but still really powerful.

---

## 2. Core Features

### **Daily Writing**
- A calm, distraction-free space to write
- Each entry is automatically tied to the date
- No clunky text boxes — it just feels like writing on a blank page

---

### **Automatic AI Magic (Behind the Scenes)**
Whenever you save a journal entry:
1. **Summary:** The app creates a short, clear summary of what you wrote  
2. **Mood Check:** It figures out your overall mood or emotion that day  
3. **Memory Bank:** It turns your words into a special format so you can search them later

---

### **Streak Tracking**
- Stay motivated by writing every day
- Your streak grows like a plant:
  - Day 1-2 → 🌱
  - Day 3-6 → 🌿
  - Day 7-13 → 🌳
  - Day 14+ → 🌲
- It’s a fun way to *see* your consistency over time

---

### **Goal Tracking**
- Set personal goals (like *“Get my dream job”* or *“Run a half-marathon”*)
- The app notices when you write about those goals
- It shows you how much progress you’re making, step by step
- A dashboard gives you an overview of your journey

---

### **Search & Smart Questions**
Instead of scrolling through old pages, just *ask*:
- *“When did I buy new glasses?”*
- *“Why have I been feeling stressed?”*

**How it works:**
- You type a question in plain language
- The app finds your most relevant past entries
- AI gives you an answer that’s grounded in what you actually wrote

---

### **Dashboard**
Your personal growth hub with:
- A timeline of daily summaries
- Mood trends over time
- Streak progress
- Goal progress visualization

---

## 3. How It All Fits Together

| Part of the App   | What It Does |
|-------------------|--------------|
| **Frontend**      | The website you write on, built with React + Vite + TailwindCSS |
| **Backend**       | The “brain” that handles AI and saves your work |
| **Database**      | Where your entries, moods, and summaries live (Supabase) |
| **AI Helpers**    | GPT-4o for summaries & answers, Hugging Face for mood analysis |
| **Hosting**       | Website runs on GitHub Pages, backend runs on Vercel/Replit |

---

## 4. How the Key Pieces Work

### **4.1 Writing and Saving**
1. You write in the editor.
2. When you hit save:
   - The text goes to the backend.
   - AI makes a summary and checks your mood.
   - It creates a “searchable memory” for later.
3. Everything is stored safely in the database with the date attached.

---

### **4.2 Search and Smart Questions**
1. You type a question like *“When was I feeling most excited about my goals?”*
2. The backend figures out what you’re asking and looks through your past entries.
3. It sends the top matches to AI.
4. AI gives you a meaningful, personalized answer.

---

### **4.3 Streak System**
- Write every day to keep your streak alive.
- If you miss a day, the streak resets to zero.
- It’s a gentle, visual reminder to keep up the habit.

---

## 5. Roadmap

### **Phase 1: MVP (Get It Working)**
- [x] Writing page with basic editor
- [x] Word count
- [ ] Auto-save to local storage
- [ ] Dynamic date display
- [ ] Basic streak tracking
- [ ] Deploy website to GitHub Pages
- [ ] Deploy backend to Vercel

---

### **Phase 2: AI + Data**
- [ ] Supabase integration
- [ ] AI summaries of each entry
- [ ] Mood detection
- [ ] Smart search (RAG)
- [ ] Store everything in a searchable way

---

### **Phase 3: Leveling Up**
- [ ] Goal tracking
- [ ] Dashboard with beautiful charts
- [ ] Mobile-friendly design
- [ ] Animated streak growth 🌱 → 🌳
- [ ] Advanced insights

---

## 6. Deployment Plan

**Frontend:** GitHub Pages  
**Backend:** Vercel or Replit  
**Database:** Supabase (with search features enabled)

---

## 7. Project Structure

ai-journal/
├── frontend/ # The website
│ ├── src/
│ │ ├── pages/ # Home, Journal, Dashboard
│ │ └── components/
│ └── public/
│
├── backend/ # The app's brain
│ ├── api/
│ └── services/
│
├── supabase/ # Database setup
│
└── FUNCTIONALITY.md # This document


---

## 8. Future Dreams

- AI-generated journaling prompts
- Mood visualizations like weather patterns
- Long-term writing insights
- Export your entire journal as PDF or Markdown
- Share selected entries with trusted friends or a coach
