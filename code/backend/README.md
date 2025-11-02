Strapi Ads Integrator (API-based)
---------------------------------
This archive provides Strapi v4 API endpoints and services to:
- Store clients and multiple ad accounts (Google / Meta) in DB
- Fetch campaign & performance data from Google Ads and Meta Ads using credentials stored in DB
- Cron job to sync all active accounts daily
- Routes: /api/ads-fetcher/sync-all (admin) and /api/ads-fetcher/sync-client (client user)

Installation:
1. Unzip into your Strapi project root so the `src/api/` and `config/` folders merge with your project:
   unzip strapi-ads-plugin.zip -d .
2. Install required NPM libs in your Strapi project:
   npm install google-ads-api facebook-nodejs-business-sdk
3. Ensure Users & Permissions plugin is configured and associate Users to Clients.
4. Run Strapi (npm run develop). Trigger manual sync:
   - Admin: GET /api/ads-fetcher/sync-all
   - Client (logged in): GET /api/ads-fetcher/sync-client

Notes:
- This is built for Strapi v4 and is DB-agnostic (works with SQLite/Postgres/MySQL supported by Strapi).
- Sensitive fields are stored in DB. Consider encrypting them or restricting admin access.
- The code uses Strapi entity service and database queries; adapt as needed for very large accounts or rate limits.
