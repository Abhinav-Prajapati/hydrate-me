from app.database.db import get_db_session
from app.database.models import Users
from app.auth.config import JWT_KEY
from app.auth.get_user import get_current_user

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from jose import jwt
import bcrypt

# Set up OAuth2 with a token URL for login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter()

# Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

class CreateUserResponse(BaseModel):
    username: str
    token: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Register a new user
@router.post("/register/", response_model=CreateUserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db_session)):
    # Check if username already exists
    existing_user = db.query(Users).filter(Users.username == user.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Hash the password before saving it to the database
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    # Create a new user instance
    new_user = Users(
        username=user.username,
        email=user.email,
        password_hash=hashed_password.decode('utf-8')  # Store as a string in the database
    )

    # Generate a JWT token for the new user
    payload_data = {"sub": new_user.username}
    token = jwt.encode(payload_data, key=JWT_KEY)

    # Add the user to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return a response with a message and the JWT token
    return CreateUserResponse(username=user.username, token=token)

@router.post("/login/", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db_session)):
    db_user = db.query(Users).filter(Users.username == form_data.username).first()

    # Verify the user exists and the password is correct
    if not db_user or not bcrypt.checkpw(form_data.password.encode('utf-8'), db_user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Generate JWT token
    payload_data = {"sub": db_user.username}
    token = jwt.encode(payload_data, key=JWT_KEY)

    return {"access_token": token, "token_type": "bearer"}

# Protected route to get user profile
@router.get("/profile/", response_model=UserRead)
def get_user_profile(current_user: Users = Depends(get_current_user)):
    return current_user

@router.get("/get_msg/", response_model=str)
def get_user_msg(current_user: Users= Depends(get_user_profile)):
    return "What does the doorbell say? Ding dong! 🤣"
