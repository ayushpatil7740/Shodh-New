# शोध Shodh - Lost & Found Community Portal 🧭

[![Stack](https://img.shields.io/badge/Stack-MERN%20(MongoDB,%20Express,%20React,%20Node)-0d9488.svg)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%7C%20TailwindCSS%20%7C%20Lucide-3b82f6.svg)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Express.js%20%7C%20JWT%20%7C%20Multer-10b981.svg)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Shodh (शोध)** is a full-stack, community-first lost and found web application designed for campuses, universities, and public institutions. It enables users to report lost belongings, list found items, search listings with multi-criteria filters, and reclaim items through a secure claim-matching and verification system.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Profiles
- **JWT & Bcrypt**: Secure token-based authentication with salted password hashing.
- **Protected Routes**: Navigation guards ensuring secure access to dashboards and forms.
- **User Profile Management**: Update avatar, phone number, bio, and change passwords.
- **One-Click Demo Credentials**: Instant login buttons for immediate testing and evaluation.

### 2. 📢 Item Reporting
- **Report Lost Items**: Title, detailed description, category, location/landmark, date lost, optional reward, and optional secret verification question.
- **Report Found Items**: Upload image, specify safe storage location (e.g. reception desk), and set privacy prompts.
- **Image Uploads**: Handled locally via Multer with file-size and mime-type validations.

### 3. 🔍 Search & Multi-Filter Catalog
- **Instant Search**: Real-time matching on title, description, and location keywords.
- **Type Toggle**: All Items, Lost Items, or Found Items.
- **Category Filter**: Electronics, Documents & IDs, Wallets & Bags, Keys, Clothing, Books, Jewelry, Other.
- **Status Filter & Sorting**: Filter active vs resolved cases; sort by newest, date lost/found, or popularity.

### 4. 🤝 Matching & Claim Verification System
- **Filing Claims**: Claimants submit proof of ownership (identifying marks, photo proof, or answers to secret questions).
- **Owner Review**: Posters can inspect submitted proofs and approve or reject claims.
- **Contact Reveal**: Upon claim approval, verified contact details unlock, facilitating safe campus handovers.
- **Confetti Celebration**: Visual feedback upon successful item reclamation.

### 5. 📊 User Dashboard & Notifications
- **My Listings Tab**: View, edit, delete, or toggle status of posted items.
- **Claims Received Tab**: Review claims on your items with quick Approve/Reject controls.
- **My Submitted Claims Tab**: Track the approval status of claims you made on other items.
- **In-App Notifications**: Real-time alerts when claims are received, approved, or rejected.

### 6. 🛡️ Administrative Control Center
- **Executive Analytics**: Total reports, recovery rates, active users, and category breakdown.
- **Listing Moderation**: Delete spam posts or override item statuses.
- **User Management Directory**: View user activity counts and promote/demote administrator privileges.
- **Dispute Resolution**: Global oversight over all platform claims.

---

## 🏗️ Architecture & Folder Structure

```
shodh-lost-and-found/
├── server/
│   ├── config/
│   │   ├── db.js             # Mongoose connection with automatic zero-config memory fallback
│   │   └── seeder.js         # Realistic demo data seeder script
│   ├── controllers/
│   │   ├── authController.js         # Auth, profile, and user stats
│   │   ├── itemController.js         # Item CRUD, search, filter, and metrics
│   │   ├── claimController.js        # Claim submission, review, and status transitions
│   │   ├── adminController.js        # Platform-wide analytics and moderation
│   │   └── notificationController.js # Alerts and notification read states
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication and user extraction
│   │   ├── adminAuth.js      # Role authorization guard
│   │   ├── upload.js         # Multer image storage configuration
│   │   ├── validation.js     # Express-validator schemas
│   │   └── errorHandler.js   # Centralized JSON error formatting
│   ├── models/
│   │   ├── User.js           # User schema with bcrypt methods
│   │   ├── Item.js           # Lost & found item schema with text index
│   │   ├── Claim.js          # Claim and proof schema
│   │   └── Notification.js   # User notification schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── adminRoutes.js
│   │   └── notificationRoutes.js
│   ├── uploads/              # Local image upload directory
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── server.js             # Express server entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Navbar, Footer, Modal, Badge, StatCard, ProtectedRoute
│   │   │   ├── items/        # ItemCard, ItemFilterBar, ClaimModal
│   │   │   ├── dashboard/    # MyReportsList, ClaimsReceivedTable, MyClaimsTable
│   │   │   └── admin/        # AdminStatWidgets, ItemManageTable, UserManageTable
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # User session, JWT persistence, login/logout
│   │   │   └── NotificationContext.jsx   # Real-time alert polling & counter
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page with hero, live counters, recent items
│   │   │   ├── BrowseItems.jsx   # Filterable & searchable directory
│   │   │   ├── ItemDetail.jsx    # Full photo view, poster info, and claim actions
│   │   │   ├── ReportLost.jsx    # Form to post a lost item
│   │   │   ├── ReportFound.jsx   # Form to post a found item
│   │   │   ├── EditItem.jsx      # Form to modify an existing listing
│   │   │   ├── Dashboard.jsx     # User management hub
│   │   │   ├── Profile.jsx       # User profile & password settings
│   │   │   ├── AdminPanel.jsx    # Administrative moderation panel
│   │   │   ├── Login.jsx         # Sign in with 1-click demo buttons
│   │   │   ├── Register.jsx      # User registration with validation
│   │   │   └── NotFound.jsx      # Custom 404 page
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── utils/
│   │   │   ├── constants.js      # Categories, statuses, demo accounts
│   │   │   └── formatters.js     # Date formatting and UI helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json              # Monorepo runner scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Optional: Local MongoDB or MongoDB Atlas URI (If MongoDB is not running locally, Shodh automatically launches an in-memory database in development mode for zero-setup demonstration).

### 1. Clone & Install Dependencies

From the project root:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Check `server/.env` (defaults are pre-configured for local development):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shodh_db
JWT_SECRET=shodh_super_secret_jwt_key_2026_change_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Realistic Demo Data (Optional but Recommended)

Populate the database with sample items (MacBooks, AirPods, Wallets, IDs, Keys), users, and claims:
```bash
cd server
npm run seed
```

### 4. Run the Application

In two separate terminals:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Now open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🔑 Demo Accounts for Evaluation

| Account Role | Email | Password | Sample Data / Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Campus Admin** | `admin@shodh.org` | `adminpassword123` | Access to Admin Panel, user directory, dispute moderation |
| 👤 **Student: Aarav** | `aarav@shodh.org` | `userpassword123` | Reported lost Space Grey MacBook, resolved Sony headphones |
| 👤 **Student: Priya** | `priya@shodh.org` | `userpassword123` | Reported found AirPods Pro, lost Casio calculator |
| 👤 **Student: Rohit** | `rohit@shodh.org` | `userpassword123` | Reported lost Fossil wallet, found brass keys |

> 💡 **Tip**: On the `/login` page, you can click any of the **One-Click Demo Login** buttons to authenticate instantly without typing credentials!

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Private | Get profile and user activity counts |
| `PUT` | `/api/auth/profile` | Private | Update user profile & avatar |
| `PUT` | `/api/auth/change-password` | Private | Change account password |

### Items (`/api/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Public | Search & filter lost/found listings |
| `GET` | `/api/items/stats/summary` | Public | Get aggregate metrics for landing page |
| `GET` | `/api/items/my-items` | Private | Get current user's posted listings |
| `GET` | `/api/items/:id` | Public | Get single item details & related claims |
| `POST` | `/api/items` | Private | Create new lost or found report |
| `PUT` | `/api/items/:id` | Private (Owner/Admin) | Update item details or status |
| `DELETE` | `/api/items/:id` | Private (Owner/Admin) | Delete item and related claims |

### Claims & Matching (`/api/claims`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/claims` | Private | Submit ownership claim / match proof |
| `GET` | `/api/claims/my-claims` | Private | Get claims filed by current user |
| `GET` | `/api/claims/received` | Private | Get claims received on user's items |
| `GET` | `/api/claims/item/:itemId` | Private (Poster/Admin) | Get claims for a specific item |
| `PUT` | `/api/claims/:id` | Private (Poster/Admin) | Approve or reject claim |
| `DELETE` | `/api/claims/:id` | Private (Claimant/Admin)| Cancel pending claim |

### Admin Moderation (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Complete platform analytics |
| `GET` | `/api/admin/users` | Admin | User directory with stats |
| `PUT` | `/api/admin/users/:id/role` | Admin | Promote/demote user to/from admin |
| `GET` | `/api/admin/claims` | Admin | All platform claims for dispute resolution |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Private | Get user notifications & unread count |
| `PUT` | `/api/notifications/:id/read` | Private | Mark single notification as read |
| `PUT` | `/api/notifications/mark-all-read` | Private | Mark all notifications as read |

---

## 🧪 Testing & Verification

Run the automated end-to-end API test script:
```bash
cd server
node test-api.js
```

Verify frontend production build:
```bash
cd client
npm run build
```

---

## 🎓 Academic Field Visit Highlights

1. **Modular Codebase**: Clean separation of concerns (Models, Controllers, Routes, Middleware, Components, Contexts).
2. **Community Safety Focus**: Contact numbers are safeguarded and only revealed upon proof verification.
3. **Resilient Data Layer**: Supports standard MongoDB with automatic in-memory fallback for effortless project demonstrations on any computer.
4. **Mobile Responsive**: Fully responsive UI designed with Tailwind CSS, supporting mobile, tablet, and desktop viewports.

---

