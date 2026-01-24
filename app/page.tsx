import fs from 'fs';
import path from 'path';
import PolaroidGallery from './components/PolaroidGallery';

export const dynamic = 'force-dynamic';

export default function Home() {
    // Leer carpeta images (Marii)
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    let mariiImages: string[] = [];
    try {
        if (fs.existsSync(imagesDir)) {
            mariiImages = fs.readdirSync(imagesDir).filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
            });
        }
    } catch (error) {
        console.error("Error leyendo imágenes Marii:", error);
    }

    // Leer carpeta bebes (Baby Fran)
    const babyDir = path.join(process.cwd(), 'public', 'bebes');
    let babyImages: string[] = [];
    try {
        if (fs.existsSync(babyDir)) {
            babyImages = fs.readdirSync(babyDir).filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
            });
        }
    } catch (error) {
        console.error("Error leyendo imágenes Bebés:", error);
    }

    return (
        <main style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <PolaroidGallery mariiImages={mariiImages} babyImages={babyImages} />
        </main>
    );
}
