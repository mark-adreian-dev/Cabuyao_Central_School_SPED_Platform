<?php

namespace Database\Seeders;

use App\Models\Disability;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Section;
use App\Models\Faculty;
use App\Models\Lesson;
use App\Models\Activity;
use App\Models\LessonFile;
use App\Models\LessonLink;
use App\Models\ActivityFile;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $now = now();

        $roles = [
            ['count' => 150, 'role' => 'STUDENT'],
            ['count' => 5, 'role' => 'GUARDIAN'],
            ['count' => 5, 'role' => 'FACULTY'],
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

        DB::transaction(function () {
            $disabilities = [
                ['name' => 'Autism Spectrum Disorder'],
                ['name' => 'Deafness'],
                ['name' => 'Blindness'],
                ['name' => 'ADHD'],
            ];

            foreach ($disabilities as $disability) {
                Disability::create($disability);
            }
        });

        DB::transaction(function () {
            $faculties = DB::table('faculties')->pluck('id')->toArray();
            $disabilities = DB::table('disabilities')->pluck('id')->toArray();

            $count = 0;
            foreach ($faculties as $facultyId) {
                for ($i = 0; $i < 3; $i++) {
                    Section::create([
                        'section_name' => 'Section ' . $count,
                        'grade_level' => rand(1, 6),
                        'faculty_id' => $facultyId,
                        'school_year' => '2024-2025',
                        'isActive' => true,
                        'disability_id' => $disabilities[array_rand($disabilities)],
                    ]);
                    $count++;
                }
            }
        });

        DB::transaction(function () {
            $students = DB::table('students')->pluck('id')->toArray();
            $disabilities = DB::table('disabilities')->pluck('id')->toArray();

            foreach ($students as $studentId) {
                DB::table('student_disabilities')->insert([
                    'student_id' => $studentId,
                    'disability_id' => $disabilities[array_rand($disabilities)],
                ]);
            }
        });

        DB::transaction(function () {
            $sections = Section::all();

            foreach ($sections as $section) {
                $studentsWithDisability = DB::table('students')
                    ->join('student_disabilities', 'students.id', '=', 'student_disabilities.student_id')
                    ->where('disability_id', $section->disability_id)
                    ->pluck('students.id')->toArray();

                $studentsToAssign = array_slice($studentsWithDisability, 0, 10);

                foreach ($studentsToAssign as $studentId) {
                    DB::table('student_sections')->insert([
                        'student_id' => $studentId,
                        'section_id' => $section->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });

        DB::transaction(function () {
            $faculties = Faculty::all()->load(["sections"]);
            $sections = Section::all();

            $count = 0;
            foreach ($faculties as $faculty) {
                for ($i = 0; $i < 5; $i++) {
                    $lesson = Lesson::create([
                        'lesson_title' => 'Lesson ' . $count,
                        'lesson_description' => 'This is a sample lesson description.',
                        'faculty_id' => $faculty->id,
                    ]);

                    if ($faculty->sections->isNotEmpty()) {
                        $lesson->sections()->attach($faculty->sections->random()->id);
                    }

                    LessonFile::create([
                        'lesson_file' => 'https://via.placeholder.com/150',
                        'file_name' => 'Sample File',
                        'file_size' => '1000',
                        'lesson_id' => $lesson->id,
                    ]);

                    LessonLink::create([
                        'lesson_link' => 'https://example.com',
                        'link_name' => 'Sample Link',
                        'lesson_id' => $lesson->id,
                    ]);
                    $count++;
                }

                for ($i = 0; $i < 5; $i++) {
                    $activity = Activity::create([
                        'faculty_id' => $faculty->id,
                        'deadline' => now()->addDays(7),
                        'perfect_score' => 100,
                        'passing_score' => 75,
                        'activity_question' => 'This is a sample activity question.',
                        'activity_description' => 'This is a sample activity description.',
                    ]);

                    $activity->sections()->attach($sections->random()->id, [
                        'deadline' => "2025-08-29 12:08:23",
                        'grading_period' => "1"
                    ]);

                    ActivityFile::create([
                        'activity_file' => 'https://via.placeholder.com/150',
                        'file_name' => 'Sample File',
                        'file_size' => '1000',
                        'activity_id' => $activity->id,
                    ]);
                }
            }
        });
    }
}