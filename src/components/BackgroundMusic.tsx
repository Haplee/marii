

import { useEffect, useState, useRef } from 'react';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [playlist, setPlaylist] = useState<{ title: string; file: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar lista de canciones dinámicamente
    useEffect(() => {
        fetch('/assets.json')
            .then(res => res.json())
            .then(data => {
                if (data.musicTracks && Array.isArray(data.musicTracks)) {
                    const tracks = data.musicTracks.map((file: string) => ({
                        // Eliminar extensión .mp3 y limpiar nombre si es necesario
                        title: file.replace(/\.[^/.]+$/, "").replace(/Salistre - /g, ""),
                        file: file
                    }));
                    setPlaylist(tracks);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load music assets", err);
                setIsLoading(false);
            });
    }, []);

    const currentTrack = playlist[currentTrackIndex];

    const handleNextTrack = () => {
        if (playlist.length === 0) return;
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    };

    useEffect(() => {
        if (playlist.length === 0) return;

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
            if (audio) {
                audio.removeEventListener('ended', handleNextTrack);
                audio.pause();
            }
            audioRef.current = null;
        };
    }, [currentTrackIndex, hasInteracted, playlist]); // Re-ejecutar cuando cambia la canción o la playlist

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

    if (isLoading || playlist.length === 0) return null;

    return (
        <div className="music-player-container">
            {/* Indicador de canción */}
            <div
                className="music-player-info"
                onClick={handleNextTrack}
                title="Click para siguiente canción"
                style={{ opacity: isPlaying ? 1 : 0.7 }}
            >
                <span className="music-player-disc" style={{ animation: isPlaying ? 'spin 3s linear infinite' : 'none' }}>💿</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="music-player-label">Está sonando</span>
                    <span className="music-player-track">
                        {currentTrack.title}
                    </span>
                </div>
            </div>

            {/* Controles */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={togglePlay}
                    className="music-control-button"
                    aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
                >
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
            </div>
        </div>
    );
}
