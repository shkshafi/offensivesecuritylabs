<x-guest-layout>
    <div class="mb-5 text-center">
        <h2 class="text-xl font-semibold text-foreground tracking-tight">Verify Email</h2>
        <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Thanks for signing up! Before getting started, verify your email address by clicking on the link we just sent you.
        </p>
    </div>

    @if (session('status') == 'verification-link-sent')
        <div class="mb-4 font-medium text-xs text-success bg-success/10 border border-success/20 p-3 rounded-[6px]">
            {{ __('A new verification link has been sent to the email address you provided during registration.') }}
        </div>
    @endif

    <div class="mt-5 flex flex-col gap-3">
        <form method="POST" action="{{ route('verification.send') }}">
            @csrf
            <x-primary-button class="w-full">
                {{ __('Resend Verification Email') }}
            </x-primary-button>
        </form>

        <form method="POST" action="{{ route('logout') }}" class="w-full text-center">
            @csrf
            <button type="submit" class="text-xs text-muted-foreground hover:text-foreground font-medium underline cursor-pointer border-0 bg-transparent">
                {{ __('Log Out') }}
            </button>
        </form>
    </div>
</x-guest-layout>
