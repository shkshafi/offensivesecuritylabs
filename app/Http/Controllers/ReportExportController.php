<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReportExportController extends Controller
{
    /**
     * Export HTML report to PDF.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function exportPdf(Request $request)
    {
        $request->validate([
            'html' => 'required|string',
            'name' => 'nullable|string',
            'client' => 'nullable|string',
            'version' => 'nullable|string',
            'date' => 'nullable|string'
        ]);

        $html = $request->input('html');
        $client = $request->input('client', 'Client');
        $version = $request->input('version', '1.0');
        $date = $request->input('date', '');

        // Format DD_MM_YY from report date (YYYY-MM-DD)
        $dateStr = '';
        if ($date && preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date, $matches)) {
            $year = substr($matches[1], -2);
            $month = $matches[2];
            $day = $matches[3];
            $dateStr = "{$day}_{$month}_{$year}";
        } else {
            $dateStr = date('d_m_y');
        }

        $cleanClient = preg_replace('/[^a-zA-Z0-9]/', '_', $client);
        $cleanClient = preg_replace('/_+/', '_', $cleanClient);
        $cleanClient = trim($cleanClient, '_');

        $cleanVersion = preg_replace('/[^a-zA-Z0-9.]/', '_', $version);
        $cleanVersion = preg_replace('/_+/', '_', $cleanVersion);
        $cleanVersion = trim($cleanVersion, '_');

        $filename = "{$dateStr}_Red_Team_Report_{$cleanClient}_{$cleanVersion}.pdf";

        // Try the persistent PDF server first (for singleton browser pattern)
        $serverUrl = env('PDF_SERVER_URL', 'http://127.0.0.1:3000/api/reports/export-pdf');
        
        try {
            // Wait up to 35 seconds for the PDF to generate
            $response = Http::timeout(35)->post($serverUrl, [
                'html' => $html
            ]);

            if ($response->successful() && $response->header('Content-Type') === 'application/pdf') {
                return response($response->body(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"'
                ]);
            }
            
            Log::warning("PDF server returned non-PDF or error response: " . $response->status());
        } catch (\Exception $e) {
            Log::info("PDF server not available or failed: " . $e->getMessage() . ". Falling back to CLI generation.");
        }

        // Fallback: Generate PDF via single-use Node.js process
        $tempHtmlFile = tempnam(sys_get_temp_dir(), 'report_html_');
        $tempPdfFile = tempnam(sys_get_temp_dir(), 'report_pdf_');
        
        // Ensure the temp files have proper extensions for the scripts
        rename($tempHtmlFile, $tempHtmlFile . '.html');
        $tempHtmlFile = $tempHtmlFile . '.html';

        try {
            file_put_contents($tempHtmlFile, $html);

            // Execute node command to generate PDF
            $command = sprintf(
                'node %s --input %s --output %s 2>&1',
                escapeshellarg(base_path('scripts/exportPdfCli.js')),
                escapeshellarg($tempHtmlFile),
                escapeshellarg($tempPdfFile)
            );

            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                Log::error("CLI PDF generation failed. Return code: {$returnVar}. Output: " . implode("\n", $output));
                return response()->json([
                    'error' => 'PDF generation failed: ' . implode(" ", $output)
                ], 500);
            }

            if (!file_exists($tempPdfFile) || filesize($tempPdfFile) === 0) {
                return response()->json([
                    'error' => 'Generated PDF is empty or missing.'
                ], 500);
            }

            $pdfContent = file_get_contents($tempPdfFile);
            
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"'
            ]);

        } finally {
            // Clean up temp files safely
            if (file_exists($tempHtmlFile)) {
                unlink($tempHtmlFile);
            }
            if (file_exists($tempPdfFile)) {
                unlink($tempPdfFile);
            }
        }
    }
}
