import logging
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models.user import User
from ..models.vendor import Vendor, VendorStatus
from ..models.vendor_approval import VendorApproval
from ..models.vendor_document import VendorDocument
import traceback


class ComplianceLogger:
    """Comprehensive logging system for manufacturing compliance"""
    
    def __init__(self):
        # Create logs directory if it doesn't exist
        os.makedirs('logs', exist_ok=True)
        
        # Configure main application logger
        self.app_logger = self._setup_logger('app', 'logs/application.log')
        
        # Configure compliance audit logger
        self.audit_logger = self._setup_logger('audit', 'logs/audit_trail.log')
        
        # Configure security logger
        self.security_logger = self._setup_logger('security', 'logs/security.log')
        
        # Configure vendor activity logger
        self.vendor_logger = self._setup_logger('vendor', 'logs/vendor_activity.log')
        
        # Configure system performance logger
        self.performance_logger = self._setup_logger('performance', 'logs/performance.log')
        
        # Configure error logger
        self.error_logger = self._setup_logger('error', 'logs/errors.log')

    def _setup_logger(self, name: str, log_file: str) -> logging.Logger:
        """Setup individual logger with proper formatting"""
        logger = logging.getLogger(name)
        logger.setLevel(logging.INFO)
        
        # Prevent duplicate handlers
        if logger.handlers:
            return logger
        
        # File handler
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.INFO)
        
        # Console handler for development
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s | %(name)s | %(levelname)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger

    def log_vendor_registration(self, vendor_data: Dict[str, Any], user_id: Optional[int] = None, ip_address: str = None):
        """Log vendor registration activity"""
        log_entry = {
            'event_type': 'VENDOR_REGISTRATION',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'ip_address': ip_address,
            'vendor_email': vendor_data.get('email'),
            'company_name': vendor_data.get('company_name'),
            'country_origin': vendor_data.get('country_origin'),
            'supplier_type': vendor_data.get('supplier_type'),
            'msme_status': vendor_data.get('msme_status'),
            'compliance_fields': {
                'pan_number': vendor_data.get('pan_number'),
                'gst_number': vendor_data.get('gst_number'),
                'gta_registration': vendor_data.get('gta_registration')
            },
            'agreements_accepted': {
                'nda': vendor_data.get('nda'),
                'sqa': vendor_data.get('sqa'),
                'four_m': vendor_data.get('four_m'),
                'code_of_conduct': vendor_data.get('code_of_conduct'),
                'compliance_agreement': vendor_data.get('compliance_agreement'),
                'self_declaration': vendor_data.get('self_declaration')
            }
        }
        
        self.audit_logger.info(f"Vendor Registration: {json.dumps(log_entry, indent=2)}")
        self.vendor_logger.info(f"New vendor registered: {vendor_data.get('email')} - {vendor_data.get('company_name')}")

    def log_vendor_status_change(self, vendor_id: int, old_status: VendorStatus, new_status: VendorStatus, 
                                user_id: int, reason: str = None, ip_address: str = None):
        """Log vendor status changes"""
        log_entry = {
            'event_type': 'VENDOR_STATUS_CHANGE',
            'timestamp': datetime.utcnow().isoformat(),
            'vendor_id': vendor_id,
            'old_status': old_status.value,
            'new_status': new_status.value,
            'user_id': user_id,
            'ip_address': ip_address,
            'reason': reason,
            'compliance_impact': self._assess_compliance_impact(old_status, new_status)
        }
        
        self.audit_logger.info(f"Status Change: {json.dumps(log_entry, indent=2)}")
        self.vendor_logger.info(f"Vendor {vendor_id} status changed from {old_status.value} to {new_status.value}")

    def log_vendor_approval(self, vendor_id: int, approval_data: Dict[str, Any], user_id: int, ip_address: str = None):
        """Log vendor approval process"""
        log_entry = {
            'event_type': 'VENDOR_APPROVAL',
            'timestamp': datetime.utcnow().isoformat(),
            'vendor_id': vendor_id,
            'user_id': user_id,
            'ip_address': ip_address,
            'approval_type': approval_data.get('approval_type'),
            'questionnaire_data': approval_data.get('questionnaire_data'),
            'compliance_checks': approval_data.get('compliance_checks'),
            'risk_assessment': approval_data.get('risk_assessment')
        }
        
        self.audit_logger.info(f"Vendor Approval: {json.dumps(log_entry, indent=2)}")
        self.vendor_logger.info(f"Vendor {vendor_id} approved by user {user_id}")

    def log_document_upload(self, vendor_id: int, document_type: str, file_name: str, 
                           file_size: int, user_id: int, ip_address: str = None):
        """Log document uploads"""
        log_entry = {
            'event_type': 'DOCUMENT_UPLOAD',
            'timestamp': datetime.utcnow().isoformat(),
            'vendor_id': vendor_id,
            'document_type': document_type,
            'file_name': file_name,
            'file_size': file_size,
            'user_id': user_id,
            'ip_address': ip_address,
            'compliance_category': self._get_compliance_category(document_type)
        }
        
        self.audit_logger.info(f"Document Upload: {json.dumps(log_entry, indent=2)}")
        self.vendor_logger.info(f"Document uploaded for vendor {vendor_id}: {document_type} - {file_name}")

    def log_user_activity(self, user_id: int, action: str, resource: str, 
                         details: Dict[str, Any], ip_address: str = None):
        """Log user activities"""
        log_entry = {
            'event_type': 'USER_ACTIVITY',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'action': action,
            'resource': resource,
            'details': details,
            'ip_address': ip_address
        }
        
        self.audit_logger.info(f"User Activity: {json.dumps(log_entry, indent=2)}")

    def log_security_event(self, event_type: str, user_id: Optional[int], 
                          ip_address: str, details: Dict[str, Any]):
        """Log security-related events"""
        log_entry = {
            'event_type': f'SECURITY_{event_type.upper()}',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'ip_address': ip_address,
            'details': details,
            'risk_level': self._assess_security_risk(event_type, details)
        }
        
        self.security_logger.warning(f"Security Event: {json.dumps(log_entry, indent=2)}")

    def log_compliance_violation(self, vendor_id: int, violation_type: str, 
                                description: str, severity: str, user_id: int = None):
        """Log compliance violations"""
        log_entry = {
            'event_type': 'COMPLIANCE_VIOLATION',
            'timestamp': datetime.utcnow().isoformat(),
            'vendor_id': vendor_id,
            'violation_type': violation_type,
            'description': description,
            'severity': severity,
            'user_id': user_id,
            'action_required': self._get_required_action(severity)
        }
        
        self.audit_logger.error(f"Compliance Violation: {json.dumps(log_entry, indent=2)}")
        self.error_logger.error(f"Compliance violation for vendor {vendor_id}: {violation_type} - {description}")

    def log_system_error(self, error: Exception, context: str, user_id: int = None):
        """Log system errors"""
        log_entry = {
            'event_type': 'SYSTEM_ERROR',
            'timestamp': datetime.utcnow().isoformat(),
            'error_type': type(error).__name__,
            'error_message': str(error),
            'context': context,
            'user_id': user_id,
            'stack_trace': traceback.format_exc()
        }
        
        self.error_logger.error(f"System Error: {json.dumps(log_entry, indent=2)}")

    def log_performance_metric(self, operation: str, duration: float, 
                              resource_usage: Dict[str, Any] = None):
        """Log performance metrics"""
        log_entry = {
            'event_type': 'PERFORMANCE_METRIC',
            'timestamp': datetime.utcnow().isoformat(),
            'operation': operation,
            'duration_ms': round(duration * 1000, 2),
            'resource_usage': resource_usage or {}
        }
        
        self.performance_logger.info(f"Performance: {json.dumps(log_entry, indent=2)}")

    def log_data_access(self, user_id: int, data_type: str, action: str, 
                       record_id: int, ip_address: str = None):
        """Log data access for audit trail"""
        log_entry = {
            'event_type': 'DATA_ACCESS',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'data_type': data_type,
            'action': action,
            'record_id': record_id,
            'ip_address': ip_address
        }
        
        self.audit_logger.info(f"Data Access: {json.dumps(log_entry, indent=2)}")

    def _assess_compliance_impact(self, old_status: VendorStatus, new_status: VendorStatus) -> str:
        """Assess the compliance impact of status changes"""
        if new_status == VendorStatus.APPROVED:
            return "HIGH - Vendor approved for business operations"
        elif new_status == VendorStatus.REJECTED:
            return "HIGH - Vendor rejected, no business operations allowed"
        elif new_status == VendorStatus.SUSPENDED:
            return "MEDIUM - Vendor suspended, review required"
        else:
            return "LOW - Status change within normal workflow"

    def _get_compliance_category(self, document_type: str) -> str:
        """Get compliance category for document types"""
        compliance_docs = ['pan_number', 'gst_number', 'msme_certificate', 'incorporation_certificate']
        legal_docs = ['nda', 'sqa', 'compliance_agreement', 'code_of_conduct']
        
        if document_type in compliance_docs:
            return "REGULATORY_COMPLIANCE"
        elif document_type in legal_docs:
            return "LEGAL_AGREEMENT"
        else:
            return "GENERAL_DOCUMENTATION"

    def _assess_security_risk(self, event_type: str, details: Dict[str, Any]) -> str:
        """Assess security risk level"""
        high_risk_events = ['LOGIN_FAILURE', 'UNAUTHORIZED_ACCESS', 'DATA_BREACH']
        medium_risk_events = ['SUSPICIOUS_ACTIVITY', 'MULTIPLE_FAILURES']
        
        if event_type in high_risk_events:
            return "HIGH"
        elif event_type in medium_risk_events:
            return "MEDIUM"
        else:
            return "LOW"

    def _get_required_action(self, severity: str) -> str:
        """Get required action based on violation severity"""
        if severity == "CRITICAL":
            return "IMMEDIATE_SUSPENSION_AND_REVIEW"
        elif severity == "HIGH":
            return "REVIEW_AND_CORRECTIVE_ACTION"
        elif severity == "MEDIUM":
            return "MONITOR_AND_VERIFY"
        else:
            return "DOCUMENT_AND_TRACK"


# Global logger instance
compliance_logger = ComplianceLogger() 