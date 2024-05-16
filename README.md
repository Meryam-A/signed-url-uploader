# Streamlit Signed URL Uploader

## Overview

This Streamlit component provides a solution to overcome the 32MB request size limit in App Engine and Cloud Run by leveraging cloud storage signed URLs. It allows users to upload large files directly to Google Cloud Storage (GCS) and seamlessly integrate them into web applications deployed on App Engine or Cloud Run.

Considering the schema below, the Signed Url Uploader abstracts away steps 2 and 3. Check this article for more details.
<img width="822" alt="image" src="https://github.com/Meryam-A/signed-url-uploader/assets/166532696/615e35a9-ab78-45ea-916f-0a2dd3e45bb2">

## Installation

You can install the latest release using:
```
pip install st_signedUrl_uploader
```

## Usage 
This component serves as an efficient uploader for applications that are deployed on App Engine or Cloud Run, specifically designed to handle large file uploads by utilizing Google Cloud Storage (GCS) and signed URLs. To facilitate ease of integration and testing, the component can be used in two ways: directly in cloud deployments or locally using a service account for development and testing purposes. Below, you will find detailed instructions for both scenarios, including sample code and a list of infrastructure prerequisites necessary to ensure smooth operation and integration of the uploader in your projects.

### Usage with App Engine or Cloud Run

#### Requirements :
  
- **Google Cloud Storage Bucket:** Set up a bucket to store uploaded files.
- **CORS Configuration:** Set your bucket's CORS settings using:
```
gcloud storage buckets update gs://BUCKET_NAME --cors-file=CORS_CONFIG_FILE
```
Example CORS configuration file can be found in [CORS.json](https://github.com/Meryam-A/signed-url-uploader/blob/main/CORS.json) or create your own based on [Google Cloud Documentation](https://cloud.google.com/storage/docs/cross-origin)

### Implementation : 
- **Service Account Permissions:** Ensure the App Engine or Cloud Run service account has the `roles/iam.serviceAccountTokenCreator` role for generating signed URLs.
- **Install Cloud Storage library:** 
```
pip install google-cloud-storage
```
#### Sample Code :

```python
from st_signedUrl_uploader import signedUrl_uploader
from google import auth
from google.cloud import storage

def main():
  bucket_name = "your-bucket-name" # Specify your GCS bucket name here

  # Authenticate and create a storage client
  credentials, project = auth.default()
  credentials.refresh(auth.transport.requests.Request()) 
  storage_client = storage.Client()

  # Use the uploader function to handle file uploads
  signedUrl_uploader(storage_client, credentials, bucket_name)

if __name__ == "__main__":
    main()
```

After deploying your application on App Engine or Cloud run, the default service account credentials are retrieved and used for signed url generation.

### Testing locally with a service account

#### Requirements :
  
- **Google Cloud Storage Bucket:** Set up a bucket to store uploaded files.
- **CORS Configuration:** Set your bucket's CORS settings using:
```
gcloud storage buckets update gs://BUCKET_NAME --cors-file=CORS_CONFIG_FILE
```
Example CORS configuration file can be found in [CORS.json](https://github.com/Meryam-A/signed-url-uploader/blob/main/CORS.json) or create your own based on [Google Cloud Documentation](https://cloud.google.com/storage/docs/cross-origin)

### Implementation : 
- Create a service account and give it the role `roles/iam.serviceAccountTokenCreator`
- **Install Cloud Storage library:** 
```
pip install google-cloud-storage
```
#### Sample Code :

```python
from st_signedUrl_uploader import signedUrl_uploader
from google import auth
from google.cloud import storage
import os

def main():
  bucket_name = "your-bucket-name"  # Specify your GCS bucket name here

  # Authenticate and create a storage client
  parent_dir = os.path.dirname(os.path.abspath(__file__))
  os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(parent_dir, 'path/to/key_file.json')
  credentials, project = auth.default()
  storage_client = storage.Client()

  # Use the uploader function to handle file uploads
  signedUrl_uploader(storage_client, credentials, bucket_name)

if __name__ == "__main__":
    main()
```

You can run the application using the command below and replacing `main.py` by the name of your file.

```
streamlit run main.py
```

## Useful links

[GitHub Repository](https://github.com/Meryam-A/signed-url-uploader)