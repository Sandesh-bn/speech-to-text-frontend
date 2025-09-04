import { useState, useEffect } from "react";
import './Transcripts.css';

export default function Transcripts({ transcript, updateSpeechBubbles }) {
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState('');

    useEffect(() => {
        let textAreaContent = ''
        for (let row of transcript) {
            let { speaker, text } = row;
            let line = `${speaker}: ${text}\n`
            textAreaContent += line;
        }

        setText(textAreaContent);
        setDraft(textAreaContent)

    }, [])

    const handleEdit = () => {
        setDraft(text);
        setIsEditing(true);
    };

    const handleSubmit = () => {
        setText(draft);
        updateSpeechBubbles(draft)
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setDraft(text);
    };

    return (
        <div style={{ maxWidth: "600px", fontFamily: "Arial" }}>
            {!isEditing ? (
                <div>
                    <button className="transcripts-button" onClick={handleEdit}>Edit Transcript</button>
                    <pre
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "20px",
                            backgroundColor: "#f9f9f9",
                            textWrap: 'wrap',
                            whiteSpace: 'pre-wrap',
                            fontSize: '15px',
                            overflowY: 'scroll',
                            maxHeight: '300px'
                        }}
                    >
                        {text}
                    </pre>
                    
                </div>
            ) : (
                <div>
                    <div>
                        <button className="transcripts-button"  onClick={handleSubmit}>Save</button>
                        <button className="transcripts-button"  onClick={handleCancel} style={{ marginLeft: "8px" }}>
                            Cancel
                        </button>
                    </div>
                    <textarea
                        rows="12"
                        style={{ width: "600px", padding: "8px", marginBottom: "10px" }}
                        
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                    />
                    
                </div>
            )}
        </div>
    );
};

