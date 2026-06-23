<?php

namespace Tests\Feature;

use App\Models\Waitlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaitlistTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can join the waitlist with a valid email.
     */
    public function test_can_join_waitlist_with_valid_email(): void
    {
        $response = $this->postJson('/waitlist', [
            'email' => 'operator@offsec.com',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Successfully joined the waitlist!',
            ]);

        $this->assertDatabaseHas('waitlists', [
            'email' => 'operator@offsec.com',
        ]);
    }

    /**
     * Test that invalid email formats are rejected.
     */
    public function test_cannot_join_waitlist_with_invalid_email(): void
    {
        $response = $this->postJson('/waitlist', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test that duplicate emails are rejected.
     */
    public function test_cannot_join_waitlist_with_duplicate_email(): void
    {
        Waitlist::create([
            'email' => 'operator@offsec.com',
        ]);

        $response = $this->postJson('/waitlist', [
            'email' => 'operator@offsec.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
