<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class AppLayout extends Component
{
    public array $viteScripts;

    /**
     * Create a new component instance.
     */
    public function __construct(array $viteScripts = [])
    {
        $this->viteScripts = $viteScripts;
    }

    /**
     * Get the view / contents that represents the component.
     */
    public function render(): View
    {
        return view('layouts.app');
    }
}
