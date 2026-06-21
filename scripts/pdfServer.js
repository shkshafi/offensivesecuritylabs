import http from 'http';
import { exportToPdf, closeGlobalBrowser } from '../resources/js/nttraptor/utils/exportPdf.js';

const PORT = process.env.PDF_SERVER_PORT ? parseInt(process.env.PDF_SERVER_PORT, 10) : 3000;

const server = http.createServer(async (req, res) => {
  // Only handle POST /api/reports/export-pdf
  if (req.method === 'POST' && req.url === '/api/reports/export-pdf') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        let payload;
        try {
          payload = JSON.parse(body);
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        if (!payload.html) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required field: html' }));
          return;
        }
        
        console.log(`[PDF Server] Exporting report PDF (HTML length: ${payload.html.length})...`);
        
        // Pass closeBrowser: false to leverage the browser singleton
        const pdfBuffer = await exportToPdf({
          html: payload.html,
          options: {
            closeBrowser: false
          }
        });
        
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.length,
          'Content-Disposition': 'attachment; filename="report.pdf"'
        });
        res.end(pdfBuffer);
        console.log(`[PDF Server] Export completed successfully (${pdfBuffer.length} bytes returned).`);
      } catch (error) {
        console.error('[PDF Server] Generation failed:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `PDF generation failed: ${error.message}` }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[PDF Server] Running at http://127.0.0.1:${PORT}`);
  console.log(`[PDF Server] POST /api/reports/export-pdf is ready to accept requests`);
});

// Handle server termination events gracefully to clean up the browser process
const handleShutdown = async () => {
  console.log('[PDF Server] Shutting down...');
  server.close(async () => {
    await closeGlobalBrowser();
    console.log('[PDF Server] Stopped and browser instance terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
