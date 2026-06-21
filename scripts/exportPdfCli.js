import { exportToPdf } from '../resources/js/nttraptor/utils/exportPdf.js';
import fs from 'fs';

// Simple command line argument parsing
const args = process.argv.slice(2);
let inputPath = '';
let outputPath = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' || args[i] === '-i') {
    inputPath = args[i + 1];
    i++;
  } else if (args[i] === '--output' || args[i] === '-o') {
    outputPath = args[i + 1];
    i++;
  }
}

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/exportPdfCli.js --input <input_html_path> --output <output_pdf_path>');
  process.exit(1);
}

try {
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input HTML file does not exist at ${inputPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(inputPath, 'utf8');
  await exportToPdf({
    html,
    outputPath,
    options: {
      closeBrowser: true
    }
  });
  process.exit(0);
} catch (error) {
  console.error(`CLI PDF Generation Error: ${error.message}`);
  process.exit(1);
}
