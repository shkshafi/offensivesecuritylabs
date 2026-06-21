<x-app-layout>
    @php
        $hour = date('H');
        $greeting = 'Good morning';
        if ($hour >= 12 && $hour < 17) {
            $greeting = 'Good afternoon';
        } elseif ($hour >= 17) {
            $greeting = 'Good evening';
        }
    @endphp

    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8 space-y-6">
        <header class="pt-0.5">
            <h1 class="text-2xl font-bold tracking-tight sm:text-[1.75rem] sm:leading-tight">
                <span class="app-page-title-gradient">
                    {{ $greeting }}, {{ explode(' ', Auth::user()->name)[0] }}
                </span>
            </h1>
        </header>

        <div class="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px] xl:gap-5 2xl:grid-cols-[1fr_300px]">
            <!-- Left Column: Applications Section -->
            <section class="min-w-0 space-y-4">
                <div class="flex items-center justify-between gap-3 border-b border-border/30 pb-3">
                    <h2 class="text-xs font-semibold tracking-wide uppercase text-muted-foreground/60">Applications</h2>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                    <!-- App 1: Recon Agent -->
                    <a href="{{ route('recon-agent') }}" class="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <div class="relative flex h-full flex-col gap-3 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-border/70 hover:bg-card/70 min-h-[120px]">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex min-w-0 items-center gap-2.5">
                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50/60 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400">
                                        <svg class="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                    </div>
                                    <h3 class="truncate text-sm font-medium text-foreground">Recon Agent</h3>
                                </div>
                                <svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                            </div>
                            <div class="mt-auto flex min-w-0 flex-col gap-0.5">
                                <p class="truncate text-sm font-semibold tracking-tight text-foreground">8 active targets</p>
                                <div class="truncate text-xs text-muted-foreground">
                                    <span class="text-purple-400 font-semibold">2 scans running</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    <!-- App 2: Report Creator -->
                    <a href="{{ route('report-creator') }}" class="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <div class="relative flex h-full flex-col gap-3 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-border/70 hover:bg-card/70 min-h-[120px]">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex min-w-0 items-center gap-2.5">
                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
                                        <svg class="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    </div>
                                    <h3 class="truncate text-sm font-medium text-foreground">Report Creator</h3>
                                </div>
                                <svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                            </div>
                            <div class="mt-auto flex min-w-0 flex-col gap-0.5">
                                <p class="truncate text-sm font-semibold tracking-tight text-foreground">5 drafts generated</p>
                                <div class="truncate text-xs text-muted-foreground">
                                    <span class="text-emerald-500 font-semibold">Vite asset bundling enabled</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    <!-- App 3: Utilities -->
                    <a href="{{ route('utilities') }}" class="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <div class="relative flex h-full flex-col gap-3 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-border/70 hover:bg-card/70 min-h-[120px]">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex min-w-0 items-center gap-2.5">
                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50/60 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400">
                                        <svg class="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </div>
                                    <h3 class="truncate text-sm font-medium text-foreground">Utilities</h3>
                                </div>
                                <svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                            </div>
                            <div class="mt-auto flex min-w-0 flex-col gap-0.5">
                                <p class="truncate text-sm font-semibold tracking-tight text-foreground">12 custom tools</p>
                                <div class="truncate text-xs text-muted-foreground">
                                    <span class="text-cyan-400 font-semibold">Payload encoder/decoder</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </section>

            <!-- Right Column: Sidebar Live Session Logs -->
            <section class="space-y-4">
                <div class="flex items-center justify-between gap-3 border-b border-border/30 pb-3">
                    <h2 class="text-xs font-semibold tracking-wide uppercase text-muted-foreground/60">Session Logs</h2>
                </div>

                <div class="space-y-3 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm">
                    <p class="mb-2 flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground select-none">
                        <svg class="h-3.5 w-3.5 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>Live Session Logs</span>
                    </p>
                    
                    <div class="space-y-3 font-mono text-xs">
                        <div class="flex flex-col gap-1 rounded-lg bg-muted/20 p-2.5 border border-border/10">
                            <span class="text-purple-400 font-semibold">[14:24:08]</span>
                            <span class="text-muted-foreground leading-relaxed">User logged in from IP 192.168.1.142 (Firefox macOS)</span>
                        </div>
                        <div class="flex flex-col gap-1 rounded-lg bg-muted/20 p-2.5 border border-border/10">
                            <span class="text-emerald-400 font-semibold">[12:10:45]</span>
                            <span class="text-muted-foreground leading-relaxed">Recon sweep completed for target: <strong class="text-foreground">internal-dc.local</strong></span>
                        </div>
                        <div class="flex flex-col gap-1 rounded-lg bg-muted/20 p-2.5 border border-border/10">
                            <span class="text-blue-400 font-semibold">[09:05:12]</span>
                            <span class="text-muted-foreground leading-relaxed">PDF Report exported: <strong class="text-foreground">OffSec_Internal_Audit_Q2.pdf</strong></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</x-app-layout>
