<x-app-layout>
    <div class="w-full px-4 sm:px-6 md:px-8 py-8">
        <!-- Header -->
        <div class="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-foreground" style="font-family: var(--font-brand);">Vulnerability Testcases</h1>
                <p class="text-sm text-muted-foreground mt-1.5 max-w-2xl">Manage, structure, and download standard security test case templates and verification scenarios.</p>
            </div>
            
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground/60 select-none">Utility Module</span>
                <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            </div>
        </div>

        <!-- Quick Stats Banner -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div class="app-chrome-surface p-4 rounded-xl border border-border/40 flex items-center gap-3.5 shadow-sm">
                <div class="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">12</div>
                <div>
                    <div class="text-[10px] uppercase font-semibold text-muted-foreground/75 tracking-wider">Web App Scenarios</div>
                    <div class="text-xs font-bold text-foreground mt-0.5">XSS, CSRF, Injection</div>
                </div>
            </div>
            <div class="app-chrome-surface p-4 rounded-xl border border-border/40 flex items-center gap-3.5 shadow-sm">
                <div class="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">8</div>
                <div>
                    <div class="text-[10px] uppercase font-semibold text-muted-foreground/75 tracking-wider">API Verification</div>
                    <div class="text-xs font-bold text-foreground mt-0.5">GraphQL & REST JWT</div>
                </div>
            </div>
            <div class="app-chrome-surface p-4 rounded-xl border border-border/40 flex items-center gap-3.5 shadow-sm">
                <div class="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-bold">6</div>
                <div>
                    <div class="text-[10px] uppercase font-semibold text-muted-foreground/75 tracking-wider">Infrastructure</div>
                    <div class="text-xs font-bold text-foreground mt-0.5">SSRF & CORS Policies</div>
                </div>
            </div>
            <div class="app-chrome-surface p-4 rounded-xl border border-border/40 flex items-center gap-3.5 shadow-sm">
                <div class="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">26</div>
                <div>
                    <div class="text-[10px] uppercase font-semibold text-muted-foreground/75 tracking-wider">Total Scenarios</div>
                    <div class="text-xs font-bold text-foreground mt-0.5">Fully documented POCs</div>
                </div>
            </div>
        </div>

        <!-- Main Workspace -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Active Test Cases List -->
            <div class="lg:col-span-2 space-y-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Available Templates</h3>
                    <div class="text-xs text-muted-foreground">Filtered by: All</div>
                </div>

                <!-- Test Case 1 -->
                <div class="app-chrome-surface p-5 rounded-2xl border border-border/40 relative overflow-hidden group hover:border-border/80 transition-colors shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/15 mb-2">CRITICAL / XSS</span>
                            <h4 class="text-base font-bold text-foreground group-hover:text-primary transition-colors">Stored Cross-Site Scripting (XSS) in Comment Section</h4>
                            <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">Standard test suite for verifying output encoding in database-persisted text areas. Includes payload verification parameters.</p>
                        </div>
                        <button class="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground border border-border/30 transition-colors cursor-pointer shrink-0">
                            Get Payload
                        </button>
                    </div>
                </div>

                <!-- Test Case 2 -->
                <div class="app-chrome-surface p-5 rounded-2xl border border-border/40 relative overflow-hidden group hover:border-border/80 transition-colors shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/15 mb-2">HIGH / CSRF</span>
                            <h4 class="text-base font-bold text-foreground group-hover:text-primary transition-colors">Cross-Site Request Forgery (CSRF) on Password Update</h4>
                            <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">HTML payload template generating an auto-submitting form targeting endpoints with missing or weak anti-CSRF token parameters.</p>
                        </div>
                        <button class="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground border border-border/30 transition-colors cursor-pointer shrink-0">
                            Get Payload
                        </button>
                    </div>
                </div>

                <!-- Test Case 3 -->
                <div class="app-chrome-surface p-5 rounded-2xl border border-border/40 relative overflow-hidden group hover:border-border/80 transition-colors shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 mb-2">MEDIUM / CORS</span>
                            <h4 class="text-base font-bold text-foreground group-hover:text-primary transition-colors">CORS Origin Reflection Configuration Audit</h4>
                            <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">Proof-of-concept script for triggering HTTP Origin reflections to verify wildcard setups on authentication cookie pathways.</p>
                        </div>
                        <button class="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground border border-border/30 transition-colors cursor-pointer shrink-0">
                            Get Payload
                        </button>
                    </div>
                </div>
            </div>

            <!-- Workspace Action Panel -->
            <div class="space-y-6">
                <div class="app-chrome-surface p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
                    <h4 class="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-4">Quick Generator</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Payload Type</label>
                            <select class="w-full bg-muted/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20">
                                <option>Cross-Site Scripting (XSS)</option>
                                <option>SQL Injection (SQLi)</option>
                                <option>Server-Side Request Forgery</option>
                                <option>Local File Inclusion</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Evasion Technique</label>
                            <select class="w-full bg-muted/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20">
                                <option>None (Standard)</option>
                                <option>Double URL Encoding</option>
                                <option>Hex String Bypass</option>
                                <option>HTML Entity Injection</option>
                            </select>
                        </div>

                        <button class="w-full py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer border-0 mt-2 shadow-md shadow-primary/10">
                            Generate POC Template
                        </button>
                    </div>
                </div>

                <div class="app-chrome-surface p-6 rounded-2xl border border-border/40 shadow-sm text-xs leading-relaxed text-muted-foreground">
                    <strong class="text-foreground font-semibold block mb-1">Standardized QA Framework</strong>
                    These test cases are structured using the OWASP Testing Framework guidelines to keep assessment reports uniform and actionable.
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
