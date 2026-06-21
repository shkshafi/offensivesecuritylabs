<x-app-layout>
    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold tracking-tight text-foreground" style="font-family: var(--font-brand);">Utilities</h1>
            <p class="text-sm text-muted-foreground mt-1">Access secondary pentest tooling, payload encoding/decoding, and scripting utilities.</p>
        </div>

        <!-- Coming Soon Shell Layout -->
        <div class="grid gap-6 md:grid-cols-3">
            <div class="md:col-span-2 app-chrome-surface p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                </div>
                <div>
                    <div class="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <h3 class="text-lg font-semibold text-foreground">Pentesting Utilities</h3>
                    <p class="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
                        This module will group quick-access helper scripts. You will be able to perform URL encoding/decoding, Base64 translations, reverse shell syntax generation, and custom regex pattern matches.
                    </p>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-violet-400 font-medium pt-4">
                    App Developer Workspace <span class="text-muted-foreground/60">• Pending Custom Implementation</span>
                </div>
            </div>

            <!-- Sidebar Info Panel -->
            <div class="app-chrome-surface p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div>
                    <h4 class="text-sm font-semibold text-foreground mb-4">Utility Setup</h4>
                    <ul class="space-y-3 text-xs text-muted-foreground">
                        <li class="flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Tailwind classes configured</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Glass-card layout styling applied</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                            <span>Responsive desktop/mobile structure</span>
                        </li>
                    </ul>
                </div>
                <div class="pt-4 border-t border-border/50 text-[11px] text-muted-foreground/75 leading-relaxed">
                    Custom utility helpers can be loaded dynamically in this view using local browser storage or basic backend endpoints.
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
