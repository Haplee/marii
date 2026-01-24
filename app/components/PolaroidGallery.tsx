'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
    "Vales muchísimo",
    "Orgullo Infinito",
    "La nota no te define",
    "Vocación Pura",
    "Eres Increíble",
    "Todo saldrá bien",
    "No te rindas nunca",
    "Brillas con luz propia",
    "Estamos contigo"
];

export default function PolaroidGallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const photos = images && images.length > 0 ? images : [];
    const hasPhotos = photos.length > 0;

    // Duración del slide en segundos
    const DURATION = 5;

    useEffect(() => {
        if (!hasPhotos) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, DURATION * 1000);
        return () => clearInterval(timer);
    }, [hasPhotos, photos.length]);

    if (!isLoaded) return null;

    return (
        <>
            {/* Cabecera Tipo Playlist/Reproduciendo */}
            <div className="title-container">
                <p className="subtitle">REPRODUCIENDO PARA</p>
                <p className="main-title">Marii the Nursee</p>
            </div>

            <div className="gallery-wrapper">
                {!hasPhotos ? (
                    <div className="album-art-container">
                        <div style={{ color: '#b3b3b3', textAlign: 'center', padding: '20px' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>+</p>
                            <p>Añade fotos en<br />public/images</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Portada Álbum Centrada */}
                        <div className="album-art-container">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.img
                                    key={currentIndex}
                                    src={`/images/${photos[currentIndex]}`}
                                    className="album-art-img"
                                    alt="Recuerdo"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Info de "Canción" + Ménsaje */}
                        <div className="track-info">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="track-title">{MESSAGES[currentIndex % MESSAGES.length]}</h2>
                                    <p className="track-artist">Marii the Nursee</p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Barra de progreso única tipo Spotify */}
                            <div className="progress-container">
                                <motion.div
                                    className="progress-bar"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: DURATION, ease: "linear", repeat: 0 }}
                                    // Key cambia para reiniciar la animación con cada slide
                                    key={currentIndex}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
