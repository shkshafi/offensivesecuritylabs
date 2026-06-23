<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('password');
        });

        // Seed/Ensure default admin user exists
        $adminEmail = 'shaik.shafi.ur.rahman@gmail.com';
        $adminUser = DB::table('users')->where('email', $adminEmail)->first();

        if ($adminUser) {
            DB::table('users')->where('email', $adminEmail)->update([
                'role' => 'admin',
            ]);
        } else {
            DB::table('users')->insert([
                'name' => 'Shaik Shafi ur Rahman',
                'email' => $adminEmail,
                'password' => Hash::make('password'),
                'role' => 'admin',
                'theme' => 'dark',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
