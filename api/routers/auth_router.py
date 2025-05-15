from typing import Annotated, Any

# pip modules
from fastapi import APIRouter, Response, Depends, status


from models.user_model import User
from schemas.auth_schema import LoginUserSchema, SigninUserSchema
from services.auth_service import (
    generate_jwt_token,
    hash_password,
    set_jwt_cookie,
    verify_password,
)
from dependencies.auth_dependency import protect_route


router = APIRouter()


@router.post("/signup")
async def signup_route(user_data: SigninUserSchema, response: Response):
    # Check if user already exists
    if User.objects(email=user_data.email).first():
        response.status_code = status.HTTP_400_BAD_REQUEST

        return {
            "status": "error",
            "message": "User is already exists",
        }

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create a new user
    user = User(name=user_data.name, email=user_data.email, password=hashed_password)
    user.save()

    # Generate JWT token
    token = generate_jwt_token(data={"sub": user.email})

    # Set the token in the cookies
    set_jwt_cookie(token, response)

    user_dict: dict = user.to_mongo().to_dict()
    user_dict["_id"] = str(user_dict["_id"])
    user_dict.pop("password")

    return {
        "status": "success",
        "data": user_dict,
    }


@router.post("/login")
async def login_route(user_data: LoginUserSchema, response: Response):
    # Check if user exists and verify password
    user = User.objects(email=user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {
            "status": "error",
            "message": "Invalid credentials",
        }

    # Generate JWT token
    token = generate_jwt_token(data={"sub": user.email})

    # Set the token in the cookies
    set_jwt_cookie(token, response)

    user_dict: dict = user.to_mongo().to_dict()
    user_dict["_id"] = str(user_dict["_id"])
    user_dict.pop("password")

    return {
        "status": "success",
        "data": user_dict,
    }


@router.get("/logout")
async def logout_route(response: Response):
    # Clear the token from the cookies
    response.delete_cookie(key="token")

    return {
        "status": "success",
        "message": "Logged out successfully",
    }


@router.get("/check-auth")
async def check_auth_route(data: Annotated[dict, Depends(protect_route)]):

    return {"status": "success", **data}
