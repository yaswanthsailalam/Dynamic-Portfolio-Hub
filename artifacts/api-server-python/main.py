"""
FastAPI server for Dynamic Portfolio Hub
Python backend replacing the Express.js server
"""

import os
import json
import uuid
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import uvicorn
import requests
import time
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv

import linkedin_service
import github_service

load_dotenv()

app = FastAPI(
    title="Portfolio API",
    description="Dynamic Portfolio Hub - Python Backend",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"projects": [], "posts": []}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    secret = os.getenv("JWT_SECRET", "supersecret_key_change_in_production")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class LoginRequest(BaseModel):
    password: str

class CodeSnippet(BaseModel):
    filename: str
    language: str
    code: str

class WorkflowStep(BaseModel):
    icon: str
    title: str
    description: str

class ProjectModel(BaseModel):
    title: str
    description: str
    tags: List[str]
    image: str
    metric: str
    features: List[str]
    impact: str
    challenges: List[str] = []
    performanceMetrics: List[str] = []
    workflow: List[WorkflowStep]
    videoSrc: str = None
    codeSnippets: List[CodeSnippet] = []

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin")
    if req.password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    secret = os.getenv("JWT_SECRET", "supersecret_key_change_in_production")
    payload = {
        "sub": "admin",
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return {"access_token": token}



def generate_linkedin_draft(project: dict) -> str:
    metric = project.get('metric', '')
    title = project.get('title', '')
    tags_str = ", ".join(project.get('tags', []))
    
    hook = f"Just delivered a project that achieved {metric} with the {title}! 🚀" if metric else f"Just shipped a major update to {title}! 🚀"
    
    draft = f"{hook}\n\n"
    draft += "Before this, the baseline process was a massive operational bottleneck.\n\n"
    draft += f"Instead of relying on slow, error-prone manual work, I engineered a robust solution using {tags_str}.\n\n"
    
    if project.get('description'): 
        draft += f"{project['description']}\n\n"
    
    if project.get('workflow') and len(project['workflow']) > 0:
        draft += "⚙️ How it works under the hood:\n"
        for w in project['workflow']:
            desc = w.get('description', '').split('.')[0]
            draft += f"⚡ {w.get('title', '')} → {desc}\n"
        draft += "\n"
        
    impact = project.get('impact', '')
    if impact: 
        draft += f"📈 The Impact:\n{impact}\n\n"
    
    if project.get('performanceMetrics') and len(project['performanceMetrics']) > 0:
        for m in project['performanceMetrics']:
            draft += f"✅ {m}\n"
        draft += "\n"
        
    challenges = project.get('challenges', [])
    if challenges:
        learning = f"💡 Key Takeaway: One of the biggest hurdles was {challenges[0].lower()}. Overcoming this taught me how crucial efficient data structures are when scaling operations.\n\n"
        draft += learning
        
    cta = "What’s the biggest manual bottleneck you’ve faced in your daily workflows? Drop it in the comments 👇"
    
    if project.get('linkedinTagsString'):
        tags = project['linkedinTagsString']
    else:
        tags = " ".join([f"#{t.replace(' ', '').replace('&', '')}" for t in project.get('tags', [])])
    
    draft += f"{cta}\n\n{tags}"
    return draft

@app.get("/api/healthz")
async def health_check() -> Dict[str, str]:
    return {"status": "ok"}

@app.get("/api/github/activity")
async def github_activity(limit: int = 10):
    events = await github_service.fetch_github_activity(limit=limit)
    return {"username": "yaswanthsailalam", "events": events}

@app.get("/api/projects")
async def get_projects():
    data = load_data()
    return data.get("projects", [])

@app.post("/api/projects")
async def add_project(project: ProjectModel, _: dict = Depends(verify_token)):
    data = load_data()
    new_project = project.dict(exclude_none=True)
    project_id = str(uuid.uuid4())
    new_project["id"] = project_id
    
    data.setdefault("projects", []).append(new_project)
    
    draft_copy = generate_linkedin_draft(new_project)

    # Use workflow diagram specifically for Linkedin if available, else standard image
    linkedin_media = new_project.get('workflowDiagram', new_project.get('image', ''))
    
    new_post = {
        "id": str(uuid.uuid4()),
        "project_id": project_id,
        "content": draft_copy,
        "image": linkedin_media,
        "status": "pending"
    }
    data.setdefault("posts", []).append(new_post)
    
    save_data(data)
    return {"message": "Project added and LinkedIn post drafted successfully", "project": new_project, "post": new_post}

@app.get("/api/posts/pending")
async def get_pending_posts():
    data = load_data()
    pending = [p for p in data.get("posts", []) if p.get("status") == "pending"]
    return pending

@app.get("/api/posts/all")
async def get_all_posts():
    data = load_data()
    return data.get("posts", [])

@app.post("/api/projects/{project_id}/draft")
async def draft_post_for_project(project_id: str, _: dict = Depends(verify_token)):
    data = load_data()
    
    project = next((p for p in data.get("projects", []) if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    existing_post = next((p for p in data.get("posts", []) if p["project_id"] == project_id), None)
    if existing_post:
        raise HTTPException(status_code=400, detail="A post draft already exists for this project.")
        
    draft_copy = generate_linkedin_draft(project)

    # Use workflow diagram specifically for Linkedin if available, else standard image
    linkedin_media = project.get('workflowDiagram', project.get('image', ''))

    new_post = {
        "id": str(uuid.uuid4()),
        "project_id": project_id,
        "content": draft_copy,
        "image": linkedin_media,
        "status": "pending"
    }
    
    data.setdefault("posts", []).append(new_post)
    save_data(data)
    
    return {"message": "LinkedIn draft generated successfully.", "post": new_post}

@app.get("/api/linkedin/status")
async def linkedin_status():
    token = linkedin_service.load_token()
    if not token:
        return {"connected": False}
    try:
        profile = await linkedin_service.get_user_profile()
        return {
            "connected": True,
            "profile": profile
        }
    except Exception as e:
        print("Failed to fetch profile:", e)
        return {"connected": False}

@app.get("/api/linkedin/authorize")
async def linkedin_authorize():
    state = str(uuid.uuid4())
    # In a real app we would save state to a session or redis to verify in callback
    url = linkedin_service.get_authorization_url(state)
    return RedirectResponse(url=url)

@app.get("/api/linkedin/callback")
async def linkedin_callback(code: str, state: str):
    try:
        await linkedin_service.exchange_code_for_token(code)
        # Redirect back to the frontend admin panel
        return RedirectResponse(url="http://localhost:5173")
    except Exception as e:
        print("OAuth Error:", e)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linkedin/disconnect")
async def linkedin_disconnect(_: dict = Depends(verify_token)):
    linkedin_service.disconnect()
    return {"message": "Disconnected"}

@app.post("/api/posts/{post_id}/publish")
async def publish_post(post_id: str, _: dict = Depends(verify_token)):
    data = load_data()
    for p in data.get("posts", []):
        if p["id"] == post_id and p["status"] == "pending":
            
            # Check for Media
            local_path = None
            image_rel = p.get('image', '')
            if image_rel.startswith('/'):
                frontend_public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'portfolio', 'public'))
                local_path = os.path.join(frontend_public_dir, image_rel.lstrip('/'))
                if not os.path.exists(local_path):
                    local_path = None
                    
            try:
                # Use our new service
                await linkedin_service.create_post(p['content'], local_path)
                p["status"] = "published"
                save_data(data)
                return {"message": "Success! Published using OAuth and /rest/posts API.", "post": p}
            except Exception as e:
                print("Failed to post:", e)
                raise HTTPException(status_code=500, detail=f"Failed to post to LinkedIn: {str(e)}")
            
    raise HTTPException(status_code=404, detail="Pending post not found")

@app.exception_handler(Exception)
async def general_exception(request, exc):
    return JSONResponse(status_code=500, content={"detail": str(exc)})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    environment = os.getenv("ENVIRONMENT", "development")
    if environment == "development":
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True, reload_dirs=["."])
    else:
        uvicorn.run(app, host="0.0.0.0", port=port, reload=False)
