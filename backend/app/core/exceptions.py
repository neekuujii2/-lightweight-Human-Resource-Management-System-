from fastapi import HTTPException, status

class HRMSException(HTTPException):
    def __init__(self, status_code: int, message: str):
        super().__init__(status_code=status_code, detail={"success": False, "message": message})

class NotFoundException(HRMSException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(status_code=status_code.HTTP_404_NOT_FOUND, message=message)

class ConflictException(HRMSException):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(status_code=status_code.HTTP_409_CONFLICT, message=message)

class ValidationException(HRMSException):
    def __init__(self, message: str = "Validation error"):
        super().__init__(status_code=status_code.HTTP_400_BAD_REQUEST, message=message)
