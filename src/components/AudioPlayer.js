import { useState, useRef, useEffect } from "react";
import './AudioPlayer.css';

export default function AudioPlayer({ audioFile }) {
    const [audioSrc, setAudioSrc] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioFile && ["audio/mpeg", "audio/wav", "audio/mp4", "video/mp4"].includes(audioFile.type)) {
            const url = URL.createObjectURL(audioFile);
            setAudioSrc(url);
            setProgress(0);
            setIsPlaying(false);
        } else {
            alert("Please upload a valid audio file (MP3, WAV, MP4).");
        }
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && ["audio/mpeg", "audio/wav", "audio/mp4", "video/mp4"].includes(file.type)) {
            const url = URL.createObjectURL(file);
            setAudioSrc(url);
            setProgress(0);
            setIsPlaying(false);
        } else {
            alert("Please upload a valid audio file (MP3, WAV, MP4).");
        }
    };

    const playAudio = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const pauseAudio = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const stopAudio = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
    };

    const handleSeek = (e) => {
        const value = e.target.value;
        audioRef.current.currentTime = value;
        setProgress(value);
    };

    const handleTimeUpdate = () => {
        setProgress(audioRef.current.currentTime);
    };

    return (
        <div className="audio-uploader">
            {/* Audio Controls */}
            {audioSrc && (
                <div className="player-container">
                    <audio
                        ref={audioRef}
                        src={audioSrc}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={stopAudio}
                    />

                    {/* Seek Bar */}
                    <input
                        type="range"
                        min="0"
                        max={audioRef.current?.duration || 0}
                        value={progress}
                        onChange={handleSeek}
                        className="seek-bar"
                    />

                    {/* Control Buttons */}
                    <div className="controls">
                        {!isPlaying ? (
                            <button className="player-button" onClick={playAudio}>
                                <span className="material-symbols-outlined">
                                    play_arrow
                                </span>
                            </button>
                        ) : (
                            <button className="player-button" onClick={pauseAudio}>
                                <span className="material-symbols-outlined">
                                    pause
                                </span>
                            </button>
                        )}
                        <button className="player-button" onClick={stopAudio}>
                            <span className="material-symbols-outlined">
                                stop
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
