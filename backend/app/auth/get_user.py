
from app.database.db import get_db_session
from app.database.models import Users
from app.auth.config import JWT_KEY

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

# Set up OAuth2 with a token URL for login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db_session)):
    try:
        # Decode the JWT token and verify its signature
        payload = jwt.decode(token, JWT_KEY, algorithms=["HS256"])
        
        # Extract the username (subject) from the token payload
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token: 'sub' claim missing")
        
        # Fetch the user from the database
        user = db.query(Users).filter(Users.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
