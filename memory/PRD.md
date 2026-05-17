# Garment Foundry — Product Requirements Document

## Original Problem Statement
Design and build a premium, modern, conversion-focused website for "Garment Foundry", a UK-based B2B apparel manufacturing and sourcing company. Black-and-white luxury aesthetic. Cinzel serif headings + Montserrat body. GF monogram + stitched arc + pinstripe grid motifs. Restrained monochrome palette (#000, #333, #777, #F2F2F2). Lead-generation and quote-request platform. Audience: clothing brand owners, startup fashion founders, boutique labels, uniform buyers, merch companies in UK & US.

## User Personas
- **Clothing brand founder** — needs reliable UK manufacturing for first collection
- **Boutique label owner** — needs sourcing + production at low/mid volume
- **Corporate uniform buyer** — needs workwear/uniforms in large quantity
- **Private-label e-commerce brand** — needs end-to-end manufacturing partner

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn UI + react-router-dom
- **Backend**: FastAPI + Motor (MongoDB async)
- **Storage**: Emergent Object Storage (file uploads)
- **Email**: Resend (transactional)
- **Routes** (all `/api` prefixed):
  - `POST /api/quotes` — create quote
  - `GET /api/quotes` — list quotes
  - `POST /api/upload` — file upload (≤10MB, allow-listed types)
  - `GET /api/files/{id}` — file download
  - `POST /api/contact` — contact enquiry

## Core Requirements (Static)
- All 10 pages: Home, About, Capabilities, Categories, Process, Sourcing, Quality, Quote, FAQs, Contact
- Multi-step Quote Calculator (10 steps, file upload)
- Monochrome luxury design, GF monogram + lockup logo
- Mobile responsive, sticky nav, accessible
- Resend email notifications (admin + customer)
- Object storage uploads for tech packs

## What's Been Implemented (2026-02)
- ✅ All 10 pages with editorial typography (Cinzel + Montserrat)
- ✅ Premium hero with dark moody fabric imagery + GF monogram
- ✅ Quote calculator: 10-step wizard with progress rail, file upload, review screen
- ✅ Contact form with toast notifications
- ✅ Object storage integration (Emergent)
- ✅ Resend email integration (admin → garmentfoundry.uk@gmail.com + customer confirmation)
- ✅ Brand logo lockup (user-provided asset) with mix-blend-mode for dark backgrounds
- ✅ FAQ accordion, stitched dividers, pinstripe grid, monogram watermarks
- ✅ Mobile responsive (mobile menu drawer)
- ✅ data-testid attributes on all interactive elements
- ✅ Backend: pytest 100% pass (root, upload, quote create/list, contact, validation)
- ✅ Frontend: end-to-end testing passed (10-step wizard completes, success screen renders)

## Prioritized Backlog (P0/P1/P2)
- **P1**: Admin dashboard at `/admin/quotes` to view incoming submissions
- **P1**: Verify a custom domain in Resend (currently testing mode → emails only deliver to verified account address)
- **P2**: Real case-study content with proof imagery
- **P2**: SEO meta tags, sitemap.xml, robots.txt, Open Graph share image
- **P2**: Cookie banner / privacy policy / T&Cs pages
- **P2**: Newsletter/lead-magnet (PDF capabilities deck) for top-of-funnel capture
- **P3**: Internationalisation (en-US vs en-GB copy switching)
- **P3**: Multi-language (Spanish, French) for EU buyers

## Next Tasks
1. Admin dashboard for quote management
2. Domain verification in Resend
3. SEO + Open Graph setup
