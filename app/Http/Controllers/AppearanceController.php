<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class AppearanceController extends Controller
{
    /**
     * Display the user's appearance settings form.
     */
    public function edit(Request $request): View
    {
        return view('settings.appearance', [
            'user' => $request->user(),
            'theme' => $request->user()->theme ?? 'dark',
            'background_style' => $request->user()->getBackgroundStyle(),
        ]);
    }

    /**
     * Update the user's appearance preferences.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => ['required', 'in:light,dark'],
            'background_style' => ['required', 'in:none,colourful'],
        ]);

        $user = $request->user();
        $appearanceSettings = $user->appearance_settings ?? [];
        $appearanceSettings['background_style'] = $validated['background_style'];

        $user->update([
            'theme' => $validated['theme'],
            'appearance_settings' => $appearanceSettings,
        ]);

        return Redirect::route('settings.appearance.edit')->with('status', 'appearance-updated');
    }
}
