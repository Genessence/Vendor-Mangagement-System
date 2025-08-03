from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from ..models.vendor import VendorStatus, VendorType, MSMEStatus


# Vendor Base Schemas
class VendorBase(BaseModel):
    business_vertical: str
    company_name: str
    country_origin: str
    registration_number: Optional[str] = None
    incorporation_certificate_path: Optional[str] = None
    contact_person_name: str
    designation: Optional[str] = None
    email: EmailStr
    phone_number: str
    website: Optional[str] = None
    year_established: Optional[int] = None
    business_description: Optional[str] = None
    supplier_type: Optional[VendorType] = None
    supplier_group: Optional[str] = None
    supplier_category: Optional[str] = None
    annual_turnover: Optional[float] = None
    products_services: Optional[str] = None
    msme_status: MSMEStatus = MSMEStatus.PENDING
    msme_category: Optional[str] = None
    msme_number: Optional[str] = None
    industry_sector: Optional[str] = None
    employee_count: Optional[str] = None
    certifications: Optional[str] = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    business_vertical: Optional[str] = None
    company_name: Optional[str] = None
    country_origin: Optional[str] = None
    registration_number: Optional[str] = None
    incorporation_certificate_path: Optional[str] = None
    contact_person_name: Optional[str] = None
    designation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    year_established: Optional[int] = None
    business_description: Optional[str] = None
    supplier_type: Optional[VendorType] = None
    supplier_group: Optional[str] = None
    supplier_category: Optional[str] = None
    annual_turnover: Optional[float] = None
    products_services: Optional[str] = None
    msme_status: Optional[MSMEStatus] = None
    msme_category: Optional[str] = None
    msme_number: Optional[str] = None
    industry_sector: Optional[str] = None
    employee_count: Optional[str] = None
    certifications: Optional[str] = None
    status: Optional[VendorStatus] = None


class VendorResponse(VendorBase):
    id: int
    vendor_code: str
    status: VendorStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[int] = None

    class Config:
        from_attributes = True


class VendorListResponse(BaseModel):
    id: int
    vendor_code: str
    company_name: str
    contact_person_name: str
    email: EmailStr
    phone_number: str
    status: VendorStatus
    supplier_type: Optional[VendorType] = None
    supplier_category: Optional[str] = None
    msme_status: MSMEStatus
    annual_turnover: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Vendor Address Schemas
class VendorAddressBase(BaseModel):
    address_type: str  # 'registered' or 'supply'
    address: str
    city: str
    state: str
    country: str
    pincode: str


class VendorAddressCreate(VendorAddressBase):
    pass


class VendorAddressUpdate(BaseModel):
    address_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None


class VendorAddressResponse(VendorAddressBase):
    id: int
    vendor_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Vendor Bank Info Schemas
class VendorBankInfoBase(BaseModel):
    bank_name: str
    branch_name: Optional[str] = None
    account_number: str
    account_type: Optional[str] = None
    ifsc_code: str
    swift_code: Optional[str] = None
    bank_address: Optional[str] = None


class VendorBankInfoCreate(VendorBankInfoBase):
    pass


class VendorBankInfoUpdate(BaseModel):
    bank_name: Optional[str] = None
    branch_name: Optional[str] = None
    account_number: Optional[str] = None
    account_type: Optional[str] = None
    ifsc_code: Optional[str] = None
    swift_code: Optional[str] = None
    bank_address: Optional[str] = None


class VendorBankInfoResponse(VendorBankInfoBase):
    id: int
    vendor_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Vendor Compliance Schemas
class VendorComplianceBase(BaseModel):
    preferred_currency: str = "INR"
    tax_registration_number: Optional[str] = None
    pan_number: Optional[str] = None
    gst_number: Optional[str] = None
    nature_of_assessee: Optional[str] = None
    tan_number: Optional[str] = None
    place_of_supply: Optional[str] = None
    vat_number: Optional[str] = None
    business_license: Optional[str] = None
    compliance_notes: Optional[str] = None
    credit_rating: Optional[str] = None
    insurance_coverage: Optional[str] = None
    special_certifications: Optional[str] = None
    gta_registration: Optional[str] = None


class VendorComplianceCreate(VendorComplianceBase):
    pass


class VendorComplianceUpdate(BaseModel):
    preferred_currency: Optional[str] = None
    tax_registration_number: Optional[str] = None
    pan_number: Optional[str] = None
    gst_number: Optional[str] = None
    nature_of_assessee: Optional[str] = None
    tan_number: Optional[str] = None
    place_of_supply: Optional[str] = None
    vat_number: Optional[str] = None
    business_license: Optional[str] = None
    compliance_notes: Optional[str] = None
    credit_rating: Optional[str] = None
    insurance_coverage: Optional[str] = None
    special_certifications: Optional[str] = None
    gta_registration: Optional[str] = None


class VendorComplianceResponse(VendorComplianceBase):
    id: int
    vendor_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Vendor Agreement Schemas
class VendorAgreementBase(BaseModel):
    nda: bool = False
    sqa: bool = False
    four_m: bool = False
    code_of_conduct: bool = False
    compliance_agreement: bool = False
    self_declaration: bool = False


class VendorAgreementCreate(VendorAgreementBase):
    pass


class VendorAgreementUpdate(BaseModel):
    nda: Optional[bool] = None
    sqa: Optional[bool] = None
    four_m: Optional[bool] = None
    code_of_conduct: Optional[bool] = None
    compliance_agreement: Optional[bool] = None
    self_declaration: Optional[bool] = None


class VendorAgreementResponse(VendorAgreementBase):
    id: int
    vendor_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 