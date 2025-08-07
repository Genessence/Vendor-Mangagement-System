from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime
from ..database import get_db
from ..models.user import User
from ..models.vendor import Vendor
from ..models.vendor_document import VendorDocument, DocumentType, DocumentStatus
from ..schemas.vendor_document import VendorDocumentCreate, VendorDocumentUpdate, VendorDocumentResponse
from ..auth import get_current_active_user
from ..config import settings
from ..utils.azure_storage import azure_storage

router = APIRouter(prefix="/documents", tags=["documents"])


def save_upload_file(upload_file: UploadFile, vendor_id: int) -> str:
    """Save uploaded file using Azure Storage or local fallback"""
    # Read file data
    file_data = upload_file.file.read()
    
    # Upload to Azure Storage (or local fallback)
    file_path = azure_storage.upload_file(
        file_data=file_data,
        file_name=upload_file.filename,
        vendor_id=vendor_id,
        content_type=upload_file.content_type
    )
    
    return file_path


@router.post("/upload/{vendor_id}", response_model=VendorDocumentResponse)
async def upload_document(
    vendor_id: int,
    document_type: DocumentType,
    file: UploadFile = File(...),
    expiry_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a document for a vendor (authenticated users)"""
    # Check if vendor exists
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Validate file size
    if file.size and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {settings.max_file_size} bytes"
        )
    
    # Validate file type
    allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Save file
    file_path = save_upload_file(file, vendor_id)
    
    # Create document record
    db_document = VendorDocument(
        vendor_id=vendor_id,
        document_type=document_type,
        file_name=file.filename,
        file_path=file_path,
        file_size=file.size or 0,
        mime_type=file.content_type or "application/octet-stream",
        expiry_date=expiry_date,
        uploaded_by=current_user.id
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document


@router.post("/upload/{vendor_id}/public", response_model=VendorDocumentResponse)
async def upload_document_public(
    vendor_id: int,
    document_type: DocumentType,
    file: UploadFile = File(...),
    expiry_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Upload a document for a vendor (public endpoint for registration)"""
    # Check if vendor exists
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Validate file size
    if file.size and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {settings.max_file_size} bytes"
        )
    
    # Validate file type
    allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Save file
    file_path = save_upload_file(file, vendor_id)
    
    # Create document record
    db_document = VendorDocument(
        vendor_id=vendor_id,
        document_type=document_type,
        file_name=file.filename,
        file_path=file_path,
        file_size=file.size or 0,
        mime_type=file.content_type or "application/octet-stream",
        expiry_date=expiry_date,
        uploaded_by=None  # No user for public uploads
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document


@router.get("/vendor/{vendor_id}", response_model=List[VendorDocumentResponse])
async def get_vendor_documents(
    vendor_id: int,
    document_type: Optional[DocumentType] = None,
    status: Optional[DocumentStatus] = None,
    db: Session = Depends(get_db)
):
    """Get all documents for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    query = db.query(VendorDocument).filter(VendorDocument.vendor_id == vendor_id)
    
    if document_type:
        query = query.filter(VendorDocument.document_type == document_type)
    
    if status:
        query = query.filter(VendorDocument.status == status)
    
    documents = query.all()
    return documents


@router.get("/{document_id}", response_model=VendorDocumentResponse)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific document"""
    document = db.query(VendorDocument).filter(VendorDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document


@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Download a specific document"""
    document = db.query(VendorDocument).filter(VendorDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Download file from Azure Storage or local storage
    file_data = azure_storage.download_file(document.file_path)
    if not file_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Determine content type
    content_type = document.mime_type or "application/octet-stream"
    
    from fastapi.responses import Response
    return Response(
        content=file_data,
        media_type=content_type,
        headers={
            "Content-Disposition": f"attachment; filename={document.file_name}"
        }
    )


@router.put("/{document_id}", response_model=VendorDocumentResponse)
async def update_document(
    document_id: int,
    document_data: VendorDocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update document status or review comments"""
    document = db.query(VendorDocument).filter(VendorDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Update document
    update_data = document_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)
    
    # Set reviewer if status is being updated
    if document_data.status:
        document.reviewed_by = current_user.id
    
    db.commit()
    db.refresh(document)
    
    return document


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a document"""
    document = db.query(VendorDocument).filter(VendorDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete physical file
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Delete database record
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}


@router.get("/types")
async def get_document_types():
    """Get all available document types"""
    return [{"value": doc_type.value, "label": doc_type.value.replace("_", " ").title()} 
            for doc_type in DocumentType]


@router.get("/stats/vendor/{vendor_id}")
async def get_vendor_document_stats(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    """Get document statistics for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    total_documents = db.query(VendorDocument).filter(
        VendorDocument.vendor_id == vendor_id
    ).count()
    
    pending_documents = db.query(VendorDocument).filter(
        VendorDocument.vendor_id == vendor_id,
        VendorDocument.status == DocumentStatus.PENDING
    ).count()
    
    approved_documents = db.query(VendorDocument).filter(
        VendorDocument.vendor_id == vendor_id,
        VendorDocument.status == DocumentStatus.APPROVED
    ).count()
    
    rejected_documents = db.query(VendorDocument).filter(
        VendorDocument.vendor_id == vendor_id,
        VendorDocument.status == DocumentStatus.REJECTED
    ).count()
    
    expired_documents = db.query(VendorDocument).filter(
        VendorDocument.vendor_id == vendor_id,
        VendorDocument.status == DocumentStatus.EXPIRED
    ).count()
    
    return {
        "total": total_documents,
        "pending": pending_documents,
        "approved": approved_documents,
        "rejected": rejected_documents,
        "expired": expired_documents
    } 