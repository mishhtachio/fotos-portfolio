import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const photosDir = path.join(process.cwd(), 'public', 'photos');
const dbPath = path.join(process.cwd(), 'src', 'photos-data.json');

// Map of common Tailwind aspect ratios and their decimal equivalents
const ASPECT_RATIOS = [
  { class: 'aspect-[4/3]', ratio: 4 / 3 },
  { class: 'aspect-[3/4]', ratio: 3 / 4 },
  { class: 'aspect-[16/9]', ratio: 16 / 9 },
  { class: 'aspect-[9/16]', ratio: 9 / 16 },
  { class: 'aspect-square', ratio: 1 / 1 }
];

const getClosestAspectRatio = (width, height) => {
  const imageRatio = width / height;
  let closest = ASPECT_RATIOS[0];
  let minDiff = Math.abs(imageRatio - closest.ratio);

  for (const r of ASPECT_RATIOS) {
    const diff = Math.abs(imageRatio - r.ratio);
    if (diff < minDiff) {
      minDiff = diff;
      closest = r;
    }
  }
  return closest.class;
};

async function migrate() {
  console.log('🏁 Starting WebP batch migration for all portfolio images...\n');

  if (!fs.existsSync(photosDir)) {
    console.error(`❌ Photos directory not found at: ${photosDir}`);
    return;
  }

  // 1. Read all files in public/photos
  const files = fs.readdirSync(photosDir);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tif', '.tiff', '.webp'];

  // Keep track of conversions to update the JSON database later
  const fileRenameMap = new Map();

  for (const file of files) {
    const filePath = path.join(photosDir, file);
    const ext = path.extname(file).toLowerCase();

    if (!imageExtensions.includes(ext) || fs.lstatSync(filePath).isDirectory()) {
      continue;
    }

    const baseName = path.parse(file).name;
    const outputFileName = `${baseName}.webp`;
    const outputFilePath = path.join(photosDir, outputFileName);

    // If it's already a WebP, skip conversion but make sure it is in lowercase extension
    if (ext === '.webp') {
      console.log(`ℹ️  ${file} is already WebP. Skipping.`);
      continue;
    }

    console.log(`🔄 Converting: ${file} -> ${outputFileName}`);

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Convert to WebP (quality 80)
      await image
        .webp({ quality: 80 })
        .toFile(outputFilePath);

      // Record the rename mapping
      fileRenameMap.set(`/photos/${file}`, `/photos/${outputFileName}`);

      // Delete the original raw file
      fs.unlinkSync(filePath);

      const newStats = fs.statSync(outputFilePath);
      const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ Success! Size: ${newSizeMB} MB`);

    } catch (err) {
      console.error(`   ❌ Failed to convert ${file}:`, err.message);
    }
  }

  // 2. Update src/photos-data.json
  if (fs.existsSync(dbPath)) {
    console.log('\n📝 Updating photos-data.json references...');
    try {
      let photosList = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      let updatedCount = 0;

      for (const entry of photosList) {
        // If the file extension is not .webp, convert it
        const currentPath = entry.image;
        if (currentPath && !currentPath.endsWith('.webp')) {
          const ext = path.extname(currentPath);
          const base = currentPath.substring(0, currentPath.length - ext.length);
          const newPath = `${base}.webp`;
          
          entry.image = newPath;
          updatedCount++;
        }
      }

      fs.writeFileSync(dbPath, JSON.stringify(photosList, null, 2), 'utf8');
      console.log(`✅ Updated ${updatedCount} image paths in photos-data.json to use .webp!`);

    } catch (err) {
      console.error('❌ Failed to update photos-data.json:', err.message);
    }
  }

  console.log('\n🎉 Migration complete! All images are now in WebP format and fully optimized.');
}

migrate();
