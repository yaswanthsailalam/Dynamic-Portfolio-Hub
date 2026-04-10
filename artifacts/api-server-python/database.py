import os
from sqlalchemy import create_engine, Column, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

# Get database URL from environment variable or default to local for development
# Render provides DATABASE_URL automatically
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/portfolio_db")

# Render sometimes provides postgres:// instead of postgresql:// which SQLAlchemy 2.0+ requires
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    tags = Column(JSON)
    linkedinTagsString = Column(Text)
    image = Column(String(500))
    workflowDiagram = Column(String(500))
    metric = Column(String(255))
    features = Column(JSON)
    impact = Column(Text)
    challenges = Column(JSON)
    performanceMetrics = Column(JSON)
    workflow = Column(JSON)
    codeSnippets = Column(JSON)
    videoSrc = Column(String(500))
    gallery = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(255))
    message = Column(Text)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_type = Column(String(100), nullable=False)
    resource_id = Column(String(255))
    session_id = Column(String(100))
    metadata_json = Column(JSON, name="metadata")
    timestamp = Column(DateTime, default=datetime.utcnow)

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36))
    content = Column(Text)
    image = Column(String(500))
    status = Column(String(50), default="pending") # pending, published
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
