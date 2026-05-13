from datetime import datetime

from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    created_at: datetime | None = None

    model_config = {"from_attributes": True}
