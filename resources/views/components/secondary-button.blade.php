<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex items-center justify-center px-4 h-9 bg-muted/40 hover:bg-muted/70 text-foreground border border-border rounded-[6px] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 active:scale-[0.98] transition-all duration-150 cursor-pointer']) }}>
    {{ $slot }}
</button>
