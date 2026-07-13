<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" 
      data-background-style="{{ Auth::user()->getBackgroundStyle() }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'OffSec Labs') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('images/favicon_light.png') }}" media="(prefers-color-scheme: light)">
        <link rel="icon" type="image/png" href="{{ asset('images/favicon_dark.png') }}" media="(prefers-color-scheme: dark)">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">

        <!-- Theme Script to avoid flicker -->
        <script>
            (function() {
                const userTheme = "{{ Auth::user()->theme ?? 'dark' }}";
                const localTheme = localStorage.getItem('theme');
                const theme = userTheme || localTheme || 'dark';
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                const userBgStyle = "{{ Auth::user()->getBackgroundStyle() }}";
                document.documentElement.setAttribute('data-background-style', userBgStyle || 'none');
            })();
        </script>

        <style>
            :root {
                --font-brand: 'Inter', 'Segoe UI', sans-serif;
            }
        </style>

        <!-- Scripts -->
        @viteReactRefresh
        @vite(array_merge(['resources/css/app.css', 'resources/js/app.js'], $viteScripts ?? []))
    </head>
    <body class="font-sans antialiased min-h-screen bg-background text-foreground">
        @php
            $routeName = request()->route() ? request()->route()->getName() : '';
            $breadcrumbs = [['label' => 'Home', 'url' => route('dashboard')]];
            
            $hour = date('H');
            $greeting = 'Good morning';
            if ($hour >= 12 && $hour < 17) {
                $greeting = 'Good afternoon';
            } elseif ($hour >= 17) {
                $greeting = 'Good evening';
            }
            
            $pageTitle = 'Console';

            if ($routeName === 'dashboard') {
                $breadcrumbs[] = ['label' => 'Report Builder', 'url' => null];
                $pageTitle = 'Reports';
            } elseif ($routeName === 'report-builder') {
                $breadcrumbs[] = ['label' => 'Report Builder', 'url' => route('dashboard')];
                $breadcrumbs[] = ['label' => 'edit', 'url' => null];
                $pageTitle = 'Edit Report';
            } elseif (str_starts_with($routeName, 'admin.users.')) {
                $breadcrumbs[] = ['label' => 'Administration', 'url' => null];
                $breadcrumbs[] = ['label' => 'User management', 'url' => null];
                $pageTitle = 'User management';
            } elseif (str_starts_with($routeName, 'admin.waitlist.')) {
                $breadcrumbs[] = ['label' => 'Administration', 'url' => null];
                $breadcrumbs[] = ['label' => 'Waitlist', 'url' => null];
                $pageTitle = 'Waitlist management';
            } elseif ($routeName === 'profile.edit') {
                $breadcrumbs[] = ['label' => 'Settings', 'url' => null];
                $breadcrumbs[] = ['label' => 'Profile', 'url' => null];
                $pageTitle = 'Profile';
            } elseif ($routeName === 'dashboard.templates') {
                $breadcrumbs[] = ['label' => 'Templates', 'url' => null];
                $pageTitle = 'Templates';
            } elseif (str_contains($routeName, 'notifications')) {
                $breadcrumbs[] = ['label' => 'Notifications', 'url' => null];
                $pageTitle = 'Notifications';
            }
        @endphp

        <div class="flex flex-col min-h-screen w-full bg-background text-foreground"
             x-data="{
                 sidebarPinned: true,
                 mobileSidebarOpen: false,
                 inReportBuilder: false,
                 currentPath: window.location.pathname,
                 init() {
                     let storedPinned = localStorage.getItem('sidebar_pinned');
                     this.sidebarPinned = (storedPinned === null || storedPinned === 'true');
                     
                     window.addEventListener('popstate', () => {
                         this.currentPath = window.location.pathname;
                     });
                     window.addEventListener('pushstate-changed', () => {
                         this.currentPath = window.location.pathname;
                     });
                     window.addEventListener('report-builder-active', (e) => {
                         this.inReportBuilder = e.detail.active;
                         if (this.inReportBuilder) {
                             this.sidebarPinned = false;
                         }
                     });
                 },
                 togglePinned() {
                     this.sidebarPinned = !this.sidebarPinned;
                     if (!this.inReportBuilder) {
                         localStorage.setItem('sidebar_pinned', this.sidebarPinned);
                     }
                 }
             }">

            <!-- Top Level Full-Width Header/Navbar -->
            <header class="w-full flex flex-row items-center justify-between pl-0 pr-0 h-12 min-h-12 max-h-12 border-b border-blue-500/80 bg-white dark:bg-[#070b13] z-50 select-none">
                <!-- Left: Mobile Trigger, 9-Dot grid, NTT DATA Logo, vertical divider, portal name -->
                <div class="flex items-center gap-4">
                    <!-- Mobile Sidebar Trigger -->
                    <button type="button" @click="mobileSidebarOpen = true" class="h-8 w-8 ml-3 shrink-0 rounded-lg border border-border/40 bg-background/50 flex items-center justify-center md:hidden text-muted-foreground hover:text-foreground cursor-pointer">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>

                    <!-- 9-dot grid icon inside a solid blue brand background box -->
                    <button type="button" @click="togglePinned()" class="h-12 w-12 flex items-center justify-center bg-[#0072BC] hover:bg-[#005B96] text-white border-0 cursor-pointer focus:outline-none transition-colors shrink-0">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="4" height="4" rx="0.5" />
                            <rect x="10" y="2" width="4" height="4" rx="0.5" />
                            <rect x="18" y="2" width="4" height="4" rx="0.5" />
                            <rect x="2" y="10" width="4" height="4" rx="0.5" />
                            <rect x="10" y="10" width="4" height="4" rx="0.5" />
                            <rect x="18" y="10" width="4" height="4" rx="0.5" />
                            <rect x="2" y="18" width="4" height="4" rx="0.5" />
                            <rect x="10" y="18" width="4" height="4" rx="0.5" />
                            <rect x="18" y="18" width="4" height="4" rx="0.5" />
                        </svg>
                    </button>
                    
                    <!-- NTT DATA Logo (nice and large as requested) -->
                    <a href="{{ route('dashboard') }}" class="flex items-center">
                        <img src="{{ asset('images/ntt-logo.png') }}" class="ntt-logo-img w-auto object-contain" style="height: 34px; max-height: 34px;" alt="NTT DATA">
                    </a>

                    <!-- Vertical separator line -->
                    <div class="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

                    <!-- App/portal name -->
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold font-sans">Red Team Reporting Portal</span>
                </div>

                <!-- Right Actions: Status (laptop), Search, Theme Switcher, Profile square -->
                <div class="flex items-center gap-5 h-full">
                    <!-- Search icon -->
                    <span class="text-muted-foreground hover:text-foreground hidden sm:inline-block cursor-pointer" title="Search">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>

                    <!-- Light and Dark Mode switcher button -->
                    <button type="button" 
                            x-data="{
                                theme: 'dark',
                                init() {
                                    this.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                                },
                                toggle() {
                                    this.theme = (this.theme === 'dark') ? 'light' : 'dark';
                                    if (this.theme === 'dark') {
                                        document.documentElement.classList.add('dark');
                                        localStorage.setItem('theme', 'dark');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                        localStorage.setItem('theme', 'light');
                                    }
                                    fetch('{{ route('settings.appearance.update') }}', {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                        },
                                        body: JSON.stringify({
                                            theme: this.theme
                                        })
                                    });
                                }
                            }"
                            @click="toggle()"
                            class="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer focus:outline-none border-0 bg-transparent"
                            title="Toggle light/dark mode">
                        <svg x-show="theme === 'dark'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        <svg x-show="theme === 'light'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    </button>

                    <!-- User Initials Square (Green RP style from example) -->
                    <div class="relative h-full" x-data="{ navDropdownOpen: false }">
                        <button @click.stop="navDropdownOpen = !navDropdownOpen" class="h-full w-12 flex items-center justify-center bg-[#00CB5D] hover:bg-[#00b552] text-white font-bold text-xs transition-colors border-0 cursor-pointer focus:outline-none" aria-label="User menu">
                            {{ strtoupper(substr(Auth::user()->name, 0, 2)) }}
                        </button>
                        <div x-show="navDropdownOpen" @click.outside="navDropdownOpen = false"
                             x-transition:enter="transition ease-out duration-150"
                             x-transition:enter-start="opacity-0 translate-y-[-6px]"
                             x-transition:enter-end="opacity-100 translate-y-0"
                             class="absolute right-0 top-full mt-0 w-48 rounded-none border border-border/50 bg-popover text-popover-foreground p-1.5 shadow-xl z-[100] space-y-0.5" style="display: none;">
                            <div class="flex items-center gap-2 px-2.5 py-1.5 border-b border-border/40 select-none">
                                <div class="h-7 w-7 rounded-none bg-[#00CB5D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                    {{ strtoupper(substr(Auth::user()->name, 0, 2)) }}
                                </div>
                                <div class="flex flex-col min-w-0">
                                    <span class="text-xs font-semibold text-foreground truncate">{{ Auth::user()->name }}</span>
                                    <span class="text-[10px] text-muted-foreground truncate">{{ Auth::user()->email }}</span>
                                </div>
                            </div>
                            <a href="{{ route('profile.edit') }}" class="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">Profile</a>
                            <div class="h-px bg-border/40 my-1"></div>
                            <form method="POST" action="{{ route('logout') }}" class="m-0">
                                @csrf
                                <button type="submit" class="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left border-0 bg-transparent cursor-pointer">
                                    Log out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Layout Container (Below Navbar) -->
            <div class="flex flex-row flex-grow w-full relative overflow-hidden bg-background text-foreground" style="height: calc(100vh - 3rem);">
                
                <!-- Desktop Sidebar -->
                <aside class="hidden md:block shrink-0 z-30 transition-[width] duration-150 ease-in-out border-r border-border bg-card"
                       :class="sidebarPinned ? 'w-56' : 'w-0 border-r-0 overflow-hidden'">
                    
                     <div data-sidebar="sidebar" class="flex h-full w-full flex-col overflow-hidden rounded-none bg-card border-none">
                          
                          <!-- Header/Close -->
                          <div class="flex items-center justify-between p-3.5 border-b border-border">
                              <button type="button" @click="togglePinned()" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border-0 bg-transparent cursor-pointer font-sans select-none focus:outline-none">
                                  <span class="text-xs font-light">✕</span>
                                  <span>Close</span>
                              </button>
                          </div>

                          <!-- Navigation Items -->
                          <div class="flex-1 overflow-y-auto py-1 space-y-0.5">
                              <!-- Dashboard Link -->
                              <a href="{{ route('dashboard') }}" 
                                 class="flex items-center gap-3 py-2.5 text-sm transition-colors text-decoration-none border-0 {{ request()->routeIs('dashboard') ? 'border-l-[3.5px] border-[#0072BC] bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] dark:text-white font-semibold pl-5' : 'border-l-[3.5px] border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground pl-5' }}">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                                  <span>Dashboard</span>
                              </a>

                              <!-- Templates Link -->
                              <a href="{{ route('dashboard.templates') }}" 
                                 class="flex items-center gap-3 py-2.5 text-sm transition-colors text-decoration-none border-0 {{ request()->routeIs('dashboard.templates') ? 'border-l-[3.5px] border-[#0072BC] bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] dark:text-white font-semibold pl-5' : 'border-l-[3.5px] border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground pl-5' }}">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                  <span>Templates</span>
                              </a>                              @if(Auth::user()->role === 'admin')
                              <div class="px-6 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider my-2">Administration</div>

                              <!-- User Management Link -->
                              <a href="{{ route('admin.users.index') }}" 
                                 class="flex items-center gap-3 py-2.5 text-sm transition-colors text-decoration-none border-0 {{ request()->routeIs('admin.users.index') ? 'border-l-[3.5px] border-[#0072BC] bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] dark:text-white font-semibold pl-5' : 'border-l-[3.5px] border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground pl-5' }}">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                  <span>User management</span>
                              </a>

                              <!-- Waitlist Link -->
                              <a href="{{ route('admin.waitlist.index') }}" 
                                 class="flex items-center gap-3 py-2.5 text-sm transition-colors text-decoration-none border-0 {{ request()->routeIs('admin.waitlist.index') ? 'border-l-[3.5px] border-[#0072BC] bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] dark:text-white font-semibold pl-5' : 'border-l-[3.5px] border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground pl-5' }}">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Waitlist</span>
                              </a>
                              @endif

                              <div class="px-6 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider my-2">Settings</div>

                              <!-- Profile Link -->
                              <a href="{{ route('profile.edit') }}" 
                                 class="flex items-center gap-3 py-2.5 text-sm transition-colors text-decoration-none border-0 {{ request()->routeIs('profile.edit') ? 'border-l-[3.5px] border-[#0072BC] bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] dark:text-white font-semibold pl-5' : 'border-l-[3.5px] border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground pl-5' }}">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                  <span>Profile</span>
                              </a>
                          </div>
                     </div>
                </aside>

                <!-- Mobile Sidebar Backdrop -->
                <div x-show="mobileSidebarOpen"
                     @click="mobileSidebarOpen = false"
                     class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                     style="display: none;"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"></div>

                <!-- Mobile Sidebar Panel -->
                <aside x-show="mobileSidebarOpen"
                       class="fixed inset-y-0 left-0 z-50 w-[240px] md:hidden p-2 flex bg-transparent"
                       style="display: none;"
                       x-transition:enter="transition ease-out duration-300 transform"
                       x-transition:enter-start="-translate-x-full"
                       x-transition:enter-end="translate-x-0"
                       x-transition:leave="transition ease-in duration-200 transform"
                       x-transition:leave-start="translate-x-0"
                       x-transition:leave-end="-translate-x-full">
                       
                       <div data-sidebar="sidebar" class="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-card border border-border">
                             <!-- Header -->
                             <div class="flex items-center justify-between p-3.5 border-b border-border">
                                 <!-- Logo -->
                                 <a href="{{ route('dashboard') }}" class="flex items-center select-none">
                                     <img src="{{ asset('images/ntt-logo.png') }}" class="ntt-logo-img w-auto object-contain" style="height: 34px; max-height: 34px;" alt="NTT DATA">
                                 </a>
                                 
                                 <!-- Close Button -->
                                 <button type="button" @click="mobileSidebarOpen = false" class="h-6 w-6 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent focus:outline-none">
                                     <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                 </button>
                             </div>

                             <!-- Navigation Items -->
                             <div class="flex-1 overflow-y-auto py-1 space-y-0.5">
                                 <a href="{{ route('dashboard') }}" 
                                    class="flex items-center gap-3 py-2.5 text-sm transition-colors text-decoration-none border-0 {{ request()->routeIs('dashboard') ? 'border-l-[3.5px] border-[#0072BC] bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] dark:text-white font-semibold pl-5' : 'border-l-[3.5px] border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground pl-5' }}">
                                     <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                                     <span>Dashboard</span>
                                 </a>

                                 <a href="{{ route('dashboard.templates') }}" class="flex items-center gap-3 px-6 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('dashboard.templates') ? 'bg-slate-200/80 dark:bg-[#253446] text-foreground dark:text-white font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                     <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                     <span>Templates</span>
                                 </a>

                                 @if(Auth::user()->role === 'admin')
                                 <div class="px-6 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider my-2">Administration</div>

                                 <!-- User Management Link -->
                                 <a href="{{ route('admin.users.index') }}" class="flex items-center gap-3 px-6 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('admin.users.index') ? 'bg-slate-200/80 dark:bg-[#253446] text-foreground dark:text-white font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                     <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                         <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                     </svg>
                                     <span>User management</span>
                                 </a>

                                 <!-- Waitlist Link -->
                                 <a href="{{ route('admin.waitlist.index') }}" class="flex items-center gap-3 px-6 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('admin.waitlist.index') ? 'bg-slate-200/80 dark:bg-[#253446] text-foreground dark:text-white font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                     <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                         <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                     </svg>
                                     <span>Waitlist</span>
                                 </a>
                                 @endif

                                 <div class="px-6 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider my-2">Settings</div>

                                 <!-- Profile Link -->
                                 <a href="{{ route('profile.edit') }}" class="flex items-center gap-3 px-6 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('profile.edit') ? 'bg-slate-200/80 dark:bg-[#253446] text-[#0072BC] text-foreground dark:text-white font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                     <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                     <span>Profile</span>
                                 </a>
                             </div>
                       </div>
                </aside>

                <!-- Main Inner Content Area (Scrolling container) -->
                <div class="flex-grow min-w-0 flex flex-col h-full overflow-y-auto">
                    <!-- Breadcrumbs & Page Title Sub-Header -->
                    <div class="bg-card border-b border-border px-4 md:px-6 py-2.5 flex items-center justify-between select-none shrink-0">
                        <div class="flex flex-col">
                            <!-- Breadcrumbs -->
                            <nav class="flex items-center gap-1.5 text-[11px] select-none mb-0.5 italic text-slate-500 dark:text-slate-400">
                                <template x-if="currentPath.includes('/dashboard/builder')">
                                    <div class="flex items-center gap-1.5">
                                        <a href="{{ route('dashboard') }}" class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-decoration-none lowercase">home</a>
                                        <span class="text-slate-500/60 dark:text-slate-500 mx-0.5 font-light">/</span>
                                        <a href="{{ route('dashboard') }}" class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-decoration-none lowercase">report builder</a>
                                        <span class="text-slate-500/60 dark:text-slate-500 mx-0.5 font-light">/</span>
                                        <span class="truncate font-normal">edit</span>
                                    </div>
                                </template>
                                <template x-if="currentPath === '/dashboard' || currentPath === '/dashboard/'">
                                    <div class="flex items-center gap-1.5">
                                        <a href="{{ route('dashboard') }}" class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-decoration-none lowercase">home</a>
                                        <span class="text-slate-500/60 dark:text-slate-500 mx-0.5 font-light">/</span>
                                        <span class="truncate font-normal">dashboard</span>
                                    </div>
                                </template>
                                <template x-if="!currentPath.includes('/dashboard')">
                                    <div class="flex items-center gap-1.5">
                                        @foreach($breadcrumbs as $index => $crumb)
                                            @if($index > 0)
                                                <span class="text-slate-500/60 dark:text-slate-500 mx-0.5 font-light">/</span>
                                            @endif
                                            @if($crumb['url'])
                                                <a href="{{ $crumb['url'] }}" class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-decoration-none lowercase">{{ $crumb['label'] }}</a>
                                            @else
                                                <span class="truncate font-normal">{{ $crumb['label'] }}</span>
                                            @endif
                                        @endforeach
                                    </div>
                                </template>
                            </nav>
                            <!-- Page Title -->
                            <h1 class="text-base font-semibold text-foreground leading-tight" x-text="currentPath.includes('/dashboard/builder') ? 'Edit Report' : (currentPath === '/dashboard' ? 'Reports' : '{{ $pageTitle }}')">
                                {{ $pageTitle }}
                            </h1>
                        </div>
                        @isset($headerActions)
                            <div class="flex items-center gap-2">
                                {{ $headerActions }}
                            </div>
                        @endisset
                    </div>

                    <!-- Page Content Shell -->
                    <main class="flex-grow min-w-0 w-full flex flex-col">
                        @isset($header)
                            <div class="mb-6 px-4 sm:px-6 md:px-8 pt-4">
                                {{ $header }}
                            </div>
                        @endisset
                        {{ $slot }}
                    </main>
                </div>

            </div>
        </div>
    </body>
</html>
