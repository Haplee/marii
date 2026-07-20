import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES_MARII = [
    'Vales muchísimo ❤️',
    'Qué orgullo de niña',
    'La nota no te define',
    'Vocación pura 👩‍⚕️',
    'Eres increíble, en serio',
    'Todo va a salir bien ✨',
    'Ni se te ocurra rendirte',
    'Brillas con luz propia',
    'Aquí estoy yo contigo',
    'Más fuerte de lo que crees',
    'Tu esfuerzo vale oro',
    'Futura mejor enfermera',
    'Confía en ti como yo',
    'Un día a la vez',
    'Ojitoo con ella 😍',
    'Respira hondo mi niña 🌿',
    'Tú puedes con tó',
    'Eres magia pura',
    'El mundo te necesita',
    'Pasito a pasito',
    'Hoy es tu día',
    'Sigue nadando 🐠',
    'Tu corazón es enorme',
    'No estás sola',
    'Mi persona favorita',
    'Po claro que puedes',
    'Lo vas a conseguir 🎓',
    'Eres un regalo',
    'Tu sonrisa me cura',
    'Pequeña gran guerrera',
    'Sigue brillando',
    'Guapa se queda corto',
    'Tu empatía es oro',
    'Nunca dejes de soñar',
    'Eres un ejemplo',
    'Todo esfuerzo suma',
    'Date tiempo ⏳',
    'Eres maravillosa',
    'Orgullo de verte crecer',
    'La mejor medicina eres tú',
    'Tu pasión te guía',
    'Eres única (no hay debate)',
    'Siempre pa lante 🚀',
    'La más valiente',
    'Mereces lo mejor',
    'Te quiero muchísimo ❤️',
    'Eres pura bondad',
    'Tu luz no se apaga',
    'Lo estás haciendo genial',
    'Equipo tú y yo ❤️'
];

const MESSAGES_BABY = [
    '¿A que soy mono? 🐵',
    'Para que sonrías',
    'Mini Fran al rescate',
    'Bebé anti-estrés',
    'Mofletes curativos',
    'Dosis de ternura',
    'Un pequeño abrazo',
    'Sonríe por mí porfaa',
    '¡Ánimo guapa!',
    'Si yo pude andar, tú puedes con esto',
    "Mirada de 'tú puedes'",
    'Soy todo orejas (y mofletes)',
    'Te mando fuerza bebé',
    '¿Ves esta carita? Es de orgullo',
    'Pequeño pero matón',
    'Chute de energía ⚡',
    'Aquí estoy pa ti',
    'Hago pucheritos si te rindes',
    'Besito volador 😘',
    'Soy tu fan número 1',
    'Rebeldía infantil activada',
    'Cara de pillo = ánimo',
    'Estoy vigilando que estudies',
    '¡Guau! (digoo... ¡vamos!)',
    'Cachetes de la suerte',
    'Mirada penetrante de ánimo',
    'Soy irresistible (y lo sabes)',
    'Hazlo por este bebé',
    'Te como a besos',
    'Soy pequeño, pero mi apoyo es gigante',
    '¿Un bibi de ánimo?',
    'Arriba esos ánimos 💪',
    'No me llores que lloro yo',
    'Jefe de tu club de fans',
    'Sonrisa mellada',
    'Ojitos de esperanza',
    'Ternura en estado puro',
    'Vengo a alegrarte el día',
    '¿Jugamos... a aprobar?',
    'Soy tu amuleto',
    'Abrazo de oso pequeño',
    '¡Tú molas mucho!',
    'Mi superhéroe eres tú',
    'Dame un abrazo virtual',
    'Soy comestible 🍫',
    'Risitas curativas',
    'Patadita de la suerte',
    'Soy pura vitamina B(ebé)',
    'Te observo... con amor',
    'Vamos campeona 🏆',
    'Ríete un poquito venga'
];

// Barajado Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

type Props = {
    mariiImages: string[];
    babyImages: string[];
};

const DURATION = 8;

export default function PolaroidGallery({ mariiImages, babyImages }: Props) {
    const [mode, setMode] = useState<'marii' | 'baby'>('marii');
    const [currentIndex, setCurrentIndex] = useState(0);

    const [shuffledContent, setShuffledContent] = useState<{
        images: string[];
        messages: string[];
    }>({ images: [], messages: [] });

    const basePath = mode === 'marii' ? '/images' : '/bebes';

    useEffect(() => {
        const originalImages = mode === 'marii' ? mariiImages : babyImages;
        const originalMessages = mode === 'marii' ? MESSAGES_MARII : MESSAGES_BABY;

        if (originalImages.length > 0) {
            setShuffledContent({
                images: shuffleArray(originalImages),
                messages: shuffleArray(originalMessages)
            });
        }
    }, [mode, mariiImages, babyImages]);

    const handleModeChange = (newMode: 'marii' | 'baby') => {
        setMode(newMode);
        setCurrentIndex(0);
    };

    const hasPhotos = shuffledContent.images.length > 0;

    // Autoplay del carrusel
    useEffect(() => {
        if (!hasPhotos) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % shuffledContent.images.length);
        }, DURATION * 1000);
        return () => clearInterval(timer);
    }, [hasPhotos, shuffledContent.images.length, mode]);

    // Precargar la siguiente foto para que la transición sea instantánea
    useEffect(() => {
        if (!hasPhotos) return;
        const next = shuffledContent.images[(currentIndex + 1) % shuffledContent.images.length];
        const img = new Image();
        img.src = `${basePath}/${next}`;
    }, [currentIndex, hasPhotos, shuffledContent.images, basePath]);

    const currentArtist = mode === 'marii' ? 'Mariaa 💕' : 'Baby FranVi';

    return (
        <div className="gallery-wrapper">
            <div className="mode-tabs">
                <button
                    className={`mode-tab ${mode === 'marii' ? 'active' : ''}`}
                    onClick={() => handleModeChange('marii')}
                >
                    Marii ❤️
                </button>
                <button
                    className={`mode-tab ${mode === 'baby' ? 'active' : ''}`}
                    onClick={() => handleModeChange('baby')}
                >
                    Baby FranVi 👶
                </button>
            </div>

            {!hasPhotos ? (
                <div className="album-art-container">
                    <div className="album-art-empty">
                        <p className="album-art-empty-icon">+</p>
                        <p>Añade fotos en<br />public/{mode === 'marii' ? 'images' : 'bebes'}</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="album-art-container">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={`${mode}-${currentIndex}`}
                                className="album-art-frame"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <img
                                    src={`${basePath}/${shuffledContent.images[currentIndex]}`}
                                    className="album-art-blur"
                                    alt=""
                                    aria-hidden="true"
                                />
                                <img
                                    src={`${basePath}/${shuffledContent.images[currentIndex]}`}
                                    className="album-art-img"
                                    alt="Recuerdo"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </motion.div>
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
                                <h2 className="track-title">
                                    {shuffledContent.messages[currentIndex % shuffledContent.messages.length]}
                                </h2>
                                <p className="track-artist">{currentArtist}</p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="progress-container">
                            <motion.div
                                className="progress-bar"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: DURATION, ease: 'linear', repeat: 0 }}
                                key={`${mode}-${currentIndex}`}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
