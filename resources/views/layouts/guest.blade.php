<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'OffSec Labs') }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('images/favicon_light.png') }}" media="(prefers-color-scheme: light)">
    <link rel="icon" type="image/png" href="{{ asset('images/favicon_dark.png') }}" media="(prefers-color-scheme: dark)">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Theme Script to avoid flicker -->
    <script>
        (function() {
            const userTheme = localStorage.getItem('theme') || 'dark';
            if (userTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col justify-between">
    <!-- Header -->
    <header class="w-full bg-card border-b border-border py-4">
        <div class="container mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
            <a href="/" class="group flex items-center select-none text-decoration-none">
                <img src="{{ asset('images/offsec_light.png') }}" class="h-8 w-auto max-w-[140px] object-contain dark:hidden" alt="Logo">
                <img src="{{ asset('images/offsec_dark.png') }}" class="hidden dark:block h-8 w-auto max-w-[140px] object-contain" alt="Logo">
            </a>
        </div>
    </header>

    <!-- Main Authentication Section -->
    <div class="flex-grow flex items-center justify-center px-4 sm:px-8 py-10 sm:py-16">
        <div class="w-full max-w-md bg-card border border-border rounded-[8px] shadow-sm overflow-hidden p-6 sm:p-8">
            {{ $slot }}
        </div>
    </div>

    <!-- Footer -->
    <footer class="w-full py-4 text-center text-xs text-muted-foreground border-t border-border bg-card">
        © 2026 Offensive Security Labs. All rights reserved.
    </footer>
</body>
</html>
