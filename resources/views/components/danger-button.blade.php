<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center px-4 h-9 bg-destructive hover:bg-destructive/90 text-white border border-transparent rounded-full font-medium text-sm focus:outline-none focus:ring-2 focus:ring-destructive/25 active:scale-[0.98] transition-all duration-150 cursor-pointer']) }}>
    {{ $slot }}
</button>
