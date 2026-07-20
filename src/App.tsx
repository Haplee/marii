import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import DaysCounter from './components/DaysCounter';
import PolaroidGallery from './components/PolaroidGallery';
import DailyMessage from './components/DailyMessage';
import SocialLinks from './components/SocialLinks';
import MusicPlayer from './components/MusicPlayer';
import InstallPrompt from './components/InstallPrompt';

type Assets = {
    mariiImages: string[];
    babyImages: string[];
    musicTracks: string[];
};

const SPLASH_MIN_MS = 2400;

export default function App() {
    const [assets, setAssets] = useState<Assets>({ mariiImages: [], babyImages: [], musicTracks: [] });
    const [loading, setLoading] = useState(true);
    const [splashDone, setSplashDone] = useState(false);

    useEffect(() => {
        fetch('/assets.json')
            .then(res => res.json())
            .then(data => {
                setAssets({
                    mariiImages: data.mariiImages ?? [],
                    babyImages: data.babyImages ?? [],
                    musicTracks: data.musicTracks ?? []
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load assets', err);
                setLoading(false);
            });

        const timer = setTimeout(() => setSplashDone(true), SPLASH_MIN_MS);
        return () => clearTimeout(timer);
    }, []);

    const showSplash = loading || !splashDone;

    return (
        <>
            <AnimatePresence>
                {showSplash && <SplashScreen key="splash" />}
            </AnimatePresence>

            {!showSplash && (
                <main className="app-shell">
                    <header className="title-container">
                        <p className="subtitle">Reproduciendo para</p>
                        <h1 className="main-title">Mariaa 💕</h1>
                    </header>

                    <DaysCounter />
                    <PolaroidGallery mariiImages={assets.mariiImages} babyImages={assets.babyImages} />
                    <DailyMessage />
                    <SocialLinks />

                    <MusicPlayer tracks={assets.musicTracks} />
                    <InstallPrompt />
                </main>
            )}
        </>
    );
}
