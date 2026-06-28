<x-app-layout>
    <div class="w-full px-4 md:px-6 py-6 max-w-4xl">
        
        @if (session('status') === 'appearance-updated')
            <div class="mb-6 p-3.5 rounded-[8px] border border-success/20 bg-success/10 text-success text-xs font-medium flex items-center gap-2">
                <svg class="h-4.5 w-4.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Appearance preferences saved successfully.</span>
            </div>
        @endif

        <form action="{{ route('settings.appearance.update') }}" method="POST" class="space-y-6" x-data="{
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
            <section class="space-y-3">
                <div>
                    <h3 class="text-sm font-semibold text-foreground">Color Theme</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Choose between dark and light modes. Changes will apply immediately.</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <!-- Light Theme Button -->
                    <button type="button" @click="theme = 'light'" :class="theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-card'" class="group rounded-[8px] border p-4 text-left transition-all cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="theme === 'light' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px]">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-xs font-bold block text-foreground">Light</span>
                                <span class="text-[11px] text-muted-foreground mt-0.5 block">Clean light surfaces for high visibility</span>
                            </div>
                        </div>
                        <div class="mt-3 rounded-[6px] border border-border p-2 bg-[#ecedef]">
                            <div class="space-y-1 rounded-[4px] p-2 shadow-sm bg-white">
                                <div class="h-2 w-16 rounded bg-[#ecedef]" />
                                <div class="h-2 w-24 rounded bg-[#ecedef]" />
                            </div>
                        </div>
                    </button>

                    <!-- Dark Theme Button -->
                    <button type="button" @click="theme = 'dark'" :class="theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-card'" class="group rounded-[8px] border p-4 text-left transition-all cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="theme === 'dark' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px]">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-xs font-bold block text-foreground">Dark</span>
                                <span class="text-[11px] text-muted-foreground mt-0.5 block">Low-glare dark surfaces for console operation</span>
                            </div>
                        </div>
                        <div class="mt-3 rounded-[6px] border border-border p-2 bg-slate-950">
                            <div class="space-y-1 rounded-[4px] p-2 shadow-sm bg-slate-800">
                                <div class="h-2 w-16 rounded bg-slate-500" />
                                <div class="h-2 w-24 rounded bg-slate-500" />
                            </div>
                        </div>
                    </button>
                </div>
                <input type="hidden" name="theme" :value="theme">
            </section>

            <!-- Background Style Selector -->
            <section class="space-y-3">
                <div>
                    <h3 class="text-sm font-semibold text-foreground">Background Layout</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Toggle visual background styling across your dashboard and sidebar.</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <!-- None Background Button -->
                    <button type="button" @click="backgroundStyle = 'none'" :class="backgroundStyle === 'none' ? 'border-primary bg-primary/5' : 'border-border bg-card'" class="group rounded-[8px] border p-4 text-left transition-all cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="backgroundStyle === 'none' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px]">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="3" x2="21" y2="21"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-xs font-bold block text-foreground">Solid Theme Background</span>
                                <span class="text-[11px] text-muted-foreground mt-0.5 block">Solid background colors on sidebars and console</span>
                            </div>
                        </div>
                    </button>

                    <!-- Colourful Background Button -->
                    <button type="button" @click="backgroundStyle = 'colourful'" :class="backgroundStyle === 'colourful' ? 'border-primary bg-primary/5' : 'border-border bg-card'" class="group rounded-[8px] border p-4 text-left transition-all cursor-pointer focus:outline-none w-full">
                        <div class="flex items-start gap-3">
                            <div :class="backgroundStyle === 'colourful' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px]">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-xs font-bold block text-foreground">Colourful Ambient Background</span>
                                <span class="text-[11px] text-muted-foreground mt-0.5 block">Light decorative backdrops on panels and surfaces</span>
                            </div>
                        </div>
                    </button>
                </div>
                <input type="hidden" name="background_style" :value="backgroundStyle">
            </section>

            <!-- Submit Button -->
            <div class="flex items-center gap-3 pt-5 border-t border-border">
                <x-primary-button type="submit">
                    Save Appearance
                </x-primary-button>
                <a href="{{ route('dashboard') }}" class="inline-flex items-center justify-center px-4 h-9 bg-muted/40 hover:bg-muted/70 text-foreground border border-border rounded-[6px] font-medium text-sm text-decoration-none transition-all cursor-pointer">
                    Cancel
                </a>
            </div>
        </form>
    </div>
</x-app-layout>
