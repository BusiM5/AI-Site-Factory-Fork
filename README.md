# AI-Site-Factory-and-Outreach-Pipeline
This project is an end-to-end automation system that collects business data, cleans and structures it, and uses AI to generate high-quality website content and personalized outreach messages. The system streamlines the entire workflow from raw data ingestion to publish-ready content and communication.

## Local dev pipeline (single command)

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### First-time setup (root folder)
```bash
npm install
```

### Start everything with one command
```bash
npm run pipeline
```

If PowerShell blocks `npm.ps1` on your machine, use:
```bash
npm.cmd run pipeline
```

This command:
- installs backend requirements from `backend/requirements.txt`
- installs frontend dependencies in `frontend/`
- starts FastAPI on `http://127.0.0.1:8000`
- starts React on `http://localhost:3000`

## Environment

Create a root `.env` file using `.env.example` as the template:

```bash
APIFY_API_TOKEN=your-apify-token
NETLIFY_API_TOKEN=your-netlify-token
APIFY_ACTOR_ID=compass~crawler-google-places
DEFAULT_LOCATION_QUERY=Durban, South Africa
SCRAPE_RESULT_LIMIT=10
```

The backend reads these values server-side. The frontend never receives the API tokens.

### Frontend API target
The frontend reads `REACT_APP_API_BASE_URL` if set, and falls back to `http://127.0.0.1:8000`.

## Current workflow

- Select one or more preconfigured industry presets.
- Run Apify Google Maps scraping with a 10-business cap per preset.
- Review and select the returned businesses.
- Submit selected businesses to the placeholder generation model.
- Deploy generated static landing pages to Netlify through the Netlify API.

## Backend API

- `GET /api/config/status` checks whether required server-side tokens are configured.
- `GET /api/industries` returns available industry scrape presets and their Apify input templates.
- `POST /api/scrape` runs selected Apify presets for a target market/location.
- `POST /api/deploy` generates landing-page context and deploys selected businesses to Netlify.

## Tech stack
### Frontend
- React
- Tailwind CSS
- Vercel (Deployment)
- https://ai-site-factory-frontend.vercel.app/ 
### Backend
- Python(FastAPI)
- Render(Deployment)
- https://ai-site-factory-backend.onrender.com/docs
### Database
- PostgreSQL(/SQLite)

## AI Layer
- Google GeminiAPI(Vertex AI)

## Deployment
- Netlify
## CRM Tracking
- Zendesk API

## Email Sending
-

## File Handling
- Pandas for CSV cleaning

## Hosting
- Render/Railway
- AWS later

  
