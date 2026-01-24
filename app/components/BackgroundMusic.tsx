"use client";

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Attempt to auto-play after a short delay or interaction
        setIsReady(true);
        setIsPlaying(true);
    }, []);

    return (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', opacity: 0.5, pointerEvents: 'none', zIndex: -1 }}>
            <ReactPlayer
                url="https://www.youtube.com/watch?v=kYcI1b3g72U"
                playing={isPlaying}
                loop={true}
                volume={0.3} // "fondo bajito"
                width="1px"
                height="1px"
                config={{
                    playerVars: { showinfo: 0, controls: 0 }
                }}
                onError={(e) => console.log("Music player error", e)}
            />
        </div>
    );
}
