# SINA People Client: Guided Issues 🚀

This is a reference list of issues for the SINA People Frontend. Use these to find a task that matches your skill level.

## 🟢 Beginner (Good First Issues)
1. **[UI] Add a "Back to Top" button**: On long attendance logs or user lists, implement a smooth-scroll "Back to Top" button.
2. **[UI] Theme Polish**: Fix color contrast for "Rejected" status tags in Dark Mode (currently too bright).
3. **[DX] JSDoc Documentation**: Add JSDoc comments to all components in `src/components/Layout/`.
4. **[Cleanup] Unused Code**: Identify and remove unused imports or CSS variables in `src/index.css`.
5. **[UX] Loading States**: Add a "Loading..." spinner to the Login button when a request is in progress.

## 🟡 Intermediate (Frontend Logic)
6. **[Feature] Forgot Password UI**: Design and implement the UI for the "Forgot Password" flow (email input + reset link acknowledgement).
7. **[Validation] Real-time Error Messages**: Improve registration form validation (e.g., check for valid email format as the user types).
8. **[UX] Modal Confirmation**: Implement a "Confirm Delete" modal before an HR manager deletes a team.
9. **[Logic] Attendance Streak counter**: Calculate and display a "Weekly Streak" on the employee dashboard based on attendance logs.
10. **[UX] Password Visibility**: Add a "Show Password" eye icon to all password inputs.

## 🔴 Advanced (Architecture & Advanced Hooks)
11. **[Performance] Memoization**: Audit the dashboard components and implement `React.memo` or `useMemo` where expensive re-renders happen.
12. **[Feature] Drag & Drop**: Allow HR managers to reorder Sidebar items via drag-and-drop.
13. **[Architecture] custom `useApi` hook**: Refactor API calls to use a custom `useApi` hook that handles loading and error states globally.
14. **[PWA] Service Worker**: Implement a basic service worker to cache the UI assets for faster repeat loads.
15. **[PWA] Install Prompt**: Add a custom install banner for Chrome/Edge to encourage users to install SINA People as an app.

---
**How to start:**
If you want to work on one of these, please open an issue on GitHub with the title from this list and wait for a maintainer to assign it to you!
