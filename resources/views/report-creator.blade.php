<x-app-layout>
    <div id="report-creator-root" data-username="{{ Auth::user()->email }}" class="w-full"></div>
    @vite(['resources/js/report-creator.tsx'])
</x-app-layout>
