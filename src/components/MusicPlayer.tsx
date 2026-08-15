import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    tracks: string[];
};

// Pista tocable: local (mp3 en public/music) o remota (preview de 30s vía Deezer)
type Track = {
    id: string;
    title: string;
    artist: string;
    src: string | null;
    externalUrl?: string;
    remote: boolean;
};

// Forma de cada elemento que devuelve /api/salistre-tracks (ver api/salistre-tracks.py)
type RemoteApiTrack = {
    id: number | string;
    title: string;
    artist?: string;
    previewUrl?: string | null;
    externalUrl?: string;
};

const SPOTIFY_URL = 'https://open.spotify.com/search/Salistre';

function normalize(text: string): string {
    return text
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

// "Salistre, Juanlu Montoya - Si Tú No Vienes.mp3" -> artista + título
function parseLocalTrack(file: string): Track {
    const name = file.replace(/\.[^/.]+$/, '');
    const separator = name.indexOf(' - ');
    const { artist, title } = separator === -1
        ? { artist: 'Salistre', title: name }
        : { artist: name.slice(0, separator).trim(), title: name.slice(separator + 3).trim() };
    return { id: file, title, artist, src: `/music/${file}`, remote: false };
}

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function MusicPlayer({ tracks }: Props) {
    const [remoteTracks, setRemoteTracks] = useState<RemoteApiTrack[]>([]);

    // Catálogo completo de Salistre desde Deezer (api/salistre-tracks.py, solo en Vercel).
    // Si falla o estamos en local, el reproductor sigue funcionando solo con los mp3 locales.
    useEffect(() => {
        let cancelled = false;
        fetch('/api/salistre-tracks')
            .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
            .then((data: { tracks?: RemoteApiTrack[] }) => {
                if (!cancelled) setRemoteTracks(Array.isArray(data.tracks) ? data.tracks : []);
            })
            .catch(err => console.error('No se pudo cargar el catálogo de Salistre', err));
        return () => {
            cancelled = true;
        };
    }, []);

    const playlist = useMemo<Track[]>(() => {
        const local = tracks.map(parseLocalTrack);
        const localTitles = new Set(local.map(t => normalize(t.title)));
        const remoteOnly: Track[] = remoteTracks
            .filter(rt => !localTitles.has(normalize(rt.title)))
            .map(rt => ({
                id: `deezer-${rt.id}`,
                title: rt.title,
                artist: rt.artist || 'Salistre',
                src: rt.previewUrl ?? null,
                externalUrl: rt.externalUrl,
                remote: true
            }));
        return [...local, ...remoteOnly];
    }, [tracks, remoteTracks]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playlistLengthRef = useRef(playlist.length);
    playlistLengthRef.current = playlist.length;
    const skipGuardRef = useRef(0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [sheetOpen, setSheetOpen] = useState(false);

    // Un único elemento de audio para toda la vida del componente
    useEffect(() => {
        const audio = new Audio();
        audio.preload = 'metadata';
        audioRef.current = audio;

        const onTimeUpdate = () => setProgress(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => {
            setCurrentIndex(prev => (prev + 1) % Math.max(1, playlistLengthRef.current));
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    // Cambiar de pista
    useEffect(() => {
        skipGuardRef.current = 0;
    }, [playlist]);

    useEffect(() => {
        const audio = audioRef.current;
        const track = playlist[currentIndex];
        if (!audio || !track) return;

        if (!track.src) {
            // Canción de Salistre sin preview disponible en Deezer: se salta sola
            // (con tope para no entrar en bucle si ninguna pista fuera reproducible)
            skipGuardRef.current += 1;
            if (skipGuardRef.current > playlist.length) return;
            setCurrentIndex(prev => (prev + 1) % Math.max(1, playlist.length));
            return;
        }
        skipGuardRef.current = 0;

        audio.src = track.src;
        setProgress(0);
        setDuration(0);
        // Intentar reproducir; si el navegador bloquea el autoplay se queda en pausa
        audio.play().catch(() => setIsPlaying(false));
    }, [currentIndex, playlist]);

    if (playlist.length === 0) return null;

    const current = playlist[currentIndex];

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => setIsPlaying(false));
        }
    };

    const goTo = (index: number) => {
        setCurrentIndex(((index % playlist.length) + playlist.length) % playlist.length);
    };

    const handleSeek = (value: number) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration)) return;
        audio.currentTime = value;
        setProgress(value);
    };

    return (
        <>
            <div className="player-bar">
                <button
                    className="player-bar-info"
                    onClick={() => setSheetOpen(true)}
                    aria-label="Abrir lista de canciones"
                >
                    <span className={`player-disc ${isPlaying ? 'spinning' : ''}`}>💿</span>
                    <span className="player-track-meta">
                        <span className="player-track-title">{current.title}</span>
                        <span className="player-track-artist">{current.artist}</span>
                    </span>
                </button>

                <div className="player-controls">
                    <button className="player-btn" onClick={() => goTo(currentIndex - 1)} aria-label="Canción anterior">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                            <path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" />
                        </svg>
                    </button>
                    <button className="player-btn player-btn-main" onClick={togglePlay} aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                    <button className="player-btn" onClick={() => goTo(currentIndex + 1)} aria-label="Siguiente canción">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                            <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
                        </svg>
                    </button>
                </div>

                <div className="player-seek">
                    <span className="player-time">{formatTime(progress)}</span>
                    <input
                        className="player-seek-bar"
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={Math.min(progress, duration || 0)}
                        onChange={e => handleSeek(Number(e.target.value))}
                        aria-label="Posición de la canción"
                    />
                    <span className="player-time">{formatTime(duration)}</span>
                </div>
            </div>

            <AnimatePresence>
                {sheetOpen && (
                    <>
                        <motion.div
                            className="sheet-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSheetOpen(false)}
                        />
                        <motion.div
                            className="sheet"
                            role="dialog"
                            aria-label="Lista de canciones"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        >
                            <div className="sheet-handle" />
                            <div className="sheet-header">
                                <h2 className="sheet-title">Nuestras canciones</h2>
                                <button className="sheet-close" onClick={() => setSheetOpen(false)} aria-label="Cerrar">✕</button>
                            </div>

                            <ul className="sheet-list">
                                {playlist.map((track, index) => {
                                    const active = index === currentIndex;
                                    const playable = Boolean(track.src);
                                    return (
                                        <li key={track.id}>
                                            <button
                                                className={`sheet-track ${active ? 'active' : ''}`}
                                                onClick={() => {
                                                    if (!playable) {
                                                        window.open(track.externalUrl ?? SPOTIFY_URL, '_blank', 'noopener,noreferrer');
                                                        return;
                                                    }
                                                    if (active) {
                                                        togglePlay();
                                                    } else {
                                                        goTo(index);
                                                    }
                                                }}
                                            >
                                                <span className="sheet-track-index">
                                                    {active && isPlaying ? (
                                                        <span className="equalizer" aria-hidden="true">
                                                            <span /><span /><span />
                                                        </span>
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </span>
                                                <span className="sheet-track-meta">
                                                    <span className="sheet-track-title">{track.title}</span>
                                                    <span className="sheet-track-artist">{track.artist}</span>
                                                </span>
                                                {active && <span className="sheet-track-now">Sonando</span>}
                                                {!active && track.remote && (
                                                    <span className="sheet-track-badge">
                                                        {playable ? 'preview' : 'abrir ↗'}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <a
                                className="spotify-link"
                                href={SPOTIFY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.586 14.424a.622.622 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115.293.18.386.563.207.857zm1.223-2.723a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166A.779.779 0 1 1 6.32 11.3c3.632-1.102 8.147-.568 11.234 1.328a.78.78 0 0 1 .255 1.073zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 1 1-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 0 1-.955 1.608z" />
                                </svg>
                                Escucha a Salistre en Spotify
                            </a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
