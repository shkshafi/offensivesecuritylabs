<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::orderBy('name')->get();
        $totalUsers = $users->count();
        $adminCount = $users->where('role', 'admin')->count();
        $userCount = $users->where('role', 'user')->count();

        return view('admin.users.index', compact('users', 'totalUsers', 'adminCount', 'userCount'));
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:admin,user'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'theme' => 'dark',
        ]);

        return redirect()->back()->with('status', "User account for {$user->name} created successfully.");
    }

    /**
     * Update the specified user's role.
     */
    public function updateRole(Request $request, User $user)
    {
        if ($user->email === 'shaik.shafi.ur.rahman@gmail.com') {
            return redirect()->back()->withErrors(['role' => 'The default administrator role cannot be modified.']);
        }

        $request->validate([
            'role' => ['required', 'string', 'in:admin,user'],
        ]);

        $user->update([
            'role' => $request->role,
        ]);

        return redirect()->back()->with('status', "User role updated successfully for {$user->name}.");
    }

    /**
     * Change the specified user's password.
     */
    public function changePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('status', "Password updated successfully for {$user->name}.");
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        if ($user->email === 'shaik.shafi.ur.rahman@gmail.com') {
            return redirect()->back()->withErrors(['delete' => 'The default administrator account cannot be deleted.']);
        }

        if (auth()->id() === $user->id) {
            return redirect()->back()->withErrors(['delete' => 'You cannot delete your own logged-in account.']);
        }

        $user->delete();

        return redirect()->back()->with('status', "User account for {$user->name} has been deleted.");
    }
}
