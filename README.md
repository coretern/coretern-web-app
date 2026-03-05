# CoreTern Learning Platform 🚀

A comprehensive, full-stack educational and service platform built with the MERN stack (MongoDB, Express, React, Node.js). The platform is divided into three main modules: a **Public/Student Frontend**, an **Admin Control Panel**, and a **REST API Backend**. 

---

## 🏗️ Project Architecture & Structure

The repository is structured into three primary folders:

```text
CoreTern/
├── frontend/               # Public User-facing React Application
│   ├── public/             # Static public assets
│   ├── src/                
│   │   ├── assets/         # Images, illustrations, icons
│   │   ├── Components/     # Reusable UI components (Navbar, Footer, Services, FloatingAction, CookieBanner)
│   │   ├── context/        # React context (ThemeContext for light/dark mode)
│   │   ├── data/           # Static content (servicesData.jsx)
│   │   ├── pages/          # Full page components representing routes
│   │   │   ├── AboutUs/              
│   │   │   ├── ContactUs/            
│   │   │   ├── Dashboard/            # Student portal dashboard
│   │   │   ├── EnrollmentPage/       # Multi-step enrollment with uploads
│   │   │   ├── ForgotPassword/
│   │   │   ├── HelpCenter/
│   │   │   ├── InternshipDetails/
│   │   │   ├── Internships/
│   │   │   ├── LandingPage/
│   │   │   ├── Login/
│   │   │   ├── Privacy/
│   │   │   ├── RefundPolicy/
│   │   │   ├── Register/
│   │   │   ├── ServiceDetails/
│   │   │   ├── Services/
│   │   │   ├── Terms/
│   │   │   ├── TicketConversation/   # UI to talk with support
│   │   │   ├── TicketsForRegistered/
│   │   │   ├── VerifyCertificate/    # Certificate verification portal
│   │   │   └── VideoPage/            
│   │   ├── App.jsx         # Main application component & routing setup
│   │   ├── index.css       # Global styles & CSS variables
│   │   └── main.jsx        # React DOM entry point
│   ├── package.json        
│   └── vite.config.js      
├── admin/                  # Secure Admin-facing React Application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Admin-specific components (Sidebar, DataTables)
│   │   ├── context/        # Admin theme & generic context
│   │   ├── pages/          
│   │   │   ├── Dashboard/           # Admin statistics & charts
│   │   │   ├── ForgotPassword/
│   │   │   ├── Login/               # Secure admin login
│   │   │   ├── ManageEnrollments/   # Enrollment approval & WhatsApp linking
│   │   │   ├── ManageInternships/   # Rich-text internship editor
│   │   │   ├── ManageUsers/         # Global User CRUD
│   │   │   └── Tickets/             # Answer student support tickets
│   │   ├── App.jsx         
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── backend/                # Node.js/Express REST API Server
    ├── config/             # DB & Cloudinary configurations
    ├── controllers/        # Business logic for routes
    │   ├── authController.js
    │   ├── certificateController.js
    │   ├── enrollmentController.js
    │   ├── internshipController.js
    │   ├── ticketController.js
    │   └── userController.js
    ├── middlewares/        # Auth, role check, and file upload middlewares
    ├── models/             # Mongoose Schema definitions
    │   ├── Certificate.js
    │   ├── Enrollment.js
    │   ├── Internship.js
    │   ├── Ticket.js
    │   └── User.js
    ├── routes/             # API Endpoint definitions
    │   ├── authRoutes.js
    │   ├── certificateRoutes.js
    │   ├── enrollmentRoutes.js
    │   ├── internshipRoutes.js
    │   ├── ticketRoutes.js
    │   └── userRoutes.js
    ├── package.json
    └── server.js           # Express App Entry Point
```

---

## 💻 Tech Stack & Dependencies

### 1. Frontend (`/frontend`)
The public-facing website and student portal, focusing on rich aesthetics, modern glassmorphism UI, and smooth animations.

**Core Stack:**
*   **React 19** & **Vite**: Ultra-fast development and build environment.
*   **React Router DOM v7**: Client-side routing for seamless navigation.

**Key Dependencies & Tools:**
*   `framer-motion`: Used extensively for smooth page transitions, entrance animations, and hover effects across all pages.
*   `lucide-react`: Clean, consistent iconography throughout the UI.
*   `axios`: Handling all HTTP requests to the backend API.
*   `react-hot-toast` / `sweetalert2`: Beautiful, non-blocking notification and alert modals.
*   `@react-oauth/google`: Integration for "Sign in with Google" functionality.
*   `html-to-image` / `downloadjs`: Generating and downloading digital certificates directly from the browser.
*   `react-phone-input-2`: Specialized input handling for WhatsApp/Phone numbers in the enrollment process.

### 2. Admin Panel (`/admin`)
A secure, authenticated portal exclusively for platform administrators to manage the business logic.

**Core Stack:**
*   **React 19** & **Vite**: Shares the same core rendering engine as the frontend.

**Key Dependencies & Tools:**
*   `react-quill-new`: Advanced Rich Text Editor for writing internship descriptions and formatting text directly from the browser.
*   `framer-motion`: Smooth transitions between administration tabs.
*   `lucide-react`: Admin-specific iconography.
*   `react-hot-toast` / `sweetalert2`: Admin action confirmations (e.g., "Are you sure you want to delete this user?").
*   `axios`: Communicating with secured admin-only backend routes.

### 3. Backend API (`/backend`)
A robust, secure, and scalable REST API providing data to both React applications.

**Core Stack:**
*   **Node.js** & **Express**: Blazing fast server handling routing and middleware.
*   **MongoDB** & **Mongoose**: NoSQL database for flexible data schemas and rich querying.

**Key Dependencies & Tools:**
*   `jsonwebtoken` (JWT) & `bcryptjs`: Secure user authentication, password hashing, and role-based access control (Admin vs. Student).
*   `cloudinary` / `multer` / `multer-storage-cloudinary`: Powerful image and file upload handling directly to cloud storage (used for payment screenshots and user avatars).
*   `nodemailer`: Sending automated transactional emails (account verification, password resets, enrollment confirmations).
*   `qrcode`: Generating dynamic QR codes for digital certificate verification.
*   `cors` & `dotenv`: Security policies and environment variable management.
*   `express-async-handler`: Clean error handling for async route controllers.

---

## 📁 Detailed Directory Breakdown

### 🖥️ `/frontend/src/pages`
*   **`LandingPage/`**: The main marketing homepage featuring dynamic hero sections and platform statistics.
*   **`Internships/` & `InternshipDetails/`**: Browse available internships and view their rich-text descriptions.
*   **`EnrollmentPage/`**: Complex multi-step form capturing student details, handling file uploads (payment proofs), and linking WhatsApp groups.
*   **`Dashboard/`**: Protected route for students to track their enrolled courses, progress, and download certificates.
*   **`VideoPage/`**: Dedicated streaming view for enrolled students.
*   **`VerifyCertificate/`**: Public portal to verify the authenticity of certificates using unique dynamically generated IDs.
*   **`Services/` & `ServiceDetails/`**: Marketing pages for CoreTern’s B2B/B2C tech services (Web Dev, App Dev).
*   **`ContactUs/` & `TicketConversation/`**: Support portal allowing users to raise and track support tickets directly with admins.

### 🛡️ `/admin/src/pages`
*   **`Dashboard/`**: High-level statistical overview of revenue, total students, and active tickets.
*   **`ManageInternships/`**: Full CRUD (Create, Read, Update, Delete) capability for internship listings using the React Quill editor.
*   **`ManageEnrollments/`**: Interface to review student enrollments, verify attached payment screenshots, and manually approve or reject access.
*   **`ManageUsers/`**: Global administration of all registered accounts.
*   **`Tickets/`**: Centralized support desk answering inquiries raised via the frontend Contact Us page.

### ⚙️ `/backend/models` & `/backend/controllers`
*   **`User.js`**: Core account model tracking emails, passwords, and user roles.
*   **`Internship.js`**: Stores title, rich-text description, price, duration, and associated frontend UI icons.
*   **`Enrollment.js`**: Essential bridging model linking a `User` to an `Internship`. Tracks payment status (pending/approved), attached Cloudinary receipts, and WhatsApp group invitation links.
*   **`Certificate.js`**: Immutable record of issued certificates tied to specific enrollments with a uniquely verifiable `certificateId`.
*   **`Ticket.js`**: Support system model tracking user messages and admin replies.

---

## ✨ Key Features Implemented

1.  **Dual-App Ecosystem**: Complete separation of concerns between what the public sees and what the administrators control.
2.  **Robust Enrollment Flow**: Students can register, upload payment proofs securely to Cloudinary, and await Admin approval.
3.  **Automated WhatsApp Integration**: Upon Admin approval, students are automatically presented with the correct WhatsApp group join link directly in their dashboard.
4.  **Premium Glassmorphism UI**: High-end visual aesthetics using pseudo-elements, dynamic blurs, and Framer Motion spring physics. 
5.  **Digital Certificate Generation & Verification**: Students receive downloadable certificates that anybody can independently verify on the platform.
6.  **Real-time Rich Text Editing**: Admins write comprehensive internship descriptions with bolding, lists, and links that dangerously render safely on the frontend.
7.  **Fully Responsive**: All pages mathematically wrap and stack gracefully for mobile, tablet, and ultra-wide desktops..
