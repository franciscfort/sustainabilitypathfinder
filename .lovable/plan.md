# Sustainability Career Pathfinder 2.0 — Build Plan

Transform the current single-page assessment app into a full career development platform with multi-page navigation, rich content libraries, and a personal dashboard.

## Scope

This is a large build. To keep it shippable in one pass, I'll deliver a complete v1 skeleton with real content for the structure to be useful immediately, then iterate on depth (more certifications, more resources, admin analytics) in follow-ups.

## Information Architecture

```text
/                       Home (landing + hero CTA)
/assessment             Existing assessment flow
/results                Assessment results + "View My Roadmap" CTA
/results/:shareId       Shared results
/careers                Career Path Explorer (searchable grid of 12 paths)
/careers/:slug          Career Roadmap page (overview, skills, tools, certs, projects, 90-day plan, related)
/skills                 Skills Library (browse by category)
/skills/:slug           Skill detail (what, why, careers using it, resources)
/certifications        Certifications Hub (filterable directory)
/resources              Learning Resources Hub (courses, books, podcasts, communities…)
/roadmaps               Career Roadmaps index (visual roadmap.sh-style cards)
/dashboard              Personalized dashboard (assessment matches, saved items, skill tracker)
/reach                  (existing) country reach map
/about                  About page
```

Top navigation bar with these sections, mobile-friendly hamburger drawer on small screens. Footer with secondary links.

## Data model (content, not DB)

All career/skills/cert/resource content lives in typed TS modules under `src/data/`:
- `careerPaths2.ts` — 12 pathways with the full schema below
- `skills.ts` — skills library (categorized, cross-referenced to careers)
- `certifications.ts` — directory with filters metadata
- `resources.ts` — courses, articles, books, podcasts, communities, fellowships

Each `CareerPath` includes: slug, name, tagline, overview (what/why/demand/growth), jobTitles {entry, mid, senior}, skills {beginner, intermediate, advanced} each split soft/technical, tools[], certifications {beginner, intermediate, advanced}, projects[], roadmap {days1to30, days31to60, days61to90}, related[].

## Personal dashboard (no auth)

Uses the existing anonymous session UUID in `localStorage`. Saved items (bookmarked careers, skills, certs, resources, tracked skills) persist to `localStorage` under `pathfinder:saved:v1`. Assessment match is fetched via existing `getRecentAssessments` RPC. No new DB tables required for v1.

Future-ready: schema is structured so we can later mirror saved items into Supabase if accounts are added.

## Admin analytics

Data is already captured (gender, career_stage, experience_level, current_goal, recommended career via `career_matches`, recommended skills). For v1, I'll add aggregation RPCs (`get_career_path_stats`, `get_goal_stats`, `get_stage_stats`, `get_skill_demand_stats`) and a `/admin/analytics` page gated by a simple shared-secret entered once and stored in localStorage (lightweight, since the app is anonymous). This is acknowledged as not true auth — if you want real admin auth, we'll layer it in next.

## Design

- Edtech feel inspired by Coursera / roadmap.sh: clean cards, generous whitespace, clear hierarchy, sustainability palette (forest green, warm sand, teal — already in design system).
- Reuse existing tokens in `index.css` / `tailwind.config.ts`. No purple gradients, no generic AI look.
- Cards with subtle shadows, rounded-xl, hover lift. Roadmap pages use a vertical phased timeline. Skills/certs use filter chips + grid.
- Mobile-first; nav collapses to drawer; all grids responsive.

## Assessment integration

Keep the existing 7-step assessment unchanged. After completion, the results page gets a prominent new CTA `🚀 View My Career Roadmap` that deep-links to `/careers/:slug` for the #1 match. Recommended skills become "Add to my skill tracker" chips that save to the dashboard.

## Files to create

- `src/components/layout/AppHeader.tsx`, `AppFooter.tsx`, `AppShell.tsx`
- `src/data/careerPaths2.ts`, `skills.ts`, `certifications.ts`, `resources.ts`
- `src/pages/Careers.tsx`, `CareerDetail.tsx`, `Skills.tsx`, `SkillDetail.tsx`, `Certifications.tsx`, `Resources.tsx`, `Roadmaps.tsx`, `Dashboard.tsx`, `About.tsx`, `AdminAnalytics.tsx`
- `src/lib/savedItems.ts` (localStorage helpers)
- `src/lib/analytics.ts` (client wrappers for new RPCs)

## Files to edit

- `src/App.tsx` — add routes + shell
- `src/pages/Index.tsx` — move into shell, refresh landing with platform pitch
- `src/components/ResultsPage.tsx` — add "View My Career Roadmap" CTA + skill-tracker chips

## Migration

Add aggregation RPCs only. No schema changes to existing tables.

## Out of scope for v1 (call out)

- Real user accounts (dashboard stays localStorage-based)
- Admin auth beyond a shared secret
- Full breadth of every certification / resource — I'll seed a credible starter set per category and we expand iteratively
- Per-career hand-curated copy edits beyond the structured content I generate

## Acceptance

- All nav routes resolve, no 404s
- 12 career detail pages render with full structured content
- Skills, Certifications, Resources pages filterable
- Dashboard shows last assessment + saved items
- Existing assessment + share flow still works end-to-end
- Mobile nav works; lighthouse-ish SEO basics on each page (title, description, canonical, H1)

Approve to start with the migration (analytics RPCs) and then the code build.
