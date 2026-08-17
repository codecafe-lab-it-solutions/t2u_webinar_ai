# PRD: Webinar Landing Page (Subdomain)

| | |
|---|---|
| **Doc owner** | [Product/Marketing Owner] |
| **Status** | Draft v1.0 |
| **Last updated** | Aug 8, 2026 |
| **Stakeholders** | Marketing, Growth, Engineering, Design, Sales/Community |

> **Assumptions used in this draft:** subdomain is `webinar.yourdomain.com`, one webinar topic per page (template reusable per event), lead form syncs to CRM/email tool, WhatsApp link goes to an existing community group. Replace bracketed placeholders with real values before build.

---

## 1. Purpose & Background

We need a dedicated, high-converting landing page — hosted on its own subdomain — to promote a webinar. Today, webinar promotion likely lives on the main site or in ad-hoc pages, which dilutes tracking, slows iteration, and mixes webinar traffic with core site traffic.

A standalone subdomain page lets marketing:
- Ship/update pages fast without touching the main site codebase
- A/B test freely
- Track a clean conversion funnel per campaign
- Reuse the same template for future webinars

## 2. Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Drive webinar signups | Form completion rate | ≥ 25% of unique visitors |
| Grow community | WhatsApp join-click rate | ≥ 15% of signups |
| Drive course discovery | Click-through to course pages | ≥ 8% of visitors |
| Page performance | Load time (LCP) | < 2.5s |
| Trust/conversion lift | Testimonial video play rate | ≥ 20% of visitors |

*(Fill in actual targets based on historical benchmarks once available.)*

## 3. Target Audience

- Primary: [e.g., working professionals interested in Skill X, prospective students]
- Traffic sources: paid social/search ads, email list, WhatsApp/Telegram shares, organic search, influencer/affiliate links
- Device mix assumption: majority mobile (design mobile-first)

## 4. Scope

**In scope**
- New responsive landing page on `webinar.yourdomain.com` (or `webinar.[domain]/[slug]` if subdomain isn't feasible technically)
- Sections: Hero, Signup form, Webinar details/agenda, Speaker bio, Testimonial videos, Course module preview, Related courses, WhatsApp community CTA, FAQ, Footer
- Form → CRM/email automation integration
- Analytics + conversion tracking
- Reusable template for future webinars (CMS-driven or config-driven)

**Out of scope (v1)**
- Live webinar hosting/streaming platform itself (Zoom/YouTube Live etc. — assumed external)
- Payment/checkout flows (unless webinar is paid — flag if so)
- Full LMS build-out (course module section is a teaser/preview, not the full course player)
- Multi-language localization (v2 candidate)


## 6. Page Structure & Functional Requirements

### 6.1 Header / Navigation
- **Layout:** slim, sticky header pinned on scroll — logo (left), minimal anchor links (center/right: e.g. "Agenda," "Speaker," "Testimonials," "Courses"), primary CTA button (right: "Reserve My Seat")
- **Style:** transparent over the `#171421` hero on load, transitioning to a solid/blurred `#171421` bar with hairline border-bottom (`border` token) once the user scrolls past the hero — glass/blur effect, not a hard shadow, per the flat-elevation rule
- **Logo:** T2U logo, sized to keep header height compact (~64–72px) so it doesn't crowd mobile screens
- **Nav links:** hidden behind a hamburger menu on mobile (<768px); desktop shows inline links, uppercase 9–10px kicker style, weight 600, muted color until hover/active (brand primary or accent underline)
- **CTA button:** same violet primary treatment as the rest of the page (md–lg radius, orange hover glow) — this button should visually match the hero and form CTAs exactly, since it's the most-repeated conversion element on the page
- **Countdown chip (optional):** small live countdown/urgency pill ("Starts in 2d 4h") can sit in the header once scrolled, styled per the status-pill pattern (10%-opacity fill, 1px border, uppercase text)
- **Behavior:** header CTA should scroll/anchor to the signup form rather than navigate away; no full page reload
- **Accessibility:** logo and nav links keyboard-navigable; mobile menu trap-focus when open; honors `prefers-reduced-motion` for the scroll-transition effect

### 6.2 Hero Section
- Webinar title, one-line value prop, date/time (with timezone + live countdown timer), primary CTA button ("Reserve My Seat")
- Background: brand imagery or short looping video
- Trust bar: logos of past partners/media mentions (optional)

### 6.3 Lead / Signup Form
- **Fields:** Name, Email, Phone (with country code), optional: City/Role/Experience level
- **Validation:** required-field checks, email format check, phone format check
- **Submit behavior:** inline success state + redirect to thank-you/confirmation step (calendar invite + WhatsApp link shown immediately after submit)
- **Integration:** push lead to CRM/email tool (e.g., HubSpot/Mailchimp/Zoho) in real time via API/webhook; trigger confirmation email + reminder email sequence (24h, 1h before webinar)
- **Anti-spam:** honeypot field or CAPTCHA
- **Consent checkbox:** opt-in for WhatsApp/marketing communication (required in many jurisdictions)
- Form should be repeatable in multiple places on the page (hero + sticky bottom bar on mobile + end-of-page)

### 6.4 Testimonial Videos
- Section with 3–6 short (30–90s) video testimonials from past attendees/students
- Video player: click-to-play thumbnails (not autoplay with sound), captions/subtitles for accessibility, mobile-optimized aspect ratio
- Below/alongside: name, role, short quote (text) for users who don't watch video
- Host videos on YouTube/Vimeo (unlisted) or CDN — avoid large self-hosted files impacting load time

### 6.5 WhatsApp Community Link
- Clear CTA block: "Join our WhatsApp community for updates, reminders & networking"
- Button links to WhatsApp group invite link (`wa.me/...` or `chat.whatsapp.com/...`)
- Shown: (a) on main page as a section, and (b) on the post-submit thank-you screen so every registrant sees it
- Consider group size limits (WhatsApp community/group caps) — plan for multiple group links or a WhatsApp Community (not just Group) to scale
- Track click events separately from form conversion

### 6.6 Course Module / Curriculum Preview
- Show a snapshot of what the related paid course covers (module titles, brief descriptions, duration per module)
- Positioned as "what you'll learn next" — a soft upsell, not the full curriculum
- CTA: "View Full Course" linking to the course sales page

### 6.7 Other Related Courses
- Carousel or grid of 2–4 related/complementary courses
- Each card: thumbnail, title, one-line description, price (if applicable), CTA to course page
- Should visually feel secondary to the webinar CTA (don't compete with primary conversion goal)

### 6.8 Supporting Sections
- **Speaker/host bio:** photo, credentials, past achievements
- **Agenda/what you'll learn:** 3–5 bullet takeaways
- **FAQ:** logistics (is it free, will there be a recording, timing, prerequisites)
- **Footer:** contact info, social links, privacy policy/terms links, unsubscribe compliance

## 7. User Flow

1. User lands on page (from ad/email/share link)
2. Scrolls or immediately fills signup form
3. Submits → sees thank-you state with: calendar-add button, WhatsApp join CTA, "you're in" confirmation
4. Receives confirmation email + reminder sequence
5. Optionally browses testimonials / related courses before or after registering

## 8. Analytics & Tracking

- GA4 (or equivalent) pageview + scroll depth tracking
- Conversion events: `form_submit`, `whatsapp_click`, `course_module_click`, `related_course_click`, `video_play`
- UTM parameter capture on all traffic sources, stored with lead record
- Ad pixel integration (Meta/Google Ads) for retargeting + conversion reporting
- Weekly dashboard: visitors → form starts → form completions → WhatsApp joins → course clicks

## 9. UI & Theme — T2U Design System

This page belongs to the **Marketing site** world of the T2U design system (not the dark‑first Portal/dashboard world) — it's public-facing and persuasive, so it should use the louder, editorial marketing treatment, not the dense dashboard look.

### 9.1 World: Marketing Site

| | |
|---|---|
| Ground color | `#171421` (near-black, with subtle dot-grid texture) |
| Headline treatment | Gradient text, mustard-orange → gold (`#ff7a00` → `#ffd700`) |
| Typeface | Plus Jakarta Sans (fallback: Poppins, Inter, ui-sans-serif, system-ui, sans-serif) |
| Base body size | 20px desktop / 18px mobile — noticeably larger, airier, more editorial than the app |
| Motion | Louder than the app: hero content staggers in via spring physics (framer-motion), ambient blurred gradient blobs, slow auto-scrolling logo/testimonial marquees. Respect `prefers-reduced-motion`. |

### 9.2 Core Color Tokens (brand pair — do not introduce a third hue)

| Token | Value | Usage |
|---|---|---|
| Brand primary | `#7c3aed` (violet) | Primary CTA, links, active states |
| Brand accent | `#f97316` (orange) | Secondary emphasis, hover glow, icons |
| Marketing mustard | `#ff7a00` | Headline gradient start |
| Marketing gold | `#ffd700` | Headline gradient end |
| Marketing ground | `#171421` | Hero/section background |

**Semantic status colors** (used only for state — never as a brand accent):
- Success/Active — emerald `#10b981`
- Pending/Warning — amber `#d97706`
- Error/Rejected — rose `#e11d48`
- Info — blue `#3b82f6`

Status pills: 10px uppercase bold text in the status color, on a 10%-opacity fill of that color, with a 1px border at 20–30% opacity. **Never fill a status pill solid.**

### 9.3 Typography Scale

| Element | Weight / Size |
|---|---|
| Hero headline | 800 weight, large scale, gradient fill, tight tracking (~-0.02em) |
| Section headings | 700 weight |
| Body copy | 400 weight, 18–20px (marketing scale, not app's 13–14px) |
| Kickers / field captions / labels | Uppercase, 9–10px, letter-spacing 0.08–0.12em, bold |
| Numbers, codes, dates, phone/ID fields | **Monospace stack**, applied consistently — e.g. form confirmation codes, countdown timer digits, dates/times |

### 9.4 Radius, Elevation & Icons

- Base radius token: **14px**, scaled — sm 8.4px / md 11.2px / lg 14px (base) / xl 19.6px / 2xl 25.2px / 3xl 30.8px
- Cards: xl–2xl radius. Buttons/inputs: md–lg. Modals/full-bleed panels: 2xl–3xl.
- Elevation stays nearly flat: a hairline 1px border (border token) plus faint shadow — **not** heavy box-shadows. Depth comes from color/blur (glassmorphism), used sparingly for premium call-outs (e.g., a hero highlight panel with `backdrop-filter: blur(10px)` over a primary→accent gradient).
- Icons: **lucide-react** exclusively, 14–20px, stroke-width 2, colored to match surrounding text/status (never flat neutral gray).

### 9.5 Section-by-Section Theme Application

| Page section | Treatment |
|---|---|
| **Header/Nav** | Sticky, transparent-to-solid on scroll (`#171421` + blur once scrolled); logo left, uppercase-kicker nav links center/right, violet CTA button matching hero/form CTAs exactly; optional countdown status-pill once scrolled |
| **Hero** | `#171421` ground with dot-grid texture; gradient headline (mustard→gold); staggered spring-in animation on load; countdown timer digits in monospace; primary CTA button in violet `#7c3aed` with subtle orange hover glow |
| **Signup form** | Card on `card` surface token with xl radius, hairline border; field labels as uppercase 9–10px kickers; inputs md–lg radius; submit button violet primary, hover glow orange |
| **Testimonial videos** | Marquee/carousel treatment consistent with marketing motion language; video cards xl radius with hairline border; optional glassmorphism highlight on featured testimonial |
| **Course module preview** | Honeycomb-style feature grid (per T2U marketing pattern) for module cards; KPI-tile pattern reused for stats (e.g., "12 Modules," "40+ Hours") |
| **Related courses** | Card grid, xl radius, hover glow (orange) on card hover; price/duration set in monospace |
| **WhatsApp community CTA** | Treated as a premium call-out — glassmorphism panel (blur over primary→accent gradient), used sparingly per the "use glass sparingly" rule |
| **Live/urgency badges** ("Seats filling fast," "Live in 2 days") | Pill pattern: uppercase 10px bold, 10%-opacity status-color fill, 1px 20–30%-opacity border — never solid fill |
| **Footer** | Neutral/dark, minimal, consistent border token |

### 9.6 Do / Don't (carried from brand spec)

**Do:** use violet/orange as the only two brand hues (all else neutral or semantic); set all numbers/codes/IDs in monospace; use uppercase letter-spaced kickers for labels; keep elevation flat (border + blur over shadow); build a real dark-first hero even though this is the marketing world.

**Don't:** introduce a third brand color; fill status pills solid; mix Geist (app typeface) with Plus Jakarta Sans on the same screen — this page is 100% Plus Jakarta Sans; use sharp corners anywhere; reach for heavy drop-shadows.

### 9.7 General Design Requirements

- Mobile-first responsive design (majority of traffic likely mobile) — base font drops to 18px under 768px per the marketing scale
- Single, unmistakable primary CTA color (violet) used consistently across every form instance
- Fast-loading: motion should degrade gracefully; avoid large glassmorphism/blur effects stacking on low-end mobile devices
- Accessibility: alt text on images, sufficient contrast against the `#171421` ground, captioned videos, keyboard-navigable form, honor `prefers-reduced-motion`

## 10. Content Checklist (to be provided by marketing before build)

- [ ] Final webinar title, date, time, timezone
- [ ] Speaker bio + headshot
- [ ] 3–6 testimonial video files/links + quotes
- [ ] Course module outline (titles + short descriptions)
- [ ] 2–4 related courses with thumbnails/links
- [ ] WhatsApp community invite link
- [ ] Legal copy: privacy policy, terms, consent language
- [ ] Confirmation + reminder email copy

## 11. Risks & Open Questions

| Risk/Question | Notes |
|---|---|
| Is the webinar free or paid? | Changes form/checkout requirements |
| Subdomain vs subpath | Subdomain is cleaner for tracking but confirm DNS/hosting access |
| WhatsApp group scaling | Standard groups cap at 1,024 members — confirm if WhatsApp Community or multiple groups needed |
| CRM/ESP tool | Which platform (HubSpot, Mailchimp, Zoho, etc.)? Needed to scope integration |
| Recurring webinars | Should this be one page per event, or one dynamic template? Affects CMS setup |
| Data privacy compliance | Which regions is traffic coming from? (GDPR/DPDP/CCPA implications) |

## 12. Milestones (indicative)

| Phase | Timeline |
|---|---|
| Content & copy finalized | Week 1 |
| Design mockups | Week 1–2 |
| Dev build + integrations | Week 2–3 |
| QA (cross-device, tracking validation) | Week 3 |
| Launch | Week 4 |

---

*This PRD assumes a single-webinar template that's reusable. If you can share the webinar topic, target audience, CRM tool, and whether it's free/paid, I can tighten the requirements and remove placeholders.*