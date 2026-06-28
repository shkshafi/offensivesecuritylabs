@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'h-9 px-3 rounded-[6px] border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-all']) }}>
