<x-app-layout>
    <div class="w-full px-4 sm:px-6 md:px-8 py-8">
        <!-- Header -->
        <div class="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2.5 mb-1.5">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <span class="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                        Alpha v0.1
                    </span>
                </div>
                <h1 class="text-3xl font-extrabold tracking-tight text-foreground" style="font-family: var(--font-brand);">Recon Agent</h1>
                <p class="text-sm text-muted-foreground mt-1.5 max-w-2xl">Automated asset discovery, active/passive scanner arrays, and live recon monitoring console.</p>
            </div>
            
            <div class="flex items-center gap-3">
                <span class="text-xs text-muted-foreground/70 font-medium">Coming Soon</span>
                <div class="h-2 w-32 bg-muted/40 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style="width: 75%;"></div>
                </div>
            </div>
        </div>

        <!-- Main Display Grid -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Recon Terminal Monitor -->
            <div class="lg:col-span-2 app-chrome-surface p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] border border-border/40 shadow-xl">
                <!-- Decorative Ambient Glow -->
                <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[30%] -left-[10%] h-[70%] w-[120%] rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl"></div>
                </div>
                
                <div class="flex-1 flex flex-col">
                    <div class="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                <svg class="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-base font-semibold text-foreground">Reconnaissance Terminal</h3>
                                <p class="text-[11px] text-muted-foreground">Console display of mock active background scanners</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span class="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">Radar Active</span>
                        </div>
                    </div>

                    <!-- Scanning Simulation Screen -->
                    <div class="flex-1 bg-black/40 rounded-xl border border-border/30 p-4 font-mono text-[11px] leading-relaxed text-cyan-400/90 overflow-y-auto space-y-2 select-none min-h-[220px]">
                        <div class="text-muted-foreground/60">[SYSTEM INITIALIZING] Loading modular scanner parameters...</div>
                        <div class="text-muted-foreground/60">[CONFIG] Target scope loaded: 0 domains, 0 networks.</div>
                        <div class="flex justify-between items-center bg-cyan-500/5 border border-cyan-500/10 rounded px-2.5 py-1.5 text-cyan-300">
                            <span>Ready to begin scanning runs</span>
                            <span class="animate-pulse">_</span>
                        </div>
                        <div class="pt-2 text-muted-foreground/50 text-center text-xs">
                            - Run customizable scripts under background workers -
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 mt-4 border-t border-border/30">
                    <span class="text-xs text-muted-foreground font-medium">Recon Agent module scheduled for Q3 deployment</span>
                    <button disabled class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 cursor-not-allowed select-none">
                        Launch Initial Scan
                    </button>
                </div>
            </div>

            <!-- Features and Specifications Sidebar -->
            <div class="app-chrome-surface p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-border/40 shadow-xl">
                <div>
                    <h4 class="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-muted-foreground/80">Module Capabilities</h4>
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <span class="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 text-xs">✓</span>
                            <div>
                                <h5 class="text-xs font-semibold text-foreground">Passive Domain Discovery</h5>
                                <p class="text-[11px] text-muted-foreground mt-0.5">Collect subdomains from public APIs and certificate transparency logs.</p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <span class="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 text-xs">✓</span>
                            <div>
                                <h5 class="text-xs font-semibold text-foreground">Port & Service Mapper</h5>
                                <p class="text-[11px] text-muted-foreground mt-0.5">Integration with scanner tools to discover open interfaces and services.</p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <span class="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20 text-xs">⏳</span>
                            <div>
                                <h5 class="text-xs font-semibold text-foreground">Change Monitoring Alerts</h5>
                                <p class="text-[11px] text-muted-foreground mt-0.5">Get notified immediately when new assets or ports are detected on client targets.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-6 border-t border-border/30 mt-6 text-[11px] text-muted-foreground/75 leading-relaxed flex flex-col gap-2">
                    <div class="p-2.5 rounded-lg bg-muted/20 border border-border/30 font-sans">
                        <strong class="text-foreground text-[10px] uppercase font-semibold block mb-1">Developer Notes:</strong>
                        Scans will support distributed run nodes and webhook triggers for continuous automation.
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
