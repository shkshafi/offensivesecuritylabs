<x-app-layout>
    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8 space-y-6" x-data="{ openApproveModal: false, waitlistEmail: '', actionUrl: '' }">
        
        <!-- Header -->
        <header class="pt-0.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight sm:text-[1.75rem] sm:leading-tight">
                    <span class="app-page-title-gradient">Waitlist Management</span>
                </h1>
                <p class="text-sm text-muted-foreground mt-1">View waitlisted operators and approve them to create new user accounts.</p>
            </div>
        </header>

        <!-- Status Notifications -->
        @if (session('status'))
            <div class="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-3 backdrop-blur-sm">
                <svg class="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ session('status') }}</span>
            </div>
        @endif

        @if ($errors->any())
            <div class="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 backdrop-blur-sm">
                <svg class="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="flex-1">
                    <span class="font-semibold">Action failed:</span>
                    <ul class="list-disc list-inside mt-1 text-xs space-y-0.5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        @endif

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="relative flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Waitlist Total</p>
                    <h3 class="text-xl font-bold text-foreground mt-0.5">{{ $totalWaitlist }}</h3>
                </div>
            </div>
        </div>

        <!-- Waitlist Table Card -->
        <div class="app-chrome-surface p-6 rounded-2xl relative overflow-hidden border border-border/40 shadow-xl w-full">
            <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent blur-3xl"></div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                            <th class="pb-3.5 pl-2">Email Address</th>
                            <th class="pb-3.5">Joined date</th>
                            <th class="pb-3.5 pr-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/20 text-sm">
                        @forelse ($waitlist as $entry)
                            <tr class="hover:bg-muted/10 transition-colors">
                                <td class="py-4 pl-2 font-medium text-foreground">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary select-none uppercase">
                                            @
                                        </div>
                                        <span class="font-mono text-xs">{{ $entry->email }}</span>
                                    </div>
                                </td>
                                <td class="py-4 text-muted-foreground text-xs">{{ $entry->created_at->format('M d, Y H:i') }}</td>
                                <td class="py-4 pr-2 text-right">
                                    <div class="flex items-center justify-end gap-2.5">
                                        <!-- Approve and Create User -->
                                        <button type="button" 
                                                @click="openApproveModal = true; waitlistEmail = '{{ $entry->email }}'; actionUrl = '{{ route('admin.waitlist.approve', $entry) }}'"
                                                class="h-7 px-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs font-medium text-primary transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Approve
                                        </button>

                                        <!-- Delete -->
                                        <form action="{{ route('admin.waitlist.destroy', $entry) }}" method="POST" onsubmit="return confirm('Are you sure you want to remove {{ $entry->email }} from the waitlist?')" class="inline-block">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="h-7 px-3 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-600 text-xs font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                                Remove
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="py-8 text-center text-muted-foreground text-xs font-medium">
                                    No users are currently on the waitlist.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Alpine.js Approve & Create User Modal -->
        <div x-show="openApproveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm px-4" style="display: none;" x-transition>
            <div @click.outside="openApproveModal = false" class="relative w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl overflow-hidden">
                <!-- Ambient glow in Modal -->
                <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[30%] -left-[20%] h-[70%] w-[140%] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl"></div>
                </div>

                <!-- Modal Close -->
                <button type="button" @click="openApproveModal = false" class="absolute top-4 right-4 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 class="text-lg font-bold text-foreground">Approve Waitlist Account</h3>
                <p class="text-xs text-muted-foreground mt-1">Create an active user account for: <span class="font-semibold text-foreground font-mono" x-text="waitlistEmail"></span></p>

                <form :action="actionUrl" method="POST" class="space-y-4 mt-5">
                    @csrf
                    
                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <input type="text" name="name" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="John Doe" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                        <input type="password" name="password" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="••••••••" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Confirm Password</label>
                        <input type="password" name="password_confirmation" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="••••••••" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-400">System Role</label>
                        <select name="role" required 
                                class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
                            <option value="user" class="bg-zinc-950 text-white">User</option>
                            <option value="admin" class="bg-zinc-950 text-white">Admin</option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-2.5 pt-3 border-t border-border/20 mt-6">
                        <button type="button" @click="openApproveModal = false" 
                                class="px-4 py-2 text-xs font-semibold rounded-lg border border-border/40 bg-transparent text-muted-foreground hover:bg-muted/40 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white hover:brightness-110 shadow-md border-0 transition-all cursor-pointer">
                            Approve & Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>
