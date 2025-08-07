# Azure Blob Storage Setup Guide

This guide explains how to set up Azure Blob Storage for document storage in the Vendor Management System.

## Prerequisites

1. Azure subscription
2. Azure CLI installed (optional but recommended)
3. Python environment with the required packages

## Step 1: Create Azure Storage Account

### Using Azure Portal:

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create Storage Account**
   - Click "Create a resource"
   - Search for "Storage account"
   - Click "Create"

3. **Configure Storage Account**
   ```
   Resource group: Create new or use existing
   Storage account name: vendor-docs-[unique-suffix]
   Location: Choose closest to your users
   Performance: Standard
   Redundancy: LRS (Locally redundant storage)
   ```

4. **Advanced Settings**
   ```
   Enable hierarchical namespace: No
   Allow Blob public access: Disabled (for security)
   Minimum TLS version: Version 1.2
   ```

5. **Review and Create**
   - Review the settings
   - Click "Create"
   - Wait for deployment to complete

### Using Azure CLI:

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name vendor-management-rg --location eastus

# Create storage account
az storage account create \
  --name vendordocs[unique] \
  --resource-group vendor-management-rg \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2
```

## Step 2: Create Blob Container

### Using Azure Portal:

1. **Navigate to Storage Account**
   - Go to your storage account
   - Click "Containers" in the left menu

2. **Create Container**
   - Click "+ Container"
   - Name: `vendor-documents`
   - Public access level: Private
   - Click "Create"

### Using Azure CLI:

```bash
# Create container
az storage container create \
  --name vendor-documents \
  --account-name vendordocs[unique] \
  --auth-mode login
```

## Step 3: Get Connection String

### Using Azure Portal:

1. **Access Keys**
   - Go to your storage account
   - Click "Access keys" in the left menu

2. **Copy Connection String**
   - Click "Show" next to "Connection string"
   - Copy the connection string
   - Format: `DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net`

### Using Azure CLI:

```bash
# Get connection string
az storage account show-connection-string \
  --name vendordocs[unique] \
  --resource-group vendor-management-rg
```

## Step 4: Configure Environment Variables

### Development (.env file):

```env
# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=vendordocs[unique];AccountKey=your-account-key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=vendor-documents
```

### Production (Environment Variables):

```bash
# Set environment variables
export AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=vendordocs[unique];AccountKey=your-account-key;EndpointSuffix=core.windows.net"
export AZURE_STORAGE_CONTAINER_NAME="vendor-documents"
```

## Step 5: Install Required Packages

```bash
# Install Azure Storage Blob package
pip install azure-storage-blob

# Or add to requirements.txt
echo "azure-storage-blob" >> requirements.txt
```

## Step 6: Test Configuration

### Test Script:

```python
# test_azure_storage.py
from azure.storage.blob import BlobServiceClient
import os

def test_azure_connection():
    try:
        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        container_name = os.getenv('AZURE_STORAGE_CONTAINER_NAME', 'vendor-documents')
        
        # Create blob service client
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        
        # Test container access
        container_client = blob_service_client.get_container_client(container_name)
        properties = container_client.get_container_properties()
        
        print(f"✅ Successfully connected to Azure Storage")
        print(f"Container: {container_name}")
        print(f"Last modified: {properties.last_modified}")
        
        return True
    except Exception as e:
        print(f"❌ Failed to connect to Azure Storage: {e}")
        return False

if __name__ == "__main__":
    test_azure_connection()
```

Run the test:
```bash
python test_azure_storage.py
```

## Step 7: Security Best Practices

### 1. Use Managed Identity (Recommended for Production)

```bash
# Enable managed identity
az storage account update \
  --name vendordocs[unique] \
  --resource-group vendor-management-rg \
  --assign-identity

# Get managed identity principal ID
az storage account show \
  --name vendordocs[unique] \
  --resource-group vendor-management-rg \
  --query identity.principalId \
  --output tsv
```

### 2. Configure CORS (if needed)

```bash
# Configure CORS for web access
az storage cors add \
  --account-name vendordocs[unique] \
  --services b \
  --methods GET POST PUT DELETE \
  --origins "*" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 86400
```

### 3. Set up Lifecycle Management

```json
{
  "rules": [
    {
      "name": "DeleteOldDocuments",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "delete": {
              "daysAfterModificationGreaterThan": 2555
            }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["vendors/"]
        }
      }
    }
  ]
}
```

## Step 8: Monitoring and Logging

### Enable Storage Analytics:

1. **Azure Portal**
   - Go to Storage Account
   - Click "Insights" → "Storage Analytics"
   - Enable logging for blobs

2. **Set up Alerts**
   - Go to "Alerts"
   - Create alert for:
     - Failed requests
     - High latency
     - Storage capacity

## Step 9: Backup Strategy

### 1. Geo-Redundant Storage (GRS)

```bash
# Update storage account to GRS
az storage account update \
  --name vendordocs[unique] \
  --resource-group vendor-management-rg \
  --sku Standard_GRS
```

### 2. Point-in-Time Restore

```bash
# Enable point-in-time restore
az storage account blob-service-properties update \
  --account-name vendordocs[unique] \
  --resource-group vendor-management-rg \
  --enable-change-feed \
  --enable-versioning \
  --enable-delete-retention \
  --delete-retention-days 7
```

## Troubleshooting

### Common Issues:

1. **Connection String Issues**
   - Verify the connection string format
   - Check account name and key
   - Ensure the storage account exists

2. **Permission Issues**
   - Verify the container exists
   - Check access permissions
   - Ensure the account key is correct

3. **Network Issues**
   - Check firewall settings
   - Verify network connectivity
   - Check CORS configuration

### Debug Commands:

```bash
# Test container access
az storage container list \
  --account-name vendordocs[unique] \
  --auth-mode login

# List blobs in container
az storage blob list \
  --container-name vendor-documents \
  --account-name vendordocs[unique] \
  --auth-mode login

# Upload test file
az storage blob upload \
  --container-name vendor-documents \
  --name test.txt \
  --file test.txt \
  --account-name vendordocs[unique] \
  --auth-mode login
```

## Cost Optimization

### 1. Lifecycle Management
- Move infrequently accessed data to cool storage
- Delete old documents automatically

### 2. Compression
- Compress documents before upload
- Use efficient file formats

### 3. Monitoring Usage
- Set up cost alerts
- Monitor storage usage
- Optimize based on usage patterns

## Migration from Local Storage

### 1. Upload Existing Files

```python
# migration_script.py
import os
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import AzureError

def migrate_local_files():
    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    container_name = os.getenv('AZURE_STORAGE_CONTAINER_NAME', 'vendor-documents')
    
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)
    
    # Upload files from local uploads directory
    uploads_dir = "uploads"
    for vendor_dir in os.listdir(uploads_dir):
        vendor_path = os.path.join(uploads_dir, vendor_dir)
        if os.path.isdir(vendor_path):
            for file_name in os.listdir(vendor_path):
                file_path = os.path.join(vendor_path, file_name)
                blob_name = f"vendors/{vendor_dir}/{file_name}"
                
                try:
                    with open(file_path, "rb") as data:
                        container_client.upload_blob(blob_name, data, overwrite=True)
                    print(f"Uploaded: {blob_name}")
                except AzureError as e:
                    print(f"Failed to upload {blob_name}: {e}")

if __name__ == "__main__":
    migrate_local_files()
```

### 2. Update Database Records

```sql
-- Update file paths in database
UPDATE vendor_documents 
SET file_path = REPLACE(file_path, 'uploads/', 'https://your-storage-account.blob.core.windows.net/vendor-documents/')
WHERE file_path LIKE 'uploads/%';
```

## Support

For additional help:
- [Azure Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/)
- [Azure Storage Blob Python SDK](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-python)
- [Azure Support](https://azure.microsoft.com/en-us/support/) 