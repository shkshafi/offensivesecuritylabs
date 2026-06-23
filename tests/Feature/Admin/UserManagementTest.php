<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admins_cannot_access_user_management(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/admin/users');

        $response->assertStatus(403);
    }

    public function test_admins_can_access_user_management(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this
            ->actingAs($admin)
            ->get('/admin/users');

        $response->assertOk();
        $response->assertViewIs('admin.users.index');
    }

    public function test_admins_can_change_user_role(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patch("/admin/users/{$user->id}/role", [
                'role' => 'admin',
            ]);

        $response->assertRedirect();
        $this->assertEquals('admin', $user->fresh()->role);
    }

    public function test_admins_cannot_change_default_admin_role(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        $defaultAdmin = User::where('email', 'shaik.shafi.ur.rahman@gmail.com')->first();
        if (!$defaultAdmin) {
            $defaultAdmin = User::factory()->create([
                'email' => 'shaik.shafi.ur.rahman@gmail.com',
                'role' => 'admin',
            ]);
        }

        $response = $this
            ->actingAs($admin)
            ->patch("/admin/users/{$defaultAdmin->id}/role", [
                'role' => 'user',
            ]);

        $response->assertSessionHasErrors('role');
        $this->assertEquals('admin', $defaultAdmin->fresh()->role);
    }

    public function test_admins_can_change_user_password(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patch("/admin/users/{$user->id}/password", [
                'password' => 'new-password123',
                'password_confirmation' => 'new-password123',
            ]);

        $response->assertRedirect();
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('new-password123', $user->fresh()->password));
    }

    public function test_admins_can_delete_users(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this
            ->actingAs($admin)
            ->delete("/admin/users/{$user->id}");

        $response->assertRedirect();
        $this->assertNull(User::find($user->id));
    }

    public function test_admins_cannot_delete_default_admin(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        $defaultAdmin = User::where('email', 'shaik.shafi.ur.rahman@gmail.com')->first();
        if (!$defaultAdmin) {
            $defaultAdmin = User::factory()->create([
                'email' => 'shaik.shafi.ur.rahman@gmail.com',
                'role' => 'admin',
            ]);
        }

        $response = $this
            ->actingAs($admin)
            ->delete("/admin/users/{$defaultAdmin->id}");

        $response->assertSessionHasErrors('delete');
        $this->assertNotNull(User::find($defaultAdmin->id));
    }

    public function test_admins_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this
            ->actingAs($admin)
            ->delete("/admin/users/{$admin->id}");

        $response->assertSessionHasErrors('delete');
        $this->assertNotNull(User::find($admin->id));
    }

    public function test_admins_can_create_new_users(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this
            ->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'New User Created By Admin',
                'email' => 'admincreated@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'user',
            ]);

        $response->assertRedirect();
        $user = User::where('email', 'admincreated@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('New User Created By Admin', $user->name);
        $this->assertEquals('user', $user->role);
    }

    public function test_non_admins_cannot_create_users(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this
            ->actingAs($user)
            ->post('/admin/users', [
                'name' => 'Should Fail',
                'email' => 'shouldfail@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'user',
            ]);

        $response->assertStatus(403);
        $this->assertNull(User::where('email', 'shouldfail@example.com')->first());
    }
}
