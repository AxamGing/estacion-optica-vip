import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const pdfBuffer = fs.readFileSync('./src/pdf/Catálogo Palazzo Caballeros.pdf');

pdfParse(pdfBuffer).then(data => {
  console.log('=== TOTAL PAGINAS:', data.numpages);
  console.log('=== TEXTO EXTRAIDO ===');
  console.log(data.text);
}).catch(err => {
  console.error('Error:', err.message);
});
