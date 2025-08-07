from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from ..database import get_db
from ..models.user import User
from ..models.vendor import Vendor, VendorStatus, VendorType, MSMEStatus, VendorAddress, VendorBankInfo, VendorCompliance, VendorAgreement, VendorComplianceCertificate
from ..schemas.vendor import (
    VendorCreate, VendorUpdate, VendorResponse, VendorListResponse,
    VendorAddressCreate, VendorAddressUpdate, VendorAddressResponse,
    VendorBankInfoCreate, VendorBankInfoUpdate, VendorBankInfoResponse,
    VendorComplianceCreate, VendorComplianceUpdate, VendorComplianceResponse,
    VendorAgreementCreate, VendorAgreementUpdate, VendorAgreementResponse,
    VendorComplianceCertificateCreate, VendorComplianceCertificateUpdate, VendorComplianceCertificateResponse
)
from ..auth import get_current_active_user
from ..utils.logger import compliance_logger
import uuid
from datetime import datetime

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


@router.post("/public-registration", response_model=VendorResponse)
async def create_vendor_public(
    vendor_data: VendorCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Create a new vendor through public registration (no authentication required)"""
    # Get client IP for logging
    client_ip = request.client.host if request.client else "unknown"
    
    # Check if vendor with same email already exists
    existing_vendor = db.query(Vendor).filter(Vendor.email == vendor_data.email).first()
    if existing_vendor:
        # Log duplicate registration attempt
        compliance_logger.log_security_event(
            event_type="DUPLICATE_REGISTRATION_ATTEMPT",
            user_id=None,
            ip_address=client_ip,
            details={
                "email": vendor_data.email,
                "company_name": vendor_data.company_name,
                "existing_vendor_id": existing_vendor.id
            }
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vendor with this email already exists"
        )
    
    # Extract agreements from nested structure if present
    agreements_data = {}
    if hasattr(vendor_data, 'agreements') and vendor_data.agreements:
        agreements_data = vendor_data.agreements
    else:
        # Handle flat agreement fields
        agreements_data = {
            'nda': vendor_data.nda,
            'sqa': vendor_data.sqa,
            'four_m': vendor_data.four_m,
            'code_of_conduct': vendor_data.code_of_conduct,
            'compliance_agreement': vendor_data.compliance_agreement,
            'self_declaration': vendor_data.self_declaration
        }
    
    # Apply conditional validation based on supplier type and country
    validation_errors = []
    
    # Helper function to check if supplier is ODM
    def is_odm_supplier(supplier_group):
        return supplier_group == 'odm-amber'
    
    # Helper function to check if supplier is Indian
    def is_indian_supplier(country_origin):
        return country_origin == 'IN'
    
    # NDA validation: Required for non-ODM suppliers
    if not is_odm_supplier(vendor_data.supplier_group):
        if not agreements_data.get('nda'):
            validation_errors.append("NDA is required for non-ODM suppliers")
    
    # SQA validation: Required for Indian suppliers
    if is_indian_supplier(vendor_data.country_origin):
        if not agreements_data.get('sqa'):
            validation_errors.append("SQA is required for Indian suppliers")
    
    # Compliance Agreement validation: Required for Indian suppliers
    if is_indian_supplier(vendor_data.country_origin):
        if not agreements_data.get('compliance_agreement'):
            validation_errors.append("Compliance Agreement is required for Indian suppliers")
    
    # Always required agreements
    if not agreements_data.get('four_m'):
        validation_errors.append("4M Change Control Agreement is required")
    if not agreements_data.get('code_of_conduct'):
        validation_errors.append("Code of Conduct is required")
    if not agreements_data.get('self_declaration'):
        validation_errors.append("Self Declaration is required")
    
    if validation_errors:
        # Log compliance validation failure
        compliance_logger.log_compliance_violation(
            vendor_id=0,  # Not created yet
            violation_type="AGREEMENT_VALIDATION_FAILURE",
            description=f"Missing required agreements: {', '.join(validation_errors)}",
            severity="MEDIUM",
            user_id=None
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Agreement validation failed", "errors": validation_errors}
        )
    
    # Create vendor data dict, excluding nested agreements
    vendor_dict = vendor_data.dict()
    if 'agreements' in vendor_dict:
        del vendor_dict['agreements']
    
    # Set agreement fields from the agreements object
    vendor_dict.update({
        'nda': agreements_data.get('nda', False),
        'sqa': agreements_data.get('sqa', False),
        'four_m': agreements_data.get('four_m', False),
        'code_of_conduct': agreements_data.get('code_of_conduct', False),
        'compliance_agreement': agreements_data.get('compliance_agreement', False),
        'self_declaration': agreements_data.get('self_declaration', False)
    })
    
    # Create vendor with unique code
    vendor_code = generate_vendor_code()
    db_vendor = Vendor(
        vendor_code=vendor_code,
        status=VendorStatus.PENDING,  # Set status to pending for public registrations
        **vendor_dict
    )
    
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    
    # Log successful vendor registration
    vendor_dict_for_logging = vendor_data.dict()
    compliance_logger.log_vendor_registration(
        vendor_data=vendor_dict_for_logging,
        user_id=None,  # Public registration
        ip_address=client_ip
    )
    
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
    db: Session = Depends(get_db)
):
    """Get list of vendors with filtering and pagination (public endpoint)"""
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
    db: Session = Depends(get_db)
):
    """Get a specific vendor by ID (public endpoint)"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Calculate counts for UI badges
    from ..models.vendor_document import VendorDocument
    from ..models.vendor import VendorCompliance, VendorAgreement
    
    # Document count
    document_count = db.query(VendorDocument).filter(VendorDocument.vendor_id == vendor_id).count()
    
    # Compliance count (always 1 if vendor has compliance data)
    compliance_count = db.query(VendorCompliance).filter(VendorCompliance.vendor_id == vendor_id).count()
    
    # Agreement count (always 1 if vendor has agreement data)
    agreement_count = db.query(VendorAgreement).filter(VendorAgreement.vendor_id == vendor_id).count()
    
    # Add counts to vendor object
    vendor.document_count = document_count
    vendor.compliance_count = compliance_count
    vendor.agreement_count = agreement_count
    
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


# Vendor Compliance Certificate Routes
@router.post("/{vendor_id}/compliance-certificates", response_model=VendorComplianceCertificateResponse)
async def create_vendor_compliance_certificate(
    vendor_id: int,
    certificate_data: VendorComplianceCertificateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add a compliance certificate to a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    db_certificate = VendorComplianceCertificate(**certificate_data.dict(), vendor_id=vendor_id)
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    
    return db_certificate


@router.get("/{vendor_id}/compliance-certificates", response_model=List[VendorComplianceCertificateResponse])
async def get_vendor_compliance_certificates(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    """Get all compliance certificates for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return vendor.compliance_certificates


@router.put("/{vendor_id}/compliance-certificates/{certificate_id}", response_model=VendorComplianceCertificateResponse)
async def update_vendor_compliance_certificate(
    vendor_id: int,
    certificate_id: int,
    certificate_data: VendorComplianceCertificateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a compliance certificate for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    certificate = db.query(VendorComplianceCertificate).filter(
        VendorComplianceCertificate.id == certificate_id,
        VendorComplianceCertificate.vendor_id == vendor_id
    ).first()
    
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compliance certificate not found"
        )
    
    # Update certificate fields
    update_data = certificate_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(certificate, field, value)
    
    db.commit()
    db.refresh(certificate)
    
    return certificate


@router.delete("/{vendor_id}/compliance-certificates/{certificate_id}")
async def delete_vendor_compliance_certificate(
    vendor_id: int,
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a compliance certificate for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    certificate = db.query(VendorComplianceCertificate).filter(
        VendorComplianceCertificate.id == certificate_id,
        VendorComplianceCertificate.vendor_id == vendor_id
    ).first()
    
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compliance certificate not found"
        )
    
    db.delete(certificate)
    db.commit()
    
    return {"message": "Compliance certificate deleted successfully"}

@router.get("/{vendor_id}/export/pdf")
async def export_vendor_pdf(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Export vendor data as PDF"""
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from io import BytesIO
    from fastapi.responses import StreamingResponse
    
    # Get vendor data
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        spaceAfter=30,
        alignment=1  # Center alignment
    )
    story.append(Paragraph(f"Vendor Profile Report", title_style))
    story.append(Spacer(1, 20))
    
    # Vendor Basic Information
    story.append(Paragraph("Basic Information", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    basic_info = [
        ['Vendor Code', vendor.vendor_code],
        ['Company Name', vendor.company_name],
        ['Legal Name', vendor.legal_name or 'N/A'],
        ['Status', vendor.status],
        ['Email', vendor.email],
        ['Phone', vendor.phone],
        ['Registration Date', vendor.registration_date.strftime('%d/%m/%Y') if vendor.registration_date else 'N/A'],
    ]
    
    basic_table = Table(basic_info, colWidths=[2*inch, 4*inch])
    basic_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(basic_table)
    story.append(Spacer(1, 20))
    
    # Business Information
    story.append(Paragraph("Business Information", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    business_info = [
        ['Category', vendor.category],
        ['Business Type', vendor.business_type],
        ['Industry', vendor.industry],
        ['Year Established', str(vendor.year_established) if vendor.year_established else 'N/A'],
        ['Employee Count', vendor.employee_count or 'N/A'],
        ['Annual Revenue', vendor.annual_revenue or 'N/A'],
    ]
    
    business_table = Table(business_info, colWidths=[2*inch, 4*inch])
    business_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(business_table)
    story.append(Spacer(1, 20))
    
    # Compliance Information
    story.append(Paragraph("Compliance Information", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    compliance_info = [
        ['PAN Number', vendor.pan_number or 'N/A'],
        ['GST Number', vendor.gst_number or 'N/A'],
        ['CIN Number', vendor.cin_number or 'N/A'],
        ['MSME Number', vendor.msme_number or 'N/A'],
        ['Nature of Assessee', vendor.nature_of_assessee or 'N/A'],
    ]
    
    compliance_table = Table(compliance_info, colWidths=[2*inch, 4*inch])
    compliance_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(compliance_table)
    story.append(Spacer(1, 20))
    
    # Address Information
    story.append(Paragraph("Address Information", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    address_info = [
        ['City', vendor.city],
        ['State', vendor.state],
        ['Country', vendor.country],
        ['Postal Code', vendor.postal_code],
        ['Registered Address', vendor.registered_address or 'N/A'],
    ]
    
    address_table = Table(address_info, colWidths=[2*inch, 4*inch])
    address_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(address_table)
    story.append(Spacer(1, 20))
    
    # Footer
    story.append(Spacer(1, 30))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=10,
        alignment=1,  # Center alignment
        textColor=colors.grey
    )
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", footer_style))
    story.append(Paragraph(f"Generated by: {current_user.email}", footer_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    # Return PDF as streaming response
    filename = f"vendor_{vendor.vendor_code}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{vendor_id}/export/excel")
async def export_vendor_excel(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Export vendor data as Excel"""
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    from io import BytesIO
    from fastapi.responses import StreamingResponse
    
    # Get vendor data
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Create Excel workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Vendor Profile"
    
    # Styles
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'),
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )
    
    # Title
    ws.merge_cells('A1:B1')
    ws['A1'] = f"Vendor Profile Report - {vendor.company_name}"
    ws['A1'].font = Font(bold=True, size=16)
    ws['A1'].alignment = Alignment(horizontal='center')
    
    # Basic Information
    ws['A3'] = "Basic Information"
    ws['A3'].font = Font(bold=True, size=14)
    ws['A3'].fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    
    basic_data = [
        ['Vendor Code', vendor.vendor_code],
        ['Company Name', vendor.company_name],
        ['Legal Name', vendor.legal_name or 'N/A'],
        ['Status', vendor.status],
        ['Email', vendor.email],
        ['Phone', vendor.phone],
        ['Registration Date', vendor.registration_date.strftime('%d/%m/%Y') if vendor.registration_date else 'N/A'],
    ]
    
    for i, (key, value) in enumerate(basic_data, start=4):
        ws[f'A{i}'] = key
        ws[f'B{i}'] = value
        ws[f'A{i}'].font = Font(bold=True)
        ws[f'A{i}'].fill = header_fill
        ws[f'A{i}'].font = header_font
        ws[f'A{i}'].border = border
        ws[f'B{i}'].border = border
    
    # Business Information
    ws['A12'] = "Business Information"
    ws['A12'].font = Font(bold=True, size=14)
    ws['A12'].fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    
    business_data = [
        ['Category', vendor.category],
        ['Business Type', vendor.business_type],
        ['Industry', vendor.industry],
        ['Year Established', str(vendor.year_established) if vendor.year_established else 'N/A'],
        ['Employee Count', vendor.employee_count or 'N/A'],
        ['Annual Revenue', vendor.annual_revenue or 'N/A'],
    ]
    
    for i, (key, value) in enumerate(business_data, start=13):
        ws[f'A{i}'] = key
        ws[f'B{i}'] = value
        ws[f'A{i}'].font = Font(bold=True)
        ws[f'A{i}'].fill = header_fill
        ws[f'A{i}'].font = header_font
        ws[f'A{i}'].border = border
        ws[f'B{i}'].border = border
    
    # Compliance Information
    ws['A20'] = "Compliance Information"
    ws['A20'].font = Font(bold=True, size=14)
    ws['A20'].fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    
    compliance_data = [
        ['PAN Number', vendor.pan_number or 'N/A'],
        ['GST Number', vendor.gst_number or 'N/A'],
        ['CIN Number', vendor.cin_number or 'N/A'],
        ['MSME Number', vendor.msme_number or 'N/A'],
        ['Nature of Assessee', vendor.nature_of_assessee or 'N/A'],
    ]
    
    for i, (key, value) in enumerate(compliance_data, start=21):
        ws[f'A{i}'] = key
        ws[f'B{i}'] = value
        ws[f'A{i}'].font = Font(bold=True)
        ws[f'A{i}'].fill = header_fill
        ws[f'A{i}'].font = header_font
        ws[f'A{i}'].border = border
        ws[f'B{i}'].border = border
    
    # Address Information
    ws['A27'] = "Address Information"
    ws['A27'].font = Font(bold=True, size=14)
    ws['A27'].fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    
    address_data = [
        ['City', vendor.city],
        ['State', vendor.state],
        ['Country', vendor.country],
        ['Postal Code', vendor.postal_code],
        ['Registered Address', vendor.registered_address or 'N/A'],
    ]
    
    for i, (key, value) in enumerate(address_data, start=28):
        ws[f'A{i}'] = key
        ws[f'B{i}'] = value
        ws[f'A{i}'].font = Font(bold=True)
        ws[f'A{i}'].fill = header_fill
        ws[f'A{i}'].font = header_font
        ws[f'A{i}'].border = border
        ws[f'B{i}'].border = border
    
    # Footer
    ws[f'A35'] = f"Generated on: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}"
    ws[f'A36'] = f"Generated by: {current_user.email}"
    ws['A35'].font = Font(size=10, color="808080")
    ws['A36'].font = Font(size=10, color="808080")
    
    # Auto-adjust column widths
    for column in ws.columns:
        max_length = 0
        column_letter = get_column_letter(column[0].column)
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column_letter].width = adjusted_width
    
    # Save to buffer
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    
    # Return Excel file as streaming response
    filename = f"vendor_{vendor.vendor_code}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    ) 