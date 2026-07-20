// Generates public/images/placeholder.webp — flat ivory with a centred thin gold outline.
// Run: node scripts/make-placeholder.mjs
import sharp from 'sharp';

const W = 1600;
const H = 1067;
const inset = 120;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FAF7F0"/>
  <rect x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" fill="none" stroke="#C9A961" stroke-width="2"/>
</svg>`;

await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile('public/images/placeholder.webp');
console.log('Wrote public/images/placeholder.webp');
