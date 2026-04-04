# Vertex: Precision Algorithmic Safety

Vertex is a comprehensive parametric insurance platform tailored specifically for gig workers (e.g., Swiggy, Zomato delivery partners). The application offers seamless onboarding, dynamic AI-based risk scoring for premiums, robust policy management, and a transparent, automated claims workflow that pays out directly when parametric triggers (like extreme weather disruptions) are met.

## 🚀 Key Features

### For Gig Workers
* **Fast Onboarding**: Direct signup and profile completion integrated tightly with real-time risk assessment.
* **Premium Calculations**: Risk scores are dynamically determined based on the user's city and delivery platform, combined with an AI service fallback heuristic.
* **Automated Claims (Parametric Triggers)**: Workers can simulate or automatically trigger claims based on parametric events (like "Heavy Rain"). No more waiting for manual approvals.
* **Modern Dashboard**: A beautiful, glassmorphism-inspired, responsive Next.js frontend where workers can view their current active policies, payouts, claims history, and profile updates.

### For Administrators
* **Analytics Dashboard**: Admins can get a bird's-eye view of active policies, total processed claims, and detect potential fraud anomalies.
* **Risk Heatmaps**: Built-in insights for active coverage zones, ensuring the platform remains adequately capitalized based on high-risk locations.

## 🛠 Tech Stack

The platform is split into specialized microservices and frontend applications for maximum modularity:

* **Frontend (`/frontend`)**:
  * **Framework**: React.js with Next.js (App Router)
  * **Styling**: Tailwind CSS with custom thematic elements (glassmorphism UI, modern curated fonts, complex radial gradients)
  * **Icons**: Lucide React
  * **Authentication**: Supabase Auth (Client-side integration)

* **Backend (`/backend`)**:
  * **Framework**: Node.js with Express.js
  * **Database & BaaS**: Supabase (PostgreSQL)
  * **Interaction**: REST API architecture bridging the Next.js frontend to the AI risk calculation microservice.

* **Database Schema (`Supabase`)**:
  * Employs structured row-level security (RLS).
  * Main tables: `Workers`, `Policies`, and `Claims`.

* **AI Service (`/ai-service`)**:
  * Standalone Python backend for processing external factors to finalize a localized parametric risk score.

## 📦 Project Structure

```text
├── frontend/              # Next.js frontend application
│   ├── src/app/          # Application routes (dashboard, login, claim, analytics)
│   ├── src/components/   # Reusable UI components including sidebars and cards
│   ├── src/lib/          # Helper modules for Supabase communication
│   └── public/           # Static assets
├── backend/               # Express server managing business logic
│   ├── server.js         # Entry point defining routes like /api/trigger-claim
│   └── seed_*.js         # Utility scripts for database seeding
├── ai-service/            # Premium calculation AI model serving
└── supabase_schema.sql    # Raw SQL DDL for bootstrapping database structure
```

## 🔐 Environment Variables

> **IMPORTANT:** Environment variables (`.env`, `.env.local`) contain sensitive API keys and database passwords. These config files are **explicitly ignored via `.gitignore` and must never be committed to Git.**

### Frontend (`frontend/.env.local`)
To run the frontend, you'll need the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
BACKEND_URL=http://localhost:3001
```

### Backend (`backend/.env`)
To run the backend, create `.env` locally:
```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ALLOWED_ORIGINS=http://localhost:3000
ADMIN_EMAILS=admin@example.com
PORT=3001
```

## 🚦 Getting Started

### 1. Database Setup
Execute the `supabase_schema.sql` into your Supabase SQL editor to create the `Workers`, `Policies`, and `Claims` tables alongside the appropriate Row Level Security (RLS) policies.

### 2. Backend Server
Navigate to the `backend/` directory, install packages, and start the development server:
```bash
cd backend
npm install
node server.js
```
The server will run on `http://localhost:3001`.

### 3. Frontend App
Navigate to the `frontend/` directory, install dependencies, and run the Next.js dev server:
```bash
cd frontend
npm install
npm run dev
```
The client application will run on `http://localhost:3000`. 

## 🛡️ Security Notes
All table queries in this project's backend are strictly typed to interface with capitalized table names (`Workers`, `Policies`, `Claims`) which mitigates schema cache visibility errors from PostgREST when executing custom DB utility functions. All sensitive credentials are excluded from source control.
