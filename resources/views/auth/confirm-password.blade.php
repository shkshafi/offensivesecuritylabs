<x-guest-layout>
    <div class="mb-5 text-center">
        <h2 class="text-xl font-semibold text-foreground tracking-tight">Confirm Password</h2>
        <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            This is a secure area of the application. Please confirm your password before continuing.
        </p>
    </div>

    <form method="POST" action="{{ route('password.confirm') }}" class="space-y-4">
        @csrf

        <!-- Password -->
        <div class="space-y-1.5">
            <label for="password" class="block text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
            <x-text-input id="password" class="block w-full"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-1" />
        </div>

        <div class="pt-2">
            <x-primary-button class="w-full">
                {{ __('Confirm') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
