from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase: Client = create_client(
    os.environ['SUPABASE_URL'],
    os.environ['SUPABASE_KEY']
)

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'frecuencia-cultura-secret')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

app = FastAPI(title="Frecuencia Cultura API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ============ MODELS ============
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "user"
    country: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str
    country: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    instagram: Optional[str] = None
    website: Optional[str] = None
    events_count: int = 0
    plan: str = "free"
    plan_started: Optional[str] = None
    created_at: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    instagram: Optional[str] = None
    website: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CategoryBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    icon: str
    slug: str
    description: Optional[str] = None

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
    external_link: Optional[str] = None
    is_free: bool = True

class EventResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    image_url: Optional[str] = None
    category_id: str
    category_name: Optional[str] = None
    date: str
    time: str
    location: str
    district: str
    organizer_id: str
    organizer_name: Optional[str] = None
    organizer_avatar: Optional[str] = None
    featured: bool = False
    price: float = 0
    external_link: Optional[str] = None
    is_free: bool = True
    views: int = 0
    saves: int = 0
    created_at: str

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    price: Optional[float] = None
    external_link: Optional[str] = None
    is_free: Optional[bool] = None

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class StatsResponse(BaseModel):
    total_events: int
    total_views: int
    total_saves: int
    events_this_month: int

# ============ HELPERS ============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No autorizado")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        result = supabase.table('users').select('*').eq('id', payload["user_id"]).single().execute()
        if not result.data:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        return result.data
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ============ AUTH ROUTES ============
@api_router.post("/auth/register", response_model=TokenResponse)
def register(user_data: UserCreate):
    # Check if email exists
    existing = supabase.table('users').select('id').eq('email', user_data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "role": user_data.role,
        "country": user_data.country,
        "events_count": 0,
        "plan": "free",
        "created_at": now
    }
    
    supabase.table('users').insert(user_doc).execute()
    token = create_token(user_id, user_data.email, user_data.role)
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user_id, email=user_data.email, name=user_data.name, 
                         role=user_data.role, country=user_data.country, 
                         events_count=0, plan="free", created_at=now)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    result = supabase.table('users').select('*').eq('email', credentials.email).single().execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    user = result.data
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    token = create_token(user["id"], user["email"], user["role"])
    
    # Count events
    events_result = supabase.table('events').select('id', count='exact').eq('organizer_id', user["id"]).execute()
    events_count = events_result.count or 0
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"], email=user["email"], name=user["name"],
            role=user["role"], country=user.get("country"),
            bio=user.get("bio"), avatar_url=user.get("avatar_url"),
            instagram=user.get("instagram"), website=user.get("website"),
            events_count=events_count, plan=user.get("plan", "free"),
            plan_started=user.get("plan_started"), created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    events_result = supabase.table('events').select('id', count='exact').eq('organizer_id', current_user["id"]).execute()
    return UserResponse(
        id=current_user["id"], email=current_user["email"], name=current_user["name"],
        role=current_user["role"], country=current_user.get("country"),
        bio=current_user.get("bio"), avatar_url=current_user.get("avatar_url"),
        instagram=current_user.get("instagram"), website=current_user.get("website"),
        events_count=events_result.count or 0, plan=current_user.get("plan", "free"),
        plan_started=current_user.get("plan_started"), created_at=current_user["created_at"]
    )

# ============ CATEGORIES ============
@api_router.get("/categories", response_model=List[CategoryBase])
def get_categories():
    result = supabase.table('categories').select('*').execute()
    return result.data

# ============ EVENTS ============
@api_router.get("/events", response_model=List[EventResponse])
def get_events(
    category: Optional[str] = None,
    district: Optional[str] = None,
    is_free: Optional[bool] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    organizer_id: Optional[str] = None,
    limit: int = Query(default=50, le=100)
):
    query = supabase.table('events').select('*, categories(name), users(name, avatar_url)')
    
    if category:
        cat = supabase.table('categories').select('id').eq('slug', category).single().execute()
        if cat.data:
            query = query.eq('category_id', cat.data['id'])
    if district:
        query = query.eq('district', district)
    if is_free is not None:
        query = query.eq('is_free', is_free)
    if featured is not None:
        query = query.eq('featured', featured)
    if organizer_id:
        query = query.eq('organizer_id', organizer_id)
    if search:
        query = query.ilike('title', f'%{search}%')
    
    result = query.order('date').limit(limit).execute()
    
    events = []
    for e in result.data:
        events.append(EventResponse(
            id=e['id'], title=e['title'], description=e['description'],
            image_url=e.get('image_url'), category_id=e['category_id'],
            category_name=e['categories']['name'] if e.get('categories') else None,
            date=str(e['date']), time=e['time'], location=e['location'],
            district=e['district'], organizer_id=e['organizer_id'],
            organizer_name=e['users']['name'] if e.get('users') else None,
            organizer_avatar=e['users'].get('avatar_url') if e.get('users') else None,
            featured=e['featured'], price=float(e['price']),
            external_link=e.get('external_link'), is_free=e['is_free'],
            views=e['views'], saves=e['saves'], created_at=e['created_at']
        ))
    return events

@api_router.get("/events/featured", response_model=List[EventResponse])
def get_featured_events(limit: int = 6):
    return get_events(featured=True, limit=limit)

@api_router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: str):
    result = supabase.table('events').select('*, categories(name), users(name, avatar_url)').eq('id', event_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    # Increment views
    supabase.table('events').update({'views': result.data['views'] + 1}).eq('id', event_id).execute()
    
    e = result.data
    return EventResponse(
        id=e['id'], title=e['title'], description=e['description'],
        image_url=e.get('image_url'), category_id=e['category_id'],
        category_name=e['categories']['name'] if e.get('categories') else None,
        date=str(e['date']), time=e['time'], location=e['location'],
        district=e['district'], organizer_id=e['organizer_id'],
        organizer_name=e['users']['name'] if e.get('users') else None,
        organizer_avatar=e['users'].get('avatar_url') if e.get('users') else None,
        featured=e['featured'], price=float(e['price']),
        external_link=e.get('external_link'), is_free=e['is_free'],
        views=e['views'] + 1, saves=e['saves'], created_at=e['created_at']
    )

@api_router.post("/events", response_model=EventResponse)
def create_event(event_data: EventCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["organizer", "admin"]:
        raise HTTPException(status_code=403, detail="Solo organizadores pueden crear eventos")
    
    # Check plan limits
    if current_user.get("plan", "free") == "free":
        month_start = datetime.now(timezone.utc).replace(day=1).isoformat()
        count = supabase.table('events').select('id', count='exact').eq('organizer_id', current_user["id"]).gte('created_at', month_start).execute()
        if (count.count or 0) >= 2:
            raise HTTPException(status_code=403, detail="Has alcanzado el límite del plan gratuito.")
    
    event_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    event_doc = {
        "id": event_id,
        **event_data.model_dump(),
        "organizer_id": current_user["id"],
        "featured": False,
        "views": 0,
        "saves": 0,
        "created_at": now
    }
    
    supabase.table('events').insert(event_doc).execute()
    
    cat = supabase.table('categories').select('name').eq('id', event_data.category_id).single().execute()
    
    return EventResponse(
        id=event_id, **event_data.model_dump(),
        category_name=cat.data['name'] if cat.data else None,
        organizer_id=current_user["id"],
        organizer_name=current_user["name"],
        organizer_avatar=current_user.get("avatar_url"),
        featured=False, views=0, saves=0, created_at=now
    )

@api_router.delete("/events/{event_id}")
def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    event = supabase.table('events').select('organizer_id').eq('id', event_id).single().execute()
    if not event.data:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    if event.data["organizer_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="No tienes permiso")
    
    supabase.table('favorites').delete().eq('event_id', event_id).execute()
    supabase.table('events').delete().eq('id', event_id).execute()
    return {"success": True}

# ============ ORGANIZERS ============
@api_router.get("/organizers", response_model=List[UserResponse])
def get_organizers(country: Optional[str] = None, limit: int = 20):
    query = supabase.table('users').select('*').eq('role', 'organizer')
    if country:
        query = query.eq('country', country)
    result = query.limit(limit).execute()
    
    organizers = []
    for o in result.data:
        events_count = supabase.table('events').select('id', count='exact').eq('organizer_id', o['id']).execute()
        organizers.append(UserResponse(
            id=o['id'], email=o['email'], name=o['name'], role=o['role'],
            country=o.get('country'), bio=o.get('bio'), avatar_url=o.get('avatar_url'),
            instagram=o.get('instagram'), website=o.get('website'),
            events_count=events_count.count or 0, plan=o.get('plan', 'free'),
            plan_started=o.get('plan_started'), created_at=o['created_at']
        ))
    return organizers

@api_router.get("/organizers/{organizer_id}", response_model=UserResponse)
def get_organizer(organizer_id: str):
    result = supabase.table('users').select('*').eq('id', organizer_id).eq('role', 'organizer').single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Organizador no encontrado")
    o = result.data
    events_count = supabase.table('events').select('id', count='exact').eq('organizer_id', o['id']).execute()
    return UserResponse(
        id=o['id'], email=o['email'], name=o['name'], role=o['role'],
        country=o.get('country'), bio=o.get('bio'), avatar_url=o.get('avatar_url'),
        instagram=o.get('instagram'), website=o.get('website'),
        events_count=events_count.count or 0, plan=o.get('plan', 'free'),
        plan_started=o.get('plan_started'), created_at=o['created_at']
    )

# ============ FAVORITES ============
@api_router.get("/favorites", response_model=List[EventResponse])
def get_favorites(current_user: dict = Depends(get_current_user)):
    favs = supabase.table('favorites').select('event_id').eq('user_id', current_user['id']).execute()
    event_ids = [f['event_id'] for f in favs.data]
    if not event_ids:
        return []
    return get_events(limit=100)  # Simplified - filter by IDs in production

@api_router.post("/favorites/{event_id}")
def add_favorite(event_id: str, current_user: dict = Depends(get_current_user)):
    try:
        supabase.table('favorites').insert({
            'id': str(uuid.uuid4()),
            'user_id': current_user['id'],
            'event_id': event_id
        }).execute()
        supabase.rpc('increment_saves', {'event_id': event_id}).execute()
        return {"success": True}
    except:
        raise HTTPException(status_code=400, detail="Ya guardaste este evento")

@api_router.delete("/favorites/{event_id}")
def remove_favorite(event_id: str, current_user: dict = Depends(get_current_user)):
    supabase.table('favorites').delete().eq('user_id', current_user['id']).eq('event_id', event_id).execute()
    return {"success": True}

@api_router.get("/favorites/check/{event_id}")
def check_favorite(event_id: str, current_user: dict = Depends(get_current_user)):
    result = supabase.table('favorites').select('id').eq('user_id', current_user['id']).eq('event_id', event_id).execute()
    return {"is_favorite": len(result.data) > 0}

# ============ STATS ============
@api_router.get("/stats/organizer", response_model=StatsResponse)
def get_organizer_stats(current_user: dict = Depends(get_current_user)):
    events = supabase.table('events').select('views, saves, created_at').eq('organizer_id', current_user['id']).execute()
    
    total_views = sum(e['views'] for e in events.data)
    total_saves = sum(e['saves'] for e in events.data)
    
    month_start = datetime.now(timezone.utc).replace(day=1).isoformat()
    events_this_month = len([e for e in events.data if e['created_at'] >= month_start])
    
    return StatsResponse(
        total_events=len(events.data),
        total_views=total_views,
        total_saves=total_saves,
        events_this_month=events_this_month
    )

# ============ PLAN ============
@api_router.post("/plan/upgrade")
def upgrade_plan(current_user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    supabase.table('users').update({'plan': 'pro', 'plan_started': now}).eq('id', current_user['id']).execute()
    return {"success": True, "message": "Plan Pro activado", "plan": "pro"}

@api_router.post("/plan/cancel")
def cancel_plan(current_user: dict = Depends(get_current_user)):
    supabase.table('users').update({'plan': 'free', 'plan_started': None}).eq('id', current_user['id']).execute()
    return {"success": True, "message": "Plan cancelado", "plan": "free"}

# ============ CONTACT ============
@api_router.post("/contact")
def send_contact(message: ContactMessage):
    supabase.table('contact_messages').insert({
        'id': str(uuid.uuid4()),
        **message.model_dump()
    }).execute()
    return {"success": True}

# ============ DISTRICTS ============
@api_router.get("/districts")
def get_districts():
    return [
        {"id": "centro", "name": "Centro"},
        {"id": "latina", "name": "Latina"},
        {"id": "lavapies", "name": "Lavapiés"},
        {"id": "usera", "name": "Usera"},
        {"id": "chamberi", "name": "Chamberí"},
        {"id": "malasana", "name": "Malasaña"},
    ]

@api_router.get("/")
def root():
    return {"message": "Frecuencia Cultura API", "version": "1.0.0"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
