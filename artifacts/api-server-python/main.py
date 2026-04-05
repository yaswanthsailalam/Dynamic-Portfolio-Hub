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

class ContactSubmission(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class AnalyticsEvent(BaseModel):
    event_type: str
    resource_id: str = ""
    metadata: dict = {}
    session_id: str = ""

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

# ── Contact / Leads ──────────────────────────────────────────

@app.post("/api/contact")
async def submit_contact(submission: ContactSubmission):
    data = load_data()
    lead = {
        "id": str(uuid.uuid4()),
        "name": submission.name,
        "email": submission.email,
        "subject": submission.subject,
        "message": submission.message,
        "submitted_at": datetime.utcnow().isoformat(),
        "read": False
    }
    data.setdefault("leads", []).append(lead)
    save_data(data)
    return {"message": "Thank you! Your message has been received.", "lead": lead}

@app.get("/api/leads")
async def get_leads(_: dict = Depends(verify_token)):
    data = load_data()
    leads = data.get("leads", [])
    # Return newest first
    leads.sort(key=lambda x: x.get("submitted_at", ""), reverse=True)
    return leads

@app.post("/api/leads/{lead_id}/read")
async def mark_lead_read(lead_id: str, _: dict = Depends(verify_token)):
    data = load_data()
    for lead in data.get("leads", []):
        if lead["id"] == lead_id:
            lead["read"] = True
            save_data(data)
            return {"message": "Marked as read"}
    raise HTTPException(status_code=404, detail="Lead not found")

# ── Analytics ────────────────────────────────────────────────

@app.post("/api/analytics/track")
async def track_event(event: AnalyticsEvent):
    data = load_data()
    analytics_entry = {
        "id": str(uuid.uuid4()),
        "event_type": event.event_type,
        "resource_id": event.resource_id,
        "session_id": event.session_id,
        "metadata": event.metadata,
        "timestamp": datetime.utcnow().isoformat()
    }
    data.setdefault("analytics", []).append(analytics_entry)
    save_data(data)
    return {"status": "ok"}

@app.get("/api/analytics/stats")
async def get_analytics_stats(_: dict = Depends(verify_token)):
    data = load_data()
    analytics = data.get("analytics", [])
    projects = data.get("projects", [])
    leads = data.get("leads", [])
    
    # 1. Traffic Trends (Last 14 days)
    now = datetime.utcnow()
    days = [(now - timedelta(days=i)).date().isoformat() for i in range(13, -1, -1)]
    trends = {day: 0 for day in days}
    for entry in analytics:
        date = entry["timestamp"].split("T")[0]
        if date in trends:
            trends[date] += 1
            
    # 2. Project Popularity
    project_stats = {p["id"]: {"title": p["title"], "views": 0} for p in projects}
    for entry in analytics:
        if entry["event_type"] == "project_view" and entry["resource_id"] in project_stats:
            project_stats[entry["resource_id"]]["views"] += 1
            
    # 4. Conversion Metrics
    form_opens = sum(1 for e in analytics if e["event_type"] == "contact_form_open")
    form_submits = len(leads)
    conversion_rate = (form_submits / form_opens * 100) if form_opens > 0 else 0

    return {
        "overview": {
            "total_views": total_views,
            "resume_downloads": resume_downloads,
            "github_clicks": github_clicks,
            "total_leads": len(leads),
            "form_opens": form_opens,
            "conversion_rate": round(conversion_rate, 1)
        },
        "trends": [{"date": d, "views": v} for d, v in trends.items()],
        "popular_projects": sorted(project_stats.values(), key=lambda x: x["views"], reverse=True)
    }

# ── Excel Dashboard Generator ───────────────────────────────

@app.get("/api/analytics/export/dashboard")
async def export_excel_dashboard(_: dict = Depends(verify_token)):
    """Generate a professional MIS-style Excel Analytics Dashboard."""
    import pandas as pd
    from io import BytesIO
    from fastapi.responses import Response

    data = load_data()
    analytics = data.get("analytics", [])
    
    if not analytics:
        raise HTTPException(status_code=400, detail="No analytics data to export")

    # Prepare DataFrames
    df = pd.DataFrame(analytics)
    # Convert timestamp to localized date
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['date'] = df['timestamp'].dt.date
    
    # Aggregations for charts
    daily_views = df[df['event_type'] == 'page_view'].groupby('date').size().reset_index(name='Views')
    daily_views['date'] = daily_views['date'].astype(str)
    
    project_views = df[df['event_type'] == 'project_view'].groupby('resource_id').size().reset_index(name='Views')

    # Create Excel in Memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        workbook = writer.book
        
        # ── Dashboard Sheet ──
        dashboard = workbook.add_worksheet('Executive Dashboard')
        dashboard.set_column('A:A', 2)  # Margin
        dashboard.set_column('B:B', 30) # labels
        dashboard.set_column('C:E', 15) # values
        
        # Formats
        title_fmt = workbook.add_format({'bold': True, 'font_size': 18, 'font_color': '#0072FF'})
        header_fmt = workbook.add_format({'bold': True, 'bg_color': '#F2F2F2', 'border': 1, 'align': 'center'})
        kpi_label_fmt = workbook.add_format({'font_color': '#666666', 'font_size': 10, 'bold': True})
        kpi_val_fmt = workbook.add_format({'font_size': 16, 'bold': True, 'align': 'center', 'border': 1, 'bg_color': '#FFFFFF'})
        
        # Dashboard Title
        dashboard.write('B2', 'InsightFlow Portfolio Performance Dashboard', title_fmt)
        dashboard.write('B3', f'Report Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
        
        # KPI Section
        kpis = [
            ("Total Visitors", sum(1 for e in analytics if e["event_type"] == "page_view")),
            ("Resume Downloads", sum(1 for e in analytics if e["event_type"] == "resume_download")),
            ("GitHub Connections", sum(1 for e in analytics if e["event_type"] == "github_click")),
            ("Total Leads", len(data.get("leads", [])))
        ]
        
        for i, (label, val) in enumerate(kpis):
            col = 1 + i # B, C, D, E
            dashboard.write(4, col, label, kpi_label_fmt)
            dashboard.write(5, col, val, kpi_val_fmt)

        # ── Charts ──
        # Data storage sheet (hidden)
        data_sheet = workbook.add_worksheet('ChartData')
        daily_views.to_excel(writer, sheet_name='ChartData', startrow=0, startcol=0, index=False)
        project_views.to_excel(writer, sheet_name='ChartData', startrow=0, startcol=3, index=False)
        
        # Trend Chart (Line)
        trend_chart = workbook.add_chart({'type': 'line'})
        trend_chart.add_series({
            'name':       'Daily Views',
            'categories': ['ChartData', 1, 0, len(daily_views), 0],
            'values':     ['ChartData', 1, 1, len(daily_views), 1],
            'line':       {'color': '#00C6FF', 'width': 2.25},
            'marker':     {'type': 'circle', 'size': 5, 'border': {'color': '#00C6FF'}, 'fill': {'color': 'white'}},
        })
        trend_chart.set_title({'name': 'Site Traffic Trend (Last 14 Days)'})
        trend_chart.set_x_axis({'name': 'Date'})
        trend_chart.set_y_axis({'name': 'Visitors'})
        dashboard.insert_chart('B8', trend_chart, {'x_scale': 1.5, 'y_scale': 1.2})
        
        # Popularity Chart (Column)
        pop_chart = workbook.add_chart({'type': 'column'})
        pop_chart.add_series({
            'name':       'Case Study Views',
            'categories': ['ChartData', 1, 3, len(project_views), 3],
            'values':     ['ChartData', 1, 4, len(project_views), 4],
            'fill':       {'color': '#0072FF'},
        })
        pop_chart.set_title({'name': 'Project Case Study Popularity'})
        dashboard.insert_chart('H8', pop_chart, {'x_scale': 1.2, 'y_scale': 1.2})

        # Final Formatting
        dashboard.hide_gridlines(2)
        
        # ── Raw Data Sheet ──
        df_raw = pd.DataFrame(analytics)
        df_raw.to_excel(writer, sheet_name='Analytics Log', index=False)

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=InsightFlow_Executive_Dashboard.xlsx"}
    )

# ── PDF Resume Generator ─────────────────────────────────────

@app.get("/api/resume/download")
async def download_resume():
    """Generate a professional ATS-optimized PDF resume."""
    from io import BytesIO
    from reportlab.lib.pagesizes import LETTER
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    from reportlab.lib import colors
    from fastapi.responses import Response

    data = load_data()
    exp_list = data.get("experience", [])
    projects = data.get("projects", [])

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=LETTER, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    name_style = ParagraphStyle('Name', parent=styles['Heading1'], alignment=TA_CENTER, fontSize=18, spaceAfter=2)
    subhead_style = ParagraphStyle('Subhead', parent=styles['Normal'], alignment=TA_CENTER, fontSize=12, spaceAfter=2)
    contact_style = ParagraphStyle('Contact', parent=styles['Normal'], alignment=TA_CENTER, fontSize=10, spaceAfter=10)
    section_title = ParagraphStyle('Section', parent=styles['Heading2'], fontSize=12, textColor=colors.black, spaceBefore=10, spaceAfter=2, fontName='Helvetica-Bold')
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=10, leading=12)
    job_title = ParagraphStyle('JobTitle', parent=styles['Normal'], fontSize=11, fontName='Helvetica-Bold')
    job_sub = ParagraphStyle('JobSub', parent=styles['Normal'], fontSize=10, fontName='Helvetica-Oblique', textColor=colors.grey)

    content = []
    
    # Header
    content.append(Paragraph("<b>LALAM YASWANTH SAI</b>", name_style))
    content.append(Paragraph("Operations Analyst", subhead_style))
    
    # Contact Info
    email = "yaswanthsailalam02@gmail.com"
    phone = "+91 9121511764"
    linkedin_url = "https://www.linkedin.com/in/yaswanth-sai-lalam-4969b236a"
    
    contact_html = f"Hyderabad, India | {phone} | {email} | <a href='{linkedin_url}' color='blue'>LinkedIn</a>"
    content.append(Paragraph(contact_html, contact_style))
    
    # Summary
    content.append(Paragraph("SUMMARY", section_title))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=5))
    summary_text = "Results-driven Operations Associate with experience specializing in backend operations, MIS reporting, and process automation within complex environments. Proven track record in streamlining operational workflows, data reconciliation, and achieving high processing speed through technical automation tools including Excel VBA and Python."
    content.append(Paragraph(summary_text, body_style))
    
    # Technical Skills
    content.append(Paragraph("TECHNICAL SKILLS", section_title))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=5))
    
    skills = [
        ("Automation & Data", "Excel VBA, Python, Data Pipeline Engineering, RPA, Web Scraping"),
        ("Healthcare Operations", "HIS/EMR Systems, Claims Adjudication, TAT Monitoring, Insurance Ops"),
        ("Analytics & MIS", "SQL, Power BI, Advanced Excel, MIS Reporting, Trend Analysis")
    ]
    
    for category, items in skills:
        content.append(Paragraph(f"<b>{category}:</b> {items}", body_style))
    content.append(Spacer(1, 5))
    
    # Experience
    content.append(Paragraph("EXPERIENCE", section_title))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=5))
    
    for exp in exp_list:
        content.append(Paragraph(f"<b>{exp['company']}</b>", job_title))
        content.append(Paragraph(f"{exp['title']} | {exp['period']}", job_sub))
        
        # Bullet points
        for ach in exp.get('achievements', []):
            content.append(Paragraph(f"• {ach}", body_style))
        content.append(Spacer(1, 10))
        
    # Education
    content.append(Paragraph("EDUCATION", section_title))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=5))
    content.append(Paragraph("<b>MBA - Operations & Data Science Management</b> | NMIMS (Pursuing)", body_style))
    content.append(Paragraph("<b>BTech - Computer Science Engineering</b> | ANITS (July 2018 - May 2022)", body_style))
    
    # Projects (Dynamic)
    if projects:
        content.append(Paragraph("KEY PROJECTS", section_title))
        content.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=5))
        for proj in projects[:3]: # Top 3
            content.append(Paragraph(f"<b>{proj['title']}</b>", job_title))
            content.append(Paragraph(f"Impact: {proj['metric']}", body_style))
            content.append(Paragraph(f"Built with {', '.join(proj['tags'])}", body_style))
            content.append(Spacer(1, 5))

    # Build PDF
    doc.build(content)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=Lalam_Yaswanth_Sai_Resume.pdf"
        }
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    environment = os.getenv("ENVIRONMENT", "development")
    if environment == "development":
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True, reload_dirs=["."])
    else:
        uvicorn.run(app, host="0.0.0.0", port=port, reload=False)
