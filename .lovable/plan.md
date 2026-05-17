## Goal
Currently the Pathfinder does not capture any location data, so there's no way to see which countries it has reached. This plan adds country capture per assessment and a private page to view the list.

## What we'll build

1. **Capture country on assessment submit**
   - Detect the visitor's country client-side using a free IP geolocation API (e.g. `https://ipapi.co/json/`) at the moment they finish the assessment.
   - Store the ISO country code (e.g. `US`, `KE`) on the `assessments` row.
   - Fail silently if the lookup fails — assessment still saves with `country = null`.

2. **Database change**
   - Add `country text` column to `assessments` (nullable, 2-letter ISO code).
   - Update the `create_assessment` RPC to accept and store `_country`.

3. **Reach view (`/reach`)**
   - New route, not linked from the public UI.
   - Protected by a simple shared passphrase prompt (stored as a Lovable Cloud secret) — no full auth system.
   - Shows:
     - Total assessments completed
     - Total unique countries reached
     - Table of countries with flag, name, and count, sorted by count desc
   - Data fetched via a new `SECURITY DEFINER` RPC `get_country_stats()` that returns aggregated counts only (no per-user data).

## Technical notes
- ISO code → flag/name rendered client-side with a tiny lookup map (no extra dependency).
- The geolocation lookup is best-effort and never blocks the results screen.
- Existing rows will show as "Unknown" until new assessments come in.

## Out of scope
- Backfilling country for historical assessments.
- City/region granularity.
- Public-facing "as seen in X countries" badge (can add later if you want).

## Question
Do you want the `/reach` page protected by a shared passphrase, or is it fine to leave it unlisted but publicly viewable (aggregated counts only, no personal data)?
