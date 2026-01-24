import fs from 'fs';
import path from 'path';
import PolaroidGallery from './components/PolaroidGallery';

export const dynamic = 'force-dynamic';

export default function Home() {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    let images: string[] = [];

    try {
        if (fs.existsSync(imagesDir)) {
            images = fs.readdirSync(imagesDir).filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
            });
        }
    } catch (error) {
        console.error("Error leyendo imágenes:", error);
    }

    return (
        <main style={{ width: '100%', height: '100%' }}>
            <div className="title-container">
                <h1 className="main-title">Maria</h1>
                <p className="subtitle">Pequeños instantes de calma</p>
            </div>

            <PolaroidGallery images={images} />
        </main>
    );
}
