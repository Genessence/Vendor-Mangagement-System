from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.vendor import Vendor, VendorStatus
from ..models.vendor_approval import VendorApproval, ApprovalStatus, ApprovalLevel
from ..schemas.vendor_approval import VendorApprovalCreate, VendorApprovalUpdate, VendorApprovalResponse
from ..auth import get_current_active_user
from datetime import datetime

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("/pending", response_model=List[VendorApprovalResponse])
async def get_pending_approvals(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    level: Optional[ApprovalLevel] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get pending approvals for the current user"""
    query = db.query(VendorApproval).filter(
        VendorApproval.approver_id == current_user.id,
        VendorApproval.status == ApprovalStatus.PENDING
    )
    
    if level:
        query = query.filter(VendorApproval.level == level)
    
    approvals = query.offset(skip).limit(limit).all()
    return approvals


@router.get("/vendor/{vendor_id}", response_model=List[VendorApprovalResponse])
async def get_vendor_approvals(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all approvals for a specific vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return vendor.approvals


@router.get("/vendor/{vendor_id}/public", response_model=List[VendorApprovalResponse])
async def get_vendor_approvals_public(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    """Get all approvals for a specific vendor (public endpoint)"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return vendor.approvals


@router.post("/vendor/{vendor_id}", response_model=VendorApprovalResponse)
async def create_vendor_approval(
    vendor_id: int,
    approval_data: VendorApprovalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new approval for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Check if approval already exists for this level
    existing_approval = db.query(VendorApproval).filter(
        VendorApproval.vendor_id == vendor_id,
        VendorApproval.level == approval_data.level
    ).first()
    
    if existing_approval:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Approval for level {approval_data.level} already exists"
        )
    
    db_approval = VendorApproval(
        vendor_id=vendor_id,
        approver_id=current_user.id,
        level=approval_data.level,
        status=approval_data.status,
        comments=approval_data.comments
    )
    
    db.add(db_approval)
    db.commit()
    db.refresh(db_approval)
    
    return db_approval


@router.put("/{approval_id}", response_model=VendorApprovalResponse)
async def update_approval(
    approval_id: int,
    approval_data: VendorApprovalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update an approval status"""
    approval = db.query(VendorApproval).filter(VendorApproval.id == approval_id).first()
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found"
        )
    
    # Check if user is the approver
    if approval.approver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own approvals"
        )
    
    # Update approval
    update_data = approval_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(approval, field, value)
    
    # If approved, set approved_at timestamp
    if approval_data.status == ApprovalStatus.APPROVED:
        approval.approved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(approval)
    
    # Check if all approvals are complete and update vendor status
    if approval_data.status in [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]:
        vendor = db.query(Vendor).filter(Vendor.id == approval.vendor_id).first()
        if vendor:
            all_approvals = db.query(VendorApproval).filter(
                VendorApproval.vendor_id == vendor.id
            ).all()
            
            # Check if all approvals are approved
            all_approved = all(
                app.status == ApprovalStatus.APPROVED 
                for app in all_approvals
            )
            
            if all_approved:
                vendor.status = VendorStatus.APPROVED
                vendor.approved_at = datetime.utcnow()
                vendor.approved_by = current_user.id
            elif any(app.status == ApprovalStatus.REJECTED for app in all_approvals):
                vendor.status = VendorStatus.REJECTED
            
            db.commit()
    
    return approval


@router.get("/stats")
async def get_approval_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get approval statistics for the current user"""
    total_pending = db.query(VendorApproval).filter(
        VendorApproval.approver_id == current_user.id,
        VendorApproval.status == ApprovalStatus.PENDING
    ).count()
    
    total_approved = db.query(VendorApproval).filter(
        VendorApproval.approver_id == current_user.id,
        VendorApproval.status == ApprovalStatus.APPROVED
    ).count()
    
    total_rejected = db.query(VendorApproval).filter(
        VendorApproval.approver_id == current_user.id,
        VendorApproval.status == ApprovalStatus.REJECTED
    ).count()
    
    return {
        "pending": total_pending,
        "approved": total_approved,
        "rejected": total_rejected,
        "total": total_pending + total_approved + total_rejected
    } 