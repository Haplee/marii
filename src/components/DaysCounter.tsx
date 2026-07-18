import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Fecha de la primera vez que quedamos. Formato: (año, mes - 1, día).
// Enero es el mes 0, por eso el 1 de enero de 2026 es (2026, 0, 1).
const START_DATE = new Date(2026, 0, 1);

function daysSince(start: Date): number {
    const now = new Date();
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.round((nowMidnight.getTime() - startMidnight.getTime()) / 86400000));
}

export default function DaysCounter() {
    const [days, setDays] = useState(() => daysSince(START_DATE));

    // Refresca cada hora por si la app se queda abierta y pasa la medianoche
    useEffect(() => {
        const timer = setInterval(() => setDays(daysSince(START_DATE)), 60 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            className="days-counter"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <span className="days-counter-number">{days}</span>
            <div className="days-counter-text">
                <span className="days-counter-label">días juntos ❤️</span>
                <span className="days-counter-sub">desde la primera vez que quedamos</span>
            </div>
        </motion.div>
    );
}
