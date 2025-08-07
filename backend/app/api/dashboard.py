from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from datetime import datetime, timedelta
from ..database import get_db
from ..models.vendor import Vendor, VendorStatus
from ..models.vendor_approval import VendorApproval, ApprovalStatus
from ..models.vendor_document import VendorDocument
from ..auth import get_current_active_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics")
async def get_dashboard_metrics(
    db: Session = Depends(get_db)
    # current_user: User = Depends(get_current_active_user)  # Temporarily disabled for testing
):
    """Get dashboard metrics"""
    try:
        # Total vendors
        total_vendors = db.query(Vendor).count()
        
        # Pending approvals (vendors with pending status)
        pending_approvals = db.query(Vendor).filter(
            Vendor.status == VendorStatus.PENDING
        ).count()
        
        # This month onboarded (vendors created this month)
        now = datetime.utcnow()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_onboarded = db.query(Vendor).filter(
            Vendor.created_at >= start_of_month
        ).count()
        
        # Compliance rate (vendors with documents)
        vendors_with_documents = db.query(Vendor).join(
            VendorDocument, Vendor.id == VendorDocument.vendor_id
        ).distinct().count()
        
        compliance_rate = (vendors_with_documents / total_vendors * 100) if total_vendors > 0 else 0
        
        # Calculate changes (comparing with last month)
        last_month = start_of_month - timedelta(days=1)
        last_month_start = last_month.replace(day=1)
        last_month_onboarded = db.query(Vendor).filter(
            and_(
                Vendor.created_at >= last_month_start,
                Vendor.created_at < start_of_month
            )
        ).count()
        
        # Calculate percentage changes
        vendor_change = ((total_vendors - (total_vendors - this_month_onboarded)) / (total_vendors - this_month_onboarded) * 100) if (total_vendors - this_month_onboarded) > 0 else 0
        onboarding_change = ((this_month_onboarded - last_month_onboarded) / last_month_onboarded * 100) if last_month_onboarded > 0 else 0
        compliance_change = 2.1  # Mock change for now
        
        return {
            "totalVendors": {
                "value": total_vendors,
                "change": f"+{vendor_change:.1f}%" if vendor_change > 0 else f"{vendor_change:.1f}%",
                "changeType": "positive" if vendor_change > 0 else "negative"
            },
            "pendingApprovals": {
                "value": pending_approvals,
                "change": f"+{pending_approvals}",
                "changeType": "neutral"
            },
            "thisMonthOnboarded": {
                "value": this_month_onboarded,
                "change": f"+{onboarding_change:.1f}%" if onboarding_change > 0 else f"{onboarding_change:.1f}%",
                "changeType": "positive" if onboarding_change > 0 else "negative"
            },
            "complianceRate": {
                "value": f"{compliance_rate:.1f}%",
                "change": f"+{compliance_change}%",
                "changeType": "positive"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching dashboard metrics: {str(e)}"
        )


@router.get("/vendor-distribution")
async def get_vendor_distribution(
    db: Session = Depends(get_db)
):
    """Get vendor distribution by category"""
    try:
        # Get vendor counts by business vertical
        distribution = db.query(
            Vendor.business_vertical,
            func.count(Vendor.id).label('count')
        ).group_by(Vendor.business_vertical).all()
        
        # Define colors for different categories
        colors = {
            'manufacturing': '#1E40AF',
            'services': '#059669',
            'technology': '#F59E0B',
            'logistics': '#DC2626',
            'others': '#64748B'
        }
        
        data = []
        for category, count in distribution:
            color = colors.get(category.lower(), colors['others'])
            data.append({
                "name": category.title() if category else "Others",
                "value": count,
                "color": color
            })
        
        # If no data, return default structure
        if not data:
            data = [
                {"name": "Manufacturing", "value": 0, "color": colors['manufacturing']},
                {"name": "Services", "value": 0, "color": colors['services']},
                {"name": "Technology", "value": 0, "color": colors['technology']},
                {"name": "Logistics", "value": 0, "color": colors['logistics']},
                {"name": "Others", "value": 0, "color": colors['others']}
            ]
        
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching vendor distribution: {str(e)}"
        )


@router.get("/onboarding-trends")
async def get_onboarding_trends(
    months: int = 6,
    db: Session = Depends(get_db)
):
    """Get vendor onboarding trends for the specified number of months"""
    try:
        now = datetime.utcnow()
        data = []
        
        for i in range(months):
            # Calculate month start and end
            month_start = (now - timedelta(days=30*i)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if i == 0:
                month_end = now
            else:
                month_end = (now - timedelta(days=30*(i-1))).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            # Get vendors created in this month
            total_vendors = db.query(Vendor).filter(
                and_(
                    Vendor.created_at >= month_start,
                    Vendor.created_at < month_end
                )
            ).count()
            
            # Get approved vendors in this month
            approved_vendors = db.query(Vendor).filter(
                and_(
                    Vendor.created_at >= month_start,
                    Vendor.created_at < month_end,
                    Vendor.status == VendorStatus.APPROVED
                )
            ).count()
            
            # Pending vendors in this month
            pending_vendors = total_vendors - approved_vendors
            
            month_name = month_start.strftime('%b')
            
            data.append({
                "month": month_name,
                "vendors": total_vendors,
                "approved": approved_vendors,
                "pending": pending_vendors
            })
        
        # Reverse to show oldest first
        data.reverse()
        
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching onboarding trends: {str(e)}"
        )


@router.get("/approval-workflow-status")
async def get_approval_workflow_status(
    db: Session = Depends(get_db)
):
    """Get approval workflow status breakdown"""
    try:
        # Count vendors by status
        submitted = db.query(Vendor).filter(
            Vendor.status == VendorStatus.PENDING
        ).count()
        
        l1_review = db.query(Vendor).filter(
            Vendor.status == VendorStatus.UNDER_REVIEW
        ).count()
        
        l2_review = db.query(Vendor).filter(
            Vendor.status == VendorStatus.UNDER_REVIEW
        ).count()  # This could be refined based on approval levels
        
        approved = db.query(Vendor).filter(
            Vendor.status == VendorStatus.APPROVED
        ).count()
        
        rejected = db.query(Vendor).filter(
            Vendor.status == VendorStatus.REJECTED
        ).count()
        
        data = [
            {"stage": "Submitted", "count": submitted, "color": "#64748B"},
            {"stage": "L1 Review", "count": l1_review, "color": "#F59E0B"},
            {"stage": "L2 Review", "count": l2_review, "color": "#D97706"},
            {"stage": "Approved", "count": approved, "color": "#059669"},
            {"stage": "Rejected", "count": rejected, "color": "#DC2626"}
        ]
        
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching approval workflow status: {str(e)}"
        )


@router.get("/recent-activities")
async def get_recent_activities(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get recent activities for the dashboard"""
    try:
        activities = []
        
        # Get recent vendor registrations
        recent_vendors = db.query(Vendor).order_by(
            Vendor.created_at.desc()
        ).limit(limit).all()
        
        for vendor in recent_vendors:
            activities.append({
                "id": f"vendor_{vendor.id}",
                "type": "vendor_submitted",
                "title": "New Vendor Registration",
                "description": f"{vendor.company_name} submitted registration form",
                "timestamp": vendor.created_at.isoformat(),
                "icon": "UserPlus",
                "color": "text-primary",
                "bgColor": "bg-primary/10"
            })
        
        # Get recent approvals
        recent_approvals = db.query(VendorApproval).filter(
            VendorApproval.status == ApprovalStatus.APPROVED
        ).order_by(
            VendorApproval.approved_at.desc()
        ).limit(limit).all()
        
        for approval in recent_approvals:
            vendor = db.query(Vendor).filter(Vendor.id == approval.vendor_id).first()
            if vendor:
                activities.append({
                    "id": f"approval_{approval.id}",
                    "type": "vendor_approved",
                    "title": "Vendor Approved",
                    "description": f"{vendor.company_name} has been approved",
                    "timestamp": approval.approved_at.isoformat() if approval.approved_at else approval.created_at.isoformat(),
                    "icon": "CheckCircle",
                    "color": "text-success",
                    "bgColor": "bg-success/10"
                })
        
        # Get recent document uploads
        recent_documents = db.query(VendorDocument).order_by(
            VendorDocument.created_at.desc()
        ).limit(limit).all()
        
        for document in recent_documents:
            vendor = db.query(Vendor).filter(Vendor.id == document.vendor_id).first()
            if vendor:
                activities.append({
                    "id": f"document_{document.id}",
                    "type": "document_uploaded",
                    "title": "Document Uploaded",
                    "description": f"{vendor.company_name} uploaded {document.document_type.value}",
                    "timestamp": document.created_at.isoformat(),
                    "icon": "FileText",
                    "color": "text-accent",
                    "bgColor": "bg-accent/10"
                })
        
        # Sort all activities by timestamp and take the most recent
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        activities = activities[:limit]
        
        return activities
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recent activities: {str(e)}"
        ) 