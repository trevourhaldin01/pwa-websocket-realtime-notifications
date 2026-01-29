from fastapi import FastAPI,Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Suggestion, User
from schemas import SuggestionCreate,SuggestionOut, UserCreate, UserLogin, PaginatedSuggestions
from ws import ConnectionManager
from fastapi.middleware.cors import CORSMiddleware
from auth import verify_token, hash_password, verify_password,create_access_token


app = FastAPI(title="SUGGESTIONS API", version="1.0.0")
origins = [
    "http://localhost:5173",   # Vite dev
    "http://127.0.0.1:5173",
    # add your production domain later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
manager = ConnectionManager()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/register")
def register(data:UserCreate, db:Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    print("Registering user:", data.password)
    hashed_pwd = hash_password(data.password)
    print("Hashed password:", hashed_pwd)
    user = User(username=data.username, hashed_password=hashed_pwd)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(data: UserLogin, db:Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# --- Protected example ---
@app.get("/me")
async def me(token: str):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"username": payload.get("sub")}
    


@app.post("/suggestions", response_model=SuggestionOut)
async def create_suggestion(data: SuggestionCreate, db: Session = Depends(get_db)):
    suggestion = Suggestion(**data.model_dump())
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)

    await manager.broadcast({
        "title": "New Suggestion",
        "message": suggestion.title

    })
    return suggestion

@app.get("/suggestions", response_model=PaginatedSuggestions)
def get_suggestions(
    token: str, 
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page")
):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # calculate offset
    offset = (page - 1) * page_size

    suggestions = (
        db.query(Suggestion)
        .order_by(Suggestion.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )
    # Convert to Pydantic models (v2)
    try:
        data = [SuggestionOut.model_validate(s) for s in suggestions]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pydantic validation failed: {e}")

    total = db.query(Suggestion).count()
    return PaginatedSuggestions(
        total=total,
        page=page,
        page_size=page_size,
        data=data
    )
    

@app.websocket("/ws/suggestions")
async def suggestions_ws(websocket: WebSocket, token:str):
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=1008)
        return
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)



