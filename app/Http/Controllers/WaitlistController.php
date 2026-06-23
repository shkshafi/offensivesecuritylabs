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
            'email' => [
                'required', 
                'string', 
                'lowercase', 
                'email', 
                'max:255', 
                'unique:waitlists,email',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,16}$/'
            ],
        ], [
            'email.unique' => 'This email address is already registered on our waitlist.',
            'email.email' => 'Please enter a valid email address.',
            'email.regex' => 'Please enter a valid email address without any special symbols or HTML tags.',
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
