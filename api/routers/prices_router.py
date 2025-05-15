from typing import Annotated

import yfinance as yf
from fastapi import APIRouter, Response, Depends, Path, status

from dependencies.user_dependency import verfiy_api_key
from network.yfinance_session import session

router = APIRouter()


@router.get("/{ticker}")
async def get_prices(
    api_key: Annotated[str, Depends(verfiy_api_key)],
    response: Response,
    ticker: Annotated[
        str, Path(description="The stock ticker symbol (e.g., AAPL, GOOGL, MSFT).")
    ],
):
    try:
        tkr = yf.Ticker(ticker)
        prices = {
            "price": tkr.info["currentPrice"],
            "price_change": tkr.info["regularMarketChange"],
            "price_change_percent": tkr.info["regularMarketChangePercent"],
            "volume": tkr.info["volume"],
            "avg_volume": tkr.info["averageVolume"],
        }
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"status": "error", "message": str(e)}

    return {
        "status": "success",
        "data": prices,
    }
