import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getImages(dirName) {
    const dirPath = path.join(__dirname, '../public', dirName);
    if (!fs.existsSync(dirPath)) {
        console.warn(`Directory not found: ${dirPath}`);
        return [];
    }
    return fs.readdirSync(dirPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
}

// Función para obtener música
function getMusic(dirName) {
    const dirPath = path.join(__dirname, '../public', dirName);
    if (!fs.existsSync(dirPath)) {
        console.warn(`Directory not found: ${dirPath}`);
        return [];
    }
    return fs.readdirSync(dirPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp3', '.m4a', '.wav', '.ogg'].includes(ext);
    });
}

const mariiImages = getImages('images');
const babyImages = getImages('bebes');
const musicTracks = getMusic('music');

const data = {
    mariiImages,
    babyImages,
    musicTracks
};

const outputPath = path.join(__dirname, '../public/assets.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`Generated assets.json with ${mariiImages.length} Marii images, ${babyImages.length} Baby images, and ${musicTracks.length} music tracks.`);
