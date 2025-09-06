# Castellón Events — Project Overview

## Purpose
A clean, trustworthy hub to **discover and publish events in Castellón de la Plana**.

Focus: great UI and UX, fast search, simple submissions, great SEO, and bilingual content (ES/EN).  
**Design & UX model inspiration:** [Visit Stockholm — Events](https://www.visitstockholm.com/events).

---

## Who It Serves
- **Residents & visitors** → find events by date, category.
- **Organizers & venues** → submit events quickly and reach a local audience without friction.
- **City partners** → a single, up-to-date showcase of culture, nightlife, sports, and community.
- **Future: map view** → see events and venues placed on a map for easier discovery.

---

## Core User Journeys (MVP)
- **Browse & find** → home → search/filter (by category, date) → event page → ticket/venue link.
- **Quick decide** → scan list cards (image, category, title, date, venue short) → open details.
- **Save & share** → “Add to Calendar” (.ics), Share, Save to favorites (local storage; no login).
- **Submit event** → simple form for organizers → admin review → publish (via CMS).

---

## MVP Feature Scope
- **Listings** → grid with image, categories, title, date, time (if provided), venue short.
- **Event page** → all listing fields + full address, website/ticket link, Share, Add to Calendar, Save.
- **Search & filtering** → categories, date range, quick presets (“Today”, “Tomorrow”, “This weekend”); sensible defaults (“Free”, "Digital event”).
- **Languages** → Spanish & English (switcher in header, mirrored URLs for SEO).
- **Submissions & moderation** → organizer form, email confirmation, lightweight admin approval.
- **SEO basics** → human-readable URLs, OpenGraph/Twitter cards, `schema.org/Event` markup, sitemap.
- **Analytics** → track views, outbound ticket clicks, and submission funnel (privacy-respecting).

---

## Out of Scope (for later)
- User complex booking/checkout
- Newsletters
- Map view (beyond MVP)
- Notifications
- Advanced personalization
- Dark mode

---

## Content Strategy

### Sources
- Manual entry (admins + organizers)
- Venue partnerships (direct calendar feeds or shared spreadsheets)
- City open-data feeds (where available)
- Third-party platforms (Facebook Events, Eventbrite, Ticketmaster) → only if legal/ToS-compliant

### Formats
- Match the clarity and UX of [Visit Stockholm Events](https://www.visitstockholm.com/events)
- Standardized image ratios and consistent categories
- Editorial add-ons later → local guides, “Best of the month,” blog posts for SEO

---

## Business & Revenue Model

### Revenue Streams
- **Featured listings / paid placement** for organizers
- **Ticket affiliate/commission** via outbound integrations
- **Venue/municipal partnerships** (sponsorship blocks, seasonal campaigns)

### Cost Control
- Start lean: listings + submissions + filtering
- Do design/content/ops in-house at first
- Automate imports only after value is proven

---

## Risks & Mitigations
- **Legality/ToS for third-party data** → prioritize Facebook/Instagram Events for ease; stay compliant
- **Content freshness** → expiry rules, automated reminders, “past events” auto-archive
- **Low organizer adoption** → free tier + onboarding kit (how-to guides, image tips), fast publishing SLA
- **Trust & spam** → moderation queue, required venue/date fields, throttled edits

---

## Operations (Lightweight)
- **SLA** → submissions reviewed within 24–48h
- **Editorial guardrails** → naming conventions, image quality checklist, category taxonomy
- **Compliance** → privacy policy, terms, cookie notice (ES/EN); honor “do not track” for analytics

---
