import { useState, useRef, useEffect } from 'react';
import { SpeechBubble } from './SpeechBubble';
import { PuffLoader } from 'react-spinners';
import Transcripts from './Transcripts';
import AudioPlayer from './AudioPlayer';
import './AudioUpload.css';
function AudioUpload() {
  const [speechData, setSpeechData] = useState([]);
  const [errorMessage, setError] = useState(null);
  const inputRef = useRef();
  let [selectedFile, setSelectedFile] = useState(null);

  let [uploadStatus, setUploadStatus] = useState('select');
  // let url = 'http://localhost:5000/upload'
  let url = 'https://speech-to-text-backend-blue.vercel.app'
  let loaderStyle = {
    marginTop: '50px'
  }
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  };

  function onChooseFile() {
    inputRef.current.click();
  }

  function clearFileInput() {
    setError(null);
    inputRef.current.value = "";
    setSelectedFile(null);
    setSpeechData([])
    setUploadStatus("select")
  }

  const handleUpload = async () => {
    setError(null)
    if (uploadStatus == 'done') {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus("uploading")
      const formdata = new FormData();
      formdata.append("audio", selectedFile);
      const uploadRes = await fetch(url + '/upload', {
        method: "POST",
        body: formdata,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.transcriptId) {
        throw new Error("No transcriptId returned from server");
      }
      const transcriptId = uploadData.transcriptId;



      //  poll until transcript is ready
      let transcriptData;
      while (true) {
        const res = await fetch(url + `/transcript/${transcriptId}`);
        transcriptData = await res.json();

        if (transcriptData.status === "completed") {
          console.log("Transcript ready:", transcriptData);
          break;
        }

        else if (transcriptData.status === "error") {
          throw new Error(transcriptData.error || "Transcription failed");
        }

        console.log("Still processing...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5s
      }


      setSpeechData(transcriptData.utterances)
      setUploadStatus('done')

      // const data = await res.json();
      // setSpeechData(data.raw)
      // setUploadStatus('done')
    }
    catch (error) {
      setError(JSON.stringify(error));
      setUploadStatus('select')
    }
  };

  function formatTranscript(input) {
    const lines = input.split("\n");
    const result = [];
    let currentSpeaker = null;
    let currentMessage = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const colonIndex = line.indexOf(":");

      if (colonIndex !== -1) {
        const possibleSpeaker = line.slice(0, colonIndex).trim();

        // If this looks like a "speaker name"
        if (possibleSpeaker.length > 0) {
          // Save previous speaker/message before starting a new one
          if (currentSpeaker) {
            result.push({
              speaker: currentSpeaker,
              text: currentMessage.join(" ").trim()
            });
          }

          // Start new speaker
          currentSpeaker = possibleSpeaker;
          currentMessage = [line.slice(colonIndex + 1).trim()];
          continue;
        }
      }

      // Continuation of current speaker's message
      if (currentSpeaker) {
        currentMessage.push(line);
      }
    }

    // Push the last speaker
    if (currentSpeaker) {
      result.push({
        speaker: currentSpeaker,
        text: currentMessage.join(" ").trim()
      });
    }

    setSpeechData(result);

  }


  function updateSpeechBubbles(editedTranscript) {
    formatTranscript(editedTranscript)
  }

  return (
    <div className='container'>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ display: 'none' }} />


      {!selectedFile && (
        <>
          <div className="file-card" onClick={onChooseFile}>
            <span className="material-symbols-outlined icon">description</span>

            <div className="file-info">
              <div style={{ flex: 1 }}>
                <h4>Choose file to upload</h4>
              </div>


            </div>
          </div>
        </>
      )}

      {selectedFile && (
        <>
          <div className="file-card">
            <span className="material-symbols-outlined icon">description</span>

            <div className="file-info">
              <div style={{ flex: 1 }}>
                <h4>{selectedFile.name}</h4>
              </div>

              {uploadStatus == 'select' && <button disabled={uploadStatus == 'uploading'} onClick={handleUpload}>
                <span className="material-symbols-outlined speech-to-text">
                  Transcribe
                </span>
              </button>}
              <button disabled={uploadStatus == 'uploading'} onClick={clearFileInput}>
                <span className="material-symbols-outlined close-icon">
                  close
                </span>
              </button>
            </div>
          </div>

          {selectedFile && <AudioPlayer audioFile={selectedFile} />}
          {errorMessage && <div>Failed to transcribe. Please try again</div>}

          {uploadStatus == 'uploading' &&
            <>
              <PuffLoader
                color={'lightblue'}
                loading={uploadStatus == 'uploading'}
                cssOverride={loaderStyle}
                size={250}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <div>Transcribing....</div>
            </>
          }
          {speechData && speechData.length > 0 &&
            <div className='transcripts-container'>
              <Transcripts updateSpeechBubbles={updateSpeechBubbles} transcript={speechData} />
              <SpeechBubble data={speechData} />
            </div>
          }
        </>
      )}
    </div>
  )
}

export default AudioUpload;
