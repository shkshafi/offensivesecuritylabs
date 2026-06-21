<x-app-layout>
    <div class="w-full px-4 sm:px-6 md:px-8 py-8">
        <!-- Header -->
        <div class="mb-10">
            <h1 class="text-3xl font-extrabold tracking-tight text-foreground" style="font-family: var(--font-brand);">Coming Soon</h1>
            <p class="text-sm text-muted-foreground mt-1.5 max-w-2xl">This module is scheduled for future deployment. Developer workspace pending custom implementation.</p>
        </div>

        <!-- Main Card -->
        <div class="app-chrome-surface p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px] border border-border/40 shadow-xl max-w-3xl">
            <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl"></div>
            </div>
            <div>
                <div class="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-foreground">Module Development Workspace</h3>
                <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
                    This page serves as a placeholder. We will be building custom offensive security tooling, logs viewer, and agent management features here.
                </p>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-primary font-medium pt-4 border-t border-border/20 mt-6">
                OffSec Labs Master Layout <span class="text-muted-foreground/60">• Integrated Theme Configured</span>
            </div>
        </div>
    </div>
</x-app-layout>
