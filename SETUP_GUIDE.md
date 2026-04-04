# Setup Guide - Dynamic Portfolio Hub

This guide will help you set up the entire project from scratch.

## System Requirements

- **Node.js**: v18.0.0 or higher ([download](https://nodejs.org/))
- **pnpm**: v10.0.0 or higher (install with: `npm install -g pnpm`)
- **Python**: v3.9 or higher ([download](https://www.python.org/))
- **Git**: For version control

## Step-by-Step Setup

### Step 1: Clone/Navigate to Project

```bash
cd Dynamic-Portfolio-Hub
```

### Step 2: Install Node.js Dependencies

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install all workspace dependencies
pnpm install
```

### Step 3: Set Up Python Backend

#### Windows

```bash
# Navigate to backend
cd artifacts\api-server-python

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Go back to root
cd ..\..\
```

#### macOS/Linux

```bash
# Navigate to backend
cd artifacts/api-server-python

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Go back to root
cd ../../
```

### Step 4: Verify Installation

#### Check Node.js
```bash
node --version   # Should be v18+
pnpm --version   # Should be v10+
npm --version    # Should be v9+
```

#### Check Python
```bash
python --version  # Should be 3.9+
# (or python3 --version on macOS/Linux)
```

---

## Running the Application

### Option A: Run Frontend Only

**Perfect for**: Frontend development, static hosting

```bash
pnpm run dev:frontend
```

The portfolio will be available at: `http://localhost:5173`

### Option B: Run Frontend + Backend Separately

**Perfect for**: Full-stack development with more control

**Terminal 1 - Frontend**:
```bash
pnpm run dev:frontend
```

**Terminal 2 - Backend** (from root):
```bash
pnpm run dev:backend
```

Or manually from the backend directory:
```bash
cd artifacts/api-server-python
# Activate virtual environment first
python main.py
```

### Option C: Run Both Together

**Perfect for**: Complete application testing

```bash
pnpm run dev
```

This will start both frontend and backend in parallel.

---

## Accessing the Application

Once running:

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Docs**: `http://localhost:5000/docs` (Swagger UI)
- **API ReDoc**: `http://localhost:5000/redoc`

---

## Project Architecture

```
Portfolio Application
├── Frontend (React + Vite)
│   └── http://localhost:5173
├── Backend (Python FastAPI)
│   └── http://localhost:5000
│       ├── API: /api/*
│       ├── Docs: /docs
│       └── ReDoc: /redoc
└── Shared config (pnpm workspace)
```

---

## Common Issues & Solutions

### Issue: Python Virtual Environment Not Activating

**Windows**:
```bash
# If `venv\Scripts\activate` doesn't work, try:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1
```

**macOS/Linux**:
```bash
# Make sure you're in the right directory
cd artifacts/api-server-python
source venv/bin/activate
```

### Issue: Port Already in Use

If port 5173 or 5000 is already in use, you can change it:

**Frontend**:
```bash
# In portfolio vite.config.ts or via command
pnpm run dev:frontend -- --port 3000
```

**Backend**:
```bash
# Set PORT environment variable
set PORT=3001
python main.py
```

### Issue: Python Modules Not Found

```bash
# Ensure virtual environment is activated, then reinstall
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: pnpm command not found

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

---

## Development Commands Reference

### Frontend Development

```bash
# Start dev server
pnpm run dev:frontend

# Build for production
pnpm --filter @workspace/portfolio run build

# Type checking
pnpm --filter @workspace/portfolio run typecheck
```

### Backend Development

```bash
# Start dev server (auto-reload)
cd artifacts/api-server-python
python main.py

# Or from root
pnpm run dev:backend
```

### Workspace Management

```bash
# Install all dependencies
pnpm install

# Add a new package
pnpm add package-name

# Remove a package
pnpm remove package-name

# Type check all TypeScript
pnpm run typecheck

# Build all packages
pnpm run build
```

---

## File Structure Overview

```
Dynamic-Portfolio-Hub/
├── artifacts/
│   ├── api-server/                 # Old Express backend (deprecated)
│   ├── api-server-python/          # ✨ New Python FastAPI backend
│   │   ├── main.py                 # Main application file
│   │   ├── requirements.txt         # Python dependencies
│   │   ├── package.json            # NPM scripts
│   │   └── venv/                  # Virtual environment (created after setup)
│   └── portfolio/                  # React frontend
│       ├── src/
│       ├── public/
│       ├── vite.config.ts
│       └── package.json
├── lib/                            # Shared libraries
├── scripts/                        # Utility scripts
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml             # pnpm workspace config
└── TECH_STACK.md                   # Technology overview
```

---

## Next Steps

1. ✅ **Frontend** - Explore the portfolio components in `artifacts/portfolio/src/`
2. ✅ **Backend** - Check out `artifacts/api-server-python/README.md` for API details
3. ✅ **Styling** - Learn about Tailwind CSS customization
4. ✅ **Features** - Add new endpoints and UI components

---

## Environment Setup for Production

### Frontend Build

```bash
pnpm run build
# Output in artifacts/portfolio/dist/
```

### Backend Production

```bash
# From api-server-python directory
set ENVIRONMENT=production
python main.py
```

---

## Getting Help

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com
- **Vite Docs**: https://vitejs.dev
- **pnpm Docs**: https://pnpm.io

---

## What's Next?

1. Start the application
2. Explore the portfolio interface
3. Check the API documentation at `/docs`
4. Modify components and see changes in real-time
5. Add new endpoints as needed

Happy coding! 🚀
