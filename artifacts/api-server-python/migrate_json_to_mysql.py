import json
import os
from datetime import datetime
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Project, Lead, Analytics, Post, init_db

def migrate():
    DATA_FILE = "data.json"
    if not os.path.exists(DATA_FILE):
        print(f"No {DATA_FILE} found. Skipping migration.")
        return

    print("Initializing Database...")
    init_db()
    db = SessionLocal()

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 1. Migrate Projects
        projects = data.get("projects", [])
        print(f"Migrating {len(projects)} projects...")
        for p in projects:
            existing = db.query(Project).filter(Project.id == p.get("id")).first()
            if not existing:
                new_p = Project(
                    id=p.get("id"),
                    title=p.get("title"),
                    description=p.get("description"),
                    tags=p.get("tags"),
                    linkedinTagsString=p.get("linkedinTagsString"),
                    image=p.get("image"),
                    workflowDiagram=p.get("workflowDiagram"),
                    metric=p.get("metric"),
                    features=p.get("features"),
                    impact=p.get("impact"),
                    challenges=p.get("challenges"),
                    performanceMetrics=p.get("performanceMetrics"),
                    workflow=p.get("workflow"),
                    codeSnippets=p.get("codeSnippets"),
                    videoSrc=p.get("videoSrc"),
                    gallery=p.get("gallery")
                )
                db.add(new_p)

        # 2. Migrate Leads
        leads = data.get("leads", [])
        print(f"Migrating {len(leads)} leads...")
        for l in leads:
            existing = db.query(Lead).filter(Lead.id == l.get("id")).first()
            if not existing:
                submitted_at = l.get("submitted_at")
                if submitted_at:
                    try:
                        submitted_at = datetime.fromisoformat(submitted_at.replace('Z', '+00:00'))
                    except ValueError:
                        submitted_at = datetime.utcnow()
                
                new_l = Lead(
                    id=l.get("id"),
                    name=l.get("name"),
                    email=l.get("email"),
                    subject=l.get("subject"),
                    message=l.get("message"),
                    submitted_at=submitted_at,
                    read=l.get("read", False)
                )
                db.add(new_l)

        # 3. Migrate Analytics
        analytics = data.get("analytics", [])
        print(f"Migrating {len(analytics)} analytics entries...")
        # Since analytics can be large, we might want to batch this, but for now we'll do it normally
        for a in analytics:
            existing = db.query(Analytics).filter(Analytics.id == a.get("id")).first()
            if not existing:
                timestamp = a.get("timestamp")
                if timestamp:
                    try:
                        timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    except ValueError:
                        timestamp = datetime.utcnow()
                
                new_a = Analytics(
                    id=a.get("id"),
                    event_type=a.get("event_type"),
                    resource_id=a.get("resource_id"),
                    session_id=a.get("session_id"),
                    metadata_json=a.get("metadata"),
                    timestamp=timestamp
                )
                db.add(new_a)

        # 4. Migrate Posts
        posts = data.get("posts", [])
        print(f"Migrating {len(posts)} posts...")
        for post in posts:
            existing = db.query(Post).filter(Post.id == post.get("id")).first()
            if not existing:
                new_post = Post(
                    id=post.get("id"),
                    project_id=post.get("project_id"),
                    content=post.get("content"),
                    image=post.get("image"),
                    status=post.get("status", "pending")
                )
                db.add(new_post)

        db.commit()
        print("Migration complete!")

    except Exception as e:
        db.rollback()
        print(f"Error during migration: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
