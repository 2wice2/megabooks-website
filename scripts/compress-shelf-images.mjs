import sharp from "sharp";
import fs from "fs";
import path from "path";

const SOURCE_DIR = path.resolve("../MegaBooks/BookShelf Images/March 2026");
const OUTPUT_DIR = path.resolve("public/shelf-images");
const MAX_WIDTH = 1200;
const QUALITY = 72;

function normalize(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function compressImages() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error("Source directory not found:", SOURCE_DIR);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sections = fs
    .readdirSync(SOURCE_DIR)
    .filter((d) => fs.statSync(path.join(SOURCE_DIR, d)).isDirectory());

  let total = 0;
  let errors = 0;

  for (const section of sections) {
    const sectionDir = path.join(SOURCE_DIR, section);
    const outSection = path.join(OUTPUT_DIR, normalize(section));
    fs.mkdirSync(outSection, { recursive: true });

    const images = fs
      .readdirSync(sectionDir)
      .filter((f) => /\.(jpe?g)$/i.test(f));

    for (const img of images) {
      const inputPath = path.join(sectionDir, img);
      const outName = normalize(img.replace(/\.jpeg$/i, ".jpg"));
      const outputPath = path.join(outSection, outName);

      try {
        await sharp(inputPath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: QUALITY })
          .toFile(outputPath);
        total++;
      } catch (err) {
        console.error(`  ERROR: ${img} - ${err.message}`);
        errors++;
      }
    }
    console.log(`${section}: ${images.length} images compressed`);
  }

  console.log(`\nDone: ${total} images compressed, ${errors} errors`);

  // Report total size
  let totalSize = 0;
  function walkDir(dir) {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) walkDir(fp);
      else totalSize += fs.statSync(fp).size;
    }
  }
  walkDir(OUTPUT_DIR);
  console.log(
    `Total output size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`
  );
}

compressImages();
