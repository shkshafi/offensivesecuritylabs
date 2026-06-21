<x-app-layout>
    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold tracking-tight text-foreground" style="font-family: var(--font-brand);">Recon Agent</h1>
            <p class="text-sm text-muted-foreground mt-1">Automate active and passive reconnaissance modules, port scanning, and host discovery.</p>
        </div>

        <!-- Coming Soon Shell Layout -->
        <div class="grid gap-6 md:grid-cols-3">
            <div class="md:col-span-2 app-chrome-surface p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-transparent blur-3xl" />
                </div>
                <div>
                    <div class="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h3 class="text-lg font-semibold text-foreground">Reconnaissance Suite</h3>
                    <p class="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
                        This module will serve as the console for active and passive recon runs. You will be able to start sub-domain enumerators, catalog assets, map target host services, and check logs.
                    </p>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-cyan-400 font-medium pt-4">
                    App Developer Workspace <span class="text-muted-foreground/60">• Pending Custom Implementation</span>
                </div>
            </div>

            <!-- Sidebar Info Panel -->
            <div class="app-chrome-surface p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div>
                    <h4 class="text-sm font-semibold text-foreground mb-4">Module Setup</h4>
                    <ul class="space-y-3 text-xs text-muted-foreground">
                        <li class="flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Tailwind & CSS setup initialized</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Full-height adaptive dashboard grid</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                            <span>Alpine.js reactivity configured</span>
                        </li>
                    </ul>
                </div>
                <div class="pt-4 border-t border-border/50 text-[11px] text-muted-foreground/75 leading-relaxed">
                    Custom scanner scripts can hook into a background queue and stream findings back to the browser using WebSockets.
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
