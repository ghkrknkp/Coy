# Coy Discover Tab — Blush Romance UI & SDE Intern Assignment

A production-quality prototype of the **Discover Tab for Coy**, following the **Blush Romance** design system (soft pink `#EC4899`, white surfaces, minimal glassmorphism, rounded cards, smooth Framer Motion animations) and featuring an **Interactive AI Chatbot System** with mutual matches.

> **Core Privacy Guarantee:** *Users must never know who liked them unless the interest is mutual.*

---

## 1. Design System & Theme: Blush Romance

The interface has been redesigned to match the reference specifications:

| Theme Element | Hex Color | Role in UI |
| :--- | :--- | :--- |
| **Primary Pink** | `#EC4899` | Primary brand accent, Like button, Coy logo |
| **Deep Pink** | `#DB2777` | Button gradients, active navigation text |
| **Soft Pink** | `#FCE7F3` | Pill badges, tag backgrounds |
| **Light Pink** | `#FFF1F7` | Active link backgrounds, button hover states |
| **Background** | `#FFF9FC` | Ambient soft romantic background |
| **Card Background** | `#FFFFFF` | Profile cards, modal surfaces |
| **Main Text** | `#18111B` | High-contrast headings and profile names |
| **Secondary Text** | `#786B78` | Subtitles, locations, and descriptions |
| **Border** | `#F3DCE8` | Card borders, dividers, subtle outlines |
| **Like Indicator** | `#16A36A` | Green dynamic LIKE drag stamp |
| **Pass Indicator** | `#F04465` | Pink/red dynamic PASS drag stamp |

---

## 2. Interactive AI Chatbot System

Every confirmed mutual match now comes with an interactive real-time Chat interface:
- **Click "Chat Soon"** on any match card (or **"Chat Now"** from the match celebration modal) to open the chat window.
- **Auto-Greeting:** Matches start the conversation with a personalized icebreaker based on their bio.
- **AI Persona Responses:** When you send a message, the match replies contextually in their unique persona (talking about coffee, books, music, travel, or their city).
- **Paste Your Own AI API Key (Optional):**
  - Click the **"🔑 Paste API"** button in the chat header.
  - Paste your **Google Gemini API Key** and click **Save** (it securely saves to your browser's local storage).
  - The chatbot will automatically switch to Google Gemini (`gemini-2.5-flash`), roleplaying authentically as that match!
  - If no API key is provided, the built-in persona engine runs out of the box with zero setup needed.
- **Typing Indicator:** Displays real-time pulsing dots (*"Ananya is typing..."*) with natural response rhythms.
- **Quick Conversation Starters:** One-tap chips for quick, charming openers.
- **Persistent Messages:** Conversations are saved in SQLite (`messages` table) and persist across page refreshes.

---

## 3. High-Quality Profiles

The dataset features 32 realistic profiles with high-resolution portrait photography, diverse Indian and global metro locations, authentic bios, and interest tags:

1. **Ananya** (`user-1`) — 23, Chennai (*Matches top mockup card!*)
   - *Interests:* Coffee, Books, Travel, Indie Cinema, Matcha
   - *Status:* **Pre-seeded reciprocal like**. Swiping right immediately triggers the match modal and unlocks chat.
2. **Maya Lin** (`user-2`) — 23, Mumbai
   - *Interests:* Ceramics, Design, Specialty Coffee, Thrifting, Vinyl
   - *Status:* **Pre-seeded reciprocal like**.
3. **Diya Sharma** (`user-3`) — 22, Delhi
   - *Interests:* Vinyl, Writing, Travel, Feminist Lit, Documentaries
   - *Status:* **Pre-seeded reciprocal like**.
4. **Chloe Bennett** (`user-4`) — 22, Kolkata
   - *Interests:* Literature, French Cinema, Pastries, Poetry, Thrifting
   - *Status:* **Pre-seeded reciprocal like**.

---

## 4. Commands to Run

### Start the Backend (Terminal 1)
```cmd
cd C:\Users\sarin\Downloads\Coy\coy-discover\backend
npm start
```
*Backend runs on: `http://localhost:5001`*

### Start the Frontend (Terminal 2)
```cmd
cd C:\Users\sarin\Downloads\Coy\coy-discover\frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

### Run Automated Backend Tests
```cmd
cd C:\Users\sarin\Downloads\Coy\coy-discover\backend
npm test
```
*(All 11 automated test cases pass with 100% test coverage)*
