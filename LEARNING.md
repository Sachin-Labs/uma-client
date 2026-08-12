# SINA People Learning Lab: Frontend Edition 🧠

Welcome to the SINA People Learning Lab! This document is designed to help **Students** and **Junior Developers** think beyond just writing code. Our goal is to understand the *why* behind the *what*.

## 🌓 Theme & User Experience (UX)
1. **The Choice**: Why did we use both `classList.add('dark')` and `setAttribute('data-theme', 'dark')` in `index.html`? *Hint: Think about library compatibility (like Tailwind).*
2. **Flash Avoidance**: In `index.html`, there is a small script in the `<head>`. What would happen if we moved that script to the bottom of the `<body>`? *Search for "Flash of Unstyled Content (FOUC)".*

## 🗺️ Geolocation & Boundaries
3. **Logic Placement**: We calculate the distance between the user and the office. Should this calculation happen on the **Client (Frontend)** or the **Server (Backend)**?
   - What if a user modifies their browser code to send a "fake" distance?
   - What if we want to show the user's distance in real-time on the UI?

## 🔑 Authentication Security
4. **Token Storage**: We store our tokens in memory/Context. Why is this safer than `localStorage`?
5. **Session Expiry**: When the Access Token expires, the app doesn't log the user out—it "refreshes" the token. How does the `axios` interceptor handle this without the user noticing?

## 🚀 Improvement Ideas (Project Proposals)
- **Offline First**: How could we implement "Offline Marking"? (Think: Queue attendance in `IndexedDB` and sync when the network returns).
- **Gamification**: Design a system that awards "Attendance Streaks" using only frontend logic. How would you persist this?

---
**Learning Tip:**
Don't just read the answers. Try to "break" the app by disabling these features and see what happens. That's how real learning starts!
