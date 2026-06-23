<x-app-layout>
    <div class="w-full px-3 sm:px-4 md:px-5 lg:px-6 2xl:px-8 py-6 sm:py-8 space-y-6" x-data="{ openModal: false, openCreateModal: false, userName: '', actionUrl: '' }">
        
        <!-- Header -->
        <header class="pt-0.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight sm:text-[1.75rem] sm:leading-tight">
                    <span class="app-page-title-gradient">User Management</span>
                </h1>
                <p class="text-sm text-muted-foreground mt-1">Manage system accounts, update roles, change passwords, and delete users.</p>
            </div>
            <div>
                <button type="button" @click="openCreateModal = true" class="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:brightness-110 text-white font-semibold text-xs border-0 shadow-md transition-all cursor-pointer flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create User
                </button>
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
            <!-- Stat 1: Total Users -->
            <div class="relative flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Accounts</p>
                    <h3 class="text-xl font-bold text-foreground mt-0.5">{{ $totalUsers }}</h3>
                </div>
            </div>

            <!-- Stat 2: Admins -->
            <div class="relative flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Administrators</p>
                    <h3 class="text-xl font-bold text-foreground mt-0.5">{{ $adminCount }}</h3>
                </div>
            </div>

            <!-- Stat 3: Users -->
            <div class="relative flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Standard Users</p>
                    <h3 class="text-xl font-bold text-foreground mt-0.5">{{ $userCount }}</h3>
                </div>
            </div>
        </div>

        <!-- Users Table Card -->
        <div class="app-chrome-surface p-6 rounded-2xl relative overflow-hidden border border-border/40 shadow-xl w-full">
            <!-- Ambient Glow inside card -->
            <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div class="absolute -top-[20%] -left-[10%] h-[60%] w-[120%] rounded-full bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent blur-3xl"></div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                            <th class="pb-3.5 pl-2">User details</th>
                            <th class="pb-3.5">Email</th>
                            <th class="pb-3.5">System Role</th>
                            <th class="pb-3.5">Joined date</th>
                            <th class="pb-3.5 pr-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/20 text-sm">
                        @foreach ($users as $user)
                            <tr class="hover:bg-muted/10 transition-colors">
                                <td class="py-4 pl-2 font-medium text-foreground">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary select-none uppercase">
                                            {{ substr($user->name, 0, 2) }}
                                        </div>
                                        <div>
                                            <span class="block font-semibold">{{ $user->name }}</span>
                                            @if (auth()->id() === $user->id)
                                                <span class="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5 font-medium inline-block mt-0.5">Your Account</span>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 text-muted-foreground font-mono text-xs">{{ $user->email }}</td>
                                <td class="py-4">
                                    @if ($user->email === 'shaik.shafi.ur.rahman@gmail.com')
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/25 shadow-sm select-none">
                                            <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                            Admin (System)
                                        </span>
                                    @else
                                        <form action="{{ route('admin.users.update-role', $user) }}" method="POST" class="inline-block">
                                            @csrf
                                            @method('PATCH')
                                            <select name="role" onchange="this.form.submit()" class="rounded-lg border border-border/40 bg-background/50 hover:bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 py-1.5 px-2.5 cursor-pointer transition-colors">
                                                <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>User</option>
                                                <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                                            </select>
                                        </form>
                                    @endif
                                </td>
                                <td class="py-4 text-muted-foreground text-xs">{{ $user->created_at->format('M d, Y H:i') }}</td>
                                <td class="py-4 pr-2 text-right">
                                    <div class="flex items-center justify-end gap-2.5">
                                        <!-- Change Password -->
                                        <button type="button" 
                                                @click="openModal = true; userName = '{{ $user->name }}'; actionUrl = '{{ route('admin.users.change-password', $user) }}'"
                                                class="h-7 px-3 rounded-lg border border-border/40 hover:border-border/70 hover:bg-muted/40 text-xs font-medium text-foreground transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                            <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                            Password
                                        </button>

                                        <!-- Delete -->
                                        @if ($user->email === 'shaik.shafi.ur.rahman@gmail.com')
                                            <button type="button" disabled 
                                                    class="h-7 px-3 rounded-lg border border-border/10 bg-transparent text-muted-foreground/30 text-xs font-medium cursor-not-allowed inline-flex items-center justify-center gap-1 select-none"
                                                    title="System Administrator cannot be deleted">
                                                Delete
                                            </button>
                                        @elseif (auth()->id() === $user->id)
                                            <button type="button" disabled 
                                                    class="h-7 px-3 rounded-lg border border-border/10 bg-transparent text-muted-foreground/30 text-xs font-medium cursor-not-allowed inline-flex items-center justify-center gap-1 select-none"
                                                    title="You cannot delete your own logged-in account">
                                                Delete
                                            </button>
                                        @else
                                            <form action="{{ route('admin.users.destroy', $user) }}" method="POST" onsubmit="return confirm('Are you sure you want to permanently delete the account for {{ $user->name }}? This action cannot be reversed.')" class="inline-block">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="h-7 px-3 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-600 text-xs font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-1">
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
        <div x-show="openModal" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm px-4" style="display: none;" x-transition>
            <div @click.outside="openModal = false" class="relative w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl overflow-hidden">
                <!-- Ambient glow in Modal -->
                <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[30%] -left-[20%] h-[70%] w-[140%] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl"></div>
                </div>

                <!-- Modal Close -->
                <button type="button" @click="openModal = false" class="absolute top-4 right-4 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 class="text-lg font-bold text-foreground">Change Password</h3>
                <p class="text-xs text-muted-foreground mt-1">Set a new secure password for <span class="font-semibold text-foreground" x-text="userName"></span></p>

                <form :action="actionUrl" method="POST" class="space-y-4 mt-5">
                    @csrf
                    @method('PATCH')
                    
                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
                        <input id="password" type="password" name="password" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="••••••••" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                        <input id="password_confirmation" type="password" name="password_confirmation" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="••••••••" />
                    </div>

                    <div class="flex justify-end gap-2.5 pt-3 border-t border-border/20 mt-6">
                        <button type="button" @click="openModal = false" 
                                class="px-4 py-2 text-xs font-semibold rounded-lg border border-border/40 bg-transparent text-muted-foreground hover:bg-muted/40 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white hover:brightness-110 shadow-md border-0 transition-all cursor-pointer">
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Alpine.js Create User Modal -->
        <div x-show="openCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm px-4" style="display: none;" x-transition>
            <div @click.outside="openCreateModal = false" class="relative w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl overflow-hidden">
                <!-- Ambient glow in Modal -->
                <div class="sidebar-ambient-glow pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[30%] -left-[20%] h-[70%] w-[140%] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl"></div>
                </div>

                <!-- Modal Close -->
                <button type="button" @click="openCreateModal = false" class="absolute top-4 right-4 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer border-0 bg-transparent">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 class="text-lg font-bold text-foreground">Create User Account</h3>
                <p class="text-xs text-muted-foreground mt-1">Add a new user with name, email, password and system role.</p>

                <form action="{{ route('admin.users.store') }}" method="POST" class="space-y-4 mt-5">
                    @csrf
                    
                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <input type="text" name="name" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="John Doe" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                        <input type="email" name="email" required 
                               class="block w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                               placeholder="john@example.com" />
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
                        <button type="button" @click="openCreateModal = false" 
                                class="px-4 py-2 text-xs font-semibold rounded-lg border border-border/40 bg-transparent text-muted-foreground hover:bg-muted/40 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white hover:brightness-110 shadow-md border-0 transition-all cursor-pointer">
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>
