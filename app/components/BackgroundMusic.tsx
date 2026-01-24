"use client";

import { useEffect, useState, useRef } from 'react';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);

    // LISTA DE CANCIONES
    const PLAYLIST = [
        { title: "Mi Varadero", file: "Salistre - Mi Varadero.mp3" },
        { title: "Todos los días son lunes", file: "Salistre - TODOS LOS DÍAS SON LUNES.mp3" },
        { title: "Tararea", file: "Salistre - Tararea.mp3" }
    ];

    const currentTrack = PLAYLIST[currentTrackIndex];

    const handleNextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    useEffect(() => {
        // Limpiar audio previo si existe
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeEventListener('ended', handleNextTrack); // Ensure listener is removed
            audioRef.current = null;
        }

        // Inicializar nuevo audio
        const audio = new Audio(`/music/${currentTrack.file}`);
        audioRef.current = audio;

        // Configurar evento para pasar a la siguiente al terminar
        audio.addEventListener('ended', handleNextTrack);

        // Intentar reproducir si ya estaba sonando o es la primera vez (auto)
        // NOTA: Si el navegador bloquea el autoplay inicial, isPlaying será false.
        // Si el usuario ya interactuó (isPlaying true), debería reproducirse la siguiente.

        // Si es la carga inicial, intentamos autoplay.
        // Si cambiamos de canción porque acabó la anterior, queremos que siga sonando (si estaba isPlaying).
        // Si cambiamos manualmente, depende.

        // Estrategia simple: Intentar reproducir siempre. Si falla, isPlaying se pone a false.
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Autoplay prevented:", error);
                // Si falla el autoplay Y no hemos interactuado, no forzamos isPlaying true
                if (!hasInteracted) setIsPlaying(false);
            });
        }

        return () => {
            audio.removeEventListener('ended', handleNextTrack);
            audio.pause();
            audioRef.current = null;
        };
    }, [currentTrackIndex, hasInteracted]); // Re-ejecutar cuando cambia la canción o la interacción

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
        setHasInteracted(true);
    };

    if (PLAYLIST.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px'
        }}>
            {/* Indicador de canción */}
            <div style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                padding: '12px 18px',
                borderRadius: '16px',
                color: 'white',
                fontSize: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: isPlaying ? 1 : 0.7,
                transition: 'all 0.3s ease',
                maxWidth: '300px',
                cursor: 'pointer' // Permitir click para siguiente canción
            }} onClick={handleNextTrack} title="Click para siguiente canción">
                <span style={{ fontSize: '2rem', animation: isPlaying ? 'spin 3s linear infinite' : 'none' }}>💿</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.35rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Está sonando</span>
                    <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {currentTrack.title}
                    </span>
                </div>
            </div>

            {/* Controles */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '2.7rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)'
                    }}
                    aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
                >
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
            </div>
        </div>
    );
}
