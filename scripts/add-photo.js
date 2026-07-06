import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';
import sharp from 'sharp';

// Helper to ask questions in terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

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

// Slugify string for clean filenames
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^-+|-+$/g, '');
};

async function main() {
  console.log('\n--- 📸 Mishel\'s Interactive Photo Uploader ---\n');

  // 1. Get raw photo path (drag and drop)
  let rawPathInput = '';
  while (!rawPathInput) {
    const ans = await askQuestion('1. Drag & Drop your photo here (or type the path) and press Enter:\n> ');
    // Clean up quotes from dragging and dropping
    const cleanPath = ans.replace(/^['"]|['"]$/g, '').trim();
    if (fs.existsSync(cleanPath) && fs.lstatSync(cleanPath).isFile()) {
      rawPathInput = cleanPath;
    } else {
      console.log('⚠️  Invalid file path. Please check and try again.');
    }
  }

  // 2. Ask for metadata details
  console.log('\n2. Enter photo details:');
  const categoryInput = (await askQuestion('   Category (e.g. Jaipur, UAE, Surathkal):\n   > ')).trim();
  const cameraInput = (await askQuestion('   Camera Model (e.g. SONY DSC-W310, iPhone 12):\n   > ')).trim();
  const editInput = (await askQuestion('   Edit Style (e.g. VSCO, DazzCam, None) [default: VSCO]:\n   > ')).trim() || 'VSCO';

  // 3. Process image with Sharp
  console.log('\n⚡ Optimizing and compressing image...');
  const parsedPath = path.parse(rawPathInput);
  const outputFileName = `${slugify(parsedPath.name)}.webp`;
  const outputDirectory = path.join(process.cwd(), 'public', 'photos');
  const outputFilePath = path.join(outputDirectory, outputFileName);

  // Ensure output directory exists
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  try {
    const image = sharp(rawPathInput);
    const metadata = await image.metadata();

    // Auto-calculate ratio
    const ratioClass = getClosestAspectRatio(metadata.width, metadata.height);
    console.log(`📏 Calculated aspect ratio: ${ratioClass} (${metadata.width}x${metadata.height})`);

    // Compress to WebP (quality 80 is optimal for visual quality vs file size)
    await image
      .webp({ quality: 80 })
      .toFile(outputFilePath);

    const stats = fs.statSync(outputFilePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Saved compressed WebP to: public/photos/${outputFileName} (${sizeInMB} MB)`);

    // 4. Update src/photos-data.json
    const dbPath = path.join(process.cwd(), 'src', 'photos-data.json');
    let photosList = [];

    if (fs.existsSync(dbPath)) {
      try {
        photosList = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch (err) {
        console.error('⚠️ Could not parse existing src/photos-data.json, starting a new list.', err);
      }
    }

    const newPhotoEntry = {
      image: `/photos/${outputFileName}`,
      ratio: ratioClass,
      camera: cameraInput || 'Unknown',
      edit: editInput,
      category: categoryInput || 'General'
    };

    // Prepend so new photo shows up at the beginning
    photosList.unshift(newPhotoEntry);
    fs.writeFileSync(dbPath, JSON.stringify(photosList, null, 2), 'utf8');
    console.log('✅ Updated src/photos-data.json with new entry!');

    // 5. Ask to Git Deploy
    console.log('\n--- 🚀 Git Deployment ---');
    const gitDeploy = (await askQuestion('Would you like to commit and push this photo to GitHub now? (y/n):\n> ')).trim().toLowerCase();

    if (gitDeploy === 'y' || gitDeploy === 'yes') {
      console.log('📦 Running git commands...');
      try {
        // Stage files
        execSync(`git add "${dbPath}" "${outputFilePath}"`, { stdio: 'inherit' });
        // Commit
        const commitMsg = `Add photo: ${newPhotoEntry.category} - ${newPhotoEntry.camera}`;
        execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
        // Push
        console.log('📤 Pushing to GitHub...');
        execSync('git push', { stdio: 'inherit' });
        console.log('🎉 Successfully pushed to GitHub!');
      } catch (err) {
        console.error('⚠️ Git operation failed. You might need to push manually.', err.message);
      }
    } else {
      console.log('👍 Skipping push. Remember to push your changes later.');
    }

  } catch (err) {
    console.error('❌ Failed to process image:', err.message);
  } finally {
    rl.close();
    console.log('\n👋 Done!');
  }
}

main();
