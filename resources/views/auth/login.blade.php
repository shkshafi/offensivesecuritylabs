<x-guest-layout>
    <!-- Page Headings -->
    <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold text-white tracking-tight" style="font-family: var(--font-brand);">Welcome back</h2>
        <p class="text-sm text-zinc-400 mt-1.5">Sign in to your OffSec Labs command console</p>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

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


    <!-- Login Form -->
    <form method="POST" action="{{ route('login') }}" class="space-y-4">
        @csrf

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
                   autofocus 
                   autocomplete="username" />
        </div>

        <!-- Password -->
        <div class="space-y-1.5">
            <div class="flex justify-between items-center">
                <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
                @if (Route::has('password.request'))
                    <a class="text-xs text-[#8b5cf6] hover:text-[#8b5cf6]/90 text-decoration-none" href="{{ route('password.request') }}">
                        Forgot password?
                    </a>
                @endif
            </div>
            <input id="password" 
                   class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]" 
                   type="password" 
                   name="password" 
                   placeholder="••••••••"
                   required 
                   autocomplete="current-password" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between pt-1">
            <label for="remember_me" class="inline-flex items-center cursor-pointer">
                <input id="remember_me" type="checkbox" class="rounded bg-zinc-950 border-white/10 text-[#8b5cf6] focus:ring-0" name="remember">
                <span class="ms-2 text-xs text-zinc-400">Remember session</span>
            </label>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
            <button type="submit" class="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold text-sm border-none shadow-[0_2px_8px_-2px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all cursor-pointer">
                Log In
            </button>
        </div>
    </form>

    <!-- Footer Links -->
    <div class="mt-6 pt-5 border-t border-white/[0.06] text-center">
        <span class="text-xs text-zinc-500">Don't have an account? </span>
        <a href="{{ route('register') }}" class="text-xs text-[#3b82f6] hover:underline font-medium">
            Create account
        </a>
    </div>
</x-guest-layout>
