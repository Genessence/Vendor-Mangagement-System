import time
import json
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from ..utils.logger import compliance_logger


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to automatically log all requests and responses"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Capture start time
        start_time = time.time()
        
        # Get client IP address
        client_ip = self._get_client_ip(request)
        
        # Get user context if available
        user_id = None
        if hasattr(request.state, 'user'):
            user_id = request.state.user.id if request.state.user else None
        
        # Log request
        self._log_request(request, client_ip, user_id)
        
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Log response
            self._log_response(request, response, duration, client_ip, user_id)
            
            return response
            
        except Exception as e:
            # Log error
            duration = time.time() - start_time
            self._log_error(request, e, duration, client_ip, user_id)
            raise

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        # Check for forwarded headers (for proxy/load balancer scenarios)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback to direct client IP
        return request.client.host if request.client else "unknown"

    def _log_request(self, request: Request, client_ip: str, user_id: int = None):
        """Log incoming request"""
        log_data = {
            'method': request.method,
            'url': str(request.url),
            'path': request.url.path,
            'query_params': dict(request.query_params),
            'headers': dict(request.headers),
            'client_ip': client_ip,
            'user_id': user_id,
            'user_agent': request.headers.get('user-agent', 'unknown')
        }
        
        # Log sensitive endpoints with extra detail
        if request.url.path.startswith('/api/v1/vendors/public-registration'):
            compliance_logger.app_logger.info(f"Vendor Registration Request: {json.dumps(log_data, indent=2)}")
        elif request.url.path.startswith('/api/v1/auth'):
            compliance_logger.security_logger.info(f"Authentication Request: {json.dumps(log_data, indent=2)}")
        else:
            compliance_logger.app_logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")

    def _log_response(self, request: Request, response: Response, duration: float, 
                     client_ip: str, user_id: int = None):
        """Log response"""
        log_data = {
            'method': request.method,
            'url': str(request.url),
            'status_code': response.status_code,
            'duration_ms': round(duration * 1000, 2),
            'client_ip': client_ip,
            'user_id': user_id
        }
        
        # Log performance metrics
        compliance_logger.log_performance_metric(
            operation=f"{request.method}_{request.url.path}",
            duration=duration,
            resource_usage={'status_code': response.status_code}
        )
        
        # Log specific activities
        if request.url.path.startswith('/api/v1/vendors') and response.status_code == 201:
            compliance_logger.vendor_logger.info(f"Vendor created successfully: {json.dumps(log_data, indent=2)}")
        elif response.status_code >= 400:
            compliance_logger.error_logger.warning(f"Error response: {json.dumps(log_data, indent=2)}")

    def _log_error(self, request: Request, error: Exception, duration: float, 
                  client_ip: str, user_id: int = None):
        """Log errors"""
        log_data = {
            'method': request.method,
            'url': str(request.url),
            'error_type': type(error).__name__,
            'error_message': str(error),
            'duration_ms': round(duration * 1000, 2),
            'client_ip': client_ip,
            'user_id': user_id
        }
        
        compliance_logger.log_system_error(
            error=error,
            context=f"Request: {request.method} {request.url.path}",
            user_id=user_id
        )
        
        compliance_logger.error_logger.error(f"Request Error: {json.dumps(log_data, indent=2)}")


class AuditMiddleware(BaseHTTPMiddleware):
    """Middleware to log data access for audit trail"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Log data access for specific endpoints
        if self._should_audit(request.url.path):
            client_ip = self._get_client_ip(request)
            user_id = getattr(request.state, 'user', None)
            user_id = user_id.id if user_id else None
            
            compliance_logger.log_data_access(
                user_id=user_id,
                data_type=self._get_data_type(request.url.path),
                action=request.method,
                record_id=self._extract_record_id(request.url.path),
                ip_address=client_ip
            )
        
        return response

    def _should_audit(self, path: str) -> bool:
        """Determine if the path should be audited"""
        audit_paths = [
            '/api/v1/vendors/',
            '/api/v1/users/',
            '/api/v1/documents/',
            '/api/v1/approvals/'
        ]
        return any(path.startswith(audit_path) for audit_path in audit_paths)

    def _get_data_type(self, path: str) -> str:
        """Extract data type from path"""
        if '/vendors/' in path:
            return 'vendor'
        elif '/users/' in path:
            return 'user'
        elif '/documents/' in path:
            return 'document'
        elif '/approvals/' in path:
            return 'approval'
        else:
            return 'unknown'

    def _extract_record_id(self, path: str) -> int:
        """Extract record ID from path if present"""
        try:
            # Extract ID from paths like /api/v1/vendors/123
            parts = path.split('/')
            for i, part in enumerate(parts):
                if part.isdigit() and i > 0:
                    return int(part)
        except (ValueError, IndexError):
            pass
        return 0

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown" 