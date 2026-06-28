<x-app-layout>
    <div class="w-full px-4 md:px-6 py-6 space-y-6">
        <div class="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px] xl:gap-5 2xl:grid-cols-[1fr_300px]">
            <!-- Left Column: Report Creator Workspace -->
            <section class="min-w-0 space-y-5">
                <!-- Workspace Hero Banner -->
                <div class="relative overflow-hidden rounded-[8px] border border-border bg-card p-6 shadow-sm">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div class="space-y-2 max-w-xl">
                            <div class="inline-flex items-center gap-1.5 rounded-[4px] bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20 uppercase tracking-wider">
                                Active Module
                            </div>
                            <h2 class="text-xl font-bold tracking-tight text-foreground">
                                Report Creator Workspace
                            </h2>
                            <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                Professional penetration testing reporting system. Write comprehensive security findings, calculate CVSS scores, and generate client-ready PDF deliverables inside a structured, state-of-the-art console.
                            </p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2.5 shrink-0">
                            <a href="{{ route('report-creator') }}" class="inline-flex items-center justify-center rounded-[6px] bg-primary hover:bg-primary/95 text-white font-medium text-xs px-4 h-9 transition-all text-decoration-none">
                                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                Launch Reports
                            </a>
                            <a href="{{ route('report-creator.templates') }}" class="inline-flex items-center justify-center rounded-[6px] border border-border bg-muted/40 hover:bg-muted/70 text-foreground font-medium text-xs px-4 h-9 transition-all text-decoration-none">
                                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                Manage Templates
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Sub-grid: Stats & Activities -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Report Creator Overview -->
                    <div class="rounded-[8px] border border-border bg-card p-5 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-border pb-3">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                                <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                                Reports Dashboard
                            </h3>
                            <span class="text-[10px] font-mono bg-success/10 text-success px-2 py-0.5 rounded-[4px] border border-success/20 font-semibold">Active</span>
                        </div>
                        <div class="grid grid-cols-3 gap-3 text-center">
                            <div class="rounded-[6px] bg-muted/30 p-2.5 border border-border">
                                <div class="text-lg font-bold text-foreground">5</div>
                                <div class="text-[10px] text-muted-foreground uppercase font-semibold">Drafts</div>
                            </div>
                            <div class="rounded-[6px] bg-muted/30 p-2.5 border border-border">
                                <div class="text-lg font-bold text-warning">1</div>
                                <div class="text-[10px] text-muted-foreground uppercase font-semibold">In Review</div>
                            </div>
                            <div class="rounded-[6px] bg-muted/30 p-2.5 border border-border">
                                <div class="text-lg font-bold text-success">3</div>
                                <div class="text-[10px] text-muted-foreground uppercase font-semibold">Finalised</div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-[10px] font-semibold text-muted-foreground/75 uppercase tracking-wider">Recent Reports</div>
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between text-xs p-2 rounded-[4px] border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <span class="text-foreground font-medium truncate max-w-[200px]">Omni Consu-Portal Ext Pentest</span>
                                    <span class="text-muted-foreground/75 font-mono text-[10px]">1.0 • Draft</span>
                                </div>
                                <div class="flex items-center justify-between text-xs p-2 rounded-[4px] border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <span class="text-foreground font-medium truncate max-w-[200px]">Active Directory Infrastructure Audit</span>
                                    <span class="text-muted-foreground/75 font-mono text-[10px]">0.8 • In Review</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Template Management -->
                    <div class="rounded-[8px] border border-border bg-card p-5 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-border pb-3">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                                <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                Templates & Styles
                            </h3>
                            <span class="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-[4px] border border-primary/20 font-semibold">Standardized</span>
                        </div>
                        <div class="space-y-3.5">
                            <div class="flex items-start gap-2.5 text-xs">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-primary/10 text-primary mt-0.5">
                                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <div>
                                    <div class="font-semibold text-foreground">Default HTML Template Active</div>
                                    <div class="text-muted-foreground text-[11px] leading-relaxed">Integrated Executive Summary, Technical Details, and CVSS finding layout.</div>
                                </div>
                            </div>
                            <div class="flex items-start gap-2.5 text-xs">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-primary/10 text-primary mt-0.5">
                                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <div>
                                    <div class="font-semibold text-foreground">PDF Exporter Loaded</div>
                                    <div class="text-muted-foreground text-[11px] leading-relaxed">Puppeteer asset bundling active with page numbering and margins configured.</div>
                                </div>
                            </div>
                        </div>
                        <div class="pt-1">
                            <a href="{{ route('report-creator.templates') }}" class="inline-flex w-full items-center justify-center rounded-[6px] border border-border bg-muted/40 hover:bg-muted/70 px-3 h-8 text-xs font-medium text-foreground transition-colors text-decoration-none">
                                Open Template Editor <svg class="ml-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Right Column: Sidebar Live Session Logs -->
            <section class="space-y-4">
                <div class="flex items-center justify-between gap-3 border-b border-border/60 pb-1.5">
                    <h2 class="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80">Console Feed</h2>
                </div>

                <div class="space-y-3 rounded-[8px] border border-border bg-card p-4 shadow-sm">
                    <p class="mb-1 flex items-center gap-1.5 text-xs font-semibold text-foreground select-none">
                        <svg class="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>Live Session Logs</span>
                    </p>
                    
                    <div class="space-y-2.5 font-mono text-[11px]">
                        <div class="flex flex-col gap-1 rounded-[6px] bg-muted/30 p-2.5 border border-border">
                            <span class="text-primary font-semibold">[14:24:08]</span>
                            <span class="text-muted-foreground leading-normal">User logged in from IP 192.168.1.142 (Firefox macOS)</span>
                        </div>
                        <div class="flex flex-col gap-1 rounded-[6px] bg-muted/30 p-2.5 border border-border">
                            <span class="text-success font-semibold">[12:10:45]</span>
                            <span class="text-muted-foreground leading-normal">Draft report created for target: <strong class="text-foreground font-medium">internal-dc.local</strong></span>
                        </div>
                        <div class="flex flex-col gap-1 rounded-[6px] bg-muted/30 p-2.5 border border-border">
                            <span class="text-info font-semibold">[09:05:12]</span>
                            <span class="text-muted-foreground leading-normal">PDF Report exported: <strong class="text-foreground font-medium">OffSec_Internal_Audit_Q2.pdf</strong></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</x-app-layout>
