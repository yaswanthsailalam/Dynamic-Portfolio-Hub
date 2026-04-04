# Quick Reference Card

## 🚀 Start Here

### Frontend Only
```bash
pnpm run dev:frontend
# Visit: http://localhost:5173
```

### Frontend + Backend
```bash
# Terminal 1:
pnpm run dev:frontend

# Terminal 2:
pnpm run dev:backend

# Visit frontend: http://localhost:5173
# Visit backend: http://localhost:5000
# Visit API Docs: http://localhost:5000/docs
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `TECH_STACK.md` | Technology decisions & overview |
| `SETUP_GUIDE.md` | Installation instructions |
| `MIGRATION_GUIDE.md` | Express → FastAPI details |
| `ARCHITECTURE.md` | Visual diagrams & structure |
| `COMPLETION_SUMMARY.md` | Update summary |

---

## 🔧 Common Commands

```bash
# Install/Update
pnpm install

# Development
pnpm run dev:frontend        # React frontend
pnpm run dev:backend         # Python backend
pnpm run dev:mockup          # UI component showcase

# Building
pnpm run build               # Build everything
pnpm run typecheck           # Type check TypeScript

# Production
pnpm run start:backend       # Production backend
```

---

## 📂 Important Folders

| Path | Purpose |
|------|---------|
| `artifacts/portfolio/` | React frontend (Tailwind CSS) |
| `artifacts/api-server-python/` | Python FastAPI backend |
| `artifacts/api-server/` | OLD Express backend (deprecated) |
| `lib/` | Shared libraries |

---

## 🐍 Python Setup

If you need to reinstall Python dependencies:

```bash
cd artifacts/api-server-python

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🌐 Running Locally

| Component | URL | Command |
|-----------|-----|---------|
| Frontend | `http://localhost:5173` | `pnpm run dev:frontend` |
| Backend | `http://localhost:5000` | `pnpm run dev:backend` |
| API Docs | `http://localhost:5000/docs` | (when backend running) |
| ReDoc | `http://localhost:5000/redoc` | (when backend running) |

---

## ✨ New Endpoints

```
GET  /api/health           Health check
GET  /api/healthz          Health status
GET  /                     Welcome
GET  /api                  API root
GET  /api/info             API information
```

---

## 💡 Adding Features

### Frontend Component
1. Create in `artifacts/portfolio/src/components/`
2. Use Tailwind CSS classes
3. Auto-reloads on save

### Backend Endpoint
1. Edit `artifacts/api-server-python/main.py`
2. Use `@app.get()`, `@app.post()`, etc.
3. Auto-reloads on save

Example:
```python
@app.get("/api/hello")
async def hello():
    return {"message": "Hello!"}
```

---

## 🎯 Tech Stack at a Glance

```
Frontend:  React 19 + Vite + Tailwind CSS + TypeScript
Backend:   Python 3.9+ + FastAPI + Uvicorn
Monorepo:  pnpm workspaces
Database:  Optional (PostgreSQL + SQLAlchemy)
```

---

## ✅ Verified Working

- ✅ Python 3.14.3 installed
- ✅ FastAPI dependencies installed
- ✅ Python backend starts successfully
- ✅ Auto-reload working
- ✅ API documentation generated

---

## 📞 Need Help?

1. **Setup Issues** → See `SETUP_GUIDE.md`
2. **Tech Decisions** → See `TECH_STACK.md`  
3. **Migration Details** → See `MIGRATION_GUIDE.md`
4. **Architecture** → See `ARCHITECTURE.md`
5. **Backend Docs** → See `artifacts/api-server-python/README.md`

---

## 🚀 Next Steps

1. ✅ **Review** the documentation
2. ✅ **Run** the frontend: `pnpm run dev:frontend`
3. ✅ **Start** developing!

---

**Your portfolio app is ready to go! 🎉**
