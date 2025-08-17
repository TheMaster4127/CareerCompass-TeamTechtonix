# backend/app.py
# Flask backend with:
# - Auth (register/login/profile) persisted in SQLite
# - Smart Search API extracting top links from Coursera, Udemy, Skillshare, Udacity
# - EdX removed per request
# - Strengthened extractors for Udemy, Skillshare, Udacity
# - Best-effort HTML parsing with fallbacks and polite delays

import os
import re
import time
import uuid
import logging
import requests
from urllib.parse import quote, urlsplit, urlunsplit

from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from bs4 import BeautifulSoup

db = SQLAlchemy()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("smart-search")

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)

    # CORS for local dev and Vercel
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "https://*career-compass-team-techtonix-5ai8j0fg5-shounak-velips-projects.vercel.app"]}})
    Swagger(app)

    # DB: SQLite by default; switch with DATABASE_URL later
    sqlite_path = os.path.join(app.instance_path, "careercompass.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", f"sqlite:///{sqlite_path}")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    # ---------------- Models ----------------
    class User(db.Model):
        __tablename__ = "users"
        id = db.Column(db.String(36), primary_key=True)
        name = db.Column(db.String(120), nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False, index=True)
        password_hash = db.Column(db.String(256), nullable=False)
        role = db.Column(db.String(20), nullable=False, default="student")
        token = db.Column(db.String(36), index=True, nullable=True)

        def to_public(self):
            return {"user_id": self.id, "name": self.name, "email": self.email, "role": self.role}

    with app.app_context():
        db.create_all()

    # --------------- Helpers ---------------
    def user_from_auth():
        token = (request.headers.get("Authorization") or "").replace("Bearer ", "")
        if not token:
            return None
        return User.query.filter_by(token=token).first()

    USER_AGENT = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )

    def http_get(url, timeout=7):
        try:
            r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=timeout, allow_redirects=True)
            ctype = r.headers.get("Content-Type", "")
            log.info(f"GET {url} -> {r.status_code} ({ctype})")
            if r.status_code == 200 and "text/html" in ctype:
                return r.text
        except requests.RequestException as e:
            log.warning(f"http_get error for {url}: {e}")
        return None

    def normalize_title(text: str) -> str:
        t = re.sub(r"\s+", " ", (text or "").strip())
        return t[:160] if t else ""

    def abs_url(href: str, base: str) -> str | None:
        if not href:
            return None
        if href.startswith("//"):
            return "https:" + href
        if href.startswith("/"):
            return base.rstrip("/") + href
        parts = urlsplit(href)
        return urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, ""))

    # --------------- Extractors ---------------

    # Coursera: /learn/, /specializations/, /professional-certificates/
    def extract_links_coursera(html, limit=10):
        res = []
        if not html:
            return res
        soup = BeautifulSoup(html, "html.parser")
        sels = [
            'a[href*="/learn/"]',
            'a[href*="/specializations/"]',
            'a[href*="/professional-certificates/"]',
            'a[data-click-key="search.search.click.search_card"]',
        ]
        for sel in sels:
            for a in soup.select(sel):
                href = abs_url(a.get("href"), "https://www.coursera.org")
                if not href or "coursera.org" not in href:
                    continue
                title = normalize_title(a.get_text())
                if title:
                    res.append({"title": title, "url": href, "platform": "Coursera"})
                if len(res) >= limit:
                    break
            if len(res) >= limit:
                break
        return res

    # Udemy
    def extract_links_udemy(html, limit=12):
        res = []
        if not html:
            return res
        soup = BeautifulSoup(html, "html.parser")

        # Primary
        for a in soup.select('h3 a[href*="/course/"]'):
            href = abs_url(a.get("href"), "https://www.udemy.com")
            if not href or "udemy.com" not in href:
                continue
            title = normalize_title(a.get_text()) or "Course"
            res.append({"title": title, "url": href, "platform": "Udemy"})
            if len(res) >= limit:
                return res

        # Fallback
        for a in soup.select('a[href*="/course/"]'):
            href = abs_url(a.get("href"), "https://www.udemy.com")
            if not href or "udemy.com" not in href:
                continue
            title = normalize_title(a.get_text()) or "Course"
            res.append({"title": title, "url": href, "platform": "Udemy"})
            if len(res) >= limit:
                break

        return res

    # Skillshare
    def extract_links_skillshare(html, limit=12):
        res = []
        if not html:
            return res
        soup = BeautifulSoup(html, "html.parser")

        # Primary
        for a in soup.select('a.class-link[href*="/en/classes/"], a.class-link[href*="/classes/"]'):
            href = a.get("href")
            if not isinstance(href, str):
                continue
            if href.startswith("/"):
                href = "https://www.skillshare.com" + href
            if "skillshare.com" not in href:
                continue
            title = (a.get_text() or "").strip() or "Class"
            res.append({"title": title, "url": href.split("#")[0], "platform": "Skillshare"})
            if len(res) >= limit:
                return res

        # Fallback
        for a in soup.select('a[href*="/en/classes/"], a[href*="/classes/"]'):
            href = a.get("href")
            if not isinstance(href, str):
                continue
            if href.startswith("/"):
                href = "https://www.skillshare.com" + href
            if "skillshare.com" not in href:
                continue
            title = (a.get_text() or "").strip() or "Class"
            res.append({"title": title, "url": href.split("#")[0], "platform": "Skillshare"})
            if len(res) >= limit:
                break

        return res

    # Udacity
    def extract_links_udacity(html, limit=12):
        res = []
        if not html:
            return res
        soup = BeautifulSoup(html, "html.parser")

        # Primary
        for a in soup.select('a.chakra-heading[href^="/course/"]'):
            href = a.get("href")
            if not isinstance(href, str):
                continue
            if href.startswith("/"):
                href = "https://www.udacity.com" + href
            if "udacity.com" not in href:
                continue
            title = (a.get_text() or "").strip() or "Course"
            res.append({"title": title, "url": href.split("#")[0], "platform": "Udacity"})
            if len(res) >= limit:
                return res

        # Fallback
        for a in soup.select('a[href^="/course/"], a[href*="/course/"]'):
            href = a.get("href")
            if not isinstance(href, str):
                continue
            if href.startswith("/"):
                href = "https://www.udacity.com" + href
            if "udacity.com" not in href:
                continue
            title = (a.get_text() or "").strip() or "Course"
            res.append({"title": title, "url": href.split("#")[0], "platform": "Udacity"})
            if len(res) >= limit:
                break

        return res

    # --------------- Query variants ---------------
    def build_variants(skills, interests, industry, cap=10):
        s = [t.strip() for t in (skills or []) if isinstance(t, str) and t.strip()]
        i = [t.strip() for t in (interests or []) if isinstance(t, str) and t.strip()]
        ind = (industry or "").strip()

        terms = []
        terms += [[x] for x in s[:4]]
        terms += [[x] for x in i[:4]]
        if ind:
            terms.append([ind])
        for a in s[:3]:
            for b in i[:3]:
                terms.append([a, b])
        if not terms and ind:
            terms = [[ind]]

        seen, out = set(), []
        for arr in terms:
            key = " ".join(arr).lower()
            if key not in seen:
                seen.add(key)
                out.append(arr)
            if len(out) >= cap:
                break
        return out

    # --------------- Routes ---------------
    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    @app.route("/api/register", methods=["POST"])
    def register():
        data = request.get_json(force=True, silent=True) or {}
        name, email, password = data.get("name"), data.get("email"), data.get("password")
        role = data.get("role", "student")
        if not all([name, email, password]) or role not in ("student", "mentor"):
            return jsonify({"error": "Invalid payload"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409
        u = User(id=str(uuid.uuid4()), name=name, email=email, password_hash=generate_password_hash(password), role=role)
        db.session.add(u); db.session.commit()
        return jsonify({"message": "Registration successful", "user_id": u.id})

    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.get_json(force=True, silent=True) or {}
        email, password = data.get("email"), data.get("password")
        if not all([email, password]):
            return jsonify({"error": "Invalid payload"}), 400
        u = User.query.filter_by(email=email).first()
        if not u or not check_password_hash(u.password_hash, password):
            return jsonify({"error": "Invalid credentials"}), 401
        u.token = str(uuid.uuid4()); db.session.commit()
        return jsonify({"token": u.token, "user_id": u.id})

    @app.route("/api/profile/<user_id>")
    def get_profile(user_id):
        u = user_from_auth()
        if not u or u.id != user_id:
            return jsonify({"error": "Unauthorized"}), 401
        return jsonify(u.to_public())

    @app.route("/api/smart-search", methods=["POST"])
    def smart_search():
        u = user_from_auth()
        if not u:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json(force=True, silent=True) or {}
        skills = data.get("skills") or []
        interests = data.get("interests") or []
        industry = data.get("industry") or ""
        limit = int(data.get("limit") or 36)

        variants = build_variants(skills, interests, industry, cap=10)
        providers = [
            ("Coursera",  "https://www.coursera.org/search?query={q}",                     extract_links_coursera),
            ("Udemy",     "https://www.udemy.com/courses/search/?q={q}",                   extract_links_udemy),
            ("Skillshare","https://www.skillshare.com/en/search/classes?query={q}",        extract_links_skillshare),
            ("Udacity",   "https://www.udacity.com/catalog?sort=relevance&searchValue={q}",extract_links_udacity),
        ]

        aggregated = []
        for arr in variants:
            q_text = " ".join(arr)
            q = quote(q_text)
            for name, tmpl, extractor in providers:
                url = tmpl.format(q=q)
                html = http_get(url)
                links = extractor(html, limit=12)

                # ✅ Consistent fallback like Coursera
                if not links:
                    links = [{
                        "title": f"Search results for {q_text} on {name}",
                        "url": url,
                        "platform": name
                    }]
                aggregated.extend(links)
                time.sleep(0.35)  # polite delay

        # dedupe by URL and cap
        seen, out = set(), []
        for it in aggregated:
            u_ = it.get("url")
            if u_ and u_ not in seen:
                seen.add(u_)
                out.append(it)
            if len(out) >= max(6, limit):
                break

        return jsonify({"items": out})

    return app

app = create_app()   # <-- Gunicorn will find this

if __name__ == "__main__":
    app.run(debug=True)
