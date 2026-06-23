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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap">

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
                
                const userBg = "{{ Auth::user()->getBackgroundStyle() }}";
                const localBg = localStorage.getItem('background_style');
                const bgStyle = userBg || localBg || 'colourful';
                document.documentElement.setAttribute('data-background-style', bgStyle);
            })();
        </script>

        <style>
            :root {
                --common-bg-image: url("{{ asset('images/task_bg.jpg') }}");
                --font-brand: 'Outfit', 'Plus Jakarta Sans', sans-serif;
            }
        </style>

        <!-- Scripts -->
        @viteReactRefresh
        @vite(array_merge(['resources/css/app.css', 'resources/js/app.js'], $viteScripts ?? []))
    </head>
    <body class="font-sans antialiased min-h-screen bg-background text-foreground">
        <div class="flex min-h-screen w-full bg-transparent"
             x-data="{
                 sidebarPinned: true,
                 sidebarHovered: false,
                 mobileSidebarOpen: false,
                 utilitiesExpanded: {{ request()->routeIs('utilities*') ? 'true' : 'false' }},
                 init() {
                     let storedPinned = localStorage.getItem('sidebar_pinned');
                     this.sidebarPinned = (storedPinned === null || storedPinned === 'true');
                     let storedUtilities = localStorage.getItem('utilities_expanded');
                     if (storedUtilities !== null) {
                         this.utilitiesExpanded = storedUtilities === 'true';
                     }
                 },
                 togglePinned() {
                     this.sidebarPinned = !this.sidebarPinned;
                     localStorage.setItem('sidebar_pinned', this.sidebarPinned);
                 },
                 toggleUtilities() {
                     this.utilitiesExpanded = !this.utilitiesExpanded;
                     localStorage.setItem('utilities_expanded', this.utilitiesExpanded);
                 }
             }">

            <!-- Desktop Sidebar -->
            <aside class="group peer hidden md:block shrink-0 z-30 transition-[width] duration-200 ease-linear"
                   :class="sidebarPinned || sidebarHovered ? 'w-[13.5rem]' : 'w-[3.5rem]'"
                   @mouseenter="if(!sidebarPinned) sidebarHovered = true"
                   @mouseleave="sidebarHovered = false">

                <!-- Fixed panel itself -->
                <div class="fixed inset-y-0 left-0 z-30 h-screen transition-[width] duration-200 ease-linear md:flex bg-transparent"
                     :class="sidebarPinned || sidebarHovered ? 'w-[13.5rem]' : 'w-[3.5rem]'">
                     
                     <div data-sidebar="sidebar" class="app-chrome-surface relative flex h-full w-full flex-col overflow-hidden rounded-none border-y-0 border-l-0 border-r border-border/40">
                          <!-- Ambient Glow -->
                          <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                              <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/10 to-transparent blur-2xl dark:from-blue-900/10 dark:via-indigo-900/5"></div>
                          </div>
                          
                          <!-- Header -->
                          <div class="flex items-center p-3 border-b border-border/40"
                               :class="sidebarPinned || sidebarHovered ? 'justify-between' : 'justify-center'">
                              <a href="{{ route('dashboard') }}" 
                                 class="flex items-center text-decoration-none select-none min-w-0 w-full"
                                 :class="sidebarPinned || sidebarHovered ? '' : 'justify-center'">
                                  <!-- Expanded Full Logo -->
                                  <div x-show="sidebarPinned || sidebarHovered" class="flex items-center">
                                      <img src="{{ asset('images/offsec_light.png') }}" class="h-8 w-auto max-w-[140px] object-contain dark:hidden mix-blend-multiply" alt="Logo">
                                      <img src="{{ asset('images/offsec_dark.png') }}" class="hidden dark:block h-8 w-auto max-w-[140px] object-contain mix-blend-screen" alt="Logo">
                                  </div>
                                  <!-- Collapsed Icon Logo -->
                                  <div x-show="!sidebarPinned && !sidebarHovered" style="display: none;" class="flex items-center justify-center w-full">
                                      <span class="text-sm font-extrabold tracking-wider text-foreground font-display">OSL</span>
                                  </div>
                              </a>
                              
                              <!-- Pin Button -->
                              <button type="button" @click="togglePinned()" class="h-6 w-6 shrink-0 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent" x-show="sidebarPinned || sidebarHovered">
                                  <svg x-show="sidebarPinned" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                      <rect width="18" height="18" x="3" y="3" rx="2" />
                                      <path d="M9 3v16" />
                                      <path d="m16 15-3-3 3-3" />
                                  </svg>
                                  <svg x-show="!sidebarPinned" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                      <rect width="18" height="18" x="3" y="3" rx="2" />
                                      <path d="M9 3v16" />
                                      <path d="m13 15 3-3-3-3" />
                                  </svg>
                              </button>
                          </div>

                          <!-- Navigation Items -->
                          <div class="flex-1 overflow-y-auto px-1.5 py-3 space-y-1">
                              <!-- Dashboard Link -->
                              <a href="{{ route('dashboard') }}" 
                                 class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('dashboard') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                 :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                                  <span x-show="sidebarPinned || sidebarHovered">Dashboard</span>
                              </a>

                              <div class="h-px bg-border/40 my-2"></div>
                              <div class="px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1" x-show="sidebarPinned || sidebarHovered">Apps</div>

                              <!-- Report Creator -->
                              <a href="{{ route('report-creator') }}" 
                                 class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('report-creator') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                 :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  <span x-show="sidebarPinned || sidebarHovered">Report Creator</span>
                              </a>

                              <!-- Recon Agent -->
                              <a href="{{ route('recon-agent') }}" 
                                 class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('recon-agent') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                 :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                  <span x-show="sidebarPinned || sidebarHovered">Recon Agent</span>
                              </a>

                              <!-- Utilities -->
                              <div class="space-y-0.5">
                                  <button type="button" @click="toggleUtilities()" 
                                          class="w-full flex items-center justify-between rounded-lg text-xs font-medium transition-colors text-decoration-none border-0 bg-transparent cursor-pointer {{ request()->routeIs('utilities*') ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                          :class="sidebarPinned || sidebarHovered ? 'px-2.5 py-2' : 'justify-center p-2'">
                                      <div class="flex items-center" :class="sidebarPinned || sidebarHovered ? 'gap-2.5' : 'justify-center'">
                                          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                                          <span x-show="sidebarPinned || sidebarHovered">Utilities</span>
                                      </div>
                                      <svg x-show="sidebarPinned || sidebarHovered" class="w-3 h-3 transition-transform duration-200" :class="utilitiesExpanded ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                                  </button>
                                  
                                  <div x-show="utilitiesExpanded && (sidebarPinned || sidebarHovered)" class="pl-5 space-y-1 mt-0.5 border-l border-border/30 ml-4">
                                      <a href="{{ route('utilities') }}" class="block px-2 py-1 rounded-md text-xs transition-colors text-decoration-none {{ request()->routeIs('utilities') ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground' }}">
                                          Overview
                                      </a>
                                      <a href="{{ route('utilities.testcases') }}" class="block px-2 py-1 rounded-md text-xs transition-colors text-decoration-none {{ request()->routeIs('utilities.testcases') ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground' }}">
                                          Testcases
                                      </a>
                                      <a href="{{ route('utilities.clickjacking') }}" class="block px-2 py-1 rounded-md text-xs transition-colors text-decoration-none {{ request()->routeIs('utilities.clickjacking') ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground' }}">
                                          Clickjacking
                                      </a>
                                  </div>
                              </div>

                              @if(Auth::user()->role === 'admin')
                              <div class="h-px bg-border/40 my-2"></div>
                              <div class="px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1" x-show="sidebarPinned || sidebarHovered">Administration</div>

                              <!-- User Management Link -->
                              <a href="{{ route('admin.users.index') }}" 
                                  class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('admin.users.index') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                  :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                  <span x-show="sidebarPinned || sidebarHovered">User Management</span>
                              </a>

                              <!-- Waitlist Link -->
                              <a href="{{ route('admin.waitlist.index') }}" 
                                  class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('admin.waitlist.index') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                  :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span x-show="sidebarPinned || sidebarHovered">Waitlist</span>
                              </a>
                              @endif

                              <div class="h-px bg-border/40 my-2"></div>
                              <div class="px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1" x-show="sidebarPinned || sidebarHovered">Settings</div>

                              <!-- Profile Link -->
                              <a href="{{ route('profile.edit') }}" 
                                 class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('profile.edit') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                 :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                  <span x-show="sidebarPinned || sidebarHovered">Profile</span>
                              </a>

                              <!-- Appearance Link -->
                              <a href="{{ route('settings.appearance.edit') }}" 
                                 class="flex items-center rounded-lg text-[13px] font-medium transition-colors text-decoration-none {{ request()->routeIs('settings.appearance.edit') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}"
                                 :class="sidebarPinned || sidebarHovered ? 'justify-start gap-2.5 px-2.5 py-2' : 'justify-center p-2'">
                                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3"/></svg>
                                  <span x-show="sidebarPinned || sidebarHovered">Appearance</span>
                              </a>
                          </div>

                          <!-- Footer (Theme/Settings links) -->
                          <div class="p-1.5 border-t border-border/40" x-show="sidebarPinned || sidebarHovered">
                              <!-- Version label and pin toggle -->
                              <div class="flex items-center justify-between px-2.5 py-1 text-[10px] text-muted-foreground/30 font-mono select-none">
                                  <span>v1.106</span>
                                  <svg class="h-3 w-3 opacity-60 hover:opacity-100 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                              </div>
                          </div>
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
                   
                   <div data-sidebar="sidebar" class="app-chrome-surface relative flex h-full w-full flex-col overflow-hidden rounded-2xl">
                         <!-- Ambient Glow -->
                         <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                             <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent blur-2xl"></div>
                         </div>
                         
                         <!-- Header -->
                         <div class="flex items-center justify-between p-3 border-b border-border/40">
                             <!-- Logo -->
                             <a href="{{ route('dashboard') }}" class="flex items-center text-decoration-none select-none">
                                 <img src="{{ asset('images/offsec_light.png') }}" class="h-8 w-auto max-w-[140px] object-contain dark:hidden mix-blend-multiply" alt="Logo">
                                 <img src="{{ asset('images/offsec_dark.png') }}" class="hidden dark:block h-8 w-auto max-w-[140px] object-contain mix-blend-screen" alt="Logo">
                             </a>
                             
                             <!-- Close Button -->
                             <button type="button" @click="mobileSidebarOpen = false" class="h-6 w-6 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                 <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                             </button>
                         </div>

                         <!-- Navigation Items -->
                         <div class="flex-1 overflow-y-auto px-1.5 py-3 space-y-1">
                             <a href="{{ route('dashboard') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('dashboard') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                                 <span>Dashboard</span>
                             </a>

                             <div class="h-px bg-border/40 my-2"></div>
                             <div class="px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1">Apps</div>

                             <!-- Report Creator -->
                             <a href="{{ route('report-creator') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('report-creator') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                 <span>Report Creator</span>
                             </a>

                             <!-- Recon Agent -->
                             <a href="{{ route('recon-agent') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('recon-agent') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                 <span>Recon Agent</span>
                             </a>

                             <!-- Utilities -->
                             <div class="space-y-0.5">
                                 <button type="button" @click="toggleUtilities()" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none border-0 bg-transparent cursor-pointer {{ request()->routeIs('utilities*') ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                     <div class="flex items-center gap-2.5">
                                         <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                                         <span>Utilities</span>
                                     </div>
                                     <svg class="w-3 h-3 transition-transform duration-200" :class="utilitiesExpanded ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                                 </button>
                                 
                                 <div x-show="utilitiesExpanded" class="pl-5 space-y-1 mt-0.5 border-l border-border/30 ml-4">
                                     <a href="{{ route('utilities') }}" class="block px-2 py-1 rounded-md text-[11px] transition-colors text-decoration-none {{ request()->routeIs('utilities') ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground' }}">
                                         Overview
                                     </a>
                                     <a href="{{ route('utilities.testcases') }}" class="block px-2 py-1 rounded-md text-[11px] transition-colors text-decoration-none {{ request()->routeIs('utilities.testcases') ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground' }}">
                                         Testcases
                                     </a>
                                     <a href="{{ route('utilities.clickjacking') }}" class="block px-2 py-1 rounded-md text-[11px] transition-colors text-decoration-none {{ request()->routeIs('utilities.clickjacking') ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground' }}">
                                         Clickjacking
                                     </a>
                                 </div>
                             </div>

                             @if(Auth::user()->role === 'admin')
                             <div class="h-px bg-border/40 my-2"></div>
                             <div class="px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1">Administration</div>

                             <!-- User Management Link -->
                             <a href="{{ route('admin.users.index') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('admin.users.index') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                     <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                 </svg>
                                 <span>User Management</span>
                             </a>

                             <!-- Waitlist Link -->
                             <a href="{{ route('admin.waitlist.index') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('admin.waitlist.index') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                     <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                                 <span>Waitlist</span>
                             </a>
                             @endif

                             <div class="h-px bg-border/40 my-2"></div>
                             <div class="px-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1">Settings</div>

                             <!-- Profile Link -->
                             <a href="{{ route('profile.edit') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('profile.edit') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                 <span>Profile</span>
                             </a>

                             <!-- Appearance Link -->
                             <a href="{{ route('settings.appearance.edit') }}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-decoration-none {{ request()->routeIs('settings.appearance.edit') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground' }}">
                                 <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3"/></svg>
                                 <span>Appearance</span>
                             </a>
                         </div>

                         <!-- Footer (Theme/Settings links) -->
                         <div class="p-1.5 border-t border-border/40">
                             <div class="flex items-center justify-center py-1 text-[10px] text-muted-foreground/30 font-mono select-none">
                                 <span>v1.106</span>
                             </div>
                         </div>
                   </div>
            </aside>

            <!-- Main Inner Container -->
            <div class="flex-grow min-w-0 flex flex-col transition-all duration-200 ease-linear">

                  <!-- Full-Width Header/Navbar -->
                  <header class="header-safe app-chrome-surface sticky top-0 z-40 w-full flex flex-row items-center gap-1.5 px-4 md:h-12 md:min-h-12 md:max-h-12 md:flex-nowrap md:gap-2 md:py-0 border-t-0 border-x-0 border-b border-border/40 rounded-none bg-background/80">
                     <!-- Mobile Sidebar Trigger -->
                     <button type="button" @click="mobileSidebarOpen = true" class="h-8 w-8 shrink-0 rounded-lg border border-border/40 bg-background/50 flex items-center justify-center md:hidden text-muted-foreground hover:text-foreground cursor-pointer">
                         <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v16" /></svg>
                     </button>
                     
                     <!-- Mobile Brand Logo -->
                     <div class="flex items-center md:hidden">
                         <img src="{{ asset('images/offsec_light.png') }}" class="h-[26px] w-auto max-w-[110px] object-contain dark:hidden mix-blend-multiply" alt="Logo">
                         <img src="{{ asset('images/offsec_dark.png') }}" class="hidden dark:block h-[26px] w-auto max-w-[110px] object-contain mix-blend-screen" alt="Logo">
                     </div>

                     <!-- Desktop Left: Search bar, App switcher and Clock -->
                     <div class="hidden md:flex items-center gap-3 min-w-0 flex-1">
                         <!-- App Switcher Dropdown -->
                         <div class="relative" x-data="{ open: false }">
                             <button @click.stop="open = !open" class="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted/50 flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                             </button>
                             <div x-show="open" @click.outside="open = false"
                                  x-transition:enter="transition ease-out duration-150"
                                  x-transition:enter-start="opacity-0 translate-y-[-6px]"
                                  x-transition:enter-end="opacity-100 translate-y-0"
                                  x-transition:leave="transition ease-in duration-100"
                                  x-transition:leave-start="opacity-100 translate-y-0"
                                  x-transition:leave-end="opacity-0 translate-y-[-6px]"
                                  class="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-border/50 bg-popover text-popover-foreground p-1.5 shadow-xl z-[100] space-y-0.5" style="display: none;">
                                 <div class="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground/75 uppercase tracking-wider">Launch Module</div>
                                 <a href="{{ route('dashboard') }}" class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">
                                     <svg class="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg> Dashboard
                                 </a>
                                 <a href="{{ route('report-creator') }}" class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">
                                     <svg class="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Report Creator
                                 </a>
                                 <a href="{{ route('recon-agent') }}" class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">
                                     <svg class="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Recon Agent
                                 </a>
                                 <a href="{{ route('utilities') }}" class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">
                                     <svg class="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> Utilities
                                 </a>
                             </div>
                         </div>
                         
                         <!-- Search bar -->
                         <div class="relative max-w-sm w-64 min-w-0" x-data="{
                             focusSearch(e) {
                                 if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                                     e.preventDefault();
                                     this.$refs.searchInput.focus();
                                 }
                             }
                         }" @keydown.window="focusSearch">
                             <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground/60">
                                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                             </span>
                             <input x-ref="searchInput" type="text" placeholder="Search..." class="w-full h-8 pl-8 pr-10 rounded-lg border-0 bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/20">
                             <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                 <kbd class="inline-flex h-4 items-center rounded border border-border/40 bg-muted/50 px-1 font-mono text-[10px] font-medium text-muted-foreground/70">
                                     <span class="text-[9px] mr-0.5">⌘</span>K
                                 </kbd>
                             </div>
                         </div>

                         <!-- Clock / DateTime Component (Desktop) -->
                         <div class="hidden md:flex min-w-0 shrink-0 items-center gap-2 rounded-lg bg-muted/25 px-2 py-1 select-none"
                              x-data="{
                                  now: new Date(),
                                  init() {
                                      setInterval(() => { this.now = new Date() }, 1000);
                                  },
                                  getDayName() {
                                      return this.now.toLocaleDateString('en-US', { weekday: 'long' });
                                  },
                                  getDate() {
                                      return this.now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                  },
                                  getTimeParts() {
                                      let time = this.now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
                                      let parts = time.match(/^(\d{1,2}:\d{2}):(\d{2})\s*(AM|PM)$/i);
                                      return parts ? { main: parts[1], sec: parts[2], period: parts[3] } : { main: time, sec: '', period: '' };
                                  }
                              }">
                              <div class="flex min-w-0 items-center gap-1.5">
                                  <svg class="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                  <div class="flex min-w-0 items-baseline gap-1.5 truncate">
                                      <span class="truncate text-xs font-semibold tracking-tight text-foreground" x-text="getDayName()"></span>
                                      <span class="hidden truncate text-xs font-medium text-muted-foreground xl:inline" x-text="getDate()"></span>
                                  </div>
                              </div>
                              <div class="h-3.5 w-px shrink-0 bg-border/60"></div>
                              <div class="flex items-center gap-1.5">
                                  <svg class="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  <div class="flex items-baseline gap-0.5 tabular-nums">
                                      <span class="text-xs font-semibold tracking-tight text-foreground" x-text="getTimeParts().main"></span>
                                      <span class="text-[10px] font-medium text-muted-foreground/60" x-text="':' + getTimeParts().sec"></span>
                                      <span class="ml-0.5 text-[10px] font-semibold uppercase text-muted-foreground" x-text="getTimeParts().period"></span>
                                  </div>
                              </div>
                         </div>
                     </div>

                     <!-- Right Actions: Theme Toggler, Bell, User Dropdown, Logout -->
                     <div class="ml-auto flex items-center gap-2">

                         <!-- Theme Toggler -->
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
                                                 'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                             },
                                             body: JSON.stringify({
                                                 theme: this.theme,
                                                 background_style: document.documentElement.getAttribute('data-background-style') || 'colourful'
                                             })
                                         });
                                     }
                                 }"
                                 @click="toggle()"
                                 class="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer focus:outline-none border-0 bg-transparent">
                             <svg x-show="theme === 'dark'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                             <svg x-show="theme === 'light'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                         </button>

                         <!-- Notifications Bell -->
                         <div class="relative" x-data="{
                             open: false,
                             notifications: [],
                             unreadCount: 0,
                             loading: false,
                             init() {
                                 this.fetchUnreadCount();
                                 this.fetchRecent();
                                 // Poll every 30 seconds
                                 setInterval(() => {
                                     this.fetchUnreadCount();
                                     if (this.open) {
                                         this.fetchRecent();
                                     }
                                 }, 30000);
                             },
                             fetchUnreadCount() {
                                 fetch('{{ route('dashboard.notifications.unread-count') }}')
                                     .then(res => res.json())
                                     .then(data => {
                                         this.unreadCount = data.count;
                                     });
                             },
                             fetchRecent() {
                                 this.loading = true;
                                 fetch('{{ route('dashboard.notifications.recent') }}')
                                     .then(res => res.json())
                                     .then(data => {
                                         this.notifications = data.notifications;
                                         this.loading = false;
                                     });
                             },
                             toggle() {
                                 this.open = !this.open;
                                 if (this.open) {
                                     this.fetchRecent();
                                 }
                             },
                             markAllRead() {
                                 fetch('{{ route('dashboard.notifications.read-all') }}', {
                                     method: 'POST',
                                     headers: {
                                         'X-CSRF-TOKEN': '{{ csrf_token() }}',
                                         'Accept': 'application/json'
                                     }
                                 }).then(() => {
                                     this.unreadCount = 0;
                                     this.notifications.forEach(n => n.is_read = true);
                                 });
                             },
                             markRead(id) {
                                 fetch(`/dashboard/notifications/${id}/read`, {
                                     method: 'POST',
                                     headers: {
                                         'X-CSRF-TOKEN': '{{ csrf_token() }}',
                                         'Accept': 'application/json'
                                     }
                                 }).then(() => {
                                     this.fetchUnreadCount();
                                     let n = this.notifications.find(item => item.id === id);
                                     if (n) n.is_read = true;
                                 });
                             }
                         }">
                             <button type="button" @click.stop="toggle()" class="relative h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted/50 flex items-center justify-center cursor-pointer focus:outline-none border-0 bg-transparent">
                                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                 <template x-if="unreadCount > 0">
                                     <span class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white leading-none" x-text="unreadCount > 99 ? '99+' : unreadCount"></span>
                                 </template>
                             </button>

                             <div x-show="open" @click.outside="open = false"
                                  x-transition:enter="transition ease-out duration-150"
                                  x-transition:enter-start="opacity-0 translate-y-[-6px]"
                                  x-transition:enter-end="opacity-100 translate-y-0"
                                  x-transition:leave="transition ease-in duration-100"
                                  x-transition:leave-start="opacity-100 translate-y-0"
                                  x-transition:leave-end="opacity-0 translate-y-[-6px]"
                                  class="absolute right-0 top-full mt-1.5 w-80 rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-xl z-[100] p-0 overflow-hidden" style="display: none;">
                                 <div class="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
                                     <h4 class="text-xs font-semibold text-foreground">Notifications</h4>
                                     <template x-if="unreadCount > 0">
                                         <button @click="markAllRead()" class="h-auto px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors border-0 bg-transparent cursor-pointer">
                                             Mark all read
                                         </button>
                                     </template>
                                 </div>

                                 <div class="max-h-72 overflow-y-auto overlay-scrollbar">
                                     <template x-if="loading">
                                         <div class="p-4 text-center text-xs text-muted-foreground select-none">
                                             Loading...
                                         </div>
                                     </template>
                                     <template x-if="!loading && notifications.length === 0">
                                         <div class="p-4 text-center text-xs text-muted-foreground select-none">
                                             No notifications
                                         </div>
                                     </template>
                                     <template x-if="!loading">
                                         <div class="divide-y divide-border/20">
                                             <template x-for="n in notifications" :key="n.id">
                                                 <div class="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/40 cursor-pointer"
                                                      :class="!n.is_read ? 'bg-muted/15' : ''"
                                                      @click="
                                                          if (!n.is_read) markRead(n.id);
                                                          if (n.action_url) window.location.href = n.action_url;
                                                      ">
                                                     <div class="flex items-center justify-between gap-2">
                                                         <div class="flex items-center gap-1.5 min-w-0">
                                                             <span class="text-muted-foreground shrink-0">
                                                                 <template x-if="n.category === 'security'">
                                                                     <svg class="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m0-6h.01M12 21a9 9 0 01-9-9V6.162l9-3.125 9 3.125V12a9 9 0 01-9 9z"/></svg>
                                                                 </template>
                                                                 <template x-if="n.category === 'system'">
                                                                     <svg class="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 01-2-2v4a2 2 0 012-2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                                                                 </template>
                                                                 <template x-if="n.category !== 'security' && n.category !== 'system'">
                                                                     <svg class="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                                 </template>
                                                             </span>
                                                             <span class="text-xs font-semibold text-foreground truncate" :class="!n.is_read ? 'font-bold' : ''" x-text="n.title"></span>
                                                         </div>
                                                         <template x-if="!n.is_read">
                                                             <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
                                                         </template>
                                                     </div>
                                                     <p class="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed" x-text="n.message"></p>
                                                     <span class="text-[10px] text-muted-foreground/60" x-text="n.time_ago"></span>
                                                 </div>
                                             </template>
                                         </div>
                                     </template>
                                 </div>

                                 <div class="border-t border-border/40 px-4 py-2 text-center bg-muted/10">
                                     <a href="{{ route('dashboard.notifications.index') }}" class="text-[10px] font-medium text-muted-foreground hover:text-foreground text-decoration-none">
                                         View all notifications
                                     </a>
                                 </div>
                             </div>
                         </div>

                         <!-- User Dropdown (Navbar Desktop) -->
                         <div class="relative" x-data="{ navDropdownOpen: false }">
                             <button @click.stop="navDropdownOpen = !navDropdownOpen" class="flex h-8 w-8 items-center justify-center rounded-lg ring-offset-background transition-all hover:bg-muted/50 focus:outline-none border-0 bg-transparent cursor-pointer" aria-label="User menu">
                                 <div class="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 select-none">
                                     {{ strtoupper(substr(Auth::user()->name, 0, 2)) }}
                                 </div>
                             </button>
                             <div x-show="navDropdownOpen" @click.outside="navDropdownOpen = false"
                                  x-transition:enter="transition ease-out duration-150"
                                  x-transition:enter-start="opacity-0 translate-y-[-6px]"
                                  x-transition:enter-end="opacity-100 translate-y-0"
                                  x-transition:leave="transition ease-in duration-100"
                                  x-transition:leave-start="opacity-100 translate-y-0"
                                  x-transition:leave-end="opacity-0 translate-y-[-6px]"
                                  class="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-border/50 bg-popover text-popover-foreground p-1.5 shadow-xl z-[100] space-y-0.5" style="display: none;">
                                 <!-- User info header -->
                                 <div class="flex items-center gap-2 px-2.5 py-1.5 border-b border-border/40 select-none">
                                     <div class="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                         {{ strtoupper(substr(Auth::user()->name, 0, 2)) }}
                                     </div>
                                     <div class="flex flex-col min-w-0">
                                         <span class="text-xs font-semibold text-foreground truncate">{{ Auth::user()->name }}</span>
                                         <span class="text-[10px] text-muted-foreground truncate">{{ Auth::user()->email }}</span>
                                     </div>
                                 </div>
                                 <a href="{{ route('profile.edit') }}" class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">
                                     <svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> Profile
                                 </a>
                                 <a href="{{ route('settings.appearance.edit') }}" class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-muted/40 transition-colors text-decoration-none text-foreground">
                                     <svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3"/></svg> Appearance
                                 </a>
                                 <div class="h-px bg-border/40 my-1"></div>
                                 <form method="POST" action="{{ route('logout') }}" class="m-0">
                                     @csrf
                                     <button type="submit" class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left border-0 bg-transparent cursor-pointer">
                                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                             <polyline points="16 17 21 12 16 7" />
                                             <line x1="21" y1="12" x2="9" y2="12" />
                                         </svg>
                                         Log out
                                     </button>
                                 </form>
                             </div>
                         </div>

                          <!-- Fast Logout Button (Glow Button from Lifestack) -->
                          <div class="hidden md:flex items-center pl-1 ml-0.5 border-l border-border/40">
                              <form method="POST" action="{{ route('logout') }}" class="m-0">
                                  @csrf
                                  <button type="submit" 
                                          style="--glow-color: rgba(255, 68, 68, 1); --glow-color-via: rgba(255, 68, 68, 0.075); --glow-color-to: rgba(255, 68, 68, 0.2);"
                                          class="h-8 px-5 text-xs rounded-lg border flex items-center justify-center relative transition-colors overflow-hidden bg-gradient-to-t border-r-0 duration-200 whitespace-nowrap from-background to-muted text-muted-foreground hover:text-foreground border-border hover:after:inset-0 hover:after:absolute hover:after:rounded-[inherit] hover:after:bg-gradient-to-r hover:after:from-transparent hover:after:from-40% hover:after:via-[var(--glow-color-via)] hover:after:to-[var(--glow-color-to)] hover:after:via-70% hover:after:shadow-[hsl(var(--foreground)/0.15)_0px_1px_0px_inset] z-20 before:absolute before:w-[5px] before:translate-x-full hover:before:translate-x-0 before:transition-all before:duration-200 before:h-[60%] before:bg-[var(--glow-color)] before:right-0 before:rounded-l before:shadow-[-2px_0_10px_var(--glow-color)] z-10 cursor-pointer focus:outline-none flex items-center gap-1">
                                      <svg class="h-3.5 w-3.5 z-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                          <polyline points="16 17 21 12 16 7" />
                                          <line x1="21" y1="12" x2="9" y2="12" />
                                      </svg>
                                      <span class="font-semibold z-30 hidden lg:inline">Log out</span>
                                  </button>
                              </form>
                          </div>
                     </div>
                 </header>

                 <!-- Page Content shell -->
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
    </body>
</html>
