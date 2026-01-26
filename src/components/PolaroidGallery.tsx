
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES_MARII = [
    "Vales muchísimo ❤️",
    "Orgullo Infinito",
    "La nota no te define",
    "Vocación Pura 👩‍⚕️",
    "Eres Increíble",
    "Todo saldrá bien ✨",
    "No te rindas nunca",
    "Brillas con luz propia",
    "Estamos contigo",
    "Eres más fuerte de lo que crees",
    "Tu esfuerzo vale la pena",
    "Futura mejor enfermera",
    "Confía en ti misma",
    "Un día a la vez",
    "Tu dedicación inspira",
    "Respira hondo 🌿",
    "Capaz de todo",
    "Eres magia pura",
    "El mundo te necesita",
    "Pasito a pasito",
    "Hoy es tu día",
    "Sigue nadando 🐠",
    "Eres suficiente",
    "Tu corazón es enorme",
    "No estás sola",
    "Eres luz en la oscuridad",
    "Cree en tu poder",
    "Lo vas a conseguir 🎓",
    "Eres un regalo",
    "Tu sonrisa cura",
    "Pequeña gran guerrera",
    "Sigue brillando",
    "Eres admirada",
    "Tu empatía es oro",
    "Nunca dejes de soñar",
    "Eres un ejemplo",
    "Todo esfuerzo suma",
    "Date tiempo ⏳",
    "Eres maravillosa",
    "Orgullo de verte crecer",
    "Eres la mejor medicina",
    "Tu pasión te guía",
    "Eres única",
    "Siempre adelante 🚀",
    "Eres valiente",
    "Mereces lo mejor",
    "Te queremos mucho",
    "Eres pura bondad",
    "Tu luz no se apaga",
    "Lo estás haciendo genial"
];

const MESSAGES_BABY = [
    "¿A que soy mono?",
    "Para que sonrías",
    "Mini Fran al rescate",
    "Bebé anti-estrés",
    "Mofletes curativos",
    "Dosis de ternura",
    "Un pequeño abrazo",
    "Sonríe por mí",
    "¡Ánimo guapa!"
];

type Props = {
    mariiImages: string[];
    babyImages: string[];
};

export default function PolaroidGallery({ mariiImages, babyImages }: Props) {
    const [mode, setMode] = useState<'marii' | 'baby'>('marii');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Seleccionar datos según el modo
    const currentImages = mode === 'marii' ? mariiImages : babyImages;
    const currentMessages = mode === 'marii' ? MESSAGES_MARII : MESSAGES_BABY;
    const currentArtist = mode === 'marii' ? 'Marii the Nursee' : 'Baby FranVi';


    // Reiniciar índice al cambiar de modo
    const handleModeChange = (newMode: 'marii' | 'baby') => {
        setMode(newMode);
        setCurrentIndex(0);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const hasPhotos = currentImages && currentImages.length > 0;
    const DURATION = 8;

    // Autoplay
    useEffect(() => {
        if (!hasPhotos) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % currentImages.length);
        }, DURATION * 1000);
        return () => clearInterval(timer);
    }, [hasPhotos, currentImages.length, mode]); // Reset timer on mode change

    if (!isLoaded) return null;

    return (
        <>
            <div className="title-container">
                <p className="subtitle">REPRODUCIENDO PARA</p>
                <p className="main-title">Marii the Nursee</p>
            </div>

            <div className="gallery-wrapper">

                {/* Botones de Navegación Estilo Tabs/Píldoras */}
                {/* Botones de Navegación Estilo Tabs/Píldoras */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px',
                    borderRadius: '50px'
                }}>
                    <button
                        onClick={() => handleModeChange('marii')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '24px',
                            border: 'none',
                            background: mode === 'marii' ? '#ffffff' : 'transparent',
                            color: mode === 'marii' ? '#000000' : '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Marii ❤️
                    </button>
                    <button
                        onClick={() => handleModeChange('baby')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '24px',
                            border: 'none',
                            background: mode === 'baby' ? '#ffffff' : 'transparent',
                            color: mode === 'baby' ? '#000000' : '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Baby FranVi 👶
                    </button>
                </div>

                {!hasPhotos ? (
                    <div className="album-art-container">
                        <div style={{ color: '#b3b3b3', textAlign: 'center', padding: '20px' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>+</p>
                            <p>Añade fotos en<br />public/{mode === 'marii' ? 'images' : 'bebes'}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="album-art-container">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.img
                                    key={`${mode}-${currentIndex}`} // Clave compuesta para animar cambio de modo
                                    src={mode === 'marii' ? `/images/${currentImages[currentIndex]}` : `/bebes/${currentImages[currentIndex]}`}
                                    className="album-art-img"
                                    alt="Recuerdo"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </AnimatePresence>
                        </div>

                        <div className="track-info">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${mode}-${currentIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="track-title">{currentMessages[currentIndex % currentMessages.length]}</h2>
                                    <p className="track-artist">{currentArtist}</p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="progress-container">
                                <motion.div
                                    className="progress-bar"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: DURATION, ease: "linear", repeat: 0 }}
                                    key={`${mode}-${currentIndex}`}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
