from typing import Annotated

from fastapi import HTTPException, status, Header

from models.user_model import User


async def verfiy_api_key(
    api_key: str | None = None,
    Authorization: Annotated[str | None, Header()] = None,
) -> bool:

    if not api_key and not Authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized - No API key provided",
        )

    if api_key:
        api_key = api_key
    elif Authorization and Authorization.startswith("Bearer "):
        api_key = Authorization.split(" ")[1]
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized - Invalid API key",
        )

    user = User.objects(api_key=api_key).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized - Invalid API key",
        )

    return True
