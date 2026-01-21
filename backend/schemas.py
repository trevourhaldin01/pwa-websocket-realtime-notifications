from pydantic import BaseModel

class SuggestionCreate(BaseModel):
    title: str
    message: str

class SuggestionOut(SuggestionCreate):
    id: int

    class Config:
        orm_mode = True    

class UserCreate(BaseModel):
    username: str
    password: str    

class UserLogin(BaseModel):
    username: str
    password: str