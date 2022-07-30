const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const convert = require('heic-convert');
const sharp = require('sharp');

const HEIC_DIR_PATH = path.resolve(__dirname, 'assets/products/heic'); 
const JPEG_DIR_PATH = path.resolve(__dirname, 'assets/products/jpg'); 
const THUMB_DIR_PATH = path.resolve(__dirname, 'assets/products/jpg/thumb');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);

(async () => {
    let filenames;
    const filenamesToResize = [];

    try {
        filenames = await readdir(HEIC_DIR_PATH);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    for (const filename of filenames) {
        const filepath = path.resolve(HEIC_DIR_PATH, filename); 
        
        // ***************************************
        // Copy none HEIC images to JPEG_DIR_PATH.
        // ***************************************
        if (path.extname(filepath).toLowerCase() !== '.heic') {
            console.info(`Copying image ${filepath}`);
            const destination = path.resolve(JPEG_DIR_PATH, path.basename(filepath));
            await copyFile(filepath, destination);
            filenamesToResize.push(destination);
            unlink(filepath);
            continue;
        }

        // *******************************************************
        // Convert HEIC images to JPEG and write to JPEG_DIR_PATH.
        // *******************************************************
        try {
            console.info(`Reading image ${filepath}`);
            const inputBuffer = await promisify(fs.readFile)(filepath);

            console.info(`Converting image ${filepath}`);
            const outputBuffer = await convert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1 
            });

            const newFilepath = path.resolve(JPEG_DIR_PATH, `${path.parse(filename).name}.jpeg`);
            console.info(`Writing image ${newFilepath}`);
            await promisify(fs.writeFile)(newFilepath, outputBuffer);
            filenamesToResize.push(newFilepath);
            unlink(filepath);
        } catch (err) {
            console.error(`Failed converting image "${filepath}".`, err);
            process.exit(1);
        }
    }

    // **************
    // Resize images.
    // **************
    for (const filenameToResize of filenamesToResize) {
        try {
            let destination = '';
            let resizedFilename = '';

            console.info(`Resizing image ${filenameToResize} to 800x800`);
            const buffer = await sharp(filenameToResize).resize(800, 800).toBuffer();
            resizedFilename = `${path.parse(filenameToResize).name}_800x800.jpeg`;
            destination = path.resolve(JPEG_DIR_PATH, resizedFilename);
            await sharp(buffer).toFile(destination);

            console.info(`Resizing image ${filenameToResize} to 300x300`);
            resizedFilename = `${path.parse(filenameToResize).name}_300x300.jpeg`;
            destination = path.resolve(THUMB_DIR_PATH, resizedFilename);
            await sharp(filenameToResize).jpeg({ quality: 100, progressive: true }).resize(300, 300).toFile(destination);

            unlink(filenameToResize);
        } catch (err) {
            console.error(`Failed resizing image "${filenameToResize}".`, err);
            process.exit(1);
        }
    }

    process.exit(0);
})();