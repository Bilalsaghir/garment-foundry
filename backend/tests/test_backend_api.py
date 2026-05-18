"""Garment Foundry — full backend API tests (admin CMS + public endpoints)."""
import io
import os
import re
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"

# TODO(launch): keep in sync with backend/.env ADMIN_EMAIL after the new mailbox is provisioned.
ADMIN_EMAIL = "hello@garmentfoundry.com"
ADMIN_PASSWORD = "GFoundry@786"

PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xcf"
    b"\xc0\x00\x00\x00\x03\x00\x01\x9a\x9c\x18\x00\x00\x00\x00IEND\xaeB`\x82"
)

# ----------- Fixtures -----------
@pytest.fixture(scope="module")
def session():
    return requests.Session()


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ======= Health =======
def test_root(session):
    r = session.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    assert "message" in r.json()


# ======= Auth =======
def test_admin_login_success(session):
    r = session.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200
    j = r.json()
    assert j["ok"] is True and isinstance(j["token"], str) and len(j["token"]) > 20


def test_admin_login_wrong_password(session):
    r = session.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=30)
    assert r.status_code == 401


def test_admin_me_unauthorized():
    # fresh session: no cookies, no Authorization header
    r = requests.get(f"{API}/admin/me", timeout=30)
    assert r.status_code == 401


def test_admin_me_with_token(session, auth_headers):
    r = session.get(f"{API}/admin/me", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ======= Dashboard =======
def test_admin_dashboard(session, auth_headers):
    r = session.get(f"{API}/admin/dashboard", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    j = r.json()
    for k in ("quotes_week", "unread_contacts", "active_subscribers", "new_subscribers_month", "sendgrid_configured"):
        assert k in j
    assert j["sendgrid_configured"] is False


# ======= Upload + Files (GridFS) =======
def test_upload_png(session):
    files = {"file": ("test.png", io.BytesIO(PNG_BYTES), "image/png")}
    r = session.post(f"{API}/upload", files=files, timeout=60)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["original_filename"] == "test.png" and d["size"] > 0
    pytest.shared_file_id = d["id"]


def test_upload_reject_exe(session):
    files = {"file": ("malware.exe", io.BytesIO(b"MZ\x00\x00"), "application/octet-stream")}
    r = session.post(f"{API}/upload", files=files, timeout=30)
    assert r.status_code == 400


def test_upload_reject_oversize(session):
    big = b"a" * (10 * 1024 * 1024 + 10)
    files = {"file": ("big.pdf", io.BytesIO(big), "application/pdf")}
    r = session.post(f"{API}/upload", files=files, timeout=120)
    assert r.status_code in (400, 413)


def test_download_file(session):
    fid = getattr(pytest, "shared_file_id", None)
    if not fid:
        pytest.skip("no uploaded file id")
    r = session.get(f"{API}/files/{fid}", timeout=30)
    assert r.status_code == 200
    assert len(r.content) > 0


# ======= Quote =======
def test_create_quote_returns_reference(session):
    payload = {
        "business_name": "TEST_Acme Apparel",
        "contact_name": "TEST Jane",
        "email": "test_jane@example.com",
        "phone": "07000000000",
        "country": "UK",
        "garment_types": ["T-Shirts"],
        "quantity": "100-300",
        "fabric_preference": "Cotton",
        "branding": ["Embroidery"],
        "packaging": "Polybag",
        "delivery_country": "UK",
        "timeline": "8-12 weeks",
        "additional_notes": "TEST",
    }
    r = session.post(f"{API}/quote", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    j = r.json()
    assert re.match(r"^GF-\d{4}-\d{4}$", j["reference"]), f"bad ref: {j['reference']}"
    assert "id" in j
    pytest.shared_quote_ref = j["reference"]


def test_create_quote_invalid_email(session):
    r = session.post(f"{API}/quote", json={
        "business_name": "x", "contact_name": "x", "email": "bad",
    }, timeout=30)
    assert r.status_code == 422


def test_admin_list_quotes(session, auth_headers):
    r = session.get(f"{API}/admin/quotes", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    for it in items:
        assert "_id" not in it


def test_admin_get_quote_by_ref(session, auth_headers):
    ref = getattr(pytest, "shared_quote_ref", None)
    if not ref:
        pytest.skip("no quote ref")
    r = session.get(f"{API}/admin/quotes/{ref}", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    assert r.json()["reference"] == ref


def test_admin_patch_quote_status_and_note(session, auth_headers):
    ref = getattr(pytest, "shared_quote_ref", None)
    if not ref:
        pytest.skip()
    r = session.patch(f"{API}/admin/quotes/{ref}", json={"status": "in_review", "note": "TEST internal"},
                      headers=auth_headers, timeout=30)
    assert r.status_code == 200
    r2 = session.get(f"{API}/admin/quotes/{ref}", headers=auth_headers, timeout=30)
    j = r2.json()
    assert j["status"] == "in_review"
    assert any(n.get("text") == "TEST internal" for n in j.get("notes_log", []))


# ======= Contact =======
def test_contact_create_and_admin_read_flow(session, auth_headers):
    r = session.post(f"{API}/contact", json={
        "name": "TEST_Contact", "email": "test_contact@example.com",
        "company": "TEST_Co", "message": "TEST hi"
    }, timeout=30)
    assert r.status_code == 200
    cid = r.json()["id"]

    r2 = session.get(f"{API}/admin/contacts", headers=auth_headers, timeout=30)
    assert r2.status_code == 200
    assert any(c["id"] == cid for c in r2.json())

    r3 = session.patch(f"{API}/admin/contacts/{cid}/read", headers=auth_headers, timeout=30)
    assert r3.status_code == 200


# ======= Subscribe / Unsubscribe =======
def test_subscribe_and_duplicate_silent(session):
    email = "test_subscriber@example.com"
    r1 = session.post(f"{API}/subscribe", json={"email": email, "name": "TEST"}, timeout=30)
    assert r1.status_code == 200 and r1.json()["status"] == "success"
    r2 = session.post(f"{API}/subscribe", json={"email": email}, timeout=30)
    assert r2.status_code == 200 and r2.json()["status"] == "success"


def test_unsubscribe_invalid_token(session):
    r = session.get(f"{API}/unsubscribe?token=nonexistent", timeout=30)
    assert r.status_code == 400


# ======= FAQs =======
def test_public_faqs_returns_eight(session):
    r = session.get(f"{API}/faqs", timeout=30)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert len(items) >= 8


def test_admin_faqs_crud_and_reorder(session, auth_headers):
    r = session.post(f"{API}/admin/faqs", json={
        "question": "TEST_Q?", "answer": "TEST_A", "display_order": 99, "active": True
    }, headers=auth_headers, timeout=30)
    assert r.status_code == 200
    fid = r.json()["id"]

    r2 = session.put(f"{API}/admin/faqs/{fid}", json={
        "question": "TEST_Q2?", "answer": "TEST_A2", "display_order": 99, "active": True
    }, headers=auth_headers, timeout=30)
    assert r2.status_code == 200

    r3 = session.get(f"{API}/admin/faqs", headers=auth_headers, timeout=30)
    assert r3.status_code == 200
    ids = [f["id"] for f in r3.json()]
    assert fid in ids

    r4 = session.post(f"{API}/admin/faqs/reorder", json=ids, headers=auth_headers, timeout=30)
    assert r4.status_code == 200

    r5 = session.delete(f"{API}/admin/faqs/{fid}", headers=auth_headers, timeout=30)
    assert r5.status_code == 200


# ======= Blog =======
def test_admin_blog_crud_and_public_filter(session, auth_headers):
    # draft post
    rd = session.post(f"{API}/admin/blog", json={
        "title": "TEST_Draft Post", "body": "<p>draft</p>", "status": "draft"
    }, headers=auth_headers, timeout=30)
    assert rd.status_code == 200
    draft_id = rd.json()["id"]

    rp = session.post(f"{API}/admin/blog", json={
        "title": "TEST_Published Post", "body": "<p>pub</p>", "status": "published",
        "excerpt": "x", "category": "News", "tags": ["test"]
    }, headers=auth_headers, timeout=30)
    assert rp.status_code == 200
    pub = rp.json()
    pub_id = pub["id"]
    pub_slug = pub["slug"]

    # public should ONLY return published
    rpub = session.get(f"{API}/blog", timeout=30)
    assert rpub.status_code == 200
    slugs = [b["slug"] for b in rpub.json()]
    assert pub_slug in slugs
    draft_slugs = [b["slug"] for b in rpub.json() if b["id"] == draft_id]
    assert not draft_slugs

    # public single
    rs = session.get(f"{API}/blog/{pub_slug}", timeout=30)
    assert rs.status_code == 200

    # update with full payload
    ru = session.put(f"{API}/admin/blog/{pub_id}", json={
        "title": "TEST_Published Post v2", "body": "<p>v2</p>", "status": "published",
        "slug": pub_slug, "excerpt": "y", "category": "News", "tags": []
    }, headers=auth_headers, timeout=30)
    assert ru.status_code == 200

    # cleanup
    session.delete(f"{API}/admin/blog/{draft_id}", headers=auth_headers)
    session.delete(f"{API}/admin/blog/{pub_id}", headers=auth_headers)


# ======= Case Studies =======
def test_admin_case_studies_anonymise(session, auth_headers):
    r = session.post(f"{API}/admin/case-studies", json={
        "title": "TEST_CS", "client_name": "Secret Brand", "anonymise_client": True,
        "industry": "Apparel", "challenge": "c", "solution": "s", "result": "r",
        "status": "published"
    }, headers=auth_headers, timeout=30)
    assert r.status_code == 200
    cs_id = r.json()["id"]

    rp = session.get(f"{API}/case-studies", timeout=30)
    assert rp.status_code == 200
    found = [c for c in rp.json() if c["id"] == cs_id]
    assert found and found[0]["client_name"] == "Leading UK Brand"

    rg = session.get(f"{API}/case-studies/{cs_id}", timeout=30)
    assert rg.status_code == 200 and rg.json()["client_name"] == "Leading UK Brand"

    session.delete(f"{API}/admin/case-studies/{cs_id}", headers=auth_headers)


# ======= Settings =======
def test_admin_settings_get_and_update(session, auth_headers):
    r = session.get(f"{API}/admin/settings", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    orig = r.json()

    r2 = session.put(f"{API}/admin/settings", json={"data": {**orig, "footer_tagline": "TEST TAG"}},
                     headers=auth_headers, timeout=30)
    assert r2.status_code == 200

    r3 = session.get(f"{API}/settings", timeout=30)
    assert r3.status_code == 200
    assert r3.json().get("footer_tagline") == "TEST TAG"

    # restore
    session.put(f"{API}/admin/settings", json={"data": orig}, headers=auth_headers)


# ======= Subscribers + CSV =======
def test_admin_subscribers_csv_export(session, auth_headers):
    r = session.get(f"{API}/admin/subscribers/export.csv", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/csv")
    assert b"email" in r.content


# ======= Campaigns =======
def test_admin_campaign_send_queued_and_duplicate(session, auth_headers):
    r = session.post(f"{API}/admin/campaigns", json={
        "name": "TEST_Campaign", "subject": "TEST", "body": "<p>{{first_name}}</p>",
        "recipient_group": "active_only"
    }, headers=auth_headers, timeout=30)
    assert r.status_code == 200
    cid = r.json()["id"]

    rs = session.post(f"{API}/admin/campaigns/{cid}/send", headers=auth_headers, timeout=30)
    assert rs.status_code == 200
    assert rs.json()["sendgrid_configured"] is False

    # wait for background task
    import time
    time.sleep(2)
    rg = session.get(f"{API}/admin/campaigns/{cid}", headers=auth_headers, timeout=30)
    assert rg.status_code == 200
    assert rg.json()["status"] == "queued"

    # duplicate -> draft
    rd = session.post(f"{API}/admin/campaigns/{cid}/duplicate", headers=auth_headers, timeout=30)
    assert rd.status_code == 200
    dup = rd.json()
    assert dup["status"] == "draft"
    assert dup["id"] != cid

    # cleanup
    session.delete(f"{API}/admin/campaigns/{cid}", headers=auth_headers)
    session.delete(f"{API}/admin/campaigns/{dup['id']}", headers=auth_headers)
