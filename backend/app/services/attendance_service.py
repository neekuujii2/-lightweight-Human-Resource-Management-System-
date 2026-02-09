from sqlalchemy.orm import Session
from ..models.attendance import Attendance
from ..models.employee import Employee
from ..schemas.attendance import AttendanceCreate
from ..core.exceptions import ConflictException, NotFoundException
from datetime import date as date_type

class AttendanceService:
    @staticmethod
    def get_attendance(db: Session, employee_id: int = None, date: date_type = None):
        query = db.query(Attendance)
        if employee_id:
            query = query.filter(Attendance.employee_id == employee_id)
        if date:
            query = query.filter(Attendance.date == date)
        return query.all()

    @staticmethod
    def mark_attendance(db: Session, attendance_data: AttendanceCreate):
        # Check if employee exists
        employee = db.query(Employee).filter(Employee.id == attendance_data.employee_id).first()
        if not employee:
            raise NotFoundException(f"Employee with ID {attendance_data.employee_id} not found")

        # Check for duplicate attendance on same date
        existing = db.query(Attendance).filter(
            Attendance.employee_id == attendance_data.employee_id,
            Attendance.date == attendance_data.date
        ).first()
        
        if existing:
            raise ConflictException(f"Attendance already marked for employee {attendance_data.employee_id} on {attendance_data.date}")

        db_attendance = Attendance(**attendance_data.model_dump())
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
