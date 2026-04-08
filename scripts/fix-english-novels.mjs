import fs from "fs";
import path from "path";

const stockPath = path.resolve("../MegaBooks/stock.ts");
let content = fs.readFileSync(stockPath, "utf-8");
const match = content.match(/\[[\s\S]*\]/);
const data = eval(match[0]);

// 1. JUNK entries to remove (OCR garbage)
const junkTitles = new Set([
  "D D D D", "EEEE", "III", "N", "T T T T", "YYYY", "XXXX",
  "Through every",  // incomplete OCR fragment
]);

// 2. Author-in-title fixes: { oldTitle: [newTitle, firstName, surname] }
const titleAuthorFixes = {
  "IN THE GARDEN OF THE FUGITIVES CERIDWEN DOVEY": ["In the Garden of the Fugitives", "Ceridwen", "Dovey"],
  "WHAT POETS NEED Finuala Dowling": ["What Poets Need", "Finuala", "Dowling"],
  "NADINE DORRIES The Four Streets": ["The Four Streets", "Nadine", "Dorries"],
  "RED SHADOW PAUL DOWSWELL": ["Red Shadow", "Paul", "Dowswell"],
  "DAVID HUSO BETRAYED": ["Betrayed", "David", "Huso"],
  "GARRISON KELLOR LAKE WOBEGON SUMMER 1956": ["Lake Wobegon Summer 1956", "Garrison", "Keillor"],
  "THOMAS KENEALLY THE PEOPLE'S TRAIN": ["The People's Train", "Thomas", "Keneally"],
  "LIA LEVI Tonight is Already Tomorrow": ["Tonight is Already Tomorrow", "Lia", "Levi"],
  "ALICE MUNRO The View from Castle Rock": ["The View from Castle Rock", "Alice", "Munro"],
  "ANNIE MURRAY The Narrowboat Girl & Water Gypsies": ["The Narrowboat Girl & Water Gypsies", "Annie", "Murray"],
  "JULIE MYERSON THEN": ["Then", "Julie", "Myerson"],
  "Julie Myerson Something Might Happen": ["Something Might Happen", "Julie", "Myerson"],
  "BRAD MELTZER THE ZERO GAME": ["The Zero Game", "Brad", "Meltzer"],
  "BARBARA NADEL DEADLY WEB": ["Deadly Web", "Barbara", "Nadel"],
  "BARBARA NADEL HAREM": ["Harem", "Barbara", "Nadel"],
  "HILARY NORMAN LAURA": ["Laura", "Hilary", "Norman"],
  "HILARY NORMAN Susanna": ["Susanna", "Hilary", "Norman"],
  "MIND GAMES HILARY NORMAN": ["Mind Games", "Hilary", "Norman"],
  "THE KID SAPPHIRE": ["The Kid", "", "Sapphire"],
  "JAMES LUCIFER'S THOMPSON TEARS": ["Lucifer's Tears", "James", "Thompson"],
  "MY LIFE AS EMPEROR SU TONG": ["My Life as Emperor", "Su", "Tong"],
  "BRAD THOR PATRIOT": ["The Last Patriot", "Brad", "Thor"],
  "BRAD THOR THE FIRST COMMANDMENT": ["The First Commandment", "Brad", "Thor"],
  "BRAD THOR THE PATH OF THE ASSASSIN": ["Path of the Assassin", "Brad", "Thor"],
  "ANTONY TREW RUNNING WILD": ["Running Wild", "Antony", "Trew"],
  "Fatima Farheen Mirza A Place For Us": ["A Place for Us", "Fatima Farheen", "Mirza"],
  "Graham Norton Holding": ["Holding", "Graham", "Norton"],
  "Freya North Fen": ["Fen", "Freya", "North"],
  "True Biz Sara Nović": ["True Biz", "Sara", "Nović"],
  "The Pleasure Seekers Tishani Doshi": ["The Pleasure Seekers", "Tishani", "Doshi"],
  "The Fetch Finuala Dowling": ["The Fetch", "Finuala", "Dowling"],
  "Book 3 in CATHERINE'S PURSUIT Lena Nelson Dooley": ["Catherine's Pursuit", "Lena Nelson", "Dooley"],
};

// 3. Simple author lookups (title stays the same)
const authorLookups = {
  "Jack Curtis": ["Jack", "Curtis"],  // This IS the author name, likely an autobiography/memoir
  "EMMA DONOGHUE": ["Emma", "Donoghue"],  // Author name as title - could be any of her books
  "Louise Douglas": ["Louise", "Douglas"],  // Same - author name scanned as title
  "Emma Tennant": ["Emma", "Tennant"],  // Same
  "ROBERT WILSON": ["Robert", "Wilson"],  // Same
  "XANDY VEE": ["Xandy", "Vee"],  // Same
  "Z A NOVEL OF VALERIE FITZGERALD": ["Zemindar", "Valerie", "Fitzgerald"],
  "The Go-Between": ["L.P.", "Hartley"],
  "The Ex-Wife's Survival Guide": ["Debby", "Holt"],
  "THE FACTORY GIRLS OF LARK LANE": ["Pam", "Howes"],
  "HOTEL SARAJEVO": ["Jack", "Kersh"],
  "BURIAL RITES": ["Hannah", "Kent"],
  "Prayer": ["Philip", "Kerr"],
  "Walking in Darkness": ["Charlotte", "Lamb"],
  "The Legacy": ["Katherine", "Webb"],  // Most common novel with this title
  "ENCOUNTERS An Anthology of South African Short Stories": ["", "Various"],
  "Burden of Proof Mills": ["Scott", "Turow"],  // "Burden of Proof" + "Mills" is publisher
  "Emergency Hospital": ["Ann", "Gilmer"],
  "Swahili for the Broken-Hearted": ["Peter", "Moore"],
  "THE MEATING ROOM": ["T.F.", "Muir"],
  "A COLLECTION OF ROMANCE READS": ["", "Various"],
  "BYGONE CHRISTMAS BRIDES": ["", "Various"],
  "THE FORTUNES OF CAROLYN TERRY": ["Margaret", "Pedler"],
  "Priceless": ["Nicole", "Richie"],
  "Glides the Stream": ["Dennis", "Hamley"],
  "CASSIDY": ["Morris", "West"],
  "RAAL: Mending a Broken Heart": ["", "Unknown"],
  "Meet Sophie": ["", "Unknown"],
  "The Homecoming": ["Stuart", "Pawson"],
  "Forever Yours": ["Daniel", "Glattauer"],
};

let removed = 0;
let titleFixed = 0;
let authorFixed = 0;

// Process the data
const cleaned = data.filter(b => {
  if (junkTitles.has(b.title) && b.location.startsWith("English novels")) {
    removed++;
    return false;
  }
  return true;
});

for (const book of cleaned) {
  if (book.location.startsWith("English novels") && !book.authorName && !book.authorSurname) {
    // Check title-author fixes
    if (titleAuthorFixes[book.title]) {
      const [newTitle, first, last] = titleAuthorFixes[book.title];
      book.title = newTitle;
      book.authorName = first;
      book.authorSurname = last;
      titleFixed++;
    }
    // Check simple author lookups
    else if (authorLookups[book.title]) {
      const fix = authorLookups[book.title];
      if (fix.length === 3) {
        // Special case: title also changes
        book.title = fix[0];
        book.authorName = fix[1];
        book.authorSurname = fix[2];
      } else {
        book.authorName = fix[0];
        book.authorSurname = fix[1];
      }
      authorFixed++;
    }
  }
}

// Rebuild stock.ts
const lines = cleaned.map(b => "  " + JSON.stringify(b) + ",");
const output =
  "// @ts-nocheck\nimport { StockBook } from './data';\n\nexport const STOCK_DATA: StockBook[] = [\n" +
  lines.join("\n") +
  "\n];\n";

fs.writeFileSync(stockPath, output);

// Report
const remaining = cleaned.filter(
  b => b.location.startsWith("English novels") && !b.authorName && !b.authorSurname
);

console.log(`Removed ${removed} junk entries`);
console.log(`Fixed ${titleFixed} title-embedded authors`);
console.log(`Fixed ${authorFixed} looked-up authors`);
console.log(`Remaining English novels without author: ${remaining.length}`);
remaining.forEach(b => console.log("  - " + b.title));
console.log(`\nTotal books now: ${cleaned.length}`);
