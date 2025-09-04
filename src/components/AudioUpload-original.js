import React, { useState } from 'react';
import { SpeechBubble } from './SpeechBubble';
import './AudioUpload.css';
function AudioUpload() {
  const [file, setFile] = useState(null);
  const [speechData, setSpeechData] = useState([])
  const [fileName, setFileName] = useState('')
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
 
    setFileName(e.target.files[0].name)
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('audio', file);

    let url = 'http://localhost:5000/upload'

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Response:');
      console.log(data)
      setSpeechData(data.raw)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      <label htmlFor="file-upload" className="custom-file-upload">
        <i className="fa fa-cloud-upload"></i> Upload
      </label>
      <input id="file-upload" type="file" accept="audio/*" onChange={handleFileChange} />

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br />
     
      <button onClick={handleUpload}>Transcribe</button>
      {speechData && speechData.length > 0 && <SpeechBubble data={speechData} />}
    </div>
  );
}

export default AudioUpload;
