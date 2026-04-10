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

from github_service import fetch_github_activity
from linkedin_service import load_token, get_user_profile, create_post, disconnect, get_authorization_url, exchange_code_for_token
from database import get_db, Project, Lead, Analytics, Post, init_db
from sqlalchemy.orm import Session
from sqlalchemy import func

load_dotenv()

# Initialize DB tables
try:
    init_db()
except Exception as e:
    print(f"Database initialization warning: {e}")

app = FastAPI(
    title="Portfolio API",
    description="Dynamic Portfolio Hub - Python Backend",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://0.0.0.0:5173,https://mellow-crepe-b114cd.netlify.app").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data persistence moved to MySQL (database.py)

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
    gallery: List[str] = []
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
    admin_pass = os.getenv("ADMIN_PASSWORD", "Admin123")
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
    events = await fetch_github_activity(limit=limit)
    return {"username": "yaswanthsailalam", "events": events}

@app.get("/api/projects")
async def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    # Convert SQLAlchemy objects to dict for JSON serialization
    return [p.__dict__ for p in projects]

@app.post("/api/projects")
async def add_project(project_data: ProjectModel, db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    project_id = str(uuid.uuid4())
    
    # 1. Create Project
    new_project = Project(
        id=project_id,
        title=project_data.title,
        description=project_data.description,
        tags=project_data.tags,
        image=project_data.image,
        metric=project_data.metric,
        features=project_data.features,
        impact=project_data.impact,
        challenges=project_data.challenges,
        performanceMetrics=project_data.performanceMetrics,
        workflow=[w.model_dump() for w in project_data.workflow],
        gallery=project_data.gallery,
        codeSnippets=[c.model_dump() for c in project_data.codeSnippets],
        videoSrc=project_data.videoSrc
    )
    db.add(new_project)
    
    # 2. Draft LinkedIn Post
    draft_content = generate_linkedin_draft(project_data.model_dump())
    linkedin_media = project_data.image # default
    
    new_post = Post(
        id=str(uuid.uuid4()),
        project_id=project_id,
        content=draft_content,
        image=linkedin_media,
        status="pending"
    )
    db.add(new_post)
    
    db.commit()
    db.refresh(new_project)
    
    return {"message": "Project added and LinkedIn post drafted successfully", "project": new_project.id}

@app.get("/api/posts/pending")
async def get_pending_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.status == "pending").all()
    return posts

@app.get("/api/posts/all")
async def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts

@app.post("/api/projects/{project_id}/draft")
async def draft_post_for_project(project_id: str, db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    existing_post = db.query(Post).filter(Post.project_id == project_id).first()
    if existing_post:
        raise HTTPException(status_code=400, detail="A post draft already exists for this project.")
        
    draft_copy = generate_linkedin_draft(project.__dict__)
    linkedin_media = project.image

    new_post = Post(
        id=str(uuid.uuid4()),
        project_id=project_id,
        content=draft_copy,
        image=linkedin_media,
        status="pending"
    )
    
    db.add(new_post)
    db.commit()
    
    return {"message": "LinkedIn draft generated successfully.", "post": new_post.id}

@app.get("/api/linkedin/status")
async def linkedin_status():
    token = load_token()
    if not token:
        return {"connected": False}
    try:
        profile = await get_user_profile()
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
    url = get_authorization_url(state)
    return RedirectResponse(url=url)

@app.get("/api/linkedin/callback")
async def linkedin_callback(code: str, state: str):
    try:
        await exchange_code_for_token(code)
        # Redirect back to the frontend admin panel
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(url=frontend_url)
    except Exception as e:
        print("OAuth Error:", e)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linkedin/disconnect")
async def linkedin_disconnect(_: dict = Depends(verify_token)):
    disconnect()
    return {"message": "Disconnected"}

@app.post("/api/posts/{post_id}/publish")
async def publish_post(post_id: str, db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    post = db.query(Post).filter(Post.id == post_id, Post.status == "pending").first()
    if not post:
        raise HTTPException(status_code=404, detail="Pending post not found")
    
    # Check for Media
    local_path = None
    image_rel = post.image or ""
    if image_rel.startswith('/'):
        frontend_public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'portfolio', 'public'))
        local_path = os.path.join(frontend_public_dir, image_rel.lstrip('/'))
        if not os.path.exists(local_path):
            local_path = None
            
    try:
        await create_post(post.content, local_path)
        post.status = "published"
        db.commit()
        return {"message": "Success! Published to LinkedIn.", "post": post.id}
    except Exception as e:
        print("Failed to post:", e)
        raise HTTPException(status_code=500, detail=f"Failed to post to LinkedIn: {str(e)}")

@app.exception_handler(Exception)
async def general_exception(request, exc):
    return JSONResponse(status_code=500, content={"detail": str(exc)})

# ── Contact / Leads ──────────────────────────────────────────

@app.post("/api/contact")
async def submit_contact(submission: ContactSubmission, db: Session = Depends(get_db)):
    lead = Lead(
        id=str(uuid.uuid4()),
        name=submission.name,
        email=submission.email,
        subject=submission.subject,
        message=submission.message,
        submitted_at=datetime.utcnow(),
        read=False
    )
    db.add(lead)
    db.commit()
    return {"message": "Thank you! Your message has been received.", "lead": lead.id}

@app.get("/api/leads")
async def get_leads(db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    leads = db.query(Lead).order_by(Lead.submitted_at.desc()).all()
    return leads

@app.post("/api/leads/{lead_id}/read")
async def mark_lead_read(lead_id: str, db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.read = True
    db.commit()
    return {"message": "Marked as read"}

# ── Analytics ────────────────────────────────────────────────

@app.post("/api/analytics/track")
async def track_event(event: AnalyticsEvent, db: Session = Depends(get_db)):
    analytics_entry = Analytics(
        id=str(uuid.uuid4()),
        event_type=event.event_type,
        resource_id=event.resource_id,
        session_id=event.session_id,
        metadata_json=event.metadata,
        timestamp=datetime.utcnow()
    )
    db.add(analytics_entry)
    db.commit()
    return {"status": "ok"}

@app.get("/api/analytics/stats")
async def get_analytics_stats(db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    # 1. Traffic Trends (Last 14 days)
    now = datetime.utcnow()
    start_date = now - timedelta(days=14)
    
    # Query for daily views
    trend_results = db.query(
        func.date(Analytics.timestamp).label('date'),
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.event_type == 'page_view',
        Analytics.timestamp >= start_date
    ).group_by(func.date(Analytics.timestamp)).all()
    
    trends = {str(r.date): r.count for r in trend_results}
    
    # 2. Project Popularity
    project_stats = db.query(
        Analytics.resource_id,
        func.count(Analytics.id).label('views')
    ).filter(
        Analytics.event_type == 'project_view'
    ).group_by(Analytics.resource_id).all()
    
    # Map back to project titles
    projects = db.query(Project.id, Project.title).all()
    project_map = {p.id: p.title for p in projects}
    
    popular_projects = [
        {"id": s.resource_id, "title": project_map.get(s.resource_id, "Unknown"), "views": s.views}
        for s in project_stats if s.resource_id in project_map
    ]
            
    # 4. Conversion Metrics
    form_opens = db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'contact_form_open').scalar() or 0
    form_submits = db.query(func.count(Lead.id)).scalar() or 0
    conversion_rate = (form_submits / form_opens * 100) if form_opens > 0 else 0
    
    # 5. Summary Metrics
    total_views = db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'page_view').scalar() or 0
    resume_downloads = db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'resume_download').scalar() or 0
    github_clicks = db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'github_click').scalar() or 0

    return {
        "overview": {
            "total_views": total_views,
            "resume_downloads": resume_downloads,
            "github_clicks": github_clicks,
            "total_leads": form_submits,
            "form_opens": form_opens,
            "conversion_rate": round(conversion_rate, 1)
        },
        "trends": [{"date": d, "views": v} for d, v in trends.items()],
        "popular_projects": sorted(popular_projects, key=lambda x: x["views"], reverse=True)
    }

# ── Excel Dashboard Generator ───────────────────────────────

@app.get("/api/analytics/export/dashboard")
async def export_excel_dashboard(db: Session = Depends(get_db), _: dict = Depends(verify_token)):
    """Generate a professional MIS-style Excel Analytics Dashboard."""
    import pandas as pd
    from io import BytesIO
    from fastapi.responses import Response

    analytics = db.query(Analytics).all()
    
    if not analytics:
        raise HTTPException(status_code=400, detail="No analytics data to export")

    # Prepare DataFrames
    data_list = []
    for a in analytics:
        data_list.append({
            "id": a.id,
            "event_type": a.event_type,
            "resource_id": a.resource_id,
            "session_id": a.session_id,
            "metadata": a.metadata_json,
            "timestamp": a.timestamp
        })
    
    df = pd.DataFrame(data_list)
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
            ("Total Visitors", db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'page_view').scalar() or 0),
            ("Resume Downloads", db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'resume_download').scalar() or 0),
            ("GitHub Connections", db.query(func.count(Analytics.id)).filter(Analytics.event_type == 'github_click').scalar() or 0),
            ("Total Leads", db.query(func.count(Lead.id)).scalar() or 0)
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
async def download_resume(db: Session = Depends(get_db)):
    """Generate a professional ATS-optimized PDF resume."""
    from io import BytesIO
    from reportlab.lib.pagesizes import LETTER
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    from reportlab.lib import colors
    from fastapi.responses import Response

    projects = db.query(Project).all()
    # Experience is still static for now as it's not in the JSON, we can hardcode for this user
    exp_list = [
        {
            "company": "Finschia Foundation / LINE Tech Plus",
            "title": "Operations Associate",
            "period": "Aug 2022 - Present",
            "achievements": [
                "Managed day-to-day operations and governance for decentralized networks.",
                "Automated financial reconciliation processes using Excel VBA.",
                "Streamlined vendor management and payment audits."
            ]
        }
    ]

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
