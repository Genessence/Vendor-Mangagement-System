from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from ..database import get_db
from ..models.user import User
from ..models.vendor import Vendor, VendorStatus, VendorType, MSMEStatus, VendorAddress, VendorBankInfo, VendorCompliance, VendorAgreement
from ..schemas.vendor import (
    VendorCreate, VendorUpdate, VendorResponse, VendorListResponse,
    VendorAddressCreate, VendorAddressUpdate, VendorAddressResponse,
    VendorBankInfoCreate, VendorBankInfoUpdate, VendorBankInfoResponse,
    VendorComplianceCreate, VendorComplianceUpdate, VendorComplianceResponse,
    VendorAgreementCreate, VendorAgreementUpdate, VendorAgreementResponse
)
from ..auth import get_current_active_user
import uuid

router = APIRouter(prefix="/vendors", tags=["vendors"])


def generate_vendor_code() -> str:
    """Generate a unique vendor code"""
    return f"VND{str(uuid.uuid4())[:8].upper()}"


@router.post("/", response_model=VendorResponse)
async def create_vendor(
    vendor_data: VendorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new vendor"""
    # Check if vendor with same email already exists
    existing_vendor = db.query(Vendor).filter(Vendor.email == vendor_data.email).first()
    if existing_vendor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vendor with this email already exists"
        )
    
    # Create vendor with unique code
    vendor_code = generate_vendor_code()
    db_vendor = Vendor(
        vendor_code=vendor_code,
        **vendor_data.dict()
    )
    
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    
    return db_vendor


@router.get("/", response_model=List[VendorListResponse])
async def get_vendors(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[VendorStatus] = None,
    vendor_type: Optional[VendorType] = None,
    msme_status: Optional[MSMEStatus] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get list of vendors with filtering and pagination"""
    query = db.query(Vendor)
    
    # Apply filters
    if search:
        search_filter = or_(
            Vendor.company_name.ilike(f"%{search}%"),
            Vendor.contact_person_name.ilike(f"%{search}%"),
            Vendor.email.ilike(f"%{search}%"),
            Vendor.vendor_code.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if status:
        query = query.filter(Vendor.status == status)
    
    if vendor_type:
        query = query.filter(Vendor.supplier_type == vendor_type)
    
    if msme_status:
        query = query.filter(Vendor.msme_status == msme_status)
    
    if category:
        query = query.filter(Vendor.supplier_category == category)
    
    # Apply pagination
    vendors = query.offset(skip).limit(limit).all()
    
    return vendors


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific vendor by ID"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return vendor


@router.put("/{vendor_id}", response_model=VendorResponse)
async def update_vendor(
    vendor_id: int,
    vendor_data: VendorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Update vendor fields
    update_data = vendor_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vendor, field, value)
    
    db.commit()
    db.refresh(vendor)
    
    return vendor


@router.delete("/{vendor_id}")
async def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    db.delete(vendor)
    db.commit()
    
    return {"message": "Vendor deleted successfully"}


# Vendor Address Routes
@router.post("/{vendor_id}/addresses", response_model=VendorAddressResponse)
async def create_vendor_address(
    vendor_id: int,
    address_data: VendorAddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add an address to a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    db_address = VendorAddress(**address_data.dict(), vendor_id=vendor_id)
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    
    return db_address


@router.get("/{vendor_id}/addresses", response_model=List[VendorAddressResponse])
async def get_vendor_addresses(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all addresses for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return vendor.addresses


# Vendor Bank Info Routes
@router.post("/{vendor_id}/bank-info", response_model=VendorBankInfoResponse)
async def create_vendor_bank_info(
    vendor_id: int,
    bank_data: VendorBankInfoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add bank information to a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Check if bank info already exists
    existing_bank_info = db.query(VendorBankInfo).filter(
        VendorBankInfo.vendor_id == vendor_id
    ).first()
    
    if existing_bank_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bank information already exists for this vendor"
        )
    
    db_bank_info = VendorBankInfo(**bank_data.dict(), vendor_id=vendor_id)
    db.add(db_bank_info)
    db.commit()
    db.refresh(db_bank_info)
    
    return db_bank_info


@router.get("/{vendor_id}/bank-info", response_model=VendorBankInfoResponse)
async def get_vendor_bank_info(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get bank information for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    if not vendor.bank_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bank information not found"
        )
    
    return vendor.bank_info


# Vendor Compliance Routes
@router.post("/{vendor_id}/compliance", response_model=VendorComplianceResponse)
async def create_vendor_compliance(
    vendor_id: int,
    compliance_data: VendorComplianceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add compliance information to a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Check if compliance info already exists
    existing_compliance = db.query(VendorCompliance).filter(
        VendorCompliance.vendor_id == vendor_id
    ).first()
    
    if existing_compliance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compliance information already exists for this vendor"
        )
    
    db_compliance = VendorCompliance(**compliance_data.dict(), vendor_id=vendor_id)
    db.add(db_compliance)
    db.commit()
    db.refresh(db_compliance)
    
    return db_compliance


@router.get("/{vendor_id}/compliance", response_model=VendorComplianceResponse)
async def get_vendor_compliance(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get compliance information for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    if not vendor.compliance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compliance information not found"
        )
    
    return vendor.compliance


# Vendor Agreement Routes
@router.post("/{vendor_id}/agreements", response_model=VendorAgreementResponse)
async def create_vendor_agreements(
    vendor_id: int,
    agreement_data: VendorAgreementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add agreement information to a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Check if agreements already exist
    existing_agreements = db.query(VendorAgreement).filter(
        VendorAgreement.vendor_id == vendor_id
    ).first()
    
    if existing_agreements:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agreement information already exists for this vendor"
        )
    
    db_agreements = VendorAgreement(**agreement_data.dict(), vendor_id=vendor_id)
    db.add(db_agreements)
    db.commit()
    db.refresh(db_agreements)
    
    return db_agreements


@router.get("/{vendor_id}/agreements", response_model=VendorAgreementResponse)
async def get_vendor_agreements(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get agreement information for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    if not vendor.agreements:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agreement information not found"
        )
    
    return vendor.agreements 