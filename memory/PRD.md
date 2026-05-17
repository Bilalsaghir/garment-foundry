# Garment Foundry — PRD

## Architecture
- Frontend: React 19, react-router, Tailwind, Shadcn UI, sonner
- Backend: FastAPI + Motor (MongoDB)
- Auth: JWT (24h, httpOnly cookie + Bearer header)
- Storage: GridFS for quote uploads
- Email: SendGrid Web API v3 (graceful queue when key empty)
- Scheduled email cron: 5-minute interval

## Implemented (Iteration 2)
### Part A — UI/UX fixes (all 8 shipped)
- Quote stepper: single-line "STEP NN / 10 — LABEL" + 2px progress bar + vertical sidebar on desktop (horizontal tab strip removed)
- Inline validation on blur (red 2px underline + italic 11px message); no toast/banner for missing fields
- Nav "REQUEST A QUOTE" button: black fill #0A0A0A, 40px height, single-line, white text
- Category grid: 45° pinstripe CSS pattern + 1px white border on hover + min-height 160/200px
- Form inputs: bg #111, label 10px 0.12em uppercase #888, bottom-border only, focus → white
- Hero CTAs: full-width white primary (52px) + bordered secondary (48px) on mobile, 12px gap
- Process timeline: vertical 1px #333 line + 6px white dot per step
- Mobile nav drawer: 28px L padding, 22px Montserrat 300, 44px gap, pinned full-width #F5F4F0 CTA

### Part B — Admin CMS + Email System
- `/admin/login` with JWT (cookie + Bearer)
- Admin panel with 9 sections: Dashboard, Blog, Case Studies, Quote Inbox, Contact Inbox, FAQs, Subscribers, Campaigns, Settings
- Blog: rich-text body, slug auto-gen, draft/publish toggle, cover image, tags, category — public `/blog`, `/blog/:slug`
- Case Studies: industry enum, anonymise toggle (Leading UK Brand), challenge/solution/result — public `/case-studies`
- Quote Inbox: GF-YYYY-NNNN refs (atomic counter), status workflow (New/In Review/Quoted/Closed), internal notes log, file download links
- Contact Inbox: inbox UI with read flag, delete
- FAQs: CRUD + drag-up/down reorder + active toggle (8 seeded)
- Subscribers: search/filter, manual unsubscribe, CSV export
- Campaigns: rich-text body, merge tags ({{first_name}}, {{unsubscribe_url}}), preview modal, duplicate, send now / schedule; SendGrid auto-queues when key empty
- Settings: hero copy, contact info, social, email templates (quote confirmation + admin notification)
- Public newsletter signup in footer
- `/unsubscribe?token=...` page

### Backend
- 25/25 pytest tests passing (auth, GridFS, CRUD, campaigns, subscribers CSV)
- Indexes on slug, status+created_at, reference, email
- Seed: 8 FAQs + default site settings on first startup

## Pending / P1
- Add SENDGRID_API_KEY (currently empty → emails queued)
- Verify a SendGrid sender (currently placeholder onboarding@resend.dev)
- (Security) Add stored-XSS sanitisation on admin-submitted HTML before save
- (Security) Rate-limit /api/upload (currently unauthenticated)
- (Perf) Switch GridFS download to StreamingResponse for large files
- Split server.py (922 lines) into routers

## Pending / P2
- Open Graph + sitemap.xml + robots.txt
- Privacy / T&Cs pages
- Drag-and-drop reorder (currently up/down buttons) for FAQs

## Credentials
- Admin: garmentfoundry.uk@gmail.com / GFoundry@786 — stored in `/app/memory/test_credentials.md`
