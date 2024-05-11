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
You can use this component as an uploader in your application that's intended for deployment on App Engine or Cloud Run. You can also test the uploader using a service account. Below is a usage example for each case, with the sample code as well as the infrastructure requirements 

### Usage with App Engine or Cloud Run

#### Requirements :
  
- Create Cloud Storage bucket where you want to upload files
- Set up CORS configuration for the bucket using this command
```
gcloud storage buckets update gs://BUCKET_NAME --cors-file=CORS_CONFIG_FILE
```
For the cofiguration file you can use [CORS.json](https://github.com/Meryam-A/signed-url-uploader/blob/main/CORS.json)

- Depending on what you are using, grant App Engine's or Cloud Run's default service account the role *roles/iam.serviceAccountTokenCreator*
    
#### Code sample :

```python
from st_signedUrl_uploader import signedUrl_uploader
from google import auth
from google.cloud import storage

def main():
  bucket_name = "st-signed-url-bucket" # name of your gcs bucket
  
  credentials, project = auth.default()
  credentials.refresh(auth.transport.requests.Request()) 
  
  storage_client = storage.Client()
  
  signedUrl_uploader(storage_client, credentials, bucket_name)

if __name__ == "__main__":
    main()
```

After deploying your application on App Engine or Cloud run, the default service account credentials are retrieved and used for signed url generation.

### Testing locally with a service account

#### Requirements :
  
- Create Cloud Storage bucket where you want to upload files
- Set up CORS configuration for the bucket using this command
```
gcloud storage buckets update gs://BUCKET_NAME --cors-file=CORS_CONFIG_FILE
```
For the cofiguration file you can use [CORS.json](https://github.com/Meryam-A/signed-url-uploader/blob/main/CORS.json)

- Create a service account and give it the role *roles/iam.serviceAccountTokenCreator*
    
#### Code sample :

```python
from st_signedUrl_uploader import signedUrl_uploader
from google import auth
from google.cloud import storage
import os

def main():
  bucket_name = "st-signed-url-bucket" # name of your gcs bucket
  
  parent_dir = os.path.dirname(os.path.abspath(__file__))
  os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(parent_dir, 'path/to/key_file.json')
  credentials, project = auth.default()
  
  
  storage_client = storage.Client()
  
  signedUrl_uploader(storage_client, credentials, bucket_name)

if __name__ == "__main__":
    main()
```
