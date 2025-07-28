# Vendor Management System - Backend

A comprehensive FastAPI backend for managing vendor registration, approval workflows, and lifecycle management.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Vendor Management**: Complete CRUD operations for vendor profiles
- **Approval Workflow**: Multi-level approval system with status tracking
- **Document Management**: File upload and document tracking
- **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT with Python-Jose
- **Password Hashing**: Passlib with bcrypt
- **Migrations**: Alembic
- **Validation**: Pydantic
- **Documentation**: OpenAPI/Swagger

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Configure PostgreSQL**
   - Create a database named `vendor_management_db`
   - Update the `DATABASE_URL` in your `.env` file

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

## Configuration

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/vendor_management_db

# Security
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
DEBUG=True
ALLOWED_HOSTS=["localhost", "127.0.0.1"]
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# File Upload Settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB
```

## Running the Application

### Development Mode
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/refresh` - Refresh access token

### Vendors
- `GET /api/v1/vendors/` - List vendors with filtering
- `POST /api/v1/vendors/` - Create new vendor
- `GET /api/v1/vendors/{id}` - Get vendor details
- `PUT /api/v1/vendors/{id}` - Update vendor
- `DELETE /api/v1/vendors/{id}` - Delete vendor

### Vendor Details
- `POST /api/v1/vendors/{id}/addresses` - Add vendor address
- `GET /api/v1/vendors/{id}/addresses` - Get vendor addresses
- `POST /api/v1/vendors/{id}/bank-info` - Add bank information
- `GET /api/v1/vendors/{id}/bank-info` - Get bank information
- `POST /api/v1/vendors/{id}/compliance` - Add compliance info
- `GET /api/v1/vendors/{id}/compliance` - Get compliance info
- `POST /api/v1/vendors/{id}/agreements` - Add agreements
- `GET /api/v1/vendors/{id}/agreements` - Get agreements

### Approvals
- `GET /api/v1/approvals/pending` - Get pending approvals
- `GET /api/v1/approvals/vendor/{id}` - Get vendor approvals
- `POST /api/v1/approvals/vendor/{id}` - Create approval
- `PUT /api/v1/approvals/{id}` - Update approval status
- `GET /api/v1/approvals/stats` - Get approval statistics

### Documents
- `POST /api/v1/documents/upload/{vendor_id}` - Upload document
- `GET /api/v1/documents/vendor/{id}` - Get vendor documents
- `GET /api/v1/documents/{id}` - Get document details
- `PUT /api/v1/documents/{id}` - Update document
- `DELETE /api/v1/documents/{id}` - Delete document
- `GET /api/v1/documents/types` - Get document types
- `GET /api/v1/documents/stats/vendor/{id}` - Get document statistics

## Database Models

### Core Models
- **User**: System users with roles and authentication
- **Vendor**: Main vendor information and categorization
- **VendorAddress**: Multiple addresses per vendor
- **VendorBankInfo**: Banking details
- **VendorCompliance**: Tax and compliance information
- **VendorAgreement**: Agreement tracking
- **VendorApproval**: Approval workflow tracking
- **VendorDocument**: Document management

## Development

### Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migrations:
```bash
alembic downgrade -1
```

### Testing

Run tests:
```bash
pytest
```

### Code Formatting

Format code with black:
```bash
black .
```

## Deployment

### Docker

1. Build the image:
```bash
docker build -t vendor-management-backend .
```

2. Run the container:
```bash
docker run -p 8000:8000 vendor-management-backend
```

### Environment Variables for Production

- Set `DEBUG=False`
- Use a strong `SECRET_KEY`
- Configure proper `CORS_ORIGINS`
- Set up proper database credentials
- Configure file storage (consider using cloud storage)

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens have expiration times
- CORS is configured for specific origins
- File uploads are validated for type and size
- SQL injection protection through SQLAlchemy ORM
- Input validation through Pydantic schemas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 