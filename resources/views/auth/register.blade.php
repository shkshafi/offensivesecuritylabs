<x-guest-layout>
    <!-- Page Headings -->
    <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold text-white tracking-tight" style="font-family: var(--font-brand);">Create account</h2>
        <p class="text-sm text-zinc-400 mt-1.5">Get access to the modular security portal</p>
    </div>

    <!-- Error Banner -->
    @if ($errors->any())
        <div class="mb-6 p-4 bg-red-950/40 border border-red-800/30 rounded-lg">
            <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span class="text-red-300 text-xs leading-relaxed">
                    {{ $errors->first() }}
                </span>
            </div>
        </div>
    @endif

    <!-- Social Register Mockup -->
    <div class="w-full space-y-4 mb-6">
        <a href="#" class="w-full flex items-center justify-center py-2.5 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors space-x-3 text-decoration-none">
            <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="text-white font-medium text-sm">Register with Google</span>
        </a>
        <div class="flex items-center">
            <div class="flex-grow border-t border-white/10"></div>
            <span class="px-3 text-[11px] uppercase tracking-wider text-zinc-500">Or register with</span>
            <div class="flex-grow border-t border-white/10"></div>
        </div>
    </div>

    <!-- Register Form -->
    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <!-- Name -->
        <div class="space-y-1.5">
            <label for="name" class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</label>
            <input id="name" 
                   class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]" 
                   type="text" 
                   name="name" 
                   value="{{ old('name') }}" 
                   placeholder="John Doe"
                   required 
                   autofocus 
                   autocomplete="name" />
        </div>

        <!-- Email Address -->
        <div class="space-y-1.5">
            <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input id="email" 
                   class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]" 
                   type="email" 
                   name="email" 
                   value="{{ old('email') }}" 
                   placeholder="name@company.com"
                   required 
                   autocomplete="username" />
        </div>

        <!-- Password -->
        <div class="space-y-1.5">
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
            <input id="password" 
                   class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]" 
                   type="password" 
                   name="password" 
                   placeholder="Minimum 8 characters"
                   required 
                   autocomplete="new-password" />
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1.5">
            <label for="password_confirmation" class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Confirm Password</label>
            <input id="password_confirmation" 
                   class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]" 
                   type="password" 
                   name="password_confirmation" 
                   placeholder="Re-enter password"
                   required 
                   autocomplete="new-password" />
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
            <button type="submit" class="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold text-sm border-none shadow-[0_2px_8px_-2px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all cursor-pointer">
                Register
            </button>
        </div>
    </form>

    <!-- Footer Links -->
    <div class="mt-6 pt-5 border-t border-white/[0.06] text-center">
        <span class="text-xs text-zinc-500">Already have an account? </span>
        <a href="{{ route('login') }}" class="text-xs text-[#3b82f6] hover:underline font-medium">
            Log In
        </a>
    </div>
</x-guest-layout>
