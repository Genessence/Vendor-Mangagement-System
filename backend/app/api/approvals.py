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
    db: Session = Depends(get_db)
    # current_user: User = Depends(get_current_active_user)  # Temporarily disabled for testing
):
    """Create a new approval for a vendor"""
    # Temporarily use a default user ID for testing
    current_user_id = 1
    
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
        # Update existing approval instead of creating new one
        existing_approval.status = approval_data.status
        existing_approval.comments = approval_data.comments
        existing_approval.approver_id = current_user_id
        
        # If approved, set approved_at timestamp
        if approval_data.status == ApprovalStatus.APPROVED:
            existing_approval.approved_at = datetime.utcnow()
        
        db_approval = existing_approval
    else:
        # Create new approval
        db_approval = VendorApproval(
            vendor_id=vendor_id,
            approver_id=current_user_id,
            level=approval_data.level,
            status=approval_data.status,
            comments=approval_data.comments
        )
        
        # If approved, set approved_at timestamp
        if approval_data.status == ApprovalStatus.APPROVED:
            db_approval.approved_at = datetime.utcnow()
        
        db.add(db_approval)
    
    db.commit()
    db.refresh(db_approval)
    
    # Update vendor status based on approval
    if approval_data.status in [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]:
        all_approvals = db.query(VendorApproval).filter(
            VendorApproval.vendor_id == vendor_id
        ).all()
        
        # Check if all approvals are approved
        all_approved = all(
            app.status == ApprovalStatus.APPROVED 
            for app in all_approvals
        )
        
        if all_approved:
            vendor.status = VendorStatus.APPROVED
            vendor.approved_at = datetime.utcnow()
            vendor.approved_by = current_user_id
        elif any(app.status == ApprovalStatus.REJECTED for app in all_approvals):
            vendor.status = VendorStatus.REJECTED
        
        db.commit()
    
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


@router.get("/workflow-stats")
async def get_workflow_stats(
    db: Session = Depends(get_db)
    # current_user: User = Depends(get_current_active_user)  # Temporarily disabled for testing
):
    """Get workflow statistics for the dashboard"""
    from datetime import datetime, timedelta
    
    # Get today's date range
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    # Get week ago date
    week_ago = today - timedelta(days=7)
    week_ago_start = datetime.combine(week_ago, datetime.min.time())
    
    # Pending Level 1 - vendors with status 'pending'
    pending_level_1 = db.query(Vendor).filter(
        Vendor.status == VendorStatus.PENDING
    ).count()
    
    # Pending Level 2 - vendors with status 'under_review'
    pending_level_2 = db.query(Vendor).filter(
        Vendor.status == VendorStatus.UNDER_REVIEW
    ).count()
    
    # Approved Today - vendors approved today
    approved_today = db.query(Vendor).filter(
        Vendor.status == VendorStatus.APPROVED,
        Vendor.approved_at >= today_start,
        Vendor.approved_at <= today_end
    ).count()
    
    # Rejected This Week - vendors rejected in the last 7 days
    rejected_this_week = db.query(Vendor).filter(
        Vendor.status == VendorStatus.REJECTED,
        Vendor.updated_at >= week_ago_start
    ).count()
    
    return {
        "pendingLevel1": pending_level_1,
        "pendingLevel2": pending_level_2,
        "approvedToday": approved_today,
        "rejectedWeek": rejected_this_week
    }


 