'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
    "Eres mucho más fuerte de lo que crees.",
    "Un examen no define tu talento.",
    "Tu vocación brilla mucho más que cualquier nota.",
    "Respira hondo... todo va a salir bien.",
    "Estoy muy orgulloso de ti.",
    "Esto es solo un pequeño bache.",
    "Tienes un corazón de oro.",
    "Sigue adelante, lo estás haciendo genial.",
    "Te quiero ver sonreír."
];

export default function PolaroidGallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const photos = images && images.length > 0 ? images : [];
    const hasPhotos = photos.length > 0;

    // Rotación automática cada 5 segundos
    useEffect(() => {
        if (!hasPhotos) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [hasPhotos, photos.length]);

    if (!isLoaded) return null;

    return (
        <div className="gallery-wrapper">
            {!hasPhotos ? (
                <div className="image-card-container">
                    <div className="empty-state">
                        <p>📸</p>
                        <br />
                        <p>Sube tus fotos a la carpeta<br /><b>public/images</b></p>
                    </div>
                </div>
            ) : (
                <div className="image-card-container">
                    {/* Barras de progreso tipo Stories */}
                    <div className="progress-bars">
                        {photos.map((_, idx) => (
                            <div key={idx} className="bar-bg">
                                <motion.div
                                    className="bar-fill"
                                    initial={{ width: "0%" }}
                                    animate={{ width: idx === currentIndex ? "100%" : (idx < currentIndex ? "100%" : "0%") }}
                                    transition={{ duration: idx === currentIndex ? 5 : 0, ease: "linear" }}
                                />
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="image-full-wrapper"
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src={`/images/${photos[currentIndex]}`}
                                className="image-full"
                                alt="Recuerdo"
                            />
                            {/* Gradiente inferior integrado en la imagen */}
                            <div className="message-container">
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="message-text"
                                >
                                    {MESSAGES[currentIndex % MESSAGES.length]}
                                </motion.p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
