# SINA People Frontend — User Management & Attendance System

SINA People (User Management & Attendance System) is a modern, production-grade **Multi-Tenant SaaS** platform designed to streamline workforce management. This repository contains the React-based frontend application.

---

## 🚀 Live Demo
- **Live URL:** [https://sina-people-client.vercel.app](https://sina-people-client.vercel.app) *(Replace with your URL)*

---

## 💻 Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** CSS (Custom Design System) + Tailwind CSS 4.0
- **Icons:** Lucide React
- **Maps:** Leaflet & Google Maps API
- **State/Routing:** React Router 7
- **Charts:** Chart.js
- **API Client:** Axios (with Interceptors for JWT rotation)

---

## ✨ Main Features
- **Multi-Tenant Registration:** Securely register your organisation and manage users.
- **Smart Attendance:** Mark attendance with real-time location verification (Geofencing).
- **Leave Management:** Simple workflows for requesting and tracking leaves.
- **Dynamic Dashboard:** Real-time analytics and attendance statistics.
- **Dark/Light Mode:** Seamless transition with persistent theme selection.
- **Responsive Design:** Optimized for all screen sizes and devices.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Installation
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_MAP_ID=your_custom_map_id
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🔑 Environment Variables Section
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API |
| `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps API Key |
| `VITE_GOOGLE_MAP_ID` | Map ID for custom styling |

---

## 🤝 Contribution
Contributions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
Built with ❤️ by [Sachin Balagam](https://github.com/sachinbalagam)
