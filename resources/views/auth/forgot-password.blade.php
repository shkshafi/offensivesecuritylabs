<x-guest-layout>
    <div class="mb-5 text-center">
        <h2 class="text-xl font-semibold text-foreground tracking-tight">Forgot password</h2>
        <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Let us know your email address and we will email you a password reset link.
        </p>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('password.email') }}" class="space-y-4">
        @csrf

        <!-- Email Address -->
        <div class="space-y-1.5">
            <label for="email" class="block text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
            <x-text-input id="email" class="block w-full" type="email" name="email" :value="old('email')" placeholder="name@company.com" required autofocus />
            <x-input-error :messages="$errors->get('email')" class="mt-1" />
        </div>

        <div class="pt-2">
            <x-primary-button class="w-full">
                {{ __('Email Password Reset Link') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
