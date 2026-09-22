# Lost & Found Web Application

A modern, responsive, full-stack **Lost & Found Web Application** developed for a college project demonstration. The platform enables campus students and faculty to report lost belongings, turn in found items, search and filter the catalog, and discover potential matches through an automated matching engine.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [How It Works & Matching System](#how-it-works--matching-system)
6. [Prerequisites](#prerequisites)
7. [Environment Variables](#environment-variables)
8. [Cloudinary Setup Guide](#cloudinary-setup-guide)
9. [Installation & Running Locally](#installation--running-locally)
10. [REST API Documentation](#rest-api-documentation)
11. [Admin Demonstration Portal](#admin-demonstration-portal)
12. [JSON Storage Architecture & Limitations](#json-storage-architecture--limitations)
13. [Safety & Privacy Protections](#safety--privacy-protections)
14. [Deployment Instructions](#deployment-instructions)

---

## 🎯 Project Overview

In a busy college environment, items such as ID cards, student bags, wallets, phones, keys, and textbooks frequently go missing. **Lost & Found** bridges the gap between item owners and finders by providing a central digital repository with intelligent algorithmic match detection and secure, privacy-preserving contact options.

---

## ✨ Key Features

- **Report Lost Items**: Upload item details, category, location, date, time, contact information, and a photo preview.
- **Report Found Items**: Turn in items found on campus, upload photos, and provide safe retrieval instructions.
- **Smart Matching System**: Automated algorithm evaluates Category (+30), Item Name similarity (+30), Location similarity (+25), and Date proximity (+15) to produce a 0–100% possible match score.
- **Multi-Faceted Search & Filter**: Search across item titles, descriptions, categories, and locations; filter by type (Lost / Found) and category; sort by newest or oldest.
- **Item Details & Safe Contact**: High-resolution image view, full metadata, and a verified "Contact Owner/Finder" panel with email (`mailto:`) and phone (`tel:`) links.
- **Privacy-First Design**: Phone numbers and emails are never exposed on public item cards.
- **Admin Demonstration Dashboard**: View all submissions, filter by status, toggle resolution ("Reunited"), and remove invalid reports with a one-click demo passcode (`admin123`).
- **Cloudinary Image Storage**: Direct image upload to Cloudinary CDN with automatic fallback to local uploads for demo continuity.
- **Responsive & Modern UI**: Built with React, Tailwind CSS, clean icons, loading animations, empty states, and mobile navigation.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js (v19) via Vite
- **Routing**: React Router (v7)
- **Styling**: Tailwind CSS & custom design tokens
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **File Uploads**: Multer (memory storage + buffer streaming)
- **Cloud Media**: Cloudinary SDK (v2)
- **Unique IDs**: UUID (v4)
- **CORS & Config**: CORS & Dotenv

### Data Storage
- **Format**: Local JSON file (`backend/data/items.json`)
- **No SQL / No NoSQL**: Conforms strictly to requirements without MongoDB, MySQL, PostgreSQL, or Firebase database.
- **Safety Mechanism**: Atomic write via temporary file swap and concurrency queue mutex.

---

## 📁 Folder Structure

```
lost-and-found/
│
├── frontend/
│   ├── index.html                    # Root Home page
│   ├── home/
│   │   └── index.html                # Dedicated Home section page
│   ├── report-lost/
│   │   └── index.html                # Report Lost Item page
│   ├── report-found/
│   │   └── index.html                # Report Found Item page
│   ├── browse/
│   │   └── index.html                # Browse & Search catalog page
│   ├── item-details/
│   │   └── index.html                # Item Details, Contact & Matches page
│   ├── admin/
│   │   └── index.html                # Admin moderation dashboard page
│   ├── login/
│   │   └── index.html                # User & Admin authentication page
│   ├── css/
│   │   └── styles.css                # Central modular stylesheet
│   ├── js/
│   │   ├── config.js                 # API base configuration & card renderers
│   │   ├── home.js                   # Home page logic & stats
│   │   ├── report-lost.js            # Lost report form & upload logic
│   │   ├── report-found.js           # Found report form & upload logic
│   │   ├── browse.js                 # Multi-filter search & catalog logic
│   │   ├── item-details.js           # Single item details & contact logic
│   │   ├── admin.js                  # Admin table, status & delete logic
│   │   └── login.js                  # Authentication logic
│   └── README.md
│
├── backend/
│   ├── controllers/
│   │   └── itemsController.js      # Handlers for CRUD, search, and match calculations
│   ├── routes/
│   │   └── itemsRoutes.js          # REST route declarations
│   ├── middleware/
│   │   ├── uploadMiddleware.js     # Multer file size (5MB) & MIME-type validation
│   │   └── errorHandler.js         # Centralized error handler
│   ├── utils/
│   │   ├── jsonStorage.js          # Safe atomic file read/write with queue mutex
│   │   ├── matchEngine.js          # Algorithmic match scoring (0 - 100)
│   │   └── cloudinary.js           # Cloudinary SDK uploader with local fallback
│   ├── data/
│   │   └── items.json              # Seeded with 10 realistic campus items
│   ├── uploads/                    # Local storage fallback directory
│   ├── server.js                   # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── .gitignore                      # Protects .env files and uploads
└── README.md                       # Complete project guide
```

---

## 🧠 How It Works & Matching System

When an item is reported, the system scans items of the opposite type (`lost` vs `found`) and computes a match score out of 100:

| Criterion | Max Points | Evaluation Method |
| :--- | :---: | :--- |
| **Category Match** | **+30** | Exact category match (e.g. Wallet = Wallet) |
| **Item Name Similarity** | **+30** | Substring and Jaccard token overlap on non-stop words |
| **Location Similarity** | **+25** | Landmark and keyword overlap (e.g. Library vs Central Library) |
| **Date Proximity** | **+15** | Same day = 15; $\le$1 day = 13; $\le$3 days = 10; $\le$7 days = 6 |
| **Total Maximum Score** | **100** | Candidate matches with score $\ge$25% are displayed |

> **Responsible Presentation**: In accordance with project requirements, potential matches are explicitly labeled as **"Possible Match — 88%"** with the caveat: *"Please inspect and verify details to confirm ownership"*.

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- Modern web browser (Chrome, Edge, Firefox, Safari)

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ☁️ Cloudinary Setup Guide

To upload images directly to Cloudinary:

1. Create a free account at [https://cloudinary.com](https://cloudinary.com).
2. Go to your **Cloudinary Dashboard**.
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Paste these values into `backend/.env`.
5. Restart the backend server.

> **Resilient Demo Guarantee**: If Cloudinary credentials are not provided or are left blank, the application automatically falls back to storing images in `backend/uploads/` and serving them locally. The project will **never crash** during an evaluation even without Cloudinary keys.

---

## 🚀 Installation & Running Locally

Follow these step-by-step instructions to run the application on your computer:

### Step 1: Clone or Navigate to the Project
```bash
cd Shodh-New
```

### Step 2: Set Up & Run the Backend
```bash
# 1. Enter backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Create .env from template
cp .env.example .env

# 4. Start the backend server
npm start
```
*The backend API will run on `http://localhost:5000`.*

### Step 3: Set Up & Run the Frontend (in a new terminal)
```bash
# 1. Enter frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Create .env from template
cp .env.example .env

# 4. Start the frontend development server
npm run dev
```
*The frontend interface will open on `http://localhost:5173`.*

---

## 📡 REST API Documentation

### Base URL
`http://localhost:5000/api`

| Method | Endpoint | Description | Sample Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server status & report counts | None |
| `POST` | `/auth/login` | User/Admin Login | `{ email, password }` or `{ passcode: 'admin123' }` |
| `POST` | `/auth/register` | Register new user | `{ name, email, password }` |
| `GET` | `/auth/me` | Current user profile | Header: `Authorization: Bearer <token>` |
| `GET` | `/items` | List all items | Query: `type`, `category`, `location`, `sort` |
| `GET` | `/items/:id` | Get single item & its possible matches | Param: `id` |
| `GET` | `/items/:id/matches` | Get algorithmic matches for an item | Param: `id` |
| `GET` | `/items/search?q=query` | Multi-field search | Query: `q=wallet` |
| `POST` | `/items` | Create lost or found item | Multipart or JSON with `type: 'lost'\|'found'` |
| `POST` | `/items/lost` | Report a lost item | Multipart form data with `photo` |
| `POST` | `/items/found` | Report a found item | Multipart form data with `photo` |
| `PUT` | `/items/:id` | Update report or mark resolved | Body JSON or Multipart |
| `DELETE` | `/items/:id` | Delete report from records | Param: `id` |

---

## 🛡️ Admin Demonstration Portal

Access the admin dashboard at `/admin`.

- **Demo Passcode**: `admin123`
- **One-Click Quick Login**: A button is provided on the login page for evaluator convenience.
- **Capabilities**:
  - Filter reports by All, Lost, or Found.
  - Search submitters or item titles.
  - Mark status as "Active" or "Reunited".
  - Permanently remove spam or duplicate reports with confirmation modal.

---

## 💾 JSON Storage Architecture & Limitations

### Implementation
All data is persisted in `backend/data/items.json`.
- **Atomic File Swapping**: Updates are written to a unique `.tmp` file and then renamed atomically via `fs.promises.rename`.
- **In-Process Mutex Queue**: Concurrent API requests are serialized using a JavaScript Promise queue to avoid race conditions.
- **Safe Recovery**: If malformed JSON is detected, a timestamped `.backup` file is created automatically.

### Important Limitations for High-Traffic Production
1. **Memory & I/O Scaling**: Entire JSON file is loaded into memory on each read. For thousands of concurrent users, this incurs disk I/O bottlenecks.
2. **Horizontal Scaling**: Since data resides on local disk, multiple backend server instances cannot share state without a distributed database (e.g. MongoDB or PostgreSQL).
3. **No Indexing**: Search requires sequential array iterations rather than B-Tree index lookups.
4. **Intended Use**: This architecture is designed specifically for college projects, prototypes, and demonstration purposes.

---

## 🔒 Safety & Privacy Protections

- Contact information (phone numbers and emails) is omitted from general search cards.
- Contact details are only visible on the dedicated item detail page.
- Image uploads are strictly filtered for format (`JPG`, `JPEG`, `PNG`, `WebP`) and restricted to `5 MB`.
- All text input is trimmed and sanitized before persistence.
- Cloudinary credentials and secrets are managed exclusively through environment variables and excluded by `.gitignore`.

---

## 🚢 Deployment Instructions

### Deploy Backend (Render / Railway / Fly.io)
1. Push repository to GitHub.
2. Connect backend directory to Render/Railway.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Set environment variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT=5000`.

### Deploy Frontend (Vercel / Netlify)
1. Connect frontend directory to Vercel or Netlify.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-deployed-backend.onrender.com/api`.

---

## 🎓 Academic Demonstration Note

This project is authored as an academic software engineering project illustrating:
1. Component-driven React SPA architecture.
2. Express REST API design.
3. Algorithmic heuristic scoring (Matching Engine).
4. Cloud media pipeline with graceful local fallback.
5. Atomic filesystem state management.
