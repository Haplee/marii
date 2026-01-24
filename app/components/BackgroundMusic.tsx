"use client";

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        setIsPlaying(true);
    }, []);

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                }}
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
                {isMuted ? '🔇' : '🔊'}
            </button>

            <div style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                <ReactPlayer
                    url="https://www.youtube.com/watch?v=kYcI1b3g72U"
                    playing={isPlaying}
                    loop={true}
                    volume={1.0}
                    muted={isMuted}
                    width="100%"
                    height="100%"
                    config={{
                        playerVars: {
                            showinfo: 0,
                            controls: 0,
                            playsinline: 1,
                            origin: typeof window !== 'undefined' ? window.location.origin : undefined
                        }
                    }}
                    onError={(e) => console.log("Music player error", e)}
                />
            </div>
        </div>
    );
}
