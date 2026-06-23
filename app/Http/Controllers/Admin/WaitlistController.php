<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Waitlist;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class WaitlistController extends Controller
{
    /**
     * Display a listing of the waitlisted users.
     */
    public function index()
    {
        $waitlist = Waitlist::orderBy('created_at', 'desc')->get();
        $totalWaitlist = $waitlist->count();

        return view('admin.waitlist.index', compact('waitlist', 'totalWaitlist'));
    }

    /**
     * Approve a waitlist entry: create user account and delete waitlist entry.
     */
    public function approve(Request $request, Waitlist $waitlist): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:admin,user'],
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $waitlist->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'theme' => 'dark',
        ]);

        // Delete from waitlist
        $waitlist->delete();

        return redirect()->route('admin.waitlist.index')
            ->with('status', "Successfully approved and created user account for {$user->name}.");
    }

    /**
     * Remove a waitlist entry.
     */
    public function destroy(Waitlist $waitlist): RedirectResponse
    {
        $waitlist->delete();

        return redirect()->route('admin.waitlist.index')
            ->with('status', 'Waitlist entry removed successfully.');
    }
}
