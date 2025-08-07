from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.vendor_approval import ApprovalStatus, ApprovalLevel


class VendorApprovalBase(BaseModel):
    vendor_id: int
    approver_id: int
    level: ApprovalLevel
    status: ApprovalStatus = ApprovalStatus.PENDING
    comments: Optional[str] = None


class VendorApprovalCreate(BaseModel):
    level: ApprovalLevel
    status: ApprovalStatus = ApprovalStatus.PENDING
    comments: Optional[str] = None


class VendorApprovalUpdate(BaseModel):
    status: Optional[ApprovalStatus] = None
    comments: Optional[str] = None


class VendorApprovalResponse(VendorApprovalBase):
    id: int
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 