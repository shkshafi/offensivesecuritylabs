<x-guest-layout>
    <div class="mb-5 text-center">
        <h2 class="text-xl font-semibold text-foreground tracking-tight">Reset Password</h2>
        <p class="text-xs text-muted-foreground mt-1">Create a new secure password for your account</p>
    </div>

    <form method="POST" action="{{ route('password.store') }}" class="space-y-4">
        @csrf

        <!-- Password Reset Token -->
        <input type="hidden" name="token" value="{{ $request->route('token') }}">

        <!-- Email Address -->
        <div class="space-y-1.5">
            <label for="email" class="block text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
            <x-text-input id="email" class="block w-full" type="email" name="email" :value="old('email', $request->email)" placeholder="name@company.com" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-1" />
        </div>

        <!-- Password -->
        <div class="space-y-1.5">
            <label for="password" class="block text-xs font-semibold text-foreground uppercase tracking-wider">New Password</label>
            <x-text-input id="password" class="block w-full" type="password" name="password" placeholder="••••••••" required autocomplete="new-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-1" />
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1.5">
            <label for="password_confirmation" class="block text-xs font-semibold text-foreground uppercase tracking-wider">Confirm Password</label>
            <x-text-input id="password_confirmation" class="block w-full"
                                type="password"
                                name="password_confirmation" placeholder="••••••••" required autocomplete="new-password" />
            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-1" />
        </div>

        <div class="pt-2">
            <x-primary-button class="w-full">
                {{ __('Reset Password') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
