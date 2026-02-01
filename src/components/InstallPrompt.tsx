import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InstallPrompt.css';

export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Detect iOS device
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        // Detect if running in standalone mode (PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

        // Show prompt only on iOS and if not already installed (standalone)
        if (isIOS && !isStandalone) {
            // Wait a bit before showing to not be intrusive immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="install-prompt-overlay"
            >
                <div className="install-prompt-header">
                    <h3 className="install-prompt-title">Instalar App</h3>
                    <button
                        onClick={() => setShowPrompt(false)}
                        className="install-prompt-close"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <p className="install-prompt-desc">
                    Instala esta aplicación en tu iPhone para una mejor experiencia:
                </p>

                <div className="install-prompt-steps">
                    <div className="install-prompt-step">
                        <span className="install-prompt-icon-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                        </span>
                        <span>1. Pulsa el botón <strong>Compartir</strong></span>
                    </div>

                    <div className="install-prompt-step">
                        <span className="install-prompt-icon-box add">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        </span>
                        <span>2. Selecciona <strong>Añadir a inicio</strong></span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

