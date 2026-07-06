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

// Helper to parse multiple file paths (handles quotes and spaces)
const parsePaths = (input) => {
  const paths = [];
  const matches = input.match(/"[^"]+"|'[^']+'|\S+/g) || [];
  for (const m of matches) {
    const clean = m.replace(/^['"]|['"]$/g, '').trim();
    if (clean) {
      paths.push(clean);
    }
  }
  return paths;
};

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.gif'];

async function main() {
  console.log('\n--- 📸 Mishel\'s Interactive Photo Uploader ---\n');

  let imagePaths = [];

  // 1. Get raw photo path(s) (drag and drop files or folder)
  while (imagePaths.length === 0) {
    const ans = await askQuestion(
      '1. Drag & Drop one or multiple photos (or a folder) here and press Enter:\n> '
    );

    const parsedInputs = parsePaths(ans);

    for (const inputPath of parsedInputs) {
      if (fs.existsSync(inputPath)) {
        const stat = fs.lstatSync(inputPath);
        if (stat.isFile()) {
          const ext = path.extname(inputPath).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext)) {
            imagePaths.push(inputPath);
          }
        } else if (stat.isDirectory()) {
          // Scan folder for images
          const files = fs.readdirSync(inputPath);
          for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
              imagePaths.push(path.join(inputPath, file));
            }
          }
        }
      }
    }

    if (imagePaths.length === 0) {
      console.log('⚠️  No valid image files found. Please check and try again.');
    }
  }

  console.log(`\n📚 Found ${imagePaths.length} photo(s) to process.`);

  // 2. Ask for details
  let commonCategory = '';
  let commonCamera = '';
  let commonEdit = '';
  let useBulkDetails = false;

  if (imagePaths.length > 1) {
    const ans = (await askQuestion('\nDo you want to apply the SAME Category, Camera, and Edit details to ALL photos? (y/n) [default: y]:\n> ')).trim().toLowerCase();
    useBulkDetails = ans !== 'n' && ans !== 'no';
  }

  if (useBulkDetails || imagePaths.length === 1) {
    console.log('\n2. Enter photo details:');
    commonCategory = (await askQuestion('   Category (e.g. Jaipur, UAE, Surathkal):\n   > ')).trim();
    commonCamera = (await askQuestion('   Camera Model (e.g. SONY DSC-W310, iPhone 12):\n   > ')).trim();
    commonEdit = (await askQuestion('   Edit Style (e.g. VSCO, DazzCam, None) [default: VSCO]:\n   > ')).trim() || 'VSCO';
  }

  // 3. Process each image
  const outputDirectory = path.join(process.cwd(), 'public', 'photos');
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  const dbPath = path.join(process.cwd(), 'src', 'photos-data.json');
  let photosList = [];
  if (fs.existsSync(dbPath)) {
    try {
      photosList = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (err) {
      console.error('⚠️ Could not parse existing src/photos-data.json, starting a new list.', err);
    }
  }

  const newOutputFilePaths = [];
  const newlyAddedEntries = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const rawPath = imagePaths[i];
    const fileName = path.basename(rawPath);
    console.log(`\n⚡ Processing [${i + 1}/${imagePaths.length}]: ${fileName}`);

    let category = commonCategory;
    let camera = commonCamera;
    let edit = commonEdit;

    if (!useBulkDetails && imagePaths.length > 1) {
      console.log(`Enter details for: ${fileName}`);
      category = (await askQuestion('   Category:\n   > ')).trim();
      camera = (await askQuestion('   Camera Model:\n   > ')).trim();
      edit = (await askQuestion('   Edit Style [default: VSCO]:\n   > ')).trim() || 'VSCO';
    }

    const parsedPath = path.parse(rawPath);
    const outputFileName = `${slugify(parsedPath.name)}.webp`;
    const outputFilePath = path.join(outputDirectory, outputFileName);

    try {
      const image = sharp(rawPath);
      const metadata = await image.metadata();

      // Auto-calculate ratio
      const ratioClass = getClosestAspectRatio(metadata.width, metadata.height);

      // Compress to WebP (quality 80)
      await image
        .webp({ quality: 80 })
        .toFile(outputFilePath);

      newOutputFilePaths.push(outputFilePath);

      const stats = fs.statSync(outputFilePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ Saved: public/photos/${outputFileName} (${sizeInMB} MB)`);

      const newPhotoEntry = {
        image: `/photos/${outputFileName}`,
        ratio: ratioClass,
        camera: camera || 'Unknown',
        edit: edit,
        category: category || 'General'
      };

      newlyAddedEntries.push(newPhotoEntry);

    } catch (err) {
      console.error(`   ❌ Failed to process: ${fileName}`, err.message);
    }
  }

  // Write updated DB
  if (newlyAddedEntries.length > 0) {
    // Prepend new photos so they show first
    photosList = [...newlyAddedEntries, ...photosList];
    fs.writeFileSync(dbPath, JSON.stringify(photosList, null, 2), 'utf8');
    console.log(`\n🎉 Successfully processed ${newlyAddedEntries.length} photo(s) and updated photos-data.json!`);
  }

  // 4. Ask to Git Deploy
  if (newlyAddedEntries.length > 0) {
    console.log('\n--- 🚀 Git Deployment ---');
    const gitDeploy = (await askQuestion(`Would you like to commit and push these ${newlyAddedEntries.length} photo(s) to GitHub now? (y/n):\n> `)).trim().toLowerCase();

    if (gitDeploy === 'y' || gitDeploy === 'yes') {
      console.log('📦 Running git commands...');
      try {
        // Stage files
        const filesToStage = [dbPath, ...newOutputFilePaths].map(p => `"${p}"`).join(' ');
        execSync(`git add ${filesToStage}`, { stdio: 'inherit' });
        
        // Commit
        const commitMsg = `Add ${newlyAddedEntries.length} photos via uploader`;
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
  }

  rl.close();
  console.log('\n👋 Done!');
}

main();
