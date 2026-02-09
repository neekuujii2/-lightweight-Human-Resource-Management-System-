from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..schemas.attendance import Attendance, AttendanceCreate
from ..services.attendance_service import AttendanceService

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/", response_model=Attendance)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    return AttendanceService.mark_attendance(db, attendance)

@router.get("/", response_model=List[Attendance])
def query_attendance(
    employee_id: Optional[int] = Query(None),
    date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    return AttendanceService.get_attendance(db, employee_id, date)
