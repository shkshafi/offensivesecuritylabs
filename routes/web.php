<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/waitlist', [\App\Http\Controllers\WaitlistController::class, 'store'])->name('waitlist.store');

Route::get('/dashboard', function () {
    return view('report-creator');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Appearance Settings
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

    Route::get('/coming-soon', function () {
        return view('coming-soon');
    })->name('coming-soon');

    // Redirect old report-creator routes to dashboard
    Route::redirect('/report-creator', '/dashboard');
    Route::redirect('/report-creator/templates', '/dashboard/templates');

    Route::get('/dashboard/templates', function () {
        return view('report-creator');
    })->name('dashboard.templates');

    Route::get('/dashboard/builder/{id?}', function () {
        return view('report-creator');
    })->name('report-builder');

    Route::prefix('admin/groqai')->name('admin.groqai.')->group(function () {
        Route::post('/query', [\App\Http\Controllers\Admin\GroqAIController::class, 'query'])->name('query');
        Route::get('/models', [\App\Http\Controllers\Admin\GroqAIController::class, 'models'])->name('models');
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
        Route::post('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
        Route::patch('/admin/users/{user}/role', [\App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.update-role');
        Route::patch('/admin/users/{user}/password', [\App\Http\Controllers\Admin\UserController::class, 'changePassword'])->name('admin.users.change-password');
        Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

        // Waitlist Management
        Route::get('/admin/waitlist', [\App\Http\Controllers\Admin\WaitlistController::class, 'index'])->name('admin.waitlist.index');
        Route::post('/admin/waitlist/{waitlist}/approve', [\App\Http\Controllers\Admin\WaitlistController::class, 'approve'])->name('admin.waitlist.approve');
        Route::delete('/admin/waitlist/{waitlist}', [\App\Http\Controllers\Admin\WaitlistController::class, 'destroy'])->name('admin.waitlist.destroy');
    });

    Route::post('/api/reports/export-pdf', [\App\Http\Controllers\ReportExportController::class, 'exportPdf'])->name('reports.export-pdf');

});

require __DIR__.'/auth.php';
