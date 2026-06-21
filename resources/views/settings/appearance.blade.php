<x-app-layout>
    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold tracking-tight text-foreground" style="font-family: var(--font-brand);">Appearance Settings</h1>
            <p class="text-sm text-muted-foreground mt-1">Customize the user interface theme and background layout of your console.</p>
        </div>

        @if (session('status') === 'appearance-updated')
            <div class="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                <svg class="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Appearance preferences saved successfully.</span>
            </div>
        @endif

        <form action="{{ route('settings.appearance.update') }}" method="POST" class="space-y-8" x-data="{
            theme: '{{ $theme }}',
            backgroundStyle: '{{ $background_style }}',
            isDirty() {
                return this.theme !== '{{ $theme }}' || this.backgroundStyle !== '{{ $background_style }}';
            },
            updatePreview() {
                // Apply theme immediately to preview
                if (this.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }
                // Apply background style immediately to preview
                document.documentElement.setAttribute('data-background-style', this.backgroundStyle);
                localStorage.setItem('background_style', this.backgroundStyle);
            }
        }" x-init="$watch('theme', val => updatePreview()); $watch('backgroundStyle', val => updatePreview())">
            @csrf
            @method('PATCH')

            <!-- Color Theme Selector -->
            <section class="space-y-4">
                <div>
                    <h3 class="text-base font-semibold tracking-tight text-foreground">Color Theme</h3>
                    <p class="text-sm text-muted-foreground mt-0.5">Preview changes instantly. Choose between dark and light themes.</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <!-- Light Theme Button -->
                    <button type="button" @click="theme = 'light'" :class="theme === 'light' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 bg-card/60 hover:border-accent'" class="group rounded-xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-sm font-semibold block text-foreground">Light</span>
                                <span class="text-xs text-muted-foreground mt-0.5 block">Bright surfaces and soft shadows</span>
                            </div>
                        </div>
                        <div class="mt-3 rounded-lg border border-border/40 p-2 bg-[#ecedef]">
                            <div class="space-y-1.5 rounded-md p-2 shadow-sm bg-white">
                                <div class="h-2 w-16 rounded bg-[#ecedef]" />
                                <div class="h-2 w-24 rounded bg-[#ecedef]" />
                            </div>
                        </div>
                    </button>

                    <!-- Dark Theme Button -->
                    <button type="button" @click="theme = 'dark'" :class="theme === 'dark' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 bg-card/60 hover:border-accent'" class="group rounded-xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-sm font-semibold block text-foreground">Dark</span>
                                <span class="text-xs text-muted-foreground mt-0.5 block">Low-glare surfaces for night use</span>
                            </div>
                        </div>
                        <div class="mt-3 rounded-lg border border-border/40 p-2 bg-slate-950">
                            <div class="space-y-1.5 rounded-md p-2 shadow-sm bg-slate-800">
                                <div class="h-2 w-16 rounded bg-slate-500" />
                                <div class="h-2 w-24 rounded bg-slate-500" />
                            </div>
                        </div>
                    </button>
                </div>
                <input type="hidden" name="theme" :value="theme">
            </section>

            <!-- Background Style Selector -->
            <section class="space-y-4">
                <div>
                    <h3 class="text-base font-semibold tracking-tight text-foreground">Background Layout</h3>
                    <p class="text-sm text-muted-foreground mt-0.5">Toggle visual background styling across your dashboard and sidebar.</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <!-- None Background Button -->
                    <button type="button" @click="backgroundStyle = 'none'" :class="backgroundStyle === 'none' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 bg-card/60 hover:border-accent'" class="group rounded-xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="backgroundStyle === 'none' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="3" x2="21" y2="21"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-sm font-semibold block text-foreground">No Background</span>
                                <span class="text-xs text-muted-foreground mt-0.5 block">Solid theme colors on sidebar and pages</span>
                            </div>
                        </div>
                    </button>

                    <!-- Colourful Background Button -->
                    <button type="button" @click="backgroundStyle = 'colourful'" :class="backgroundStyle === 'colourful' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 bg-card/60 hover:border-accent'" class="group rounded-xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="backgroundStyle === 'colourful' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-sm font-semibold block text-foreground">Colourful</span>
                                <span class="text-xs text-muted-foreground mt-0.5 block">Image backgrounds on sidebar and pages</span>
                            </div>
                        </div>
                    </button>
                </div>
                <input type="hidden" name="background_style" :value="backgroundStyle">
            </section>

            <!-- Submit Button -->
            <div class="flex items-center gap-4 pt-4 border-t border-border/50">
                <button type="submit" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/95 shadow transition-colors cursor-pointer focus:outline-none">
                    Save Appearance
                </button>
                <a href="{{ route('dashboard') }}" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-decoration-none">
                    Cancel
                </a>
            </div>
        </form>
    </div>
</x-app-layout>
