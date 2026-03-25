from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import ssl
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import certifi

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url, tlsCAFile=certifi.where())
db = client[os.environ['DB_NAME']]

app = FastAPI()

class CORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            response = Response(status_code=200)
        else:
            response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

app.add_middleware(CORSMiddleware)
api_router = APIRouter(prefix="/api")


class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str
    status: str
    price: str
    original_price: Optional[str] = ""
    currency: Optional[str] = "CLP"
    bedrooms: int
    bathrooms: int
    parking: Optional[int] = 0
    area: Optional[str] = ""
    area_built: Optional[str] = ""
    area_total: Optional[str] = ""
    location: Optional[str] = ""
    region: Optional[str] = ""
    commune: Optional[str] = ""
    image_url: Optional[str] = ""
    image_urls: Optional[List[str]] = []
    description: Optional[str] = ""
    featured: Optional[bool] = False
    on_offer: Optional[bool] = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PropertyCreate(BaseModel):
    title: str
    type: str
    status: str
    price: str
    original_price: Optional[str] = ""
    currency: Optional[str] = "CLP"
    bedrooms: int
    bathrooms: int
    parking: Optional[int] = 0
    area: Optional[str] = ""
    area_built: Optional[str] = ""
    area_total: Optional[str] = ""
    location: Optional[str] = ""
    region: Optional[str] = ""
    commune: Optional[str] = ""
    image_url: Optional[str] = ""
    image_urls: Optional[List[str]] = []
    description: Optional[str] = ""
    featured: Optional[bool] = False
    on_offer: Optional[bool] = False


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    price: Optional[str] = None
    original_price: Optional[str] = None
    currency: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    parking: Optional[int] = None
    area: Optional[str] = None
    area_built: Optional[str] = None
    area_total: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None
    commune: Optional[str] = None
    image_url: Optional[str] = None
    image_urls: Optional[List[str]] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    on_offer: Optional[bool] = None


@api_router.get("/")
async def root():
    return {"message": "MACA Propiedades API"}


@api_router.get("/properties", response_model=List[Property])
async def get_properties():
    properties = await db.properties.find({}, {"_id": 0}).to_list(1000)
    for prop in properties:
        if isinstance(prop.get('created_at'), str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
    properties.sort(key=lambda p: (
        not p.get('featured', False),
        not p.get('on_offer', False)
    ))
    return properties


@api_router.post("/properties", response_model=Property)
async def create_property(input: PropertyCreate):
    property_dict = input.model_dump()
    property_obj = Property(**property_dict)
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.properties.insert_one(doc)
    return property_obj


@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, input: PropertyUpdate):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    if isinstance(existing.get('created_at'), str):
        existing['created_at'] = datetime.fromisoformat(existing['created_at'])
    update_data = input.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        existing[key] = value
    property_obj = Property(**existing)
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.properties.update_one({"id": property_id}, {"$set": doc})
    return property_obj


@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}


app.include_router(api_router)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
