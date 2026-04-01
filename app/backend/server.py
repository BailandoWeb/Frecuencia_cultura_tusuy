from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

# ================= CONFIG =================
ROOT_DIR = Path(__file__).parent
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Faltan variables de entorno SUPABASE")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

JWT_SECRET = os.environ.get('JWT_SECRET', 'dev_secret')
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ================= MODELS =================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EventCreate(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    category_id: str
    date: str
    time: str
    location: str
    district: str
    price: float = 0
    is_free: bool = True

# ================= HELPERS =================

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=72)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload["user_id"]

        result = supabase.table('users').select('*').eq('id', user_id).single().execute()
        return result.data
    except:
        raise HTTPException(status_code=401, detail="No autorizado")

# ================= AUTH =================

@api_router.post("/auth/register")
def register(user: UserCreate):
    existing = supabase.table('users').select('id').eq('email', user.email).execute()

    if existing.data:
        raise HTTPException(400, "Email ya registrado")

    user_id = str(uuid.uuid4())

    supabase.table('users').insert({
        "id": user_id,
        "email": user.email,
        "password": hash_password(user.password),
        "name": user.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }).execute()

    token = create_token(user_id)

    return {"access_token": token}

@api_router.post("/auth/login")
def login(user: UserLogin):
    result = supabase.table('users').select('*').eq('email', user.email).single().execute()

    if not result.data:
        raise HTTPException(401, "Credenciales inválidas")

    db_user = result.data

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(401, "Credenciales inválidas")

    token = create_token(db_user["id"])

    return {"access_token": token, "user": db_user}

# ================= EVENTS =================

@api_router.get("/events")
def get_events():
    result = supabase.table('events').select('*').execute()
    return result.data

@api_router.post("/events")
def create_event(event: EventCreate, user=Depends(get_user)):
    event_id = str(uuid.uuid4())

    supabase.table('events').insert({
        "id": event_id,
        **event.dict(),
        "organizer_id": user["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }).execute()

    return {"id": event_id}

# ================= CATEGORIES =================

@api_router.get("/categories")
def get_categories():
    return supabase.table('categories').select('*').execute().data

# ================= DISTRICTS =================

@api_router.get("/districts")
def get_districts():
    return [
        {"id": "centro", "name": "Centro"},
        {"id": "lavapies", "name": "Lavapiés"},
        {"id": "malasana", "name": "Malasaña"},
    ]

# ================= INIT =================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)