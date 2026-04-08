import fs from "fs";

const stockPath = "../MegaBooks/stock.ts";
let content = fs.readFileSync(stockPath, "utf-8");

const fixes = [
  ["The Unfortunate Side Effects of Heartbreak and Magic", "Breanne", "Randall"],
  ["The September House", "Carissa", "Orlando"],
  ["The Shelbourne Ultimatum", "Ross", "O'Carroll-Kelly"],
  ["The Dark Elite", "Chloe", "Neill"],
  ["The Stray Cats of Homs", "Eva", "Nour"],
  ["The Garnett Girls", "Georgina", "Moore"],
  ["The Memory Wood", "Sam", "Lloyd"],
  ["Half His Age", "Jennette", "McCurdy"],
  ["A serial killer's guide to marriage", "Asia", "Mackay"],
  ["Where the Innocent Die", "M.J.", "Lee"],
  ["A Little Hope", "Ethan", "Joella"],
  ["The Girl Who Disappeared Twice", "Andrea", "Kane"],
  ["The Colour Of Bee Larkham's Murder", "Sarah J.", "Harris"],
  ["Psycho Cat", "Derek", "Hansen"],
  ["The Fourteenth Letter", "Claire", "Evans"],
  ["Gwen & Art Are Not in Love", "Lex", "Croucher"],
  ["The storm we made", "Vanessa", "Chan"],
  ["The Heart of the Midwife", "Darlene", "Franklin"],
];

let count = 0;
for (const [title, first, last] of fixes) {
  const old = `"title":"${title}","authorName":"","authorSurname":""`;
  const rep = `"title":"${title}","authorName":"${first}","authorSurname":"${last}"`;
  if (content.includes(old)) {
    content = content.replace(old, rep);
    count++;
  }
}

fs.writeFileSync(stockPath, content);
console.log(`Fixed ${count} entries in stock.ts`);
