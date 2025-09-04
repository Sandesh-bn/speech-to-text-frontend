import { useEffect, useState } from "react";
import "./SpeechBubble.css"; 
export const SpeechBubble = ({ data }) => {
    let [firstName, setFirstName] = useState('');
    let [secondName, setSecondName] = useState('');

    useEffect(() => {
        if (data && data.length >= 2) {
            setFirstName(data[0].speaker);
            setSecondName(data[1].speaker);
        }
    }, [data])


    const sampleData = [
        {
            speaker: "A",
            text: "Hello, West 27. This is Melissa, a virtual recruit… a good time? It won't take more than 10 minutes.",
            confidence: 0.9877538,
            start: 4800,
            end: 19920,
        },
        {
            speaker: "B",
            text: "Yes, this is a good time.",
            confidence: 0.99768066,
            start: 21600,
            end: 22880,
        },
        {
            speaker: "A",
            text: "Great. Before we proceed, I want to let you know t…our permission to continue with our conversation?",
            confidence: 0.988711,
            start: 25120,
            end: 40420,
        },
        {
            speaker: "B",
            text: "Yes, you do.",
            confidence: 0.99365234,
            start: 42340,
            end: 43140,
        },
        {
            speaker: "A",
            text: "Excellent. Thank you. I'll start by confirming a f… Can you confirm where you are currently located?",
            confidence: 0.99074054,
            start: 46580,
            end: 60560,
        },
    ];


    return (
        <div className="transcript-container">
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className={`message-row ${item.speaker === firstName ? "left" : "right"
                        }`}
                >
                    <div className={`bubble ${item.speaker === firstName ? "bubble-left" : "bubble-right"}`}>
                        <p className="speaker"> {item.speaker}</p>
                        <p className="text">{item.text}</p>

                    </div>
                </div>
            ))}
        </div>
    );
};
