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
                    <pre
                        
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "10px",
                            backgroundColor: "#f9f9f9",
                            textWrap: 'wrap',
                            whiteSpace: 'pre-wrap',
                            fontSize: '15px'
                        }}
                    >
                        {text}
                    </pre>
                    <button className="transcripts-button" onClick={handleEdit}>Edit</button>
                </div>
            ) : (
                <div>
                    <textarea
                        rows="7"
                        style={{ width: "600px", padding: "8px", marginBottom: "10px" }}
                        
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                    />
                    <div>
                        <button className="transcripts-button"  onClick={handleSubmit}>Save</button>
                        <button className="transcripts-button"  onClick={handleCancel} style={{ marginLeft: "8px" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

