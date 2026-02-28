# TechStart Platform

This is the main repository for the TechStart Platform, which consists of three main components: a Backend API (Node.js/Express), a Frontend Client Application (React), and an Admin Panel Application (React).

## Project Structure

```text
newPlatform/
├── admin/                  # React Admin Dashboard
│   ├── public/             # Static public assets
│   ├── src/                # React source code and components
│   ├── package.json        # Admin dependencies and scripts
│   └── vite.config.js      # Vite configuration for the admin panel
│
├── backend/                # Node.js/Express Backend Server
│   ├── config/             # Database and environment configurations
│   ├── controllers/        # Request handlers and business logic
│   ├── middleware/         # Custom Express middlewares (e.g., auth)
│   ├── models/             # Mongoose/DB schemas
│   ├── routes/             # API route definitions
│   ├── scripts/            # Utility and database seed scripts
│   ├── uploads/            # Generated/Uploaded files
│   ├── utils/              # Helper functions and utilities
│   ├── server.js           # Main application entry point
│   └── package.json        # Backend dependencies and scripts
│
└── frontend/               # React User-Facing Application
    ├── public/             # Static public assets
    ├── src/                # React source code (Pages, Components)
    ├── package.json        # Frontend dependencies and scripts
    └── vite.config.js      # Vite configuration for the frontend app
```

## Running Locally

1. **Backend**:
    - `cd backend`
    - `npm install`
    - Create a `.env` file based on your configuration.
    - `npm run dev` or `node server.js`

2. **Frontend**:
    - `cd frontend`
    - `npm install`
    - Create a `.env` file for frontend variables.
    - `npm run dev`

3. **Admin Panel**:
    - `cd admin`
    - `npm install`
    - Create a `.env` file for admin panel variables.
    - `npm run dev`
