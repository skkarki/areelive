
## Overview

Build two public submission flows and one admin management surface:

1. **/join** — "Join AREELIVE" page with 5 role application options + application form
2. **/invite-broadcaster** — Broadcaster-to-broadcaster referral page + form
3. **/_authenticated/admin/applications** and **/admin/referrals** — admin panel to review, filter, update status, add notes, export CSV

Both public forms write to the database via public server functions (no login required to apply). Admin panel is gated to users with the `admin` role.

---

## Database (one migration)

New enums:
- `application_role`: agency, recruiter, host, admin, agency_manager
- `application_status`: pending, reviewed, approved, rejected
- `referral_status`: pending, contacted, approved, active, bonus_eligible, bonus_paid, rejected
- `app_role` (roles system): admin, moderator, user

New tables (all `public`, with GRANTs + RLS):

- `applications` — full_name, email, phone, country_city, applying_for (application_role), has_experience bool, capacity_estimate text, portfolio_link, agency_name, preferred_language, message, consent bool, status (default pending), admin_notes
- `broadcaster_referrals` — referrer_areelive_id, referrer_name, referrer_phone, friend_name, friend_phone, friend_country_city, friend_social_link, friend_prior_experience bool, note, status (default pending), admin_notes
- `user_roles` — (user_id, role) — standard secure roles pattern
- `has_role(uuid, app_role)` SECURITY DEFINER function

RLS:
- `applications` / `broadcaster_referrals`: INSERT allowed to `anon` + `authenticated` with length caps + consent check; SELECT/UPDATE restricted to admins via `has_role(auth.uid(), 'admin')`
- `user_roles`: SELECT to authenticated (needed by has_role); no client writes

---

## Server functions (`src/lib/*.functions.ts`)

- `submitApplication` — public, validates with Zod, inserts via server publishable client
- `submitReferral` — public, same shape
- `listApplications` / `listReferrals` — requires auth + admin role, returns rows
- `updateApplicationStatus` / `updateReferralStatus` — auth + admin, updates status + notes

---

## Routes

Public:
- `src/routes/join.tsx` — role cards, benefits section, application form (react-hook-form + zod), success state, unique head() metadata
- `src/routes/invite-broadcaster.tsx` — description, conditions list, referral form, success state, unique head() metadata

Admin (under existing `_authenticated`):
- `src/routes/_authenticated/admin/applications.tsx` — table, role filter, status dropdown, notes textarea, CSV export button
- `src/routes/_authenticated/admin/referrals.tsx` — same shape for referrals

Nav: add "Join AREELIVE" link to the existing site header/hero CTA area.

---

## Admin access

Add a small "Grant me admin" bootstrap: the first authenticated user can self-assign admin via a one-time server function that only succeeds when `user_roles` has zero admins. Documented inline. After that, admins grant others through the admin UI.

---

## CSV export

Client-side: convert rows to CSV string, trigger download via Blob. No server dependency.

---

## Out of scope

- Payment/payout of referral bonuses (manual, tracked via status)
- Email notifications to applicants (can be added later via Lovable AI or Resend)
- KYC verification integration
