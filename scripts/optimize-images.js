import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// El marco de la galería nunca pasa de 320 px CSS, así que 1200 px cubre incluso
// una pantalla a 3x con margen. La calidad 86 con mozjpeg no deja artefactos
// visibles en retina.
const MAX_WIDTH = 1200;
const QUALITY = 86;

async function optimizeDir(dirName) {
    const dirPath = path.join(__dirname, '../public', dirName);
    if (!fs.existsSync(dirPath)) {
        console.warn(`Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath).filter(file =>
        ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
    );

    let before = 0;
    let after = 0;

    for (const file of files) {
        const filePath = path.join(dirPath, file);

        // Se lee a memoria antes de procesar: en Windows sharp mantiene abierto el
        // fichero de origen y escribir encima da EPERM.
        const original = fs.readFileSync(filePath);

        const optimized = await sharp(original)
            .rotate() // respeta la orientación EXIF antes de descartar los metadatos
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .jpeg({ quality: QUALITY, mozjpeg: true })
            .toBuffer();

        // Si la original ya estaba más optimizada, se queda como está.
        if (optimized.length < original.length) {
            fs.writeFileSync(filePath, optimized);
            after += optimized.length;
        } else {
            after += original.length;
        }
        before += original.length;
    }

    const mb = bytes => (bytes / 1024 / 1024).toFixed(1);
    console.log(`${dirName}: ${files.length} imágenes, ${mb(before)} MB -> ${mb(after)} MB`);
}

await optimizeDir('images');
await optimizeDir('bebes');
