# AviMiles Roblox OAuth

Callback URL:
https://avimiles-auth.vercel.app/api/roblox/callback

Vercel environment variables:
- ROBLOX_CLIENT_ID
- ROBLOX_CLIENT_SECRET
- ROBLOX_REDIRECT_URI
- OAUTH_STATE_SECRET
- AVIMILES_API_URL
- AVIMILES_SERVICE_TOKEN

Important: AVIMILES_API_URL must be a public HTTPS URL Vercel can reach. If your RRHosting API is only 127.0.0.1/private, the callback cannot save the link directly to it.
