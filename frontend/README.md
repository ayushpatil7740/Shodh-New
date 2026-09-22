# Lost & Found Frontend

Client application for the Lost & Found college project, built with React, Vite, React Router, Tailwind CSS, and Axios.

## Features

- **Home Page**: Hero banner, quick stats, quick search, recent lost & found item feeds, and a "How It Works" guide.
- **Report Lost Item**: Intuitive form with photo preview, category selection, client-side validation, and instant match detection.
- **Report Found Item**: Form to turn in items found on campus with finder contact details.
- **Browse & Search**: Real-time search across item name, description, category, and location with multi-criteria filtering and sorting.
- **Item Details**: High-resolution image view, comprehensive metadata, privacy-protected contact reveal ("Contact Owner/Finder"), and algorithmically computed possible matches.
- **Possible Matching Engine**: Dynamic percentage match badges (e.g. "Possible Match — 88%") with detailed scoring breakdown.
- **Admin Dashboard**: Overview metrics, item filtering, status updates (Mark Reunited), and item deletion.

## Setup & Running Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   Make sure `.env` contains:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.
