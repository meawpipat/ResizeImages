const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputFolder = path.join(__dirname, 'input');
const outputFolder = path.join(__dirname, 'output');
const width = 800; // Desired width

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Recursively get all image files from a folder
const getFilesRecursively = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath));
        } else if (file.match(/\.(jpg|jpeg|png|webp|tiff|gif)$/i)) {
            results.push(filePath);
        }
    });
    return results;
};

const files = getFilesRecursively(inputFolder);

Promise.all(files.map(file => {
    const relativePath = path.relative(inputFolder, file);
    const outputPath = path.join(outputFolder, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    return sharp(file)
        .resize({ width, withoutEnlargement: true })
        .png({ compressionLevel: 9 }) // Optimize PNG output
        .toFile(outputPath)
        .then(() => console.log(`Resized and saved: ${relativePath}`))
        .catch(err => console.error(`Error processing ${relativePath}:`, err));
}))
.catch(err => console.error('Error processing files:', err));

console.log("Done.");