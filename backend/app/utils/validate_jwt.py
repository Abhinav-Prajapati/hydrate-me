from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer
from jose import jwt, JWTError, ExpiredSignatureError

from app.utils.config import PRIVATE_JWT_KEY

ALGORITHM = "HS256"
EXPECTED_AUDIENCE = "authenticated" 

def validate_jwt(token: str = Security(HTTPBearer())):
    try:
        payload = jwt.decode(
            token.credentials,
            PRIVATE_JWT_KEY,
            algorithms=[ALGORITHM],
            audience=EXPECTED_AUDIENCE,
        )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"JWT decoding error: {str(e)}")
