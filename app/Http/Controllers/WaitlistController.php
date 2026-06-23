<?php

namespace App\Http\Controllers;

use App\Models\Waitlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WaitlistController extends Controller
{
    /**
     * Store a newly created waitlist signup.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:waitlists,email'],
        ], [
            'email.unique' => 'This email address is already registered on our waitlist.',
            'email.email' => 'Please enter a valid email address.',
        ]);

        $waitlist = Waitlist::create([
            'email' => $request->email,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully joined the waitlist!',
            'data' => $waitlist,
        ], 201);
    }
}
