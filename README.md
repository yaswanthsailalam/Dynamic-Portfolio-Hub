# 🎨 Dynamic Portfolio Hub

> A modern, full-stack portfolio application showcasing contemporary web development practices with **React 19** frontend and **Python FastAPI** backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-orange)](https://pnpm.io/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎯 **Modern Portfolio Showcase** - Display your projects and work experience
- 🔄 **Real-time Updates** - Dynamic content management with FastAPI backend
- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS and Framer Motion animations
- 🚀 **Performance Optimized** - Built with Vite for ultra-fast development experience
- 📱 **Fully Responsive** - Mobile-first design approach
- 🔐 **Type Safe** - Full TypeScript support for frontend
- 🧪 **Mockup Sandbox** - Isolated environment for testing components

## 🛠️ Tech Stack

### Frontend
- **React** 19+ with Vite
- **Tailwind CSS** 4+ for styling
- **TypeScript** for type safety
- **Framer Motion** for smooth animations
- **Radix UI** for accessible components
- **React Query** (@tanstack/react-query) for data fetching
- **React Hook Form** for form management

### Backend
- **Python** 3.9+
- **FastAPI** - modern, fast web framework
- **Uvicorn** - ASGI server
- **Async/await** support for non-blocking operations

### Development & DevOps
- **pnpm** monorepo workspace management
- **TypeScript** for enhanced developer experience
- **Prettier** for consistent code formatting
- **Vite** for blazing-fast builds

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Dynamic Portfolio Hub                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (React + Tailwind)          Backend (FastAPI)│
│  Port: 5173                           Port: 5000       │
│                                                         │
│  • Portfolio Website        ←→        • API Endpoints  │
│  • Project Showcase                   • Data Management│
│  • Experience Section                 • Auto Docs      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **pnpm** 10 or higher (`npm install -g pnpm`)
- **Python** 3.9 or higher ([Download](https://www.python.org/))
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Dynamic-Portfolio-Hub.git
cd Dynamic-Portfolio-Hub
```

### 2. Install Frontend Dependencies

```bash
pnpm install
```

### 3. Setup Python Backend

```bash
cd artifacts/api-server-python

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Return to root
cd ../../
```

## ▶️ Running the Application

### Option 1: Frontend Only (Recommended for Design/UI Work)

```bash
pnpm run dev:frontend
# Visit: http://localhost:5173
```

### Option 2: Full Stack (Frontend + Backend)

**Terminal 1 - Frontend:**
```bash
pnpm run dev:frontend
# Frontend: http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
pnpm run dev:backend
# API: http://localhost:5000
# API Docs: http://localhost:5000/docs
```

### Option 3: Component Sandbox

Test components in isolation:
```bash
pnpm run dev:mockup
# Visit: http://localhost:5173
```

### Production Build

```bash
pnpm run build
pnpm run start
```

### API Documentation (When Backend Running)

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## 📁 Project Structure

```
Dynamic-Portfolio-Hub/
├── artifacts/
│   ├── api-server/                    # [DEPRECATED] Old Express.js backend
│   ├── api-server-python/             # ✨ Python FastAPI backend
│   │   ├── main.py                    # FastAPI application entry point
│   │   ├── requirements.txt            # Python dependencies
│   │   └── package.json               # Scripts for running backend
│   ├── portfolio/                     # React + Tailwind frontend
│   │   ├── src/
│   │   │   ├── App.tsx                # Main application component
│   │   │   ├── components/            # Reusable React components
│   │   │   │   ├── sections/          # Page sections
│   │   │   │   └── ui/                # UI components
│   │   │   ├── pages/                 # Page components
│   │   │   └── lib/                   # Utility functions
│   │   └── vite.config.ts             # Vite configuration
│   └── mockup-sandbox/                # Component testing environment
│       └── src/components/
│
├── lib/
│   ├── api-spec/                      # OpenAPI specifications
│   ├── api-client-react/              # Auto-generated React hooks
│   ├── api-zod/                       # Zod validation schemas
│   └── db/                            # Database layer
│
├── scripts/                           # Utility scripts
├── pnpm-workspace.yaml                # Workspace configuration
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # This file
```

## 📚 Available Scripts

### Common Commands

```bash
# Development
pnpm run dev              # Run frontend + backend together
pnpm run dev:frontend     # Frontend only (http://localhost:5173)
pnpm run dev:backend      # Backend only (http://localhost:5000)
pnpm run dev:mockup       # Component sandbox

# Building
pnpm run build            # Build all packages
pnpm run typecheck        # Check TypeScript types
pnpm run typecheck:libs   # Check lib TypeScript types

# Production
pnpm run start            # Build and run backend
```

## 🔌 API Documentation

The backend provides interactive API documentation at:

- **Swagger UI** (detailed): http://localhost:5000/docs
- **ReDoc** (readable): http://localhost:5000/redoc

### Key API Endpoints

- `GET /api/health` - Health check
- `GET /api/info` - API information
- Additional endpoints defined in `artifacts/api-server-python/main.py`

## 💡 Development Tips

### Frontend Development
- **Hot Reload**: Changes to React components automatically update
- **Component Testing**: Use the mockup-sandbox for isolated component testing
- **Styling**: Tailwind CSS classes for responsive design
- **Animations**: Framer Motion for smooth interactions

### Backend Development
- **Auto-reload**: Backend server restarts on file changes
- **Async Support**: FastAPI handles async operations efficiently
- **Validation**: Pydantic models for request validation
- **Auto Docs**: Swagger UI updates automatically with new endpoints

### Adding New Features

**Frontend:**
1. Create component in `artifacts/portfolio/src/components/`
2. Add routes in `artifacts/portfolio/src/pages/`
3. Style with Tailwind CSS classes
4. Import and use in the main app

**Backend:**
1. Add new endpoint in `artifacts/api-server-python/main.py`
2. Define request/response models with Pydantic
3. Use async functions for better performance
4. Test with Swagger UI at `/docs`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change the port (Windows PowerShell)
$env:PORT=3001; pnpm run dev:backend

# Linux/macOS
PORT=3001 pnpm run dev:backend
```

### Module Not Found
```bash
# Reinstall all dependencies
pnpm install --force
```

### Python Virtual Environment Issues
```bash
cd artifacts/api-server-python

# Completely remove and recreate venv
Remove-Item venv -Recurse -Force  # Windows
rm -rf venv                       # Linux/macOS

python -m venv venv
.\venv\Scripts\activate           # Windows
source venv/bin/activate          # Linux/macOS

pip install -r requirements.txt
```

### Frontend Styling Issues
```bash
# Rebuild Tailwind CSS
pnpm run build
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more detailed troubleshooting.

## 📖 Additional Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Quick reference card for common commands
- **[TECH_STACK.md](./TECH_STACK.md)** - Detailed technology documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture details
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Express.js to FastAPI migration info
- **[artifacts/api-server-python/README.md](./artifacts/api-server-python/README.md)** - Backend-specific documentation

## 🌟 Key Highlights

✅ **Modern Stack** - React 19, FastAPI, Tailwind CSS 4  
✅ **Type Safe** - Full TypeScript support  
✅ **Performance Optimized** - Vite builds, async Python backend  
✅ **Developer Friendly** - Hot reload, auto-generated API docs  
✅ **Responsive Design** - Mobile-first approach  
✅ **Monorepo Structure** - Organized with pnpm workspaces  
✅ **Easy Deployment** - Replit ready, see [replit.md](./replit.md)  

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/my-feature`)
3. **Commit** changes (`git commit -m 'Add feature'`)
4. **Push** to the branch (`git push origin feature/my-feature`)
5. **Open** a Pull Request

### Code Style
- Use **Prettier** for formatting: `pnpm run format`
- Maintain **TypeScript** type safety
- Follow **React** best practices
- Write **meaningful commit messages**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 🙋 Support & Questions

- 📧 **Issues**: Open an issue on GitHub for bugs or feature requests
- 💬 **Discussions**: Start a discussion for questions
- 📚 **Documentation**: Check the docs folder for detailed guides

## 🚀 Next Steps

1. Follow the [Installation & Setup](#installation--setup) section
2. Run `pnpm run dev` to start development
3. Open http://localhost:5173 in your browser
4. Check the [QUICK_START.md](./QUICK_START.md) for quick reference

---

**Made with ❤️ - Dynamic Portfolio Hub**

## 🚀 Deployment

### Frontend
```bash
pnpm --filter @workspace/portfolio run build
# Deploy dist/ to static hosting (Vercel, Netlify, etc.)
```

### Backend
```bash
cd artifacts/api-server-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5000
```

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 💡 Next Steps

1. ✅ Review [TECH_STACK.md](./TECH_STACK.md) for architecture overview
2. ✅ Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup
3. ✅ Start developing with `pnpm run dev`
4. ✅ Check API docs at `http://localhost:5000/docs`

---

**Built with ❤️ using React, Tailwind CSS, and Python FastAPI**
