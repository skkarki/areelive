# Careers setup

The public Careers page is `/careers`; authorised admins review submissions at
`/admin/careers`. This is separate from creator and agency applications.

## Rollout

1. Apply `supabase/migrations/20260927120000_career_applications.sql` to the
   configured Supabase project before deploying the updated frontend. Use your
   authenticated Supabase CLI (`supabase db push`) or Supabase SQL editor.
2. Confirm the `career-documents` bucket is private, with its 10 MB size limit and
   PDF/DOC/DOCX MIME allowlist. Anonymous callers may insert files but cannot list,
   read, overwrite, or delete them. Only existing admin-role users may read files
   and applications and change review statuses.
3. In a staging project, submit a test application with both documents. Confirm
   that an administrator can download both, mark it reviewed, and see the saved
   status after refresh. Confirm anonymous/non-admin reads fail.
4. Deploy the frontend. Application success is displayed only after document
   uploads and the application insert complete. Retrying a record save reuses
   the application ID and uploads to avoid creating duplicate applications.

No Supabase database administrator credentials are included in this checkout;
the migration must be applied by the project owner before submissions work.

## Retention and recovery

Documents uploaded before an abandoned/failed record save remain private.
Administrators should periodically remove unreferenced storage folders after an
appropriate retry window and set an applicant-data retention period. Keep files
referenced by application records for the approved retention period.

Rollback the frontend to the prior version if needed. Leave the additive table
and private bucket in place to preserve applicant records and documents; no
existing application/referral schema is changed. Do not drop applicant data as
part of a routine rollback.
