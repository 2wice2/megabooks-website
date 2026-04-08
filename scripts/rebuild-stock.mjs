import fs from "fs";
import path from "path";

const scanDir = path.resolve("../MegaBooks/BookShelf Images/March 2026");
const stockPath = path.resolve("../MegaBooks/stock.ts");

const dirs = fs
  .readdirSync(scanDir)
  .filter((d) => fs.statSync(path.join(scanDir, d)).isDirectory());

const allBooks = [];

for (const dir of dirs.sort()) {
  const files = fs.readdirSync(path.join(scanDir, dir));
  const histFile = files.find((f) => f.includes("scan_history"));
  const cleanFile = files.find((f) => f.endsWith("_Clean.json"));

  // Prefer scan_history, fall back to Clean.json
  if (histFile) {
    const data = JSON.parse(
      fs.readFileSync(path.join(scanDir, dir, histFile), "utf-8")
    );
    for (const scan of data) {
      if (!scan.books || !Array.isArray(scan.books)) continue;
      const loc = scan.location || dir;
      for (const b of scan.books) {
        if (!b.title || !b.title.trim()) continue;

        let authorName = "";
        let authorSurname = "";

        if (b.authorName !== undefined) {
          // Structured format (most sections)
          authorName = (b.authorName || "").trim();
          authorSurname = (b.authorSurname || "").trim();
        } else if (b.author) {
          // Combined format (New Arrivals)
          const parts = b.author.trim().split(/\s+/);
          if (parts.length >= 2) {
            authorSurname = parts.pop();
            authorName = parts.join(" ");
          } else if (parts.length === 1 && parts[0]) {
            authorSurname = parts[0];
          }
        }

        allBooks.push({
          title: b.title.trim(),
          authorName,
          authorSurname,
          count: b.count || 1,
          location: loc,
        });
      }
    }
  } else if (cleanFile) {
    const data = JSON.parse(
      fs.readFileSync(path.join(scanDir, dir, cleanFile), "utf-8")
    );
    for (const scan of data.scans) {
      if (!scan.entries || !Array.isArray(scan.entries)) continue;
      const loc = scan.fileName
        ? scan.fileName.replace(/\.\w+$/, "")
        : dir;
      for (const b of scan.entries) {
        if (!b.title || !b.title.trim()) continue;
        allBooks.push({
          title: b.title.trim(),
          authorName: (b.authorName || "").trim(),
          authorSurname: (b.authorSurname || "").trim(),
          count: b.count || 1,
          location: loc,
        });
      }
    }
  } else {
    console.log("NO DATA:", dir);
  }
}

// Apply manual author fixes for books OCR missed
const authorFixes = {
  "The Unfortunate Side Effects of Heartbreak and Magic": ["Breanne", "Randall"],
  "The September House": ["Carissa", "Orlando"],
  "The Shelbourne Ultimatum": ["Ross", "O'Carroll-Kelly"],
  "The Dark Elite": ["Chloe", "Neill"],
  "The Stray Cats of Homs": ["Eva", "Nour"],
  "The Garnett Girls": ["Georgina", "Moore"],
  "The Memory Wood": ["Sam", "Lloyd"],
  "Half His Age": ["Jennette", "McCurdy"],
  "A serial killer's guide to marriage": ["Asia", "Mackay"],
  "Where the Innocent Die": ["M.J.", "Lee"],
  "A Little Hope": ["Ethan", "Joella"],
  "The Girl Who Disappeared Twice": ["Andrea", "Kane"],
  "The Colour Of Bee Larkham's Murder": ["Sarah J.", "Harris"],
  "Psycho Cat": ["Derek", "Hansen"],
  "The Fourteenth Letter": ["Claire", "Evans"],
  "Gwen & Art Are Not in Love": ["Lex", "Croucher"],
  "The storm we made": ["Vanessa", "Chan"],
  "The Heart of the Midwife": ["Darlene", "Franklin"],
};

for (const book of allBooks) {
  if (!book.authorName && !book.authorSurname && authorFixes[book.title]) {
    [book.authorName, book.authorSurname] = authorFixes[book.title];
  }
}

// Write stock.ts
const lines = allBooks.map((b) => "  " + JSON.stringify(b) + ",");
const content =
  "// @ts-nocheck\nimport { StockBook } from './data';\n\nexport const STOCK_DATA: StockBook[] = [\n" +
  lines.join("\n") +
  "\n];\n";

fs.writeFileSync(stockPath, content);

console.log("Rebuilt stock.ts — March 2026 data");
console.log("Total books:", allBooks.length);

const noAuthor = allBooks.filter((b) => !b.authorName && !b.authorSurname);
console.log("Missing authors:", noAuthor.length);

const sections = {};
for (const b of allBooks) {
  const sec = b.location.replace(/\s*\d+$/, "");
  sections[sec] = (sections[sec] || 0) + 1;
}
for (const [k, v] of Object.entries(sections).sort()) {
  console.log("  " + k.padEnd(30) + v);
}
