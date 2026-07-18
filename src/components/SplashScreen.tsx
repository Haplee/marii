import { motion } from 'framer-motion';

export default function SplashScreen() {
    return (
        <motion.div
            className="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
            <motion.span
                className="splash-heart"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.25, 1], rotate: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            >
                ❤️
            </motion.span>

            <motion.p
                className="splash-title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
            >
                Para mi niña preciosa
            </motion.p>

            <motion.p
                className="splash-signature"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.3 }}
            >
                con muchísimo cariño, Fran
            </motion.p>
        </motion.div>
    );
}
