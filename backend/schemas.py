from pydantic import BaseModel
from datetime import datetime

class SuggestionCreate(BaseModel):
    title: str
    message: str

class SuggestionOut(SuggestionCreate):
    id: int
    title: str
    message: str
    created_at: datetime

    model_config ={
        "from_attributes": True
    }   

class PaginatedSuggestions(BaseModel):
    total: int
    page: int
    page_size: int
    data: list[SuggestionOut]

class UserCreate(BaseModel):
    username: str
    password: str    

class UserLogin(BaseModel):
    username: str
    password: str