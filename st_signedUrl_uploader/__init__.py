import os
import streamlit.components.v1 as components
import datetime as dt
import time
import streamlit as st

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component(
        "signedUrl_uploader",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("signedUrl_uploader", path=build_dir)

def generate_signed_url(credentials, blob, method="PUT"):
    expiration_timedelta = dt.timedelta(days=1)
    signed_url = blob.generate_signed_url(
        expiration=expiration_timedelta,
        method=method,
        content_type='application/octet-stream',
        service_account_email=credentials.service_account_email,
        access_token=credentials.token,
    )
    return signed_url


def signedUrl_uploader(storage_client, credentials, bucket_name, key='1'):

    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob("signedUrl file")
    signed_url = generate_signed_url(credentials, blob)
    files_data = _component_func(signed_url=signed_url,key=key)
    if files_data:
        while not blob.exists() :
            time.sleep(1)
        new_blob = bucket.rename_blob(blob, files_data['filename'])
        new_blob.content_type = files_data['content_type']
        new_blob.patch()        
        st.toast('File Uploaded Successfully !', icon='🤩')

    return files_data
   

if not _RELEASE:

    from google import auth
    from google.cloud import storage

    # Name of the gcs bucket where you want to upload
    # this bucket must have cors configuration to allow PUT requests from browser
    bucket_name = "st-signed-url-bucket"

    # if you want to use service account keys, specify the path to your json key file here
    # this service account roles/iam.serviceAccountTokenCreator
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(parent_dir, 'gae.json')


    credentials, project = auth.default()

    # if you want to deploy on app engine or cloud run, you don't need to provide key file, just add this line below
    # the service account associated to app engine or cloud run must have the role roles/iam.serviceAccountTokenCreator

    #credentials.refresh(auth.transport.requests.Request()) # remove this line if you are using environment variable for service account credentials
    
    storage_client = storage.Client()

    file_data = signedUrl_uploader(storage_client, credentials, bucket_name)
