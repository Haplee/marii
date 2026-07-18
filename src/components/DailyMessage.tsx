import { motion } from 'framer-motion';

// Un mensaje distinto cada día, escrito por Fran.
// Rota de forma determinista según la fecha: mismo día = mismo mensaje.
const DAILY_MESSAGES = [
    'Buenos diaas mi niña, hoy te comes el día enterito ❤️',
    'Oyee, que te lo digo yo: lo estás haciendo genial',
    'Acuérdate de beber agua y descansar un poquito, que te conozco',
    'Hoy toca sonreír aunque sea un poquito (por mí porfaa)',
    'Eres la futura mejor enfermera de España y punto',
    'Si hoy se hace cuesta arriba, respira hondo. Yo estoy aquí ❤️',
    'Vale vale, sé que estás liada, pero come bien porfa',
    'Mi niña preciosa, que sepas que ahora mismo estoy pensando en ti',
    'La nota no te define, tú vales muchísimo más que un número',
    'Esta noche sueña con lo más guapo que hay (yo, obviamente)',
    'Pasito a pasito se llega a tó lo que tú quieras',
    'Estoy súper orgulloso de ti, que no se te olvide nunca',
    'Si te rayas, me escribes y lo hablamos, como siempre',
    'Tú puedes con esto y con lo que te echen, te lo digo yo',
    'Un día malo lo tiene cualquiera, tú sigues siendo increíble',
    'Hoy te mando un abrazo de esos que te dejan nueva ❤️',
    'Cuando dudes, mira las fotos de aquí arriba y sonríe',
    'Eres mi persona favorita del mundo entero (no hay debate)',
    'Descansa cuando toque, que luego no duermes ná',
    'Si el día viene regulero, tranquila, que mañana pinta mejor',
    'Tu esfuerzo se nota, aunque tú todavía no lo veas',
    'Po venga mi niña, otro día más que nos comemos juntos',
    'Tienes un corazón enorme y el mundo lo va a notar',
    'Confía en ti la mitad de lo que yo confío y ya está tó hecho',
    'Hoy te quiero un poquito más que ayer (y mira que era difícil)',
    'No estás sola en esto, estamos tú y yo, equipo ❤️',
    'Cierra los ojos, respira hondo y pa lante',
    'Eres capaz de muchísimo más de lo que crees, en serio',
    'Sonríe, que cuando sonríes se me arregla el día',
    'Te quiero muchísimo mi niña, hoy y todos los días ❤️'
];

function todayIndex(): number {
    const now = new Date();
    const daysSinceEpoch = Math.floor(
        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000
    );
    return daysSinceEpoch % DAILY_MESSAGES.length;
}

export default function DailyMessage() {
    const message = DAILY_MESSAGES[todayIndex()];

    return (
        <motion.div
            className="daily-message"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <span className="daily-message-label">El mensaje de hoy</span>
            <p className="daily-message-text">“{message}”</p>
            <span className="daily-message-signature">— Fran ❤️</span>
        </motion.div>
    );
}
