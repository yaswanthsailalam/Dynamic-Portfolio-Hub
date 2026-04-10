# Dynamic Portfolio Hub - Tech Stack Updated

## 🎯 Project Overview

This is a modern full-stack portfolio application with a **React + Tailwind CSS** frontend and **Python FastAPI** backend. The project is organized as a pnpm monorepo with TypeScript support for the frontend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4+
- **UI Components**: Radix UI
- **State Management**: React Query (@tanstack/react-query)
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form

### Backend
- **Language**: Python 3.9+
- **Framework**: FastAPI (modern, async-capable)
- **Server**: Uvicorn (ASGI server)
- **Package Manager**: NPM (via pnpm for running)

### Development Tools
- **Monorepo Manager**: pnpm
- **Language**: TypeScript (frontend)
- **Code Quality**: Prettier (formatting)
- **Package Manager**: pnpm (workspace)

---

## 📁 Project Structure

```
Dynamic-Portfolio-Hub/
├── artifacts/
│   ├── api-server/                 # [DEPRECATED] Old Express.js backend
│   ├── api-server-python/          # ✨ NEW Python FastAPI backend
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── requirements.txt         # Python dependencies
│   │   └── package.json            # NPM scripts for running Python
│   ├── portfolio/                  # React Tailwind frontend
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── lib/
│   │   └── vite.config.ts
│   └── mockup-sandbox/             # UI component showcase
├── lib/                            # Shared libraries
│   ├── api-spec/                   # OpenAPI specifications
│   ├── api-client-react/           # React Query hooks (frontend)
│   ├── api-zod/                    # Zod validation schemas
│   └── db/                         # Database layer (Drizzle ORM)
├── scripts/                        # Utility scripts
├── package.json                    # Root workspace package
├── pnpm-workspace.yaml             # pnpm configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (v10 or higher) - Install with: `npm install -g pnpm`
3. **Python** (v3.9 or higher)

### Installation

1. **Clone and navigate to project**:
```bash
cd Dynamic-Portfolio-Hub
```

2. **Install dependencies**:
```bash
# Install all frontend dependencies
pnpm install
```

3. **Set up Python backend** (optional but recommended):
```bash
# Navigate to Python backend
cd artifacts/api-server-python

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Create virtual environment (macOS/Linux)
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Running the Application

#### Option 1: Run Frontend Only
```bash
pnpm run dev:frontend
```
Portfolio will be available at `http://localhost:5173`

#### Option 2: Run Frontend + Python Backend
```bash
# Terminal 1: Start the frontend
pnpm run dev:frontend

# Terminal 2: Start the Python backend
cd artifacts/api-server-python
python main.py
# OR from root: pnpm run dev:backend
```

#### Option 3: Run Both Simultaneously
```bash
# From root directory (requires both Node.js and Python installed)
pnpm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Documentation: `http://localhost:5000/docs` (Swagger UI)

---

## 📝 Available Scripts

### Root Project Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Run frontend + backend together |
| `pnpm run dev:frontend` | Run React frontend only |
| `pnpm run dev:backend` | Run Python backend only |
| `pnpm run dev:mockup` | Run UI component sandbox |
| `pnpm run build` | Build all packages |
| `pnpm run typecheck` | Type check TypeScript code |
| `pnpm run start` | Run production build |
| `pnpm run start:backend` | Run backend in production |

### Frontend Scripts (portfolio)

```bash
pnpm --filter @workspace/portfolio run dev      # Dev server
pnpm --filter @workspace/portfolio run build    # Production build
pnpm --filter @workspace/portfolio run serve    # Preview production build
```

### Backend Scripts (Python)

```bash
cd artifacts/api-server-python

# Development
python main.py
pnpm run dev

# Production
set ENVIRONMENT=production && python main.py
pnpm run prod
```

---

## 🔌 API Endpoints

The Python backend provides the following endpoints:

### Health Check
- `GET /api/healthz` - Health status
- `GET /api/health` - Alternative health endpoint

### Info
- `GET /` - Welcome message
- `GET /api` - API root
- `GET /api/info` - API information

### Interactive Documentation
When running the backend locally, visit:
- **Swagger UI**: `http://localhost:5000/docs`
- **ReDoc**: `http://localhost:5000/redoc`

---

## 🔄 Migration from Express to FastAPI

The backend has been migrated from Express.js to Python FastAPI. Here are the key points:

### What Changed
- **Old**: `artifacts/api-server/` (Express.js)
- **New**: `artifacts/api-server-python/` (Python FastAPI)

### What Stayed the Same
- All API endpoints maintain the same contracts
- CORS is enabled for frontend development
- Health check endpoints work identically
- Frontend requires no changes

### Why FastAPI?
- ✨ **Modern**: Async-capable, built for modern Python
- ⚡ **Fast**: High performance, comparable to Node.js
- 📚 **Auto Docs**: Automatic Swagger UI and ReDoc
- 🔒 **Type Safe**: Built-in validation with Pydantic
- 🚀 **Easy to Scale**: Perfect for adding features

---

## 📦 Key Dependencies

### Frontend
```json
{
  "react": "^19.0.0",
  "tailwindcss": "^4.0.0",
  "@tanstack/react-query": "^5.0.0",
  "vite": "^5.0.0",
  "framer-motion": "^12.0.0",
  "lucide-react": "^0.500.0"
}
```

### Backend
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
```

---

## 🔐 Environment Variables

### Frontend (portfolio/)
- None required for basic development

### Backend (api-server-python/)
```bash
PORT=5000                 # Server port (default: 5000)
ENVIRONMENT=development   # development or production
```

---

## 📚 Documentation

### Frontend
- Tailwind CSS: https://tailwindcss.com
- React: https://react.dev
- Vite: https://vitejs.dev

### Backend
- FastAPI: https://fastapi.tiangolo.com
- Uvicorn: https://www.uvicorn.org
- Pydantic: https://docs.pydantic.dev

---

## 🔧 Development Workflow

### Adding a New Frontend Component
1. Create component in `artifacts/portfolio/src/components/`
2. Import and use in your pages
3. Style with Tailwind CSS classes
4. Run `pnpm run dev:frontend` to see changes

### Adding a New Backend Endpoint
1. Edit `artifacts/api-server-python/main.py`
2. Add a new route with `@app.get()`, `@app.post()`, etc.
3. Use Pydantic models for request/response validation
4. Restart the server - it auto-reloads in development

Example:
```python
from pydantic import BaseModel

class Project(BaseModel):
    name: str
    description: str

@app.get("/api/projects")
async def get_projects():
    return []

@app.post("/api/projects")
async def create_project(project: Project):
    return project
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Frontend starts with `pnpm run dev:frontend`
- [ ] Backend starts with `python main.py` (from api-server-python/)
- [ ] Backend health check: `curl http://localhost:5000/api/healthz`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] API docs visible at `http://localhost:5000/docs`

---

## 📖 Next Steps

1. **Update API Client**: If you have frontend API calls, ensure they target the Python backend
2. **Add Database**: Set up PostgreSQL connection in the Python backend
3. **Implement Features**: Add more endpoints and frontend components as needed
4. **Deploy**: Configure deployment for both frontend and Python backend

---

## 🤝 Support

For issues or questions:
- Check the README in `artifacts/api-server-python/` for backend-specific help
- Check the portfolio's documentation for frontend-specific help
- Review FastAPI docs: https://fastapi.tiangolo.com

---

## 📄 License

MIT
