<x-guest-layout>
    <!-- Page Headings -->
    <div class="mb-6 text-center">
        <h2 class="text-xl font-semibold text-foreground tracking-tight">Welcome back</h2>
        <p class="text-xs text-muted-foreground mt-1">Sign in to your OffSec Labs command console</p>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <!-- Error Banner -->
    @if ($errors->any())
        <div class="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 rounded-[6px]">
            <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-destructive mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span class="text-destructive text-xs leading-relaxed font-medium">
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
            <label for="email" class="block text-xs font-medium text-foreground">Email address</label>
            <x-text-input id="email" 
                          class="block w-full" 
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
                <label for="password" class="block text-xs font-medium text-foreground">Password</label>
                @if (Route::has('password.request'))
                    <a class="text-xs text-primary hover:text-primary/95 text-decoration-none font-medium" href="{{ route('password.request') }}">
                        Forgot password?
                    </a>
                @endif
            </div>
            <x-text-input id="password" 
                          class="block w-full" 
                          type="password" 
                          name="password" 
                          placeholder="••••••••"
                          required 
                          autocomplete="current-password" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between pt-1">
            <label for="remember_me" class="inline-flex items-center cursor-pointer">
                <input id="remember_me" type="checkbox" class="rounded border-border bg-background text-primary focus:ring-0 focus:ring-offset-0" name="remember">
                <span class="ms-2 text-xs text-muted-foreground">Remember session</span>
            </label>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
            <x-primary-button class="w-full">
                Log in
            </x-primary-button>
        </div>
    </form>

    <!-- Footer Links -->
    <div class="mt-6 pt-5 border-t border-border text-center">
        <span class="text-xs text-muted-foreground/80">Registration is managed by system administrators.</span>
    </div>
</x-guest-layout>
