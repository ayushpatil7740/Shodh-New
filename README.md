# शोध Shodh - Lost & Found Community Portal 🧭

[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20React-0d9488.svg)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%7C%20TailwindCSS%20%7C%20Lucide-3b82f6.svg)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Express.js%20%7C%20JWT%20%7C%20Multer-10b981.svg)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Shodh (शोध)** is a full-stack, community-first lost and found web application designed for campus demonstration. It enables users to report lost belongings, list found items, search listings with multi-criteria filters, and reclaim items through a secure claim-matching and verification system.

---

## 🌐 Live URL
- **Production URL**: `https://shodh-portal.onrender.com`

---

## 🔑 Demo Accounts for Evaluation

Instant one-click demo login buttons are available directly on the `/login` page:

| Account Role | Email / Identifier | Password | Permissions & Sample Data |
| :--- | :--- | :--- | :--- |
| 👑 **Campus Admin** | `admin@shodh.org` *(or `admin`)* | `admin123` *(or `adminpassword123`)* | Full Admin Panel, Analytics & Listing Moderation |
| 👤 **Student: Aarav** | `aarav@shodh.org` | `user123` *(or `userpassword123`)* | Reported lost MacBook, resolved Sony headphones |
| 👤 **Student: Priya** | `priya@shodh.org` | `user123` *(or `userpassword123`)* | Reported found AirPods, lost calculator |
| 👤 **Student: Rohit** | `rohit@shodh.org` | `user123` *(or `userpassword123`)* | Reported lost Fossil wallet, found brass keys |

> 💡 **Tip**: On the `/login` page, click any of the **One-Click Demo Login** buttons to authenticate immediately without typing!

---

## 🌟 Key Features
- **Item Reporting**: Upload photos, specify location/landmarks, dates, and optional reward.
- **Search & Multi-Filter Catalog**: Real-time keyword search, categories, lost/found toggle, and status filters.
- **Claim & Verification System**: Submit ownership proof; poster reviews and approves/rejects claim; contact info reveals upon approval.
- **In-App Notifications**: Real-time alerts for claims and status updates.
- **Admin Control Center**: Executive analytics, user management, and listing moderation.
- **Zero-Database JSON Engine**: Completely self-contained local JSON storage (`backend/data/db.json`) — no MongoDB or external database required.

---

## 🚀 How to Run Locally

### 1. Install & Build
```bash
npm run build
```

### 2. Start Server
```bash
npm start
```
- Open: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Get profile and user activity counts |
| `PUT` | `/api/auth/profile` | Update user profile & avatar |
| `PUT` | `/api/auth/change-password` | Change account password |

### Items (`/api/items`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Search & filter lost/found listings |
| `GET` | `/api/items/stats/summary` | Get aggregate metrics for landing page |
| `GET` | `/api/items/my-items` | Get current user's posted listings |
| `GET` | `/api/items/:id` | Get single item details & related claims |
| `POST` | `/api/items` | Create new lost or found report |
| `PUT` | `/api/items/:id` | Update item details or status |
| `DELETE` | `/api/items/:id` | Delete item |

### Claims & Matching (`/api/claims`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/claims` | Submit ownership claim / match proof |
| `GET` | `/api/claims/my-claims` | Get claims filed by current user |
| `GET` | `/api/claims/received` | Get claims received on user's items |
| `PUT` | `/api/claims/:id` | Approve or reject claim |
| `DELETE` | `/api/claims/:id` | Cancel pending claim |

### Admin Moderation (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Complete platform analytics |
| `GET` | `/api/admin/users` | User directory with stats |
| `GET` | `/api/admin/claims` | All platform claims |
