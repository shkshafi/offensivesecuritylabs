<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'OffSec Labs') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        :root {
            --font-brand: 'Outfit', sans-serif;
        }

        /* HeroGeometric Background Styles & Animations */
        @keyframes enter-shape {
            0% {
                opacity: 0;
                transform: translateY(-150px) rotate(calc(var(--base-rot) - 15deg));
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
                transform: translateY(0px) rotate(var(--base-rot));
            }
        }
        @keyframes float-y {
            0%, 100% { transform: translateY(0px) rotate(var(--base-rot)); }
            50% { transform: translateY(15px) rotate(var(--base-rot)); }
        }

        .shape-container {
            position: absolute;
            border-radius: 9999px;
            background: linear-gradient(to right, var(--gradient-from), transparent);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            border: 2px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1);
            pointer-events: none;
            opacity: 0;
            transform: translateY(-150px) rotate(calc(var(--base-rot) - 15deg));
            transition: opacity 1.2s ease-in-out;
        }
        .shape-container::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%);
        }
        .shape-container.loaded {
            opacity: 1;
            animation: 
                enter-shape 2.4s cubic-bezier(0.23, 0.86, 0.39, 0.96) var(--delay) forwards,
                float-y 12s ease-in-out calc(var(--delay) + 2.4s) infinite;
        }

        /* Glass Card Glow effect */
        .magic-card-glow {
            position: relative;
            background: rgba(15, 15, 20, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .magic-card-glow:hover {
            border-color: rgba(139, 92, 246, 0.35);
            box-shadow: 0 10px 40px rgba(139, 92, 246, 0.1);
        }
        .magic-card-glow::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: 16px;
            padding: 1px;
            background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.1) 40%, transparent 60%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }
    </style>
</head>
<body class="font-sans antialiased text-[#e0e0e0] bg-[#030303] overflow-x-hidden min-h-screen">
    <!-- Geometric shapes background -->
    <div class="absolute inset-0 w-full min-h-screen overflow-hidden pointer-events-none z-0">
        <!-- Giant background blur -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl"></div>

        <!-- Float Shapes -->
        <div class="shape-container left-[-10%] md:left-[-5%] top-[15%] md:top-[20%] w-[600px] h-[140px]" style="--base-rot: 12deg; --delay: 0.3s; --gradient-from: rgba(99, 102, 241, 0.15);"></div>
        <div class="shape-container right-[-5%] md:right-[0%] top-[70%] md:top-[75%] w-[500px] h-[120px]" style="--base-rot: -15deg; --delay: 0.5s; --gradient-from: rgba(244, 63, 94, 0.15);"></div>
        <div class="shape-container left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%] w-[300px] h-[80px]" style="--base-rot: -8deg; --delay: 0.4s; --gradient-from: rgba(139, 92, 246, 0.15);"></div>
        <div class="shape-container right-[15%] md:right-[20%] top-[10%] md:top-[15%] w-[200px] h-[60px]" style="--base-rot: 20deg; --delay: 0.6s; --gradient-from: rgba(245, 158, 11, 0.15);"></div>
        <div class="shape-container left-[20%] md:left-[25%] top-[5%] md:top-[10%] w-[150px] h-[40px]" style="--base-rot: -25deg; --delay: 0.7s; --gradient-from: rgba(6, 182, 212, 0.15);"></div>

        <!-- Vignette overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80"></div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 w-full min-h-screen flex flex-col justify-between">
        <!-- Header -->
        <header class="w-full bg-[#0a0a0a]/50 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300" style="padding-top: env(safe-area-inset-top, 0px);">
            <div class="container mx-auto max-w-7xl px-4 sm:px-6 min-h-14 sm:min-h-20 flex items-center justify-between">
                <a href="/" class="group flex items-center gap-2.5 select-none text-decoration-none">
                    <span class="flex shrink-0 items-center justify-center rounded-[10px] w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] shadow-[0_2px_8px_-2px_rgba(139,92,246,0.55)] transition-transform duration-200 group-hover:scale-105">
                        <svg class="size-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <polyline points="4 17 10 11 4 5" />
                            <line x1="12" y1="19" x2="20" y2="19" />
                        </svg>
                    </span>
                    <span class="text-white font-[700] tracking-[-0.03em] leading-none text-lg" style="font-family: var(--font-brand);">
                        offensivesecuritylabs
                    </span>
                </a>
            </div>
        </header>

        <!-- Main Authentication Section -->
        <div class="flex-grow flex items-center justify-center px-4 sm:px-8 py-10 sm:py-16">
            <div class="w-full max-w-md magic-card-glow overflow-hidden">
                <div class="p-6 sm:p-8">
                    {{ $slot }}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="w-full py-4 text-center text-xs text-zinc-500 border-t border-white/[0.05] bg-[#0a0a0a]/30">
            © 2026 Offensive Security Labs. All rights reserved.
        </footer>
    </div>

    <!-- Activation script for shape fade-in -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.querySelectorAll('.shape-container').forEach(el => {
                    el.classList.add('loaded');
                });
            }, 100);
        });
    </script>
</body>
</html>
