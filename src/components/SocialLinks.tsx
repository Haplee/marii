import { motion } from 'framer-motion';

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const LINKS = [
    { name: 'María', handle: '@mariiaapacheco_', url: 'https://www.instagram.com/mariiaapacheco_' },
    { name: 'Fran', handle: '@franvidalmateo', url: 'https://www.instagram.com/franvidalmateo' }
];

export default function SocialLinks() {
    return (
        <motion.div
            className="social-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {LINKS.map(link => (
                <a
                    key={link.url}
                    className="social-chip"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <InstagramIcon />
                    <span>{link.name}</span>
                </a>
            ))}
        </motion.div>
    );
}
