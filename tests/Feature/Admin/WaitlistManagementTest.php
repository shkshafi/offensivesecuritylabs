<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Waitlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaitlistManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that non-admin users cannot access the waitlist administration routes.
     */
    public function test_non_admins_cannot_access_waitlist_management(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/admin/waitlist');

        $response->assertStatus(403);
    }

    /**
     * Test that admin users can access the waitlist administration routes.
     */
    public function test_admins_can_access_waitlist_management(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this
            ->actingAs($admin)
            ->get('/admin/waitlist');

        $response->assertStatus(200)
            ->assertViewIs('admin.waitlist.index');
    }

    /**
     * Test that admin users can approve a waitlisted user.
     */
    public function test_admins_can_approve_waitlisted_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $waitlist = Waitlist::create([
            'email' => 'waitlisted@example.com',
        ]);

        $response = $this
            ->actingAs($admin)
            ->post("/admin/waitlist/{$waitlist->id}/approve", [
                'name' => 'Approved User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'user',
            ]);

        $response->assertRedirect(route('admin.waitlist.index'));
        
        // Assert user exists
        $user = User::where('email', 'waitlisted@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('Approved User', $user->name);
        $this->assertEquals('user', $user->role);

        // Assert waitlist entry is deleted
        $this->assertDatabaseMissing('waitlists', [
            'id' => $waitlist->id,
        ]);
    }

    /**
     * Test that admin users can remove a waitlist entry.
     */
    public function test_admins_can_delete_waitlist_entry(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $waitlist = Waitlist::create([
            'email' => 'tobedeleted@example.com',
        ]);

        $response = $this
            ->actingAs($admin)
            ->delete("/admin/waitlist/{$waitlist->id}");

        $response->assertRedirect(route('admin.waitlist.index'));

        // Assert waitlist entry is deleted
        $this->assertDatabaseMissing('waitlists', [
            'id' => $waitlist->id,
        ]);
    }
}
