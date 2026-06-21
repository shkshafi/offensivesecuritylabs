import { chromium } from 'playwright';
import fs from 'fs';

let globalBrowser = null;

/**
 * Exports HTML string to PDF using Playwright Chromium
 * @param {object} params
 * @param {string} params.html - Rendered HTML content
 * @param {string} [params.outputPath] - Target file path
 * @param {object} [params.options] - Override PDF/browser options
 * @returns {Promise<Buffer>}
 */
export async function exportToPdf({ html, outputPath, options = {} }) {
  const timeout = options.timeout ?? (process.env.PDF_EXPORT_TIMEOUT ? parseInt(process.env.PDF_EXPORT_TIMEOUT, 10) : 30000);
  const closeBrowser = options.closeBrowser !== false; // if false, reuse globalBrowser

  let browser = null;
  let page = null;

  try {
    if (closeBrowser) {
      const args = process.env.PDF_CHROMIUM_ARGS 
        ? process.env.PDF_CHROMIUM_ARGS.split(',') 
        : ['--no-sandbox', '--disable-setuid-sandbox'];
      browser = await chromium.launch({ args });
    } else {
      if (!globalBrowser) {
        const args = process.env.PDF_CHROMIUM_ARGS 
          ? process.env.PDF_CHROMIUM_ARGS.split(',') 
          : ['--no-sandbox', '--disable-setuid-sandbox'];
        globalBrowser = await chromium.launch({ args });
      }
      browser = globalBrowser;
    }
  } catch (launchError) {
    throw new Error(`PDF generation failed: Browser launch failed. ${launchError.message}`);
  }

  try {
    page = await browser.newPage();

    // Log console messages during development
    if (process.env.NODE_ENV !== 'production') {
      page.on('console', msg => {
        console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
      });
    }

    if (options.extraHTTPHeaders) {
      await page.setExtraHTTPHeaders(options.extraHTTPHeaders);
    }

    // Style for print page and color adjustment
    const printStyle = `
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page { margin: 0; }   /* let Playwright margin options control spacing */
    body { margin: 0; }
  </style>
`;

    // Inject custom print styles into the HTML head
    let processedHtml = html;
    if (processedHtml.includes('</head>')) {
      processedHtml = processedHtml.replace('</head>', `${printStyle}</head>`);
    } else {
      processedHtml = printStyle + processedHtml;
    }

    // Set page content with a local base URL for relative assets
    const baseURL = options.baseURL ?? `file://${process.cwd()}/`;
    await page.setContent(processedHtml, { 
      waitUntil: 'networkidle',
      baseURL 
    });

    // Additional safety net for web fonts
    await page.waitForLoadState('networkidle');

    // Default configuration options
    const defaultPdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      displayHeaderFooter: false,
      scale: 1,
      timeout
    };

    // Filter out config parameters from pdf overrides
    const { 
      baseURL: _baseURL, 
      extraHTTPHeaders: _headers, 
      closeBrowser: _closeBrowser, 
      ...pdfOverrides 
    } = options;

    const mergedPdfOptions = {
      ...defaultPdfOptions,
      ...pdfOverrides
    };

    const pdfBuffer = await page.pdf(mergedPdfOptions);

    if (outputPath) {
      fs.writeFileSync(outputPath, pdfBuffer);
    }

    return pdfBuffer;
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (page) {
      await page.close();
    }
    if (closeBrowser && browser) {
      await browser.close();
    }
  }
}

/**
 * Closes the global browser instance if open (e.g. for server cleanup)
 */
export async function closeGlobalBrowser() {
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = null;
  }
}

export default exportToPdf;
