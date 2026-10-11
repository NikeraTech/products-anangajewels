# Migration and runtime configuration

This source-only export came exclusively from C:/xampp/htdocs/anangajewels-web.
Old Git history, node_modules, .next, next-env.d.ts and TypeScript build information
are excluded. Preserve package-lock.json; install the locked dependencies only in
an authorized development/deployment environment. Next generates next-env.d.ts
and route types with next typegen/dev/build; do not track its generated files.

The bundled jewellery catalogue and product/brand images are application assets,
not customer data. Without Sanity configuration the storefront uses this catalogue.
Optional Sanity integration requires NEXT_PUBLIC_SANITY_PROJECT_ID and
NEXT_PUBLIC_SANITY_DATASET. The importer additionally requires protected
SANITY_API_WRITE_TOKEN; running it uploads assets and replaces remote documents.
Do not run the importer as a migration verification step.

SANITY_REVALIDATE_SECRET protects the webhook, and RESEND_API_KEY enables contact
email. Configure secrets through protected runtime configuration, never Git.
CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, NEXT_PUBLIC_SITE_URL and optional
NEXT_PUBLIC_GA_ID also affect deployment. NEXT_PUBLIC values are browser-visible.
The supplied .env.example contains blank secret fields, not real credentials.

scripts/migrate-legacy.ts references a sibling legacy application. It is preserved
as source only and was not executed; do not run it under the strict source scope.
No other application was inspected or included. Scripts/import-to-sanity.ts was
not executed. No CMS, email, database, hosting, DNS or production setting changed.

There are no GitHub Actions workflows. This is preparation only: publication of
a local-directory source needs a separately reviewed runner source adapter. The
current runner accepts its existing GitHub mirror mappings, not this local source.
Do not use a manual push or weaken approval/identity/inventory gates.
