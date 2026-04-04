# Portfolio API - Python Backend

Modern Python FastAPI backend for the Dynamic Portfolio Hub application.

## Stack

- **Framework**: FastAPI (modern, fast, async-ready)
- **Server**: Uvicorn (ASGI server)
- **Python**: 3.9+
- **Database**: PostgreSQL + SQLAlchemy (optional, extendable)

## Setup

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. **Create a virtual environment** (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode
```bash
# With auto-reload
python main.py
# OR
pnpm run dev
```

The server will start on `http://localhost:5000` by default.

### Production Mode
```bash
set ENVIRONMENT=production
python main.py
# OR
pnpm run prod
```

## API Endpoints

### Health Check
- **GET** `/api/healthz` - Health check endpoint
- **GET** `/api/health` - Alternative health check endpoint

### Information
- **GET** `/api` - API root
- **GET** `/api/info` - API information and status

### Root
- **GET** `/` - Welcome message

## Environment Variables

- `PORT` - Port number (default: 5000)
- `ENVIRONMENT` - Environment mode: `development` or `production` (default: development)

## Documentation

Once the server is running, visit:
- **Interactive API docs (Swagger)**: http://localhost:5000/docs
- **ReDoc documentation**: http://localhost:5000/redoc

## Project Structure

```
api-server-python/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── package.json         # NPM scripts configuration
└── README.md           # This file
```

## Features

- ✅ CORS enabled for React frontend development
- ✅ Automatic API documentation (Swagger UI)
- ✅ Hot reload in development mode
- ✅ Error handling middleware
- ✅ Health check endpoints
- ✅ Easy to extend with more routes

## Next Steps

To add more endpoints:

1. Add route handlers in `main.py`
2. Use FastAPI decorators (`@app.get()`, `@app.post()`, etc.)
3. Leverage Pydantic models for request/response validation

Example:
```python
from pydantic import BaseModel

class Project(BaseModel):
    name: str
    description: str
    url: str

@app.get("/api/projects")
async def get_projects() -> list[Project]:
    return []

@app.post("/api/projects")
async def create_project(project: Project) -> Project:
    return project
```

## Migration Notes

This is a Python replacement for the original Express.js backend. All existing API contracts are maintained for compatibility with the React frontend.

## License

MIT
