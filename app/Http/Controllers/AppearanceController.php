<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class AppearanceController extends Controller
{
    /**
     * Update the user's appearance preferences.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => ['required', 'in:light,dark'],
        ]);

        $user = $request->user();
        $user->update([
            'theme' => $validated['theme'],
        ]);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'theme' => $user->theme]);
        }

        return back();
    }
}
