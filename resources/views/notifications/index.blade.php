<x-app-layout>
    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8" x-data="{
        unreadCount: {{ $unreadCount }},
        markRead(id, elementId) {
            fetch(`/dashboard/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            }).then(res => {
                if (res.ok) {
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                    document.getElementById(elementId).classList.remove('bg-muted/15');
                    let dot = document.getElementById(elementId + '-dot');
                    if (dot) dot.style.display = 'none';
                    let markReadBtn = document.getElementById(elementId + '-read-btn');
                    if (markReadBtn) markReadBtn.style.display = 'none';
                }
            });
        },
        deleteNotification(id, elementId) {
            fetch(`/dashboard/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            }).then(res => {
                if (res.ok) {
                    let el = document.getElementById(elementId);
                    if (el) {
                        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(-10px)';
                        setTimeout(() => el.remove(), 200);
                    }
                }
            });
        },
        markAllRead() {
            fetch('{{ route('dashboard.notifications.read-all') }}', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            }).then(res => {
                if (res.ok) {
                    this.unreadCount = 0;
                    window.location.reload();
                }
            });
        }
    }">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-foreground" style="font-family: var(--font-brand);">Notifications</h1>
                <p class="text-sm text-muted-foreground mt-1">Review account alerts, security logs, and scan updates.</p>
            </div>
            <template x-if="unreadCount > 0">
                <button @click="markAllRead()" class="inline-flex h-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 px-4 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors cursor-pointer">
                    Mark all as read
                </button>
            </template>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Notifications list -->
            <div class="lg:col-span-2 space-y-3">
                @if ($notifications->isEmpty())
                    <div class="app-chrome-surface p-8 text-center rounded-2xl">
                        <div class="h-10 w-10 rounded-xl bg-muted/20 text-muted-foreground flex items-center justify-center mx-auto mb-3">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                        </div>
                        <h3 class="text-sm font-semibold text-foreground">No notifications found</h3>
                        <p class="text-xs text-muted-foreground mt-1">You are all caught up!</p>
                    </div>
                @else
                    <div class="space-y-3">
                        @foreach ($notifications as $n)
                            @php
                                $isRead = $n->read_at !== null;
                                $elId = 'notification-' . $n->id;
                            @endphp
                            <div id="{{ $elId }}" class="app-chrome-surface p-4 rounded-xl relative overflow-hidden flex flex-row items-start justify-between gap-4 transition-all duration-200 {{ !$isRead ? 'bg-muted/15' : '' }}">
                                <div class="flex items-start gap-3 min-w-0">
                                    <div class="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 {{ !$isRead ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground' }}">
                                        @if ($n->category === 'security')
                                            <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m0-6h.01M12 21a9 9 0 01-9-9V6.162l9-3.125 9 3.125V12a9 9 0 01-9 9z"/></svg>
                                        @elseif ($n->category === 'system')
                                            <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                                        @else
                                            <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        @endif
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <h3 class="text-sm font-semibold text-foreground truncate">{{ $n->title }}</h3>
                                            <span id="{{ $elId }}-dot" class="h-2 w-2 rounded-full bg-blue-500" style="{{ $isRead ? 'display: none;' : '' }}"></span>
                                        </div>
                                        <p class="text-xs text-muted-foreground mt-1 leading-relaxed">{{ $n->message }}</p>
                                        <div class="flex items-center gap-2 mt-2">
                                            <span class="text-[10px] text-muted-foreground/60">{{ $n->created_at->diffForHumans() }}</span>
                                            @if ($n->action_url)
                                                <span class="text-muted-foreground/30">•</span>
                                                <a href="{{ $n->action_url }}" class="text-[10px] font-semibold text-primary hover:underline text-decoration-none">{{ $n->action_label ?? 'View Details' }}</a>
                                            @endif
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-1.5">
                                    <button id="{{ $elId }}-read-btn" @click="markRead('{{ $n->id }}', '{{ $elId }}')" title="Mark as read" class="h-7 w-7 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent" style="{{ $isRead ? 'display: none;' : '' }}">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                    </button>
                                    <button @click="deleteNotification('{{ $n->id }}', '{{ $elId }}')" title="Delete" class="h-7 w-7 rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="mt-4">
                        {{ $notifications->links() }}
                    </div>
                @endif
            </div>

            <!-- Stats / Info Panel -->
            <div class="space-y-4">
                <div class="app-chrome-surface p-6 rounded-2xl relative overflow-hidden">
                    <h4 class="text-sm font-semibold text-foreground mb-4">Notification Center</h4>
                    <div class="space-y-3 text-xs text-muted-foreground">
                        <div class="flex items-center justify-between">
                            <span>Unread count:</span>
                            <span class="font-semibold text-foreground" x-text="unreadCount"></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span>Total notifications:</span>
                            <span class="font-semibold text-foreground">{{ $notifications->total() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
