from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Response, status, Path, Query

from dependencies.user_dependency import verfiy_api_key
from models.stock_model import Stock
from models.index_model import Index

from utils import rename_keys

router = APIRouter()

key_map = {
    "_id": "id",
    "companyName": "company_name",
    "logoUrl": "logo_url",
    "zipCode": "zip_code",
    "yearBorn": "year_born",
    "maxAge": "max_age",
    "exercisedValue": "exercised_value",
    "unexercisedValue": "unexercised_value",
    "marketCap": "market_cap",
    "companyOfficers": "company_officers",
    "exchangeName": "exchange_name",
    "createdAt": "created_at",
    "updatedAt": "updated_at",
}


@router.get("")
async def get_tickers(
    api_key: Annotated[dict, Depends(verfiy_api_key)],
    response: Response,
    market: str | None = Query(
        None,
        description="Filter by market type (`stocks`, `indices`). By default all markets are included.",
    ),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, description="Items per page"),
    sort_by: Optional[str] = Query(None, description="Field to sort by"),
    order: Optional[str] = Query(None, description="Sort order (asc or desc)"),
):
    # Initialize variables
    total_count = 0
    tickers = []

    # Create base pipeline
    pipeline = []

    # Add sorting if specified
    if sort_by:
        sort_direction = -1 if order and order.lower() == "desc" else 1
        pipeline.append({"$sort": {sort_by: sort_direction}})

    # Create count pipeline for pagination
    count_pipeline = pipeline.copy()
    count_pipeline.append({"$count": "total_count"})

    # Add pagination to main pipeline
    skip_pipeline = pipeline.copy()
    skip_pipeline.append({"$skip": (page - 1) * limit})
    skip_pipeline.append({"$limit": limit})

    # Execute queries based on market type
    if market == "stocks":
        # Get count
        count_result = list(Stock.objects.aggregate(count_pipeline))
        total_count = count_result[0]["total_count"] if count_result else 0

        # Get paginated data
        stocks_cursor = Stock.objects.aggregate(skip_pipeline)
        stock_list = list(stocks_cursor)
        tickers.extend(stock_list)

    elif market == "indices":
        # Get count
        count_result = list(Index.objects.aggregate(count_pipeline))
        total_count = count_result[0]["total_count"] if count_result else 0

        # Get paginated data
        indices_cursor = Index.objects.aggregate(skip_pipeline)
        indices_list = list(indices_cursor)
        tickers.extend(indices_list)

    else:
        # Get stocks count
        count_stocks_result = list(Stock.objects.aggregate(count_pipeline))
        stocks_count = (
            count_stocks_result[0]["total_count"] if count_stocks_result else 0
        )

        # Get indices count
        count_indices_result = list(Index.objects.aggregate(count_pipeline))
        indices_count = (
            count_indices_result[0]["total_count"] if count_indices_result else 0
        )

        total_count = stocks_count + indices_count

        # Get paginated data - need to handle differently when combining collections
        if total_count > 0:
            # Calculate how many items to take from each collection
            if stocks_count == 0:
                indices_limit = limit
                stocks_limit = 0
            elif indices_count == 0:
                stocks_limit = limit
                indices_limit = 0
            else:
                # Proportionally split the limit between stocks and indices
                stocks_ratio = stocks_count / total_count
                stocks_limit = min(int(limit * stocks_ratio), stocks_count)
                indices_limit = min(limit - stocks_limit, indices_count)

            # Adjust skip values based on pagination
            skip_stocks = 0
            skip_indices = 0

            if page > 1:
                # Calculate which collection to skip items from
                items_before = (page - 1) * limit

                if items_before <= stocks_count:
                    skip_stocks = items_before
                else:
                    skip_stocks = stocks_count
                    skip_indices = items_before - stocks_count

            # Get stocks
            if stocks_limit > 0:
                stocks_pipeline = pipeline.copy()
                stocks_pipeline.append({"$skip": skip_stocks})
                stocks_pipeline.append({"$limit": stocks_limit})
                stocks_cursor = Stock.objects.aggregate(stocks_pipeline)
                tickers.extend(list(stocks_cursor))

            # Get indices
            if indices_limit > 0:
                indices_pipeline = pipeline.copy()
                indices_pipeline.append({"$skip": skip_indices})
                indices_pipeline.append({"$limit": indices_limit})
                indices_cursor = Index.objects.aggregate(indices_pipeline)
                tickers.extend(list(indices_cursor))

    # Calculate pagination metadata
    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 0

    if page > total_pages and total_pages > 0:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "status": "error",
            "message": "Page number exceeds total pages",
        }

    # Process results
    processed_tickers = []
    for stock in tickers:
        stock["_id"] = str(stock["_id"])
        processed_stock = rename_keys(stock, key_map)
        processed_stock.pop("created_at", None)
        processed_stock.pop("updated_at", None)
        processed_tickers.append(processed_stock)

    return {
        "status": "success",
        "data": processed_tickers,
        "pagination": {
            "count": len(processed_tickers),
            "total": total_count,
            "page": page,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        },
    }


@router.get("/{ticker}")
async def get_ticker(
    response: Response,
    tkr: Annotated[
        str, Path(alias="ticker", title="Ticker", description="Ticker of the stock")
    ],
):
    ticker = Stock.objects(ticker=tkr).first()

    if not ticker:
        ticker = Index.objects(ticker=tkr).first()

    if not ticker:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {
            "status": "error",
            "message": "Ticker not found",
        }

    ticker: dict = ticker.to_mongo().to_dict()
    ticker["_id"] = str(ticker["_id"])
    ticker = rename_keys(ticker, key_map)
    ticker.pop("created_at", None)
    ticker.pop("updated_at", None)

    return {
        "status": "success",
        "data": ticker,
    }
