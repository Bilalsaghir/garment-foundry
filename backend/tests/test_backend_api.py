"""Backend API tests for Garment Foundry."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://garment-foundry.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    return s


# --- Health ---
def test_root(session):
    r = session.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert "message" in data


# --- Upload ---
# 1x1 transparent PNG
PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xcf"
    b"\xc0\x00\x00\x00\x03\x00\x01\x9a\x9c\x18\x00\x00\x00\x00IEND\xaeB`\x82"
)


def test_upload_png(session):
    files = {"file": ("test.png", io.BytesIO(PNG_BYTES), "image/png")}
    r = session.post(f"{API}/upload", files=files, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    for k in ("id", "storage_path", "original_filename", "content_type", "size"):
        assert k in data
    assert data["original_filename"] == "test.png"
    assert data["size"] > 0
    pytest.shared_file_id = data["id"]
    pytest.shared_file = data


def test_upload_reject_exe(session):
    files = {"file": ("malware.exe", io.BytesIO(b"MZ\x00\x00fake exe"), "application/octet-stream")}
    r = session.post(f"{API}/upload", files=files, timeout=30)
    assert r.status_code == 400, r.text


# --- Quotes ---
def test_create_quote_with_files(session):
    file_info = getattr(pytest, "shared_file", None)
    files_arr = [file_info] if file_info else []
    payload = {
        "company_name": "TEST_Acme Apparel Ltd",
        "contact_name": "TEST John Doe",
        "email": "test_john@example.com",
        "phone": "07575657531",
        "website": "https://example.com",
        "country": "UK",
        "garment_type": "T-Shirts",
        "garment_subcategory": "Crew Neck",
        "quantity": "500-1000",
        "fabric_preference": "Organic Cotton",
        "branding": ["Embroidery", "Screen Print"],
        "packaging": "Polybag + Hangtag",
        "delivery_country": "United Kingdom",
        "timeline": "8-12 weeks",
        "notes": "TEST notes",
        "files": files_arr,
    }
    r = session.post(f"{API}/quotes", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["company_name"] == payload["company_name"]
    assert data["email"] == payload["email"]
    assert "id" in data and len(data["id"]) > 0
    assert data["status"] == "new"
    assert "created_at" in data
    pytest.shared_quote_id = data["id"]


def test_list_quotes_no_objectid(session):
    r = session.get(f"{API}/quotes", timeout=30)
    assert r.status_code == 200, r.text
    items = r.json()
    assert isinstance(items, list)
    # Verify the test quote is present and no _id leaks
    found = False
    for it in items:
        assert "_id" not in it
        if it.get("id") == getattr(pytest, "shared_quote_id", None):
            found = True
    assert found, "Created quote not found in list"


def test_create_quote_invalid_email(session):
    payload = {
        "company_name": "TEST_Bad",
        "contact_name": "TEST_Bad",
        "email": "not-an-email",
        "garment_type": "Tee",
        "quantity": "100",
    }
    r = session.post(f"{API}/quotes", json=payload, timeout=30)
    assert r.status_code == 422


# --- Contact ---
def test_create_contact(session):
    payload = {
        "name": "TEST_Jane",
        "email": "test_jane@example.com",
        "company": "TEST_Co",
        "message": "Hello from automated test",
    }
    r = session.post(f"{API}/contact", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert "id" in data and len(data["id"]) > 0
    assert "created_at" in data
