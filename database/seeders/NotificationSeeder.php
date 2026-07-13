<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            $user = User::first();
        }

        if (!$user) {
            return;
        }

        // Clear existing notifications
        Notification::forUser($user->id)->delete();

        $notifications = [
            [
                'id' => (string) Str::uuid(),
                'type' => 'GenericNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => [
                    'title' => 'Report Creator configured',
                    'message' => 'Default templates have been successfully initialized for Omni Consumer Products.',
                    'category' => 'system',
                    'icon' => 'file-text',
                    'action_url' => route('dashboard'),
                    'action_label' => 'View Workspace',
                ],
                'read_at' => null,
                'created_at' => now()->subMinutes(15),
            ],
            [
                'id' => (string) Str::uuid(),
                'type' => 'GenericNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => [
                    'title' => 'Security Alert: New Login',
                    'message' => 'A new login was detected from IP address 203.0.113.45 (macOS, Safari).',
                    'category' => 'security',
                    'icon' => 'shield',
                    'action_url' => null,
                    'action_label' => null,
                ],
                'read_at' => null,
                'created_at' => now()->subHours(2),
            ],
            [
                'id' => (string) Str::uuid(),
                'type' => 'GenericNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => [
                    'title' => 'Draft Report Generated',
                    'message' => 'Your internal network penetration testing draft report is ready for download.',
                    'category' => 'general',
                    'icon' => 'file-text',
                    'action_url' => route('dashboard'),
                    'action_label' => 'Download Draft',
                ],
                'read_at' => null,
                'created_at' => now()->subHours(5),
            ],
            [
                'id' => (string) Str::uuid(),
                'type' => 'GenericNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => [
                    'title' => 'System Maintenance Scheduled',
                    'message' => 'OffSec Labs will undergo scheduled maintenance tonight at 02:00 UTC for database upgrades.',
                    'category' => 'system',
                    'icon' => 'server',
                    'action_url' => null,
                    'action_label' => null,
                ],
                'read_at' => now()->subHours(12),
                'created_at' => now()->subHours(24),
            ],
        ];

        foreach ($notifications as $n) {
            Notification::create($n);
        }
    }
}
