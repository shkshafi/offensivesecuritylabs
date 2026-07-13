<x-app-layout>
    <x-slot name="headerActions">
        <x-primary-button type="button" @click="$dispatch('open-create-user-modal')" class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create User
        </x-primary-button>
    </x-slot>

    <div class="w-full px-4 md:px-6 py-6 space-y-6" x-data="{ openModal: false, openCreateModal: false, userName: '', actionUrl: '' }" @open-create-user-modal.window="openCreateModal = true">
        
        <!-- Status Notifications -->
        @if (session('status'))
            <div class="p-3.5 rounded-[8px] border border-success/20 bg-success/10 text-success text-xs font-medium flex items-start gap-2.5">
                <svg class="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ session('status') }}</span>
            </div>
        @endif

        @if ($errors->any())
            <div class="p-3.5 rounded-[8px] border border-destructive/20 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
                <svg class="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
            <!-- Stat 1: Total Users -->
            <div class="flex items-center gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Accounts</p>
                    <h3 class="text-lg font-bold text-foreground mt-0.5">{{ $totalUsers }}</h3>
                </div>
            </div>

            <!-- Stat 2: Admins -->
            <div class="flex items-center gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Administrators</p>
                    <h3 class="text-lg font-bold text-foreground mt-0.5">{{ $adminCount }}</h3>
                </div>
            </div>

            <!-- Stat 3: Users -->
            <div class="flex items-center gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Standard Users</p>
                    <h3 class="text-lg font-bold text-foreground mt-0.5">{{ $userCount }}</h3>
                </div>
            </div>
        </div>

        <!-- Users Table Card -->
        <div class="rounded-[8px] border border-border bg-card p-5 shadow-sm w-full">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                            <th class="pb-3 pl-2">User details</th>
                            <th class="pb-3">Email</th>
                            <th class="pb-3">System Role</th>
                            <th class="pb-3">Joined date</th>
                            <th class="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/40 text-xs">
                        @foreach ($users as $user)
                            <tr class="hover:bg-muted/20 transition-colors">
                                <td class="py-3 pl-2 font-medium text-foreground">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary select-none uppercase">
                                            {{ substr($user->name, 0, 2) }}
                                        </div>
                                        <div>
                                            <span class="block font-semibold text-foreground">{{ $user->name }}</span>
                                            @if (auth()->id() === $user->id)
                                                <span class="text-[9px] text-primary bg-primary/10 border border-primary/20 rounded-[4px] px-1.5 py-0.5 font-medium inline-block mt-0.5">Your Account</span>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3 text-muted-foreground font-mono">{{ $user->email }}</td>
                                <td class="py-3">
                                    @if ($user->email === 'shaik.shafi.ur.rahman@gmail.com')
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-primary/10 text-primary border border-primary/25 select-none">
                                            <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                            Admin (System)
                                        </span>
                                    @else
                                        <form action="{{ route('admin.users.update-role', $user) }}" method="POST" class="inline-block m-0">
                                            @csrf
                                            @method('PATCH')
                                            <select name="role" onchange="this.form.submit()" class="h-7 px-2.5 rounded-[6px] border border-border bg-background text-[11px] text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all">
                                                <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>User</option>
                                                <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                                            </select>
                                        </form>
                                    @endif
                                </td>
                                <td class="py-3 text-muted-foreground">{{ $user->created_at->format('M d, Y H:i') }}</td>
                                <td class="py-3 pr-2 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <!-- Change Password -->
                                        <button type="button" 
                                                @click="openModal = true; userName = '{{ $user->name }}'; actionUrl = '{{ route('admin.users.change-password', $user) }}'"
                                                class="h-7 px-2.5 rounded-[6px] border border-border hover:bg-muted/50 text-xs font-medium text-foreground transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                            <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                            Password
                                        </button>

                                        <!-- Delete -->
                                        @if ($user->email === 'shaik.shafi.ur.rahman@gmail.com')
                                            <button type="button" disabled 
                                                    class="h-7 px-2.5 rounded-[6px] border border-border/10 bg-transparent text-muted-foreground/30 text-xs font-medium cursor-not-allowed inline-flex items-center justify-center gap-1 select-none"
                                                    title="System Administrator cannot be deleted">
                                                Delete
                                            </button>
                                        @elseif (auth()->id() === $user->id)
                                            <button type="button" disabled 
                                                    class="h-7 px-2.5 rounded-[6px] border border-border/10 bg-transparent text-muted-foreground/30 text-xs font-medium cursor-not-allowed inline-flex items-center justify-center gap-1 select-none"
                                                    title="You cannot delete your own logged-in account">
                                                Delete
                                            </button>
                                        @else
                                            <form action="{{ route('admin.users.destroy', $user) }}" method="POST" onsubmit="return confirm('Are you sure you want to permanently delete the account for {{ $user->name }}? This action cannot be reversed.')" class="inline-block m-0">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="h-7 px-2.5 rounded-[6px] border border-destructive/20 bg-destructive/10 hover:bg-destructive/25 text-destructive text-xs font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                                    Delete
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Alpine.js Password Change Modal -->
        <div x-show="openModal" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4" style="display: none;" x-transition>
            <div @click.outside="openModal = false" class="relative w-full max-w-md rounded-[8px] border border-border bg-card p-6 shadow-lg overflow-hidden">
                <!-- Modal Close -->
                <button type="button" @click="openModal = false" class="absolute top-4 right-4 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 class="text-base font-bold text-foreground">Change Password</h3>
                <p class="text-xs text-muted-foreground mt-1">Set a new secure password for <span class="font-semibold text-foreground" x-text="userName"></span></p>

                <form :action="actionUrl" method="POST" class="space-y-4 mt-4">
                    @csrf
                    @method('PATCH')
                    
                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">New Password</label>
                        <x-text-input id="password" type="password" name="password" required class="block w-full" placeholder="••••••••" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">Confirm Password</label>
                        <x-text-input id="password_confirmation" type="password" name="password_confirmation" required class="block w-full" placeholder="••••••••" />
                    </div>

                    <div class="flex justify-end gap-2 pt-3 border-t border-border mt-6">
                        <x-secondary-button type="button" @click="openModal = false">
                            Cancel
                        </x-secondary-button>
                        <x-primary-button type="submit">
                            Save changes
                        </x-primary-button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Alpine.js Create User Modal -->
        <div x-show="openCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4" style="display: none;" x-transition>
            <div @click.outside="openCreateModal = false" class="relative w-full max-w-md rounded-[8px] border border-border bg-card p-6 shadow-lg overflow-hidden">
                <!-- Modal Close -->
                <button type="button" @click="openCreateModal = false" class="absolute top-4 right-4 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 class="text-base font-bold text-foreground">Create User Account</h3>
                <p class="text-xs text-muted-foreground mt-1">Add a new user with name, email, password and system role.</p>

                <form action="{{ route('admin.users.store') }}" method="POST" class="space-y-4 mt-4">
                    @csrf
                    
                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
                        <x-text-input type="text" name="name" required class="block w-full" placeholder="John Doe" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
                        <x-text-input type="email" name="email" required class="block w-full" placeholder="john@example.com" />
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
                        <x-secondary-button type="button" @click="openCreateModal = false">
                            Cancel
                        </x-secondary-button>
                        <x-primary-button type="submit">
                            Create User
                        </x-primary-button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>
