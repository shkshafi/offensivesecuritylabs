<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class NotificationController extends Controller
{
    public function index(Request $request): View
    {
        $query = Notification::forUser(auth()->id())->latest();

        if ($request->filled('status')) {
            if ($request->status === 'unread') {
                $query->unread();
            } elseif ($request->status === 'read') {
                $query->read();
            }
        }

        $notifications = $query->paginate(20)->withQueryString();
        $unreadCount = Notification::forUser(auth()->id())->unread()->count();

        return view('notifications.index', compact('notifications', 'unreadCount'));
    }

    public function markAsRead(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);

        if ($notification->notifiable_id !== auth()->id() || $notification->notifiable_type !== User::class) {
            abort(403);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read.',
        ]);
    }

    public function markAllAsRead(): JsonResponse
    {
        Notification::forUser(auth()->id())
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);

        if ($notification->notifiable_id !== auth()->id() || $notification->notifiable_type !== User::class) {
            abort(403);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted.',
        ]);
    }

    public function unreadCount(): JsonResponse
    {
        $count = Notification::forUser(auth()->id())->unread()->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    public function recent(): JsonResponse
    {
        $notifications = Notification::forUser(auth()->id())
            ->latest()
            ->take(5)
            ->get();

        $data = $notifications->map(function ($n) {
            return [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'icon' => $n->icon,
                'category' => $n->category,
                'action_url' => $n->action_url,
                'action_label' => $n->action_label,
                'is_read' => $n->read_at !== null,
                'created_at' => $n->created_at->format('Y-m-d H:i:s'),
                'time_ago' => $n->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'notifications' => $data,
        ]);
    }
}
