<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center px-4 h-9 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/25 active:scale-[0.98] transition-all duration-150 cursor-pointer']) }}>
    {{ $slot }}
</button>
