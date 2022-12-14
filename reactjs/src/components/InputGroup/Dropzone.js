import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@mui/material';

export default function DropzoneWithoutDrag(props) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    noDrag: true
  });
  const files = acceptedFiles.map((file) => <li key={file.path}>{file.path}</li>);

  return (
    <section className="container">
      <Card
        {...getRootProps({ className: 'dropzone' })}
        style={{
          outline: 'none',
          display: 'flex',
          overflow: 'hidden',
          textAlign: 'center',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer',
          height: '100px',
          marginBottom: '20px'
        }}
      >
        <input {...getInputProps(props)} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Card>
      <aside>
        <h4>Files: {files}</h4>
      </aside>
    </section>
  );
}
