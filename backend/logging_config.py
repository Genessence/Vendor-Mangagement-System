"""
Comprehensive Logging Configuration for Manufacturing Compliance System

This configuration ensures all activities are logged for compliance, audit, and security purposes.
"""

import os
import logging.config
from datetime import datetime

# Create logs directory
os.makedirs('logs', exist_ok=True)

# Logging configuration dictionary
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    
    'formatters': {
        'detailed': {
            'format': '%(asctime)s | %(name)s | %(levelname)s | %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(asctime)s | %(levelname)s | %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'json': {
            'format': '{"timestamp": "%(asctime)s", "logger": "%(name)s", "level": "%(levelname)s", "message": %(message)s}',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        }
    },
    
    'handlers': {
        # Application logs - general application activity
        'application_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/application.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'detailed',
            'encoding': 'utf-8'
        },
        
        # Audit trail - compliance and regulatory requirements
        'audit_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/audit_trail.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 10,  # Keep more audit logs
            'formatter': 'detailed',
            'encoding': 'utf-8'
        },
        
        # Security events - security monitoring
        'security_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/security.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 10,
            'formatter': 'detailed',
            'encoding': 'utf-8'
        },
        
        # Vendor activity - vendor-specific actions
        'vendor_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/vendor_activity.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'detailed',
            'encoding': 'utf-8'
        },
        
        # Performance metrics - system performance monitoring
        'performance_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/performance.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 3,
            'formatter': 'detailed',
            'encoding': 'utf-8'
        },
        
        # Error logs - system errors and exceptions
        'error_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/errors.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'detailed',
            'encoding': 'utf-8'
        },
        
        # Console output for development
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
            'level': 'INFO'
        },
        
        # Compliance reports - structured JSON for compliance reporting
        'compliance_json': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/compliance_reports.json',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'json',
            'encoding': 'utf-8'
        }
    },
    
    'loggers': {
        # Application logger
        'app': {
            'handlers': ['application_file', 'console'],
            'level': 'INFO',
            'propagate': False
        },
        
        # Audit logger
        'audit': {
            'handlers': ['audit_file', 'compliance_json'],
            'level': 'INFO',
            'propagate': False
        },
        
        # Security logger
        'security': {
            'handlers': ['security_file', 'console'],
            'level': 'WARNING',
            'propagate': False
        },
        
        # Vendor activity logger
        'vendor': {
            'handlers': ['vendor_file', 'audit_file'],
            'level': 'INFO',
            'propagate': False
        },
        
        # Performance logger
        'performance': {
            'handlers': ['performance_file'],
            'level': 'INFO',
            'propagate': False
        },
        
        # Error logger
        'error': {
            'handlers': ['error_file', 'console'],
            'level': 'ERROR',
            'propagate': False
        },
        
        # Compliance logger
        'compliance': {
            'handlers': ['audit_file', 'compliance_json'],
            'level': 'INFO',
            'propagate': False
        }
    },
    
    'root': {
        'handlers': ['console'],
        'level': 'WARNING'
    }
}

# Compliance-specific logging categories
COMPLIANCE_CATEGORIES = {
    'VENDOR_REGISTRATION': {
        'description': 'Vendor registration activities',
        'retention_days': 2555,  # 7 years
        'critical': True
    },
    'VENDOR_STATUS_CHANGE': {
        'description': 'Vendor status modifications',
        'retention_days': 2555,  # 7 years
        'critical': True
    },
    'DOCUMENT_UPLOAD': {
        'description': 'Document upload activities',
        'retention_days': 2555,  # 7 years
        'critical': True
    },
    'COMPLIANCE_VIOLATION': {
        'description': 'Compliance violations and issues',
        'retention_days': 3650,  # 10 years
        'critical': True
    },
    'SECURITY_EVENT': {
        'description': 'Security-related events',
        'retention_days': 1825,  # 5 years
        'critical': True
    },
    'USER_ACTIVITY': {
        'description': 'User activity tracking',
        'retention_days': 1095,  # 3 years
        'critical': False
    },
    'DATA_ACCESS': {
        'description': 'Data access and retrieval',
        'retention_days': 1095,  # 3 years
        'critical': False
    },
    'PERFORMANCE_METRIC': {
        'description': 'System performance metrics',
        'retention_days': 365,  # 1 year
        'critical': False
    }
}

# Risk levels for compliance events
RISK_LEVELS = {
    'CRITICAL': {
        'description': 'Immediate action required',
        'escalation': 'IMMEDIATE',
        'notification': True
    },
    'HIGH': {
        'description': 'High priority review required',
        'escalation': 'WITHIN_24_HOURS',
        'notification': True
    },
    'MEDIUM': {
        'description': 'Standard review process',
        'escalation': 'WITHIN_7_DAYS',
        'notification': False
    },
    'LOW': {
        'description': 'Routine monitoring',
        'escalation': 'NONE',
        'notification': False
    }
}

# Manufacturing compliance requirements
MANUFACTURING_COMPLIANCE_REQUIREMENTS = {
    'ISO_9001': {
        'description': 'Quality Management System',
        'logging_requirements': [
            'VENDOR_REGISTRATION',
            'VENDOR_STATUS_CHANGE',
            'DOCUMENT_UPLOAD',
            'COMPLIANCE_VIOLATION'
        ],
        'retention_period': '7 years'
    },
    'ISO_14001': {
        'description': 'Environmental Management System',
        'logging_requirements': [
            'VENDOR_REGISTRATION',
            'COMPLIANCE_VIOLATION'
        ],
        'retention_period': '7 years'
    },
    'ISO_45001': {
        'description': 'Occupational Health and Safety',
        'logging_requirements': [
            'VENDOR_REGISTRATION',
            'COMPLIANCE_VIOLATION',
            'SECURITY_EVENT'
        ],
        'retention_period': '7 years'
    },
    'FDA_21_CFR_PART_11': {
        'description': 'Electronic Records and Signatures',
        'logging_requirements': [
            'VENDOR_REGISTRATION',
            'VENDOR_STATUS_CHANGE',
            'DOCUMENT_UPLOAD',
            'USER_ACTIVITY',
            'DATA_ACCESS'
        ],
        'retention_period': '10 years'
    },
    'GDPR': {
        'description': 'General Data Protection Regulation',
        'logging_requirements': [
            'USER_ACTIVITY',
            'DATA_ACCESS',
            'SECURITY_EVENT'
        ],
        'retention_period': '3 years'
    }
}

def setup_logging():
    """Initialize the logging configuration"""
    logging.config.dictConfig(LOGGING_CONFIG)
    
    # Create a startup log entry
    startup_logger = logging.getLogger('app')
    startup_logger.info(f"Manufacturing Compliance Logging System initialized at {datetime.utcnow().isoformat()}")
    
    # Log compliance requirements
    compliance_logger = logging.getLogger('compliance')
    compliance_logger.info(f"Compliance requirements loaded: {list(MANUFACTURING_COMPLIANCE_REQUIREMENTS.keys())}")

def get_logger(name):
    """Get a logger instance with the specified name"""
    return logging.getLogger(name)

def log_compliance_event(event_type, data, user_id=None, ip_address=None):
    """Log a compliance event with proper categorization"""
    logger = logging.getLogger('compliance')
    
    log_entry = {
        'event_type': event_type,
        'timestamp': datetime.utcnow().isoformat(),
        'user_id': user_id,
        'ip_address': ip_address,
        'data': data,
        'compliance_category': COMPLIANCE_CATEGORIES.get(event_type, {}),
        'risk_level': determine_risk_level(event_type, data)
    }
    
    logger.info(log_entry)
    
    # Also log to audit trail
    audit_logger = logging.getLogger('audit')
    audit_logger.info(log_entry)

def determine_risk_level(event_type, data):
    """Determine the risk level for a compliance event"""
    if event_type == 'COMPLIANCE_VIOLATION':
        severity = data.get('severity', 'MEDIUM')
        return severity.upper()
    
    if event_type.startswith('SECURITY_'):
        return 'HIGH'
    
    if event_type in ['VENDOR_REGISTRATION', 'VENDOR_STATUS_CHANGE']:
        return 'MEDIUM'
    
    return 'LOW'

def create_compliance_report(start_date, end_date, report_type='summary'):
    """Create a compliance report for the specified period"""
    # This would integrate with the database to generate reports
    # Implementation would depend on your specific reporting requirements
    pass

if __name__ == "__main__":
    setup_logging()
    print("Logging configuration loaded successfully!") 