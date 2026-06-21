<x-app-layout :vite-scripts="['resources/js/report-creator.tsx']">
    <div id="report-creator-root" data-username="{{ Auth::user()->email }}" class="w-full"></div>
</x-app-layout>
