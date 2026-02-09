from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.employee import Employee, EmployeeCreate
from ..services.employee_service import EmployeeService

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=Employee)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return EmployeeService.create_employee(db, employee)

@router.get("/", response_model=List[Employee])
def list_employees(db: Session = Depends(get_db)):
    return EmployeeService.get_employees(db)

@router.delete("/{id}")
def delete_employee(id: int, db: Session = Depends(get_db)):
    return EmployeeService.delete_employee(db, id)
