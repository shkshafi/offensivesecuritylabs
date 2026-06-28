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
            <!-- Left Column: Report Creator Workspace -->
            <section class="min-w-0 space-y-5">
                <!-- Workspace Hero Banner -->
                <div class="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-indigo-950/40 via-slate-900/50 to-slate-900/40 p-6 md:p-8 backdrop-blur-md shadow-xl">
                    <!-- Subtle Ambient Light -->
                    <div class="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl"></div>
                    <div class="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl"></div>
                    
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div class="space-y-3 max-w-xl">
                            <div class="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                                Active Module
                            </div>
                            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-brand">
                                Report Creator Workspace
                            </h2>
                            <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
                                Professional penetration testing reporting system. Write comprehensive security findings, calculate CVSS scores, and generate client-ready PDF deliverables inside a structured, state-of-the-art console.
                            </p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3 shrink-0">
                            <a href="{{ route('report-creator') }}" class="inline-flex items-center justify-center rounded-xl bg-primary px-4.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-decoration-none">
                                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                Launch Reports
                            </a>
                            <a href="{{ route('report-creator.templates') }}" class="inline-flex items-center justify-center rounded-xl border border-border/80 bg-background/50 px-4.5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring text-decoration-none">
                                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                Manage Templates
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Sub-grid: Stats & Activities -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Report Creator Overview -->
                    <div class="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-border/20 pb-3">
                            <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
                                <svg class="h-4.5 w-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                                Reports Dashboard
                            </h3>
                            <span class="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Active</span>
                        </div>
                        <div class="grid grid-cols-3 gap-3 text-center">
                            <div class="rounded-lg bg-muted/20 p-2.5 border border-border/10">
                                <div class="text-xl font-bold text-foreground">5</div>
                                <div class="text-[10px] text-muted-foreground uppercase font-medium">Drafts</div>
                            </div>
                            <div class="rounded-lg bg-muted/20 p-2.5 border border-border/10">
                                <div class="text-xl font-bold text-amber-500">1</div>
                                <div class="text-[10px] text-muted-foreground uppercase font-medium">In Review</div>
                            </div>
                            <div class="rounded-lg bg-muted/20 p-2.5 border border-border/10">
                                <div class="text-xl font-bold text-emerald-500">3</div>
                                <div class="text-[10px] text-muted-foreground uppercase font-medium">Finalised</div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">Recent Reports</div>
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between text-xs p-2 rounded bg-muted/10 hover:bg-muted/20 transition-colors">
                                    <span class="text-foreground font-medium truncate max-w-[200px]">Omni Consu-Portal Ext Pentest</span>
                                    <span class="text-muted-foreground/70 shrink-0 font-mono">1.0 • Draft</span>
                                </div>
                                <div class="flex items-center justify-between text-xs p-2 rounded bg-muted/10 hover:bg-muted/20 transition-colors">
                                    <span class="text-foreground font-medium truncate max-w-[200px]">Active Directory Infrastructure Audit</span>
                                    <span class="text-muted-foreground/70 shrink-0 font-mono">0.8 • In Review</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Template Management -->
                    <div class="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-border/20 pb-3">
                            <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
                                <svg class="h-4.5 w-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                Templates & Styles
                            </h3>
                            <span class="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">Standardized</span>
                        </div>
                        <div class="space-y-3.5">
                            <div class="flex items-start gap-2.5 text-xs">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 mt-0.5">
                                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <div>
                                    <div class="font-semibold text-foreground">Default HTML Template Active</div>
                                    <div class="text-muted-foreground text-[11px] leading-relaxed">Integrated Executive Summary, Technical Details, and CVSS finding layout.</div>
                                </div>
                            </div>
                            <div class="flex items-start gap-2.5 text-xs">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 mt-0.5">
                                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <div>
                                    <div class="font-semibold text-foreground">PDF Exporter Loaded</div>
                                    <div class="text-muted-foreground text-[11px] leading-relaxed">Puppeteer asset bundling active with page numbering and margins configured.</div>
                                </div>
                            </div>
                        </div>
                        <div class="pt-1">
                            <a href="{{ route('report-creator.templates') }}" class="inline-flex w-full items-center justify-center rounded-lg bg-muted/30 px-3 py-2 text-xs font-semibold text-foreground border border-border/30 hover:bg-muted/50 transition-colors text-decoration-none">
                                Open Template Editor <svg class="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </a>
                        </div>
                    </div>
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
                            <span class="text-muted-foreground leading-relaxed">Draft report created for target: <strong class="text-foreground">internal-dc.local</strong></span>
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
