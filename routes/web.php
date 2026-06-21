<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Appearance Settings
    Route::get('/settings/appearance', [AppearanceController::class, 'edit'])->name('settings.appearance.edit');
    Route::patch('/settings/appearance', [AppearanceController::class, 'update'])->name('settings.appearance.update');

    // Notifications
    Route::prefix('dashboard/notifications')->name('dashboard.notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::get('/recent', [NotificationController::class, 'recent'])->name('recent');
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
    });

    // Custom Apps
    Route::get('/report-creator', function () {
        return view('report-creator');
    })->name('report-creator');

    Route::post('/api/reports/export-pdf', [\App\Http\Controllers\ReportExportController::class, 'exportPdf'])->name('reports.export-pdf');

    Route::get('/recon-agent', function () {
        return view('recon-agent');
    })->name('recon-agent');

    Route::get('/utilities', function () {
        return view('utilities');
    })->name('utilities');
});

require __DIR__.'/auth.php';
