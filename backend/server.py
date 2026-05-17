"""Garment Foundry — FastAPI backend with admin CMS, email campaigns, and lead capture."""

from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Response, Depends, Cookie, Request, BackgroundTasks, Header
from fastapi.responses import StreamingResponse, JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from bson import ObjectId
import os
import io
import asyncio
import logging
import secrets
import uuid
import jwt
import bcrypt
import csv
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from email.utils import formataddr

import sendgrid
from sendgrid.helpers.mail import Mail
import bleach

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---------- Config ----------
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALGO = 'HS256'
JWT_TTL_HOURS = 24

ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '').strip()
SEND_FROM_EMAIL = os.environ.get('SEND_FROM_EMAIL', 'noreply@example.com')
SEND_FROM_NAME = 'Garment Foundry'
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Storage (object storage kept for legacy uploads; new uploads use GridFS)
import requests
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get('EMERGENT_LLM_KEY')
APP_NAME = os.environ.get('APP_NAME', 'garment-foundry')
_storage_key: Optional[str] = None

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('gf')

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
gridfs = AsyncIOMotorGridFSBucket(db, bucket_name='uploads')

app = FastAPI(title='Garment Foundry API')
api_router = APIRouter(prefix='/api')
admin_router = APIRouter(prefix='/api/admin')


# ---------- Helpers ----------
def now() -> datetime:
    return datetime.now(timezone.utc)


def iso(d: datetime) -> str:
    return d.isoformat()


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_jwt(payload: dict) -> str:
    body = {**payload, 'iat': now(), 'exp': now() + timedelta(hours=JWT_TTL_HOURS)}
    return jwt.encode(body, JWT_SECRET, algorithm=JWT_ALGO)


def decode_jwt(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        return None


async def require_admin(gf_admin: Optional[str] = Cookie(None), authorization: Optional[str] = Header(None)) -> dict:
    token = gf_admin
    if not token and authorization and authorization.lower().startswith('bearer '):
        token = authorization.split(' ', 1)[1]
    if not token:
        raise HTTPException(status_code=401, detail='Authentication required')
    data = decode_jwt(token)
    if not data:
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    return data


def slugify(s: str) -> str:
    import re
    s = (s or '').lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')[:80]


# ---------- HTML sanitisation (stored-XSS hardening) ----------
ALLOWED_TAGS = [
    'p', 'br', 'hr', 'div', 'span',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'small', 'mark',
    'a', 'img',
    'ul', 'ol', 'li',
    'blockquote', 'q', 'cite',
    'code', 'pre', 'kbd', 'samp',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption',
    'figure', 'figcaption',
]
ALLOWED_ATTRS = {
    '*': ['class', 'style'],
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'td': ['colspan', 'rowspan', 'align'],
    'th': ['colspan', 'rowspan', 'align', 'scope'],
}
ALLOWED_PROTOCOLS = ['http', 'https', 'mailto', 'tel']


def sanitize_html(value: Optional[str]) -> str:
    """Strip dangerous tags/attrs/protocols while preserving marketing-safe markup and {{merge_tags}}."""
    if not value:
        return ''
    cleaned = bleach.clean(
        value,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
        strip_comments=True,
    )
    return cleaned


def sanitize_fields(d: dict, fields: List[str]) -> dict:
    for f in fields:
        if f in d and isinstance(d[f], str):
            d[f] = sanitize_html(d[f])
    return d


# ---------- Email ----------
def render_template(tpl: str, vars_: dict) -> str:
    out = tpl or ''
    for k, v in vars_.items():
        out = out.replace('{{' + k + '}}', str(v if v is not None else ''))
    return out


def _send_via_sendgrid_sync(to_email: str, subject: str, html: str) -> bool:
    if not SENDGRID_API_KEY:
        logger.info(f"[email queued — no SENDGRID_API_KEY] to={to_email} subject={subject}")
        return False
    try:
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        msg = Mail(
            from_email=(SEND_FROM_EMAIL, SEND_FROM_NAME),
            to_emails=to_email,
            subject=subject,
            html_content=html,
        )
        resp = sg.send(msg)
        ok = 200 <= resp.status_code < 300
        logger.info(f"sendgrid -> {to_email} status={resp.status_code}")
        return ok
    except Exception as e:
        logger.error(f"sendgrid send failed: {e}")
        return False


async def send_email_async(to_email: str, subject: str, html: str) -> bool:
    return await asyncio.to_thread(_send_via_sendgrid_sync, to_email, subject, html)


# ---------- Object storage helpers (kept for legacy uploads) ----------
def init_storage() -> Optional[str]:
    global _storage_key
    if _storage_key:
        return _storage_key
    if not EMERGENT_KEY:
        return None
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        _storage_key = resp.json()['storage_key']
        return _storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class BlogPostIn(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = ''
    body: str
    cover_image: Optional[str] = ''
    category: Optional[str] = ''
    tags: List[str] = []
    status: str = 'draft'  # draft|published


class CaseStudyIn(BaseModel):
    title: str
    client_name: str
    anonymise_client: bool = False
    industry: str
    challenge: str = ''
    solution: str = ''
    result: str = ''
    cover_image: Optional[str] = ''
    status: str = 'draft'


class FAQIn(BaseModel):
    question: str
    answer: str
    display_order: int = 0
    active: bool = True


class QuoteIn(BaseModel):
    business_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = ''
    website_instagram: Optional[str] = ''
    country: Optional[str] = ''
    garment_types: List[str] = []
    quantity: Optional[str] = ''
    fabric_preference: Optional[str] = ''
    branding: List[str] = []
    packaging: Optional[str] = ''
    delivery_country: Optional[str] = ''
    timeline: Optional[str] = ''
    uploaded_files: List[Dict[str, Any]] = []
    additional_notes: Optional[str] = ''


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ''
    message: str


class SubscribeIn(BaseModel):
    email: EmailStr
    name: Optional[str] = ''


class CampaignIn(BaseModel):
    name: str
    subject: str
    preview_text: Optional[str] = ''
    body: str
    recipient_group: str = 'active_only'  # all|active_only
    scheduled_at: Optional[str] = None  # ISO


class CampaignAction(BaseModel):
    action: str  # send_now|schedule|save_draft


class SettingsIn(BaseModel):
    data: Dict[str, Any]


class StatusUpdate(BaseModel):
    status: str
    note: Optional[str] = ''


# ---------- Quote reference generator ----------
async def next_quote_reference() -> str:
    year = now().year
    res = await db.counters.find_one_and_update(
        {'_id': f'quote_ref_{year}'},
        {'$inc': {'seq': 1}},
        upsert=True,
        return_document=True,
    )
    seq = res['seq'] if res else 1
    return f'GF-{year}-{seq:04d}'


# =========================================================
#                     PUBLIC ENDPOINTS
# =========================================================
@api_router.get('/')
async def root():
    return {'message': 'Garment Foundry API'}


# ---- Settings ----
@api_router.get('/settings')
async def get_public_settings():
    doc = await db.site_settings.find_one({'_id': 'main'}, {'_id': 0}) or {}
    return doc


# ---- Blog (public) ----
@api_router.get('/blog')
async def list_blog_public():
    items = await db.blog_posts.find({'status': 'published'}, {'_id': 0, 'body': 0}).sort('published_at', -1).to_list(200)
    return items


@api_router.get('/blog/{slug}')
async def get_blog_public(slug: str):
    item = await db.blog_posts.find_one({'slug': slug, 'status': 'published'}, {'_id': 0})
    if not item:
        raise HTTPException(404, 'Post not found')
    return item


# ---- Case Studies (public) ----
@api_router.get('/case-studies')
async def list_case_studies_public():
    items = await db.case_studies.find({'status': 'published'}, {'_id': 0}).sort('created_at', -1).to_list(200)
    for it in items:
        if it.get('anonymise_client'):
            it['client_name'] = 'Leading UK Brand'
    return items


@api_router.get('/case-studies/{cs_id}')
async def get_case_study_public(cs_id: str):
    item = await db.case_studies.find_one({'id': cs_id, 'status': 'published'}, {'_id': 0})
    if not item:
        raise HTTPException(404, 'Not found')
    if item.get('anonymise_client'):
        item['client_name'] = 'Leading UK Brand'
    return item


# ---- FAQs (public) ----
@api_router.get('/faqs')
async def list_faqs_public():
    items = await db.faqs.find({'active': True}, {'_id': 0}).sort('display_order', 1).to_list(200)
    return items


# ---- Quote upload (GridFS) ----
ALLOWED_EXT = {'pdf', 'ai', 'psd', 'png', 'jpg', 'jpeg', 'webp', 'zip', 'doc', 'docx'}


@api_router.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(413, 'File exceeds 10MB limit')
    ext = (file.filename.split('.')[-1] if '.' in (file.filename or '') else 'bin').lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f'.{ext} file type is not allowed')
    file_id = str(uuid.uuid4())
    storage_id = await gridfs.upload_from_stream(
        f'{file_id}.{ext}',
        io.BytesIO(data),
        metadata={
            'id': file_id,
            'original_filename': file.filename,
            'content_type': file.content_type or 'application/octet-stream',
            'size': len(data),
            'created_at': iso(now()),
        },
    )
    return {
        'id': file_id,
        'storage_path': str(storage_id),
        'original_filename': file.filename,
        'content_type': file.content_type or 'application/octet-stream',
        'size': len(data),
    }


@api_router.get('/files/{file_id}')
async def download_file(file_id: str):
    cursor = gridfs.find({'metadata.id': file_id})
    docs = await cursor.to_list(1)
    if not docs:
        raise HTTPException(404, 'File not found')
    g = docs[0]
    stream = await gridfs.open_download_stream(g['_id'])
    data = await stream.read()
    return Response(content=data, media_type=g.get('metadata', {}).get('content_type', 'application/octet-stream'))


# ---- Quote create ----
@api_router.post('/quote')
async def create_quote(payload: QuoteIn, background: BackgroundTasks):
    ref = await next_quote_reference()
    record = {
        'id': str(uuid.uuid4()),
        'reference': ref,
        **payload.model_dump(),
        'status': 'new',
        'notes_log': [],
        'created_at': iso(now()),
        'updated_at': iso(now()),
    }
    await db.quote_requests.insert_one(record)

    # Emails
    settings = await db.site_settings.find_one({'_id': 'main'}) or {}
    confirm_subj = settings.get('quote_confirmation_subject') or "We've received your enquiry — Garment Foundry"
    confirm_body = settings.get('quote_confirmation_body') or default_quote_html()
    admin_body_tpl = settings.get('admin_notification_body') or default_admin_html()

    confirm_html = render_template(confirm_body, {
        'name': payload.contact_name,
        'reference': ref,
        'garment_type': ', '.join(payload.garment_types) if payload.garment_types else '',
    })
    admin_html = render_template(admin_body_tpl, {
        'reference': ref, 'business': payload.business_name, 'name': payload.contact_name,
        'email': payload.email, 'phone': payload.phone or '—',
        'garment': ', '.join(payload.garment_types) if payload.garment_types else '—',
        'quantity': payload.quantity or '—',
        'fabric': payload.fabric_preference or '—',
        'branding': ', '.join(payload.branding) if payload.branding else '—',
        'packaging': payload.packaging or '—',
        'delivery': payload.delivery_country or '—',
        'timeline': payload.timeline or '—',
        'notes': payload.additional_notes or '—',
        'files_count': len(payload.uploaded_files),
    })

    background.add_task(_safe_send, payload.email, confirm_subj, confirm_html)
    background.add_task(_safe_send, ADMIN_EMAIL, f"New Quote Request — {ref}", admin_html)
    return {'reference': ref, 'id': record['id']}


async def _safe_send(to_email: str, subject: str, html: str):
    try:
        await send_email_async(to_email, subject, html)
    except Exception as e:
        logger.error(f"email send error to {to_email}: {e}")


def default_quote_html() -> str:
    return """
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;color:#0a0a0a;">
      <h2 style="letter-spacing:2px;border-bottom:1px solid #333;padding-bottom:8px;">GARMENT FOUNDRY</h2>
      <p>Dear {{name}},</p>
      <p>Thank you for your enquiry. We have received your request and will respond within one business day with an indicative proposal.</p>
      <p><strong>Reference:</strong> {{reference}}</p>
      <p><strong>Project:</strong> {{garment_type}}</p>
      <p style="margin-top:32px;color:#555;">Crafted with purpose. Delivered with precision.<br/>— Garment Foundry, Manchester</p>
    </div>
    """


def default_admin_html() -> str:
    return """
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111;">
      <h2 style="font-family:Georgia,serif;border-bottom:1px solid #333;padding-bottom:8px;">New Quote — {{reference}}</h2>
      <p><strong>Business:</strong> {{business}}<br/>
         <strong>Contact:</strong> {{name}} — {{email}} {{phone}}</p>
      <ul>
        <li><strong>Garment:</strong> {{garment}}</li>
        <li><strong>Quantity:</strong> {{quantity}}</li>
        <li><strong>Fabric:</strong> {{fabric}}</li>
        <li><strong>Branding:</strong> {{branding}}</li>
        <li><strong>Packaging:</strong> {{packaging}}</li>
        <li><strong>Delivery:</strong> {{delivery}}</li>
        <li><strong>Timeline:</strong> {{timeline}}</li>
        <li><strong>Files:</strong> {{files_count}}</li>
      </ul>
      <p><strong>Notes:</strong> {{notes}}</p>
    </div>
    """


# ---- Contact create ----
@api_router.post('/contact')
async def create_contact(payload: ContactIn, background: BackgroundTasks):
    rec = {
        'id': str(uuid.uuid4()),
        **payload.model_dump(),
        'read': False,
        'created_at': iso(now()),
    }
    await db.contact_submissions.insert_one(rec)
    html = f"""<div style="font-family:Arial,sans-serif;color:#111;"><h3>New Contact Enquiry</h3>
    <p><strong>{rec['name']}</strong> ({rec['email']}) — {rec.get('company') or '—'}</p>
    <p>{rec['message']}</p></div>"""
    background.add_task(_safe_send, ADMIN_EMAIL, f"New Contact — {rec['name']}", html)
    return {'id': rec['id'], 'status': 'received'}


# ---- Subscribe ----
@api_router.post('/subscribe')
async def subscribe(payload: SubscribeIn):
    existing = await db.subscribers.find_one({'email': payload.email.lower()})
    if existing:
        return {'status': 'success'}  # silent duplicate
    token = secrets.token_urlsafe(24)
    rec = {
        'id': str(uuid.uuid4()),
        'name': payload.name or '',
        'email': payload.email.lower(),
        'status': 'active',
        'source': 'footer_form',
        'unsubscribe_token': token,
        'created_at': iso(now()),
    }
    await db.subscribers.insert_one(rec)
    return {'status': 'success'}


@api_router.get('/unsubscribe')
async def unsubscribe(token: str):
    sub = await db.subscribers.find_one({'unsubscribe_token': token})
    if not sub:
        return JSONResponse({'ok': False, 'message': 'Invalid unsubscribe link.'}, status_code=400)
    await db.subscribers.update_one({'_id': sub['_id']}, {'$set': {'status': 'unsubscribed'}})
    return JSONResponse({'ok': True, 'message': 'You have been unsubscribed.'})


# =========================================================
#                     ADMIN ENDPOINTS
# =========================================================
@api_router.post('/admin/login')
async def admin_login(payload: LoginIn, response: Response):
    if payload.email.lower() != ADMIN_EMAIL.lower() or payload.password != ADMIN_PASSWORD:
        raise HTTPException(401, 'Invalid credentials')
    token = create_jwt({'email': payload.email.lower(), 'role': 'admin'})
    response.set_cookie('gf_admin', token, httponly=True, secure=True, samesite='none', max_age=JWT_TTL_HOURS * 3600, path='/')
    return {'ok': True, 'token': token}


@api_router.post('/admin/logout')
async def admin_logout(response: Response, _: dict = Depends(require_admin)):
    response.delete_cookie('gf_admin', path='/')
    return {'ok': True}


@api_router.get('/admin/me')
async def admin_me(claims: dict = Depends(require_admin)):
    return {'email': claims.get('email'), 'role': claims.get('role')}


# ---- Dashboard ----
@admin_router.get('/dashboard')
async def admin_dashboard(_: dict = Depends(require_admin)):
    week_ago = iso(now() - timedelta(days=7))
    month_ago = iso(now() - timedelta(days=30))
    quotes_week = await db.quote_requests.count_documents({'created_at': {'$gte': week_ago}})
    unread_contacts = await db.contact_submissions.count_documents({'read': False})
    active_subs = await db.subscribers.count_documents({'status': 'active'})
    new_subs_month = await db.subscribers.count_documents({'created_at': {'$gte': month_ago}})
    last_campaign = await db.email_campaigns.find_one({'status': 'sent'}, {'_id': 0}, sort=[('sent_at', -1)])
    recent_quotes = await db.quote_requests.find({}, {'_id': 0}).sort('created_at', -1).to_list(5)
    recent_subs = await db.subscribers.find({}, {'_id': 0, 'unsubscribe_token': 0}).sort('created_at', -1).to_list(5)
    return {
        'quotes_week': quotes_week,
        'unread_contacts': unread_contacts,
        'active_subscribers': active_subs,
        'new_subscribers_month': new_subs_month,
        'last_campaign': last_campaign,
        'recent_quotes': recent_quotes,
        'recent_subscribers': recent_subs,
        'sendgrid_configured': bool(SENDGRID_API_KEY),
    }


# ---- Blog admin ----
@admin_router.get('/blog')
async def admin_list_blog(_: dict = Depends(require_admin)):
    return await db.blog_posts.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)


@admin_router.post('/blog')
async def admin_create_blog(payload: BlogPostIn, _: dict = Depends(require_admin)):
    slug = payload.slug or slugify(payload.title)
    while await db.blog_posts.find_one({'slug': slug}):
        slug = f"{slug}-{secrets.token_hex(2)}"
    data = sanitize_fields(payload.model_dump(exclude={'slug'}), ['body', 'excerpt'])
    rec = {
        'id': str(uuid.uuid4()), 'slug': slug, **data,
        'created_at': iso(now()), 'updated_at': iso(now()),
        'published_at': iso(now()) if payload.status == 'published' else None,
    }
    await db.blog_posts.insert_one(rec)
    rec.pop('_id', None)
    return rec


@admin_router.put('/blog/{post_id}')
async def admin_update_blog(post_id: str, payload: BlogPostIn, _: dict = Depends(require_admin)):
    existing = await db.blog_posts.find_one({'id': post_id})
    if not existing:
        raise HTTPException(404, 'Not found')
    update = sanitize_fields(payload.model_dump(), ['body', 'excerpt'])
    if payload.slug:
        update['slug'] = payload.slug
    update['updated_at'] = iso(now())
    if payload.status == 'published' and not existing.get('published_at'):
        update['published_at'] = iso(now())
    await db.blog_posts.update_one({'id': post_id}, {'$set': update})
    return {'ok': True}


@admin_router.delete('/blog/{post_id}')
async def admin_delete_blog(post_id: str, _: dict = Depends(require_admin)):
    await db.blog_posts.delete_one({'id': post_id})
    return {'ok': True}


# ---- Case Study admin ----
@admin_router.get('/case-studies')
async def admin_list_cs(_: dict = Depends(require_admin)):
    return await db.case_studies.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)


@admin_router.post('/case-studies')
async def admin_create_cs(payload: CaseStudyIn, _: dict = Depends(require_admin)):
    data = sanitize_fields(payload.model_dump(), ['challenge', 'solution', 'result'])
    rec = {'id': str(uuid.uuid4()), **data,
           'created_at': iso(now()), 'updated_at': iso(now())}
    await db.case_studies.insert_one(rec)
    rec.pop('_id', None)
    return rec


@admin_router.put('/case-studies/{cs_id}')
async def admin_update_cs(cs_id: str, payload: CaseStudyIn, _: dict = Depends(require_admin)):
    if not await db.case_studies.find_one({'id': cs_id}):
        raise HTTPException(404, 'Not found')
    data = sanitize_fields(payload.model_dump(), ['challenge', 'solution', 'result'])
    await db.case_studies.update_one({'id': cs_id}, {'$set': {**data, 'updated_at': iso(now())}})
    return {'ok': True}


@admin_router.delete('/case-studies/{cs_id}')
async def admin_delete_cs(cs_id: str, _: dict = Depends(require_admin)):
    await db.case_studies.delete_one({'id': cs_id})
    return {'ok': True}


# ---- Quote admin ----
@admin_router.get('/quotes')
async def admin_list_quotes(_: dict = Depends(require_admin)):
    return await db.quote_requests.find({}, {'_id': 0}).sort('created_at', -1).to_list(1000)


@admin_router.get('/quotes/{ref}')
async def admin_get_quote(ref: str, _: dict = Depends(require_admin)):
    q = await db.quote_requests.find_one({'reference': ref}, {'_id': 0})
    if not q:
        raise HTTPException(404, 'Not found')
    return q


@admin_router.patch('/quotes/{ref}')
async def admin_update_quote(ref: str, payload: StatusUpdate, _: dict = Depends(require_admin)):
    upd: dict = {}
    if payload.status:
        upd['status'] = payload.status
    upd['updated_at'] = iso(now())
    pushed = None
    if payload.note:
        pushed = {'at': iso(now()), 'text': payload.note}
    update_op: dict = {'$set': upd}
    if pushed:
        update_op['$push'] = {'notes_log': pushed}
    r = await db.quote_requests.update_one({'reference': ref}, update_op)
    if not r.matched_count:
        raise HTTPException(404, 'Not found')
    return {'ok': True}


# ---- Contact admin ----
@admin_router.get('/contacts')
async def admin_list_contacts(_: dict = Depends(require_admin)):
    return await db.contact_submissions.find({}, {'_id': 0}).sort('created_at', -1).to_list(1000)


@admin_router.patch('/contacts/{cid}/read')
async def admin_mark_read(cid: str, _: dict = Depends(require_admin)):
    await db.contact_submissions.update_one({'id': cid}, {'$set': {'read': True}})
    return {'ok': True}


@admin_router.delete('/contacts/{cid}')
async def admin_delete_contact(cid: str, _: dict = Depends(require_admin)):
    await db.contact_submissions.delete_one({'id': cid})
    return {'ok': True}


# ---- FAQ admin ----
@admin_router.get('/faqs')
async def admin_list_faqs(_: dict = Depends(require_admin)):
    return await db.faqs.find({}, {'_id': 0}).sort('display_order', 1).to_list(500)


@admin_router.post('/faqs')
async def admin_create_faq(payload: FAQIn, _: dict = Depends(require_admin)):
    data = sanitize_fields(payload.model_dump(), ['answer'])
    rec = {'id': str(uuid.uuid4()), **data,
           'created_at': iso(now()), 'updated_at': iso(now())}
    await db.faqs.insert_one(rec)
    rec.pop('_id', None)
    return rec


@admin_router.put('/faqs/{fid}')
async def admin_update_faq(fid: str, payload: FAQIn, _: dict = Depends(require_admin)):
    data = sanitize_fields(payload.model_dump(), ['answer'])
    await db.faqs.update_one({'id': fid}, {'$set': {**data, 'updated_at': iso(now())}})
    return {'ok': True}


@admin_router.delete('/faqs/{fid}')
async def admin_delete_faq(fid: str, _: dict = Depends(require_admin)):
    await db.faqs.delete_one({'id': fid})
    return {'ok': True}


@admin_router.post('/faqs/reorder')
async def admin_reorder_faqs(order: List[str], _: dict = Depends(require_admin)):
    for i, fid in enumerate(order):
        await db.faqs.update_one({'id': fid}, {'$set': {'display_order': i}})
    return {'ok': True}


# ---- Subscribers admin ----
@admin_router.get('/subscribers')
async def admin_list_subs(_: dict = Depends(require_admin)):
    return await db.subscribers.find({}, {'_id': 0, 'unsubscribe_token': 0}).sort('created_at', -1).to_list(5000)


@admin_router.delete('/subscribers/{sid}')
async def admin_unsub(sid: str, _: dict = Depends(require_admin)):
    await db.subscribers.update_one({'id': sid}, {'$set': {'status': 'unsubscribed'}})
    return {'ok': True}


@admin_router.get('/subscribers/export.csv')
async def admin_export_subs(_: dict = Depends(require_admin)):
    items = await db.subscribers.find({'status': 'active'}, {'_id': 0, 'unsubscribe_token': 0}).to_list(10000)
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(['name', 'email', 'status', 'source', 'created_at'])
    for it in items:
        w.writerow([it.get('name', ''), it.get('email', ''), it.get('status', ''), it.get('source', ''), it.get('created_at', '')])
    return Response(content=buf.getvalue(), media_type='text/csv',
                    headers={'Content-Disposition': 'attachment; filename=subscribers.csv'})


# ---- Campaign admin ----
@admin_router.get('/campaigns')
async def admin_list_campaigns(_: dict = Depends(require_admin)):
    return await db.email_campaigns.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)


@admin_router.get('/campaigns/{cid}')
async def admin_get_campaign(cid: str, _: dict = Depends(require_admin)):
    c = await db.email_campaigns.find_one({'id': cid}, {'_id': 0})
    if not c:
        raise HTTPException(404, 'Not found')
    return c


@admin_router.post('/campaigns')
async def admin_create_campaign(payload: CampaignIn, _: dict = Depends(require_admin)):
    data = sanitize_fields(payload.model_dump(), ['body'])
    rec = {'id': str(uuid.uuid4()), **data,
           'status': 'draft', 'opens_count': 0, 'clicks_count': 0, 'recipients_count': 0,
           'sent_at': None,
           'created_at': iso(now()), 'updated_at': iso(now())}
    await db.email_campaigns.insert_one(rec)
    rec.pop('_id', None)
    return rec


@admin_router.put('/campaigns/{cid}')
async def admin_update_campaign(cid: str, payload: CampaignIn, _: dict = Depends(require_admin)):
    data = sanitize_fields(payload.model_dump(), ['body'])
    await db.email_campaigns.update_one({'id': cid}, {'$set': {**data, 'updated_at': iso(now())}})
    return {'ok': True}


@admin_router.delete('/campaigns/{cid}')
async def admin_delete_campaign(cid: str, _: dict = Depends(require_admin)):
    await db.email_campaigns.delete_one({'id': cid})
    return {'ok': True}


@admin_router.post('/campaigns/{cid}/duplicate')
async def admin_duplicate_campaign(cid: str, _: dict = Depends(require_admin)):
    c = await db.email_campaigns.find_one({'id': cid}, {'_id': 0})
    if not c:
        raise HTTPException(404, 'Not found')
    c['id'] = str(uuid.uuid4())
    c['name'] = f"{c.get('name', 'Untitled')} (copy)"
    c['status'] = 'draft'
    c['sent_at'] = None
    c['recipients_count'] = 0
    c['opens_count'] = 0
    c['clicks_count'] = 0
    c['created_at'] = iso(now())
    c['updated_at'] = iso(now())
    await db.email_campaigns.insert_one(c)
    c.pop('_id', None)
    return c


async def _send_campaign(cid: str):
    c = await db.email_campaigns.find_one({'id': cid})
    if not c:
        return
    q = {'status': 'active'} if c.get('recipient_group') == 'active_only' else {}
    subs = await db.subscribers.find(q).to_list(50000)
    if not SENDGRID_API_KEY:
        await db.email_campaigns.update_one({'id': cid}, {'$set': {'status': 'queued', 'recipients_count': len(subs)}})
        logger.warning(f"Campaign {cid} queued — SENDGRID_API_KEY not configured")
        return
    await db.email_campaigns.update_one({'id': cid}, {'$set': {'status': 'sending'}})
    sent = 0
    for s in subs:
        unsubscribe_url = f"{FRONTEND_URL}/unsubscribe?token={s.get('unsubscribe_token', '')}"
        first_name = (s.get('name') or s.get('email').split('@')[0]).split(' ')[0]
        html = render_template(c['body'], {'first_name': first_name, 'unsubscribe_url': unsubscribe_url})
        html += f"""<div style="margin-top:32px;font-size:11px;color:#777;font-family:Arial,sans-serif;text-align:center;">
        You are receiving this because you subscribed to Garment Foundry updates.
        <a href="{unsubscribe_url}" style="color:#777;">Unsubscribe</a></div>"""
        ok = await send_email_async(s['email'], c['subject'], html)
        if ok:
            sent += 1
    await db.email_campaigns.update_one({'id': cid}, {'$set': {
        'status': 'sent', 'sent_at': iso(now()), 'recipients_count': sent
    }})


@admin_router.post('/campaigns/{cid}/send')
async def admin_send_campaign(cid: str, background: BackgroundTasks, _: dict = Depends(require_admin)):
    c = await db.email_campaigns.find_one({'id': cid})
    if not c:
        raise HTTPException(404, 'Not found')
    background.add_task(_send_campaign, cid)
    return {'ok': True, 'sendgrid_configured': bool(SENDGRID_API_KEY)}


# ---- Settings admin ----
@admin_router.get('/settings')
async def admin_get_settings(_: dict = Depends(require_admin)):
    return await db.site_settings.find_one({'_id': 'main'}, {'_id': 0}) or {}


@admin_router.put('/settings')
async def admin_update_settings(payload: SettingsIn, _: dict = Depends(require_admin)):
    data = dict(payload.data)
    sanitize_fields(data, ['quote_confirmation_body', 'admin_notification_body', 'hero_subheading'])
    await db.site_settings.update_one({'_id': 'main'}, {'$set': {**data, 'updated_at': iso(now())}}, upsert=True)
    return {'ok': True}


# ---- Schedule cron (lightweight) ----
async def _scheduler_loop():
    while True:
        try:
            cur = iso(now())
            campaigns = await db.email_campaigns.find({'status': 'scheduled', 'scheduled_at': {'$lte': cur}}).to_list(50)
            for c in campaigns:
                asyncio.create_task(_send_campaign(c['id']))
        except Exception as e:
            logger.error(f"scheduler error: {e}")
        await asyncio.sleep(300)


# =========================================================
#                     SEED & STARTUP
# =========================================================
SEED_FAQS = [
    {'question': 'What is the minimum order quantity?', 'answer': 'MOQs typically begin at 100 pieces per style per colour for cut and sew. Some product categories such as printed t-shirts can start lower.', 'display_order': 0},
    {'question': 'How long does a typical project take?', 'answer': 'Sampling generally takes 3–4 weeks. Bulk production lead times range from 6 to 12 weeks depending on quantity, fabric availability and finishing.', 'display_order': 1},
    {'question': 'Do you ship to the United States?', 'answer': 'Yes. We ship DDP (Delivered Duty Paid) to the United Kingdom, the United States and globally.', 'display_order': 2},
    {'question': 'Can you work from sketches or do I need a tech pack?', 'answer': 'Both. Our design team can translate sketches, mood boards or reference images into manufacturing-ready tech packs.', 'display_order': 3},
    {'question': 'Do you support sustainable and ethical sourcing?', 'answer': 'Yes. We work with audited mills offering GOTS, OEKO-TEX, BCI and recycled materials.', 'display_order': 4},
    {'question': 'How are you different from a typical clothing factory?', 'answer': 'Garment Foundry is a sourcing and manufacturing partner, not a single factory. We match each project to the correct production setup.', 'display_order': 5},
    {'question': 'Can I visit the factory?', 'answer': 'Of course. We arrange factory visits and virtual walk-throughs for active clients.', 'display_order': 6},
    {'question': 'How do I begin?', 'answer': 'Submit a quote request with as much detail as you have. A member of our production team will respond within one business day.', 'display_order': 7},
]

DEFAULT_SETTINGS = {
    'contact_email': 'garmentfoundry.uk@gmail.com',
    'contact_phone': '+44 7575 657 531',
    'contact_address': 'Manchester, United Kingdom',
    'hero_headline': 'Crafted with purpose. Delivered with precision.',
    'hero_subheading': 'A United Kingdom apparel manufacturing and sourcing partner for fashion labels, uniform programmes, private-label and wholesale brands.',
    'footer_tagline': 'CRAFTED WITH PURPOSE. DELIVERED WITH PRECISION.',
    'social_instagram': '',
    'social_linkedin': '',
    'social_twitter': '',
    'quote_confirmation_subject': "We've received your enquiry — Garment Foundry",
    'quote_confirmation_body': default_quote_html(),
    'admin_notification_body': default_admin_html(),
}


@app.on_event('startup')
async def startup():
    # Indexes
    try:
        await db.blog_posts.create_index('slug', unique=True)
        await db.blog_posts.create_index([('status', 1), ('published_at', -1)])
        await db.case_studies.create_index([('status', 1), ('created_at', -1)])
        await db.quote_requests.create_index('reference', unique=True)
        await db.quote_requests.create_index([('status', 1), ('created_at', -1)])
        await db.contact_submissions.create_index([('read', 1), ('created_at', -1)])
        await db.faqs.create_index([('active', 1), ('display_order', 1)])
        await db.subscribers.create_index('email', unique=True)
        await db.email_campaigns.create_index([('status', 1), ('scheduled_at', 1)])
    except Exception as e:
        logger.warning(f"index creation: {e}")

    # Seed defaults
    if await db.faqs.count_documents({}) == 0:
        for f in SEED_FAQS:
            await db.faqs.insert_one({'id': str(uuid.uuid4()), **f, 'active': True,
                                      'created_at': iso(now()), 'updated_at': iso(now())})
        logger.info('FAQs seeded')

    if not await db.site_settings.find_one({'_id': 'main'}):
        await db.site_settings.insert_one({'_id': 'main', **DEFAULT_SETTINGS, 'updated_at': iso(now())})
        logger.info('Site settings seeded')

    asyncio.create_task(_scheduler_loop())


@app.on_event('shutdown')
async def shutdown():
    client.close()


# Routers + CORS
app.include_router(api_router)
app.include_router(admin_router)

cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '*').split(',') if o.strip()]
if FRONTEND_URL and FRONTEND_URL not in cors_origins and '*' not in cors_origins:
    cors_origins.append(FRONTEND_URL)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=['*'],
    allow_headers=['*'],
)
