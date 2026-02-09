from sqlalchemy.orm import Session
from ..models.employee import Employee
from ..schemas.employee import EmployeeCreate
from ..core.exceptions import ConflictException, NotFoundException

class EmployeeService:
    @staticmethod
    def get_employees(db: Session):
        return db.query(Employee).all()

    @staticmethod
    def create_employee(db: Session, employee_data: EmployeeCreate):
        # Check if employee_id or email already exists
        if db.query(Employee).filter(Employee.employee_id == employee_data.employee_id).first():
            raise ConflictException(f"Employee with ID {employee_data.employee_id} already exists")
        
        if db.query(Employee).filter(Employee.email == employee_data.email).first():
            raise ConflictException(f"Employee with email {employee_data.email} already exists")

        db_employee = Employee(**employee_data.model_dump())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee

    @staticmethod
    def delete_employee(db: Session, employee_id: int):
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            raise NotFoundException(f"Employee with ID {employee_id} not found")
        
        db.delete(employee)
        db.commit()
        return {"success": True, "message": "Employee deleted successfully"}
