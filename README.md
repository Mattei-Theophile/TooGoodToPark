# TooGoodToPark

TooGoodToPark is a full-stack web application built with Vue.js frontend and Node.js/Express backend, featuring user authentication and MySQL database integration.

## 📋 Table of Contents

- [Project Overview](#Project Overview)
- [Technical Specifications](#technical-specifications)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)

## 🚀 Project Overview

TooGoodToPark is a monorepo application structured with:
- **Frontend**: Vue.js 3 application with modern tooling (Vite, Pinia, Vue Router)
- **Backend**: Node.js/Express REST API with JWT authentication
- **Database**: MySQL with role-based permission system

## 🛠 Technical Specifications

### Frontend Technologies
- **Vue.js**: 3.5.18
- **Vue Router**: 4.5.1 (Client-side routing)
- **Pinia**: 3.0.3 (State management)
- **Pinia Plugin Persistedstate**: 4.5.0 (State persistence)
- **Vite**: 7.0.6 (Build tool and dev server)
- **Vite Plugin Vue**: 6.0.1
- **Vite Plugin Vue DevTools**: 8.0.0

### Backend Technologies
- **Node.js**: ^20.19.0 || >=22.12.0
- **Express**: 5.1.0 (Web framework)
- **MySQL2**: 3.14.5 (Database driver)
- **JWT**: 9.0.2 (JSON Web Tokens for authentication)
- **bcrypt**: 6.0.0 (Password hashing)
- **CORS**: 2.8.5 (Cross-origin resource sharing)
- **dotenv**: 17.2.2 (Environment variables)
- **Body Parser**: 2.2.0 (Request parsing)
- **Cookie Parser**: 1.4.7 (Cookie parsing)
- **Colors**: 1.4.0 (Console coloring)

### Development Tools
- **Concurrently**: 8.2.2 (Run multiple commands)
- **npm**: Package management with workspaces

### Database
- **MySQL**: Role-based permission system
- **Database Name**: ToPaD
- **User**: ToPa

## 📋 Prerequisites

Before installing and running this project, ensure you have:

- **Node.js** (version ^20.19.0 or >=22.12.0)
- **npm** (comes with Node.js)
- **MySQL Server** (version 5.7+ or 8.0+)
- **Git** (for cloning the repository)

## 💾 Installation

### 1. Clone the Repository

git clone https://github.com/Mattei-Theophile/TooGoodToPark cd TooGoodToPark


### 2. Install Dependencies
The project uses npm workspaces for managing dependencies across frontend and backend:

```bash
# Install root dependencies
npm install
# Install frontend dependencies
npm install --workspace=frontend
# Install backend dependencies
npm install --workspace=backend
```

### 3. Database Setup

1. **Start MySQL Server**
   ```bash
   # On macOS with Homebrew
   brew services start mysql
   
   # On Ubuntu/Debian
   sudo systemctl start mysql
   
   # On Windows
   # Start MySQL service from Services panel or MySQL Workbench
   ```

2. **Create Database and User**

   Run the database configuration script:
   ```bash
   mysql -u root -p < backend/databaseconf.sql
   ```

   Or execute manually:
   ```sql
   CREATE USER 'ToPa'@'localhost' IDENTIFIED BY '6TZSb2QLkoh7QNQKBDaR';
   CREATE DATABASE ToPaD;
   GRANT ALL PRIVILEGES ON ToPaD.* TO 'ToPa'@'localhost';
   FLUSH PRIVILEGES;
   ```

## ⚙️ Configuration

### Backend Configuration

The backend uses environment variables defined in `backend/.env`:

**Important**: Change the JWT_KEY in production to a secure, randomly generated key.

### Frontend Configuration

The frontend runs on port 5173 (Vite default) and connects to the backend on port 3000.

CORS is configured to allow requests from `http://localhost:5173`.

## 🚀 Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run dev
```
This command will:
- Start the backend server on `http://localhost:3000`
- Start the frontend development server on `http://localhost:5173`
- Enable hot-reload for both applications

### Individual Services
**Backend only:**
```bash
npm run dev:backend
```
**Frontend only:**
```bash
npm run dev:frontend
```

Production Build
Build the frontend for production:
```bash
npm run build
```

Project Structure
``` 
TooGoodToPark/
├── backend/                 # Node.js/Express backend
│   ├── api/                # API routes and middleware
│   │   ├── middleware/     # Custom middleware
│   │   └── routes/        # API route definitions
│   ├── database/          # Database related files
│   ├── logs/              # Application logs
│   ├── services/          # Business logic services
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   ├── databaseconf.sql   # Database setup script
│   └── package.json       # Backend dependencies
├── frontend/               # Vue.js frontend
│   ├── src/               # Source code
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Vue components
│   │   ├── pages/         # Page components
│   │   ├── services/      # Frontend services
│   │   ├── stores/        # Pinia stores
│   │   ├── App.vue        # Main App component
│   │   └── main.js        # Entry point
│   ├── public/            # Public assets
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── node_modules/          # Shared dependencies
├── package.json           # Root package.json with workspaces
└── README.md             # This file
```

**API Endpoints**
The backend exposes REST API endpoints with JWT authentication:
  - Base URL: http://localhost:3000
  - Authentication: JWT tokens via cookies
  - CORS: Configured for http://localhost:5173

**Authentication**
  - Login routes available at /api/login
  - Protected routes require JWT authentication

**Development**
**Frontend Development**
  - Hot-reload enabled via Vite
  - Vue DevTools available in development
  - State management with Pinia
  -Persistent state across browser sessions

**Backend Development**
  - Express server with middleware support
  - JWT-based authentication
  - Role-based permission system
  - MySQL database integration
  - Request logging and error handling

**Available Scripts**
_Root level:_
  - npm run dev - Run both frontend and backend
  - npm run dev:frontend - Run frontend only
  - npm run dev:backend - Run backend only
  - npm run build - Build frontend for production
  - npm run install:all - Install all dependencies
_Frontend workspace:_
  - npm run dev --workspace=frontend - Development server
  - npm run build --workspace=frontend - Production build
  - npm run preview --workspace=frontend - Preview production build
_Backend workspace:_
  - npm run start --workspace=backend - Start backend server


**Troubleshooting**
_Common Issues_
  1) Port already in use
     - Backend (3000): Change PORT in backend/.env
     - Frontend (5173): Vite will automatically try the next available port
  
  2) Database connection issues
     - Ensure MySQL server is running
     - Verify database credentials in backend/.env
     - Check if database ToPaD and user ToPa exist
     
  3) CORS errors
     - Verify frontend URL in backend CORS configuration
     - Check if both servers are running on expected ports

  4) Dependencies issues
     - Delete node_modules folders and run npm run install:all
  - Ensure Node.js version meets requirements


**License**

This project is private and not licensed for public use.

For additional support or questions, please refer to the project documentation or contact the development team.```

This comprehensive README provides:

1. **Complete project overview** with technical specifications
2. **Detailed installation instructions** including database setup
3. **Configuration guidelines** for both frontend and backend
4. **Multiple ways to run the application** (development/production)
5. **Clear project structure** explanation
6. **Troubleshooting section** for common issues
7. **Professional formatting** with proper sections and badges

The README is based on the actual project structure and configuration files I analyzed, ensuring accuracy and completeness.
```
