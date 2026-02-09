# HRMS Lite – Backend & Database Service

Production-ready backend service for a lightweight Human Resource Management System.

## Tech Stack
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Validation:** Pydantic

## Project Structure
```
backend/
├── app/
│   ├── main.py            # API entry point
│   ├── database.py        # DB connection & Session
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic validation schemas
│   ├── routers/           # API routes
│   ├── services/          # Business logic
│   └── core/              # Config & Exceptions
├── alembic/               # Database migrations
└── requirements.txt       # Dependencies
```

## Setup Instructions

1. **Clone the repository**
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Environment:**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/db_name
   ```
5. **Run Migrations:**
   ```bash
   alembic upgrade head
   ```
6. **Start the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

## API Base URL
Local: `http://localhost:8000`

## Deployment
Compatible with Render and Railway. Ensure `DATABASE_URL` is set in environment variables.
