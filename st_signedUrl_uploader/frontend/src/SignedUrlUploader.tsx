import React, { ReactNode } from "react";
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import uploadIcon from './logo.png';

interface FileData {
  filename: string;
  content_type: string;
}

interface State {
  filesData: FileData;
  signedUrl: string;
}

class SignedUrlUploader extends StreamlitComponentBase<State> {
  public state: State = { filesData: { filename: '', content_type: '' }, signedUrl: '' };

  public render = (): ReactNode => {
    const { theme } = this.props;
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center', 
      gap: '20px',          
    };

    const imageStyle: React.CSSProperties = {
      height: '50px',       
      width: '50px',        
    };
    const style: React.CSSProperties = {
      border: '1px solid black',  
      outline: '1px solid black', 
      backgroundColor: '#002244',   
      color: 'white',               
      padding: '10px 15px',         
      borderRadius: '5px'           
    };

    if (theme) {
      const borderStyling = `1px solid black`;
      style.border = borderStyling;
      style.outline = borderStyling;
    }

    return (
      <div style={{ padding: "20px" }}>
        <div style={containerStyle}>
        <img src={uploadIcon} style={imageStyle} alt="Upload Icon"/>
        <input
          type="file"
          onChange={this.onFileUpload}
          style={{...style, backgroundColor: 'transparent', color: 'initial', border: 'bleu'}}
        />
        <button
          style={style}
          onClick={this.onClicked}
        >
          Upload
        </button>
        </div>
      </div>
    );
  };

  private onFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    const signedUrl = this.props.args["signed_url"];

    if (file && signedUrl) {
      try {
        const filesData: FileData = {
          filename: file.name,
          content_type: file.type,
        };

        this.setState({ filesData });

        if (!file.name.endsWith('.DS_Store')) {
          await this.uploadFile(file, signedUrl);
        }
      } catch (error) {
        console.error(error);
        alert(`Error uploading file ${file.name}: ${error}`);
      }
    } else {
      console.error("File or signed URL is missing.");
    }
  };

  private uploadFile = async (file: File, signedUrl: string): Promise<void> => {
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'application/octet-stream'  // Fixed content type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed for file: ${file.name}`);
    }
  };

  private onClicked = (): void => {
    Streamlit.setComponentValue(this.state.filesData);
  };
}

export default withStreamlitConnection(SignedUrlUploader);
