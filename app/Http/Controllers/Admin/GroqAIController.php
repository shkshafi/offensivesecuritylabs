<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GroqAIController extends Controller
{
    public function query(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:2000',
            'model' => 'nullable|string|max:200',
        ]);

        $apiKey = config('services.groq.api_key') ?: env('GROQ_API_KEY');
        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'GROQ_API_KEY is not configured. Please set it in .env and run php artisan config:clear',
            ], 500);
        }

        $model = $request->input('model') ?: 'llama-3.3-70b-versatile';

        $payload = [
            'model' => $model,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $request->input('prompt'),
                ],
            ],
            'max_tokens' => 1500,
            'temperature' => 0.3,
        ];

        try {
            // Use the OpenAI-compatible endpoint as per Groq API reference
            $response = Http::withToken($apiKey)
                ->accept('application/json')
                ->timeout(35)
                ->post('https://api.groq.com/openai/v1/chat/completions', $payload);

            if ($response->failed()) {
                $status = $response->status() ?: 500;
                $body   = $response->json() ?: $response->body();

                \Log::warning('Groq API request failed', [
                    'status' => $status,
                    'payload' => $payload,
                    'response' => $body,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Groq API request failed.',
                    'status' => $status,
                    'errors' => $body,
                ], $status);
            }

            $data = $response->json();
            $answer = '';

            if (isset($data['choices'][0]['message']['content'])) {
                $answer = trim($data['choices'][0]['message']['content']);
            } elseif (isset($data['choices'][0]['text'])) {
                $answer = trim($data['choices'][0]['text']);
            } else {
                $answer = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            }

            return response()->json([
                'success' => true,
                'answer' => $answer,
                'raw' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Groq request exception: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function models()
    {
        $apiKey = config('services.groq.api_key') ?: env('GROQ_API_KEY');
        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'GROQ_API_KEY is not configured. Please set it in .env and run php artisan config:clear',
            ], 500);
        }

        try {
            $modelEndpoints = [
                'https://api.groq.com/openai/v1/models',
                'https://api.groq.com/v1/models',
            ];

            $response = null;
            $lastError = null;

            foreach ($modelEndpoints as $endpoint) {
                $response = Http::withToken($apiKey)
                    ->accept('application/json')
                    ->timeout(30)
                    ->get($endpoint);

                if (!$response->failed()) {
                    break;
                }

                $lastError = [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'body' => $response->json() ?: $response->body(),
                ];
            }

            if ($response === null || $response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Groq model list request failed.',
                    'status' => $response?->status() ?: 500,
                    'errors' => $lastError,
                ], $response?->status() ?: 500);
            }

            $data = $response->json();
            $models = collect($data['data'] ?? [])
                ->pluck('id')
                ->values();

            return response()->json([
                'success' => true,
                'models' => $models,
                'raw' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Groq model list exception: ' . $e->getMessage(),
            ], 500);
        }
    }
}
