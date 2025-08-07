import os
import uuid
from datetime import datetime
from typing import Optional
from azure.storage.blob import BlobServiceClient, ContentSettings
from azure.core.exceptions import AzureError
from ..config import settings


class AzureStorageManager:
    def __init__(self):
        self.connection_string = settings.azure_storage_connection_string
        self.container_name = settings.azure_storage_container_name or "vendor-documents"
        self.blob_service_client = None
        
        if self.connection_string:
            try:
                self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
                # Ensure container exists
                self._ensure_container_exists()
            except Exception as e:
                print(f"Failed to initialize Azure Storage: {e}")
    
    def _ensure_container_exists(self):
        """Ensure the blob container exists"""
        try:
            container_client = self.blob_service_client.get_container_client(self.container_name)
            container_client.get_container_properties()
        except AzureError:
            # Container doesn't exist, create it
            self.blob_service_client.create_container(self.container_name)
    
    def upload_file(self, file_data: bytes, file_name: str, vendor_id: int, content_type: str = None) -> str:
        """Upload a file to Azure Blob Storage"""
        if not self.blob_service_client:
            # Fallback to local storage if Azure is not configured
            return self._save_local_file(file_data, file_name, vendor_id)
        
        try:
            # Generate unique blob name
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            file_extension = os.path.splitext(file_name)[1]
            blob_name = f"vendors/{vendor_id}/{timestamp}_{unique_id}_{file_name}"
            
            # Get blob client
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            # Set content settings
            content_settings = None
            if content_type:
                content_settings = ContentSettings(content_type=content_type)
            
            # Upload file
            blob_client.upload_blob(
                file_data, 
                overwrite=True,
                content_settings=content_settings
            )
            
            # Return the blob URL
            return blob_client.url
            
        except AzureError as e:
            print(f"Azure upload failed: {e}")
            # Fallback to local storage
            return self._save_local_file(file_data, file_name, vendor_id)
    
    def _save_local_file(self, file_data: bytes, file_name: str, vendor_id: int) -> str:
        """Fallback to local file storage"""
        upload_dir = os.path.join(settings.upload_dir, str(vendor_id))
        os.makedirs(upload_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file_name}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as f:
            f.write(file_data)
        
        return file_path
    
    def download_file(self, blob_url: str) -> Optional[bytes]:
        """Download a file from Azure Blob Storage"""
        if not self.blob_service_client or not blob_url.startswith("https://"):
            # Fallback to local file reading
            return self._read_local_file(blob_url)
        
        try:
            # Extract blob name from URL
            blob_name = blob_url.split(f"{self.container_name}/")[-1]
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            # Download blob
            blob_data = blob_client.download_blob()
            return blob_data.readall()
            
        except AzureError as e:
            print(f"Azure download failed: {e}")
            # Fallback to local file reading
            return self._read_local_file(blob_url)
    
    def _read_local_file(self, file_path: str) -> Optional[bytes]:
        """Read file from local storage"""
        try:
            if os.path.exists(file_path):
                with open(file_path, "rb") as f:
                    return f.read()
        except Exception as e:
            print(f"Local file read failed: {e}")
        return None
    
    def delete_file(self, blob_url: str) -> bool:
        """Delete a file from Azure Blob Storage"""
        if not self.blob_service_client or not blob_url.startswith("https://"):
            # Fallback to local file deletion
            return self._delete_local_file(blob_url)
        
        try:
            # Extract blob name from URL
            blob_name = blob_url.split(f"{self.container_name}/")[-1]
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            # Delete blob
            blob_client.delete_blob()
            return True
            
        except AzureError as e:
            print(f"Azure delete failed: {e}")
            # Fallback to local file deletion
            return self._delete_local_file(blob_url)
    
    def _delete_local_file(self, file_path: str) -> bool:
        """Delete file from local storage"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception as e:
            print(f"Local file deletion failed: {e}")
        return False


# Global instance
azure_storage = AzureStorageManager() 