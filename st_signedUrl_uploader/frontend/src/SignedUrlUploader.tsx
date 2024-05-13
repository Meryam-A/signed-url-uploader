import React, { ReactNode } from "react";
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";

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
    const style: React.CSSProperties = {};

    if (theme) {
      const borderStyling = `1px solid ${theme.primaryColor}`;
      style.border = borderStyling;
      style.outline = borderStyling;
    }

    return (
      <div style={{ padding: "20px" }}>
        <input
          type="file"
          onChange={this.onFileUpload}
          style={style}
        />
        <button
          style={style}
          onClick={this.onClicked}
        >
          Upload
        </button>
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
