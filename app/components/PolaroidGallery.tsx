'use client';
import { useState, useEffect } from 'react';

// Frases de ánimo para Maria
const MESSAGES = [
    "Eres mucho más fuerte de lo que crees.",
    "Un examen no define lo excelente enfermera que eres.",
    "Tu vocación brilla mucho más que cualquier nota.",
    "Respira hondo... todo va a salir bien.",
    "Estoy muy orgulloso de ti.",
    "Esto es solo un pequeño bache, tú saltas montañas.",
    "Tienes un corazón de oro, eso es lo que cuenta.",
    "Mañana lo verás todo con otros ojos.",
    "Sigue adelante, lo estás haciendo genial.",
    "Te quiero ver sonreír."
];

export default function PolaroidGallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Guardamos el índice actual en el mazo. Mostramos la imagen currentIndex.
    // Cuando hacemos click, incrementamos currentIndex.
    // Si llegamos al final, volvemos a 0 (efecto mazo infinito).

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const photos = images && images.length > 0 ? images : [];
    const hasPhotos = photos.length > 0;

    const handleNext = () => {
        if (!hasPhotos) return;
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    if (!isLoaded) return <div className="loading">Cargando...</div>;

    return (
        <>
            <div className="gallery-container" onClick={handleNext}>
                {!hasPhotos ? (
                    <div className="polaroid" style={{ transform: 'rotate(-2deg)' }}>
                        <div className="polaroid-img-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffe', color: '#888', padding: '20px', textAlign: 'center' }}>
                            <p>Sube tus fotos a la carpeta<br /><b>public/images</b><br />para verlas aquí.</p>
                        </div>
                        <div className="polaroid-caption">Esperando recuerdos...</div>
                    </div>
                ) : (
                    photos.map((src, index) => {
                        // Lógica de visualización de mazo eficiente
                        // Solo renderizamos la actual y la siguiente para rendimiento si hay muchas,
                        // pero para efecto visual de "montón", rendericemos unas pocas.
                        // Simplificación: Mostramos la actual (top) y quizás la anterior saliendo.

                        // Mejor approach visual:
                        // Siempre mostramos una imagen central.
                        // Al hacer click, la transición cambia la opacidad/transform.

                        // Enfoque "Polaroid Stack":
                        // Las fotos no cambian de orden en el DOM, solo cambiamos clases.

                        const isCurrent = index === currentIndex;
                        const isNext = index === (currentIndex + 1) % photos.length;

                        // Si no es la actual ni la siguiente, la ocultamos para no cargar DOM,
                        // a menos que sea necesaria para transiciones.
                        // Para simplicidad en este MVP rápido:
                        // Solo mostramos la carta actual.

                        if (!isCurrent) return null;

                        return (
                            <div
                                key={src + index} // Key única para forzar remount o animación
                                className="polaroid active floating"
                                style={{
                                    // Rotación aleatoria ligera basada en string
                                    transform: `rotate(${src.length % 6 - 3}deg)`
                                }}
                            >
                                <div className="polaroid-img-container">
                                    <img src={`/images/${src}`} alt="Recuerdo" className="polaroid-img" />
                                </div>
                                <div className="polaroid-caption">
                                    <span>Recuerdo</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="message-box">
                <p key={currentIndex} className="message-text visible">
                    {MESSAGES[currentIndex % MESSAGES.length]}
                </p>
            </div>
        </>
    );
}
