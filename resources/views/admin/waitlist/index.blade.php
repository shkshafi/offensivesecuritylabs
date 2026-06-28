<x-app-layout>
    <div class="w-full px-4 md:px-6 py-6 space-y-6" x-data="{ openApproveModal: false, waitlistEmail: '', actionUrl: '' }">
        
        <!-- Status Notifications -->
        @if (session('status'))
            <div class="p-3.5 rounded-[8px] border border-success/20 bg-success/10 text-success text-xs font-medium flex items-start gap-2.5">
                <svg class="h-4.5 w-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ session('status') }}</span>
            </div>
        @endif

        @if ($errors->any())
            <div class="p-3.5 rounded-[8px] border border-destructive/20 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
                <svg class="h-4.5 w-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="flex-1">
                    <span class="font-bold">Action failed:</span>
                    <ul class="list-disc list-inside mt-1 space-y-0.5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        @endif

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="flex items-center gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Waitlist Total</p>
                    <h3 class="text-lg font-bold text-foreground mt-0.5">{{ $totalWaitlist }}</h3>
                </div>
            </div>
        </div>

        <!-- Waitlist Table Card -->
        <div class="rounded-[8px] border border-border bg-card p-5 shadow-sm w-full">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                            <th class="pb-3 pl-2">Email Address</th>
                            <th class="pb-3">Joined date</th>
                            <th class="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/40 text-xs">
                        @forelse ($waitlist as $entry)
                            <tr class="hover:bg-muted/20 transition-colors">
                                <td class="py-3 pl-2 font-medium text-foreground">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary select-none uppercase">
                                            @
                                        </div>
                                        <span class="font-mono text-foreground font-semibold">{{ $entry->email }}</span>
                                    </div>
                                </td>
                                <td class="py-3 text-muted-foreground">{{ $entry->created_at->format('M d, Y H:i') }}</td>
                                <td class="py-3 pr-2 text-right">
                                    <div class="flex items-center justify-end gap-2 text-xs">
                                        <!-- Approve and Create User -->
                                        <button type="button" 
                                                @click="openApproveModal = true; waitlistEmail = '{{ $entry->email }}'; actionUrl = '{{ route('admin.waitlist.approve', $entry) }}'"
                                                class="h-7 px-2.5 rounded-[6px] border border-border hover:bg-muted/50 text-xs font-medium text-foreground transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                            <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Approve
                                        </button>

                                        <!-- Delete -->
                                        <form action="{{ route('admin.waitlist.destroy', $entry) }}" method="POST" onsubmit="return confirm('Are you sure you want to remove {{ $entry->email }} from the waitlist?')" class="inline-block m-0">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="h-7 px-2.5 rounded-[6px] border border-destructive/20 bg-destructive/10 hover:bg-destructive/25 text-destructive text-xs font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-1">
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
        <div x-show="openApproveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4" style="display: none;" x-transition>
            <div @click.outside="openApproveModal = false" class="relative w-full max-w-md rounded-[8px] border border-border bg-card p-6 shadow-lg overflow-hidden">
                <!-- Modal Close -->
                <button type="button" @click="openApproveModal = false" class="absolute top-4 right-4 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 class="text-base font-bold text-foreground">Approve Waitlist Account</h3>
                <p class="text-xs text-muted-foreground mt-1">Create an active user account for: <span class="font-semibold text-foreground font-mono" x-text="waitlistEmail"></span></p>

                <form :action="actionUrl" method="POST" class="space-y-4 mt-4">
                    @csrf
                    
                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
                        <x-text-input type="text" name="name" required class="block w-full" placeholder="John Doe" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
                        <x-text-input type="password" name="password" required class="block w-full" placeholder="••••••••" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">Confirm Password</label>
                        <x-text-input type="password" name="password_confirmation" required class="block w-full" placeholder="••••••••" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">System Role</label>
                        <select name="role" required 
                                class="block w-full h-9 px-3 rounded-[6px] border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-2 pt-3 border-t border-border mt-6">
                        <x-secondary-button type="button" @click="openApproveModal = false">
                            Cancel
                        </x-secondary-button>
                        <x-primary-button type="submit">
                            Approve Account
                        </x-primary-button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>
