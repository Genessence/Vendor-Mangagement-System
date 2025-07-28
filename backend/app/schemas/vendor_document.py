from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.vendor_document import DocumentType, DocumentStatus


class VendorDocumentBase(BaseModel):
    vendor_id: int
    document_type: DocumentType
    file_name: str
    file_path: str
    file_size: int
    mime_type: str
    status: DocumentStatus = DocumentStatus.PENDING
    expiry_date: Optional[datetime] = None
    review_comments: Optional[str] = None


class VendorDocumentCreate(VendorDocumentBase):
    pass


class VendorDocumentUpdate(BaseModel):
    status: Optional[DocumentStatus] = None
    expiry_date: Optional[datetime] = None
    review_comments: Optional[str] = None


class VendorDocumentResponse(VendorDocumentBase):
    id: int
    uploaded_by: Optional[int] = None
    reviewed_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 