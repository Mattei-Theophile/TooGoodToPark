# TooGoodToPark

TooGoodToPark is a full-stack web application built with Vue.js frontend and Node.js/Express backend, featuring user authentication and MySQL database integration.

## 📋 Table of Contents

- [Project Overview](#project-overview)
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