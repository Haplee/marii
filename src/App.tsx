import { useState, useEffect } from 'react';
import PolaroidGallery from './components/PolaroidGallery';
import BackgroundMusic from './components/BackgroundMusic';
import InstallPrompt from './components/InstallPrompt';

export default function App() {
    const [images, setImages] = useState({ mariiImages: [], babyImages: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/assets.json')
            .then(res => res.json())
            .then(data => {
                setImages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load assets", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        background: '#121212'
    }}>Cargando...</div>;

    return (
        <main style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <PolaroidGallery mariiImages={images.mariiImages} babyImages={images.babyImages} />
            <BackgroundMusic />
            <InstallPrompt />
        </main>
    );
}
