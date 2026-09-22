# Lost & Found Backend API

RESTful API backend for the Lost & Found college project, built with Node.js and Express.js.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework
- **Multer**: Handling multipart form data and file uploads
- **Cloudinary**: Cloud image storage
- **UUID**: Unique ID generation for reports
- **CORS & Dotenv**: Cross-origin requests and environment variable management

## Data Storage

All data is stored in `backend/data/items.json`.
No relational or NoSQL database is used. Safe atomic read/write functions are implemented in `backend/utils/jsonStorage.js` with an in-process queue to prevent file race conditions.

## Installation & Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your Cloudinary credentials (optional for initial demo; local fallback will activate if credentials are blank).

4. Run the server:
   ```bash
   # Development mode with auto-reload:
   npm run dev

   # Or standard start:
   npm start
   ```

The server will run on `http://localhost:5000`.

## API Endpoints

- `GET /api/health` - Server health status and item count
- `POST /api/auth/login` - Authenticate admin or student (`{ email, password }` or `{ passcode: 'admin123' }`)
- `POST /api/auth/register` - Register a new account (`{ name, email, password }`)
- `GET /api/auth/me` - Get current authenticated user profile
- `POST /api/auth/logout` - Invalidate session
- `GET /api/items` - List all items (filters: `?type=lost|found&category=...&location=...&sort=newest|oldest`)
- `POST /api/items` - Create lost or found item (`{ type: 'lost'|'found', ... }`)
- `GET /api/items/:id` - Fetch item details and possible matches
- `GET /api/items/:id/matches` - Get algorithmic matches for an item
- `GET /api/items/search?q=keyword` - Multi-field search
- `POST /api/items/lost` - Report a lost item (multipart form with image file)
- `POST /api/items/found` - Report a found item (multipart form with image file)
- `PUT /api/items/:id` - Update an item report
- `DELETE /api/items/:id` - Remove an item report
