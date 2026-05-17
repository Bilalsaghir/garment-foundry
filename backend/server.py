from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Response, Query, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import uuid
import requests
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Storage
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = os.environ.get("APP_NAME", "garment-foundry")
storage_key: Optional[str] = None

# Email
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "garmentfoundry.uk@gmail.com")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="Garment Foundry API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def init_storage() -> Optional[str]:
    global storage_key
    if storage_key:
        return storage_key
    if not EMERGENT_KEY:
        logger.warning("EMERGENT_LLM_KEY not set; storage disabled")
        return None
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=503, detail="Storage not available")
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(status_code=503, detail="Storage not available")
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------- Models ----------
class UploadedFile(BaseModel):
    id: str
    storage_path: str
    original_filename: str
    content_type: str
    size: int


class QuoteCreate(BaseModel):
    # Business
    company_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = ""
    website: Optional[str] = ""
    country: Optional[str] = ""
    # Project
    garment_type: str
    garment_subcategory: Optional[str] = ""
    quantity: str
    fabric_preference: Optional[str] = ""
    branding: List[str] = []
    packaging: Optional[str] = ""
    delivery_country: Optional[str] = ""
    timeline: Optional[str] = ""
    notes: Optional[str] = ""
    files: List[UploadedFile] = []


class Quote(QuoteCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ""
    message: str


class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Email helper ----------
async def send_email_safe(to_email: str, subject: str, html: str) -> bool:
    if not RESEND_API_KEY:
        logger.info(f"[email skipped — no API key] to={to_email} subject={subject}")
        return False
    try:
        params = {"from": SENDER_EMAIL, "to": [to_email], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}: {result.get('id') if isinstance(result, dict) else result}")
        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False


def quote_html_admin(q: Quote) -> str:
    files_html = "".join(
        f"<li>{f.original_filename} ({f.size} bytes)</li>" for f in q.files
    ) or "<li>None</li>"
    branding = ", ".join(q.branding) if q.branding else "None"
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111;">
      <h2 style="font-family:Georgia,serif;border-bottom:1px solid #333;padding-bottom:8px;">New Quote Request — Garment Foundry</h2>
      <p><strong>Ref:</strong> {q.id}<br/><strong>Submitted:</strong> {q.created_at}</p>
      <h3>Business</h3>
      <p>{q.company_name}<br/>{q.contact_name} — {q.email}<br/>{q.phone}<br/>{q.website}<br/>{q.country}</p>
      <h3>Project</h3>
      <ul>
        <li><strong>Garment:</strong> {q.garment_type} {('— ' + q.garment_subcategory) if q.garment_subcategory else ''}</li>
        <li><strong>Quantity:</strong> {q.quantity}</li>
        <li><strong>Fabric:</strong> {q.fabric_preference}</li>
        <li><strong>Branding:</strong> {branding}</li>
        <li><strong>Packaging:</strong> {q.packaging}</li>
        <li><strong>Delivery Country:</strong> {q.delivery_country}</li>
        <li><strong>Timeline:</strong> {q.timeline}</li>
      </ul>
      <h3>Notes</h3>
      <p>{q.notes or '—'}</p>
      <h3>Files</h3>
      <ul>{files_html}</ul>
    </div>
    """


def quote_html_customer(q: Quote) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111;">
      <h2 style="font-family:Georgia,serif;letter-spacing:2px;">GARMENT FOUNDRY</h2>
      <p>Dear {q.contact_name},</p>
      <p>Thank you for your enquiry. We have received your request and our production team is reviewing your specifications.</p>
      <p>A member of our team will respond within <strong>one business day</strong> with an indicative proposal.</p>
      <p><strong>Reference:</strong> {q.id}</p>
      <p style="margin-top:32px;color:#555;">Crafted with purpose. Delivered with precision.<br/>— Garment Foundry, Manchester</p>
    </div>
    """


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Garment Foundry API"}


@api_router.post("/upload", response_model=UploadedFile)
async def upload(file: UploadFile = File(...)):
    # Basic size check (10 MB)
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "bin"
    allowed = {"pdf", "png", "jpg", "jpeg", "webp", "ai", "psd", "zip", "doc", "docx"}
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed")
    file_id = str(uuid.uuid4())
    path = f"{APP_NAME}/quotes/{file_id}.{ext}"
    content_type = file.content_type or "application/octet-stream"
    result = put_object(path, data, content_type)
    rec = {
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.files.insert_one(rec)
    return UploadedFile(**{k: rec[k] for k in ("id", "storage_path", "original_filename", "content_type", "size")})


@api_router.get("/files/{file_id}")
async def download(file_id: str):
    rec = await db.files.find_one({"id": file_id, "is_deleted": False}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=404, detail="File not found")
    data, ct = get_object(rec["storage_path"])
    return Response(content=data, media_type=rec.get("content_type", ct))


@api_router.post("/quotes", response_model=Quote)
async def create_quote(payload: QuoteCreate):
    quote = Quote(**payload.model_dump())
    doc = quote.model_dump()
    await db.quotes.insert_one(doc)
    # Fire-and-forget emails
    asyncio.create_task(send_email_safe(ADMIN_EMAIL, f"New Quote Request — {quote.company_name}", quote_html_admin(quote)))
    asyncio.create_task(send_email_safe(quote.email, "We've received your request — Garment Foundry", quote_html_customer(quote)))
    return quote


@api_router.get("/quotes", response_model=List[Quote])
async def list_quotes():
    items = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Quote(**i) for i in items]


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    c = Contact(**payload.model_dump())
    await db.contacts.insert_one(c.model_dump())
    html = f"""
    <div style="font-family:Arial,sans-serif;color:#111;">
      <h3>New Contact Enquiry</h3>
      <p><strong>{c.name}</strong> ({c.email}) — {c.company or '—'}</p>
      <p>{c.message}</p>
    </div>
    """
    asyncio.create_task(send_email_safe(ADMIN_EMAIL, f"New Contact — {c.name}", html))
    return c


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    try:
        init_storage()
    except Exception as e:
        logger.error(f"Startup storage init error: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
