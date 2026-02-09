from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers import employee_router, attendance_router
from .core.exceptions import HRMSException
from .core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler
@app.exception_handler(HRMSException)
async def hrms_exception_handler(request: Request, exc: HRMSException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail,
    )

# Routers
app.include_router(employee_router)
app.include_router(attendance_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}
