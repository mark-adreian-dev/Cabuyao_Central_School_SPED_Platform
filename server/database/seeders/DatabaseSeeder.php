<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $now = now();

        $roles = [
            ['count' => 5, 'role' => 'STUDENT'],
            ['count' => 5, 'role' => 'GUARDIAN'],
            ['count' => 3, 'role' => 'FACULTY'],
            ['count' => 1, 'role' => 'PRINCIPAL'],
        ];

        $index = 1;

        foreach ($roles as $group) {
            for ($i = 0; $i < $group['count']; $i++) {
                User::create([
                    'first_name' => 'First' . $index,
                    'last_name' => 'Last' . $index,
                    'middle_name' => 'M',
                    'ext' => null,
                    'role' => $group['role'],
                    'sex' => $i % 2 === 0 ? 'MALE' : 'FEMALE',
                    'profile_picture' => null,
                    'date_of_birth' => '2000-01-01',
                    'mobile_number' => '0917123456' . $index,
                    'address' => '123 Example Street',
                    'age' => 24,
                    'email' => "user{$index}@example.com",
                    'email_verified_at' => $now,
                    'password' => Hash::make('password'),
                ]);

                $index++;
            }
        }

        DB::transaction(function () {
            $students = User::where('role', 'STUDENT')->get();

            foreach ($students as $index => $user) {
                DB::table('students')->insert([
                    'id' => 25000 + $user->id,
                    'user_id' => $user->id,
                    'grade_level' => rand(7, 12),
                    'mother_tongue' => 'Tagalog',
                    'LRN' => 'LRN' . str_pad($user->id, 8, '0', STR_PAD_LEFT),
                    'current_school' => 'Watcher High School',
                ]);
            }
        });

        DB::transaction(function () {
            $faculties = User::where('role', 'FACULTY')->get();

            foreach ($faculties as $user) {
                DB::table('faculties')->insert([
                    'user_id' => $user->id,
                    'position' => rand(1, 4),
                ]);
            }
        });

        DB::transaction(function () {
            $principal = User::where('role', 'PRINCIPAL')->first();

            if ($principal) {
                DB::table('principals')->insert([
                    'user_id' => $principal->id,
                    'year_started' => 2020,
                    'year_ended' => null,
                ]);
            }
        });

        DB::transaction(function () {
            $guardians = User::where('role', 'GUARDIAN')->get();
            $students = DB::table('students')->pluck('id')->toArray();

            foreach ($guardians as $index => $guardian) {
                $studentId = $students[$index % count($students)];

                DB::table('guardians')->insert([
                    'user_id' => $guardian->id,
                    'student_id' => $studentId,
                    'mother_tongue' => 'Tagalog',
                ]);
            }
        });
    }
}