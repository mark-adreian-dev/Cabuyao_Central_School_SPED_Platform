<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use App\Models\Faculty;

class SectionController extends Controller
{
    public function index()
    {
        $sections = Section::with(['students.user', 'faculty.user'])->get();

        return response()->json(["sections" => $sections], 200);
    }

    public function show(Section $section)
    {
        return response()->json(["section" => $section->load("students.user", "faculty.user")], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_name' => 'required|string',
            'grade_level' => 'required|integer',
            'faculty_id' => 'required|exists:faculties,id',
            'school_year' => 'required|string',
            'isActive' => 'required|boolean',
        ]);

        $section = Section::create([
            'section_name' => $validated['section_name'],
            'grade_level' => $validated['grade_level'],
            'faculty_id' => $validated['faculty_id'],
            'school_year' => $validated['school_year'],
            'isActive' => $validated['isActive'],
        ])->with(['students.user', 'faculty.user'])->get();

        return response()->json(["section" => $section], 201);


    }

    public function update(Request $request, Section $section)
    {
        try {
            $validated = $request->validate([
                'grade_level' => 'sometimes|integer',
                'faculty_id' => 'sometimes|exists:faculties,id',
                'school_year' => 'sometimes|string',
                'isActive' => 'sometimes|boolean',
                'section_name' => 'sometimes|string',
                'section_description' => 'sometimes|string',
            ]);
            $section->update($validated);

            return response()->json(["section" => $section, "req" => $validated], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 400);
        }
    }

    public function destroy(Section $section)
    {
        $section->delete();

        return response()->json(['message' => 'Section deleted successfully.']);
    }

    public function showStudentSections(Student $student)
    {
        $sections = $student->sections()->with(['faculty.user'])->get();

        return response()->json(["sections" => $sections], 200);
    }

    public function showActiveSections(bool $status)
    {
        $sections = Section::where('isActive', $status)->with(['students.user', 'faculty.user'])->get();

        return response()->json(["sections" => $sections], 200);
    }

    public function showInactiveSections()
    {
        return response()->json(["sections" => Section::where('isActive', false)->with(['students.user', 'faculty.user'])->get()], 200);
    }

    public function showFacultySections(Faculty $faculty)
    {
        $sections = $faculty->sections()->with(['students.user'])->get();

        return response()->json(["sections" => $sections], 200);
    }

    public function addStudentsToSection(Request $request, Section $section)
    {
        $validated = $request->validate([
            'students' => 'required|array',
            'students.*' => 'exists:students,id'
        ]);
        DB::beginTransaction();

        try {
            foreach ($validated['students'] as $studentId) {
                $student = Student::findOrFail($studentId);
                $activeSection = $student->activeSection();

                if ($activeSection) {
                    return response()->json(["message" => "A student is already enlisted on an active section."], 400);
                }
            }
            foreach ($validated['students'] as $studentId) {
                $student = Student::findOrFail($studentId);

                $section->students()->attach($student->id);
            }
            DB::commit();

            return response()->json(
                [
                    'message' => 'Students successfully added to the section.',
                    "section" => $section->load("students.user", "faculty.user")
                ],
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function removeStudentToSection(Request $request, Section $section)
    {
        $validated = $request->validate([
            'student_id' => 'required'
        ]);
        $student = Student::findOrFail($validated['student_id']);
        $valid = $student->sections()->where('section_id', $section->id)->exists();
        if (!$valid) {
            return response()->json(["message" => "Student is not enrolled in selected section"], 400);
        }
        $student->sections()->detach($section->id);
        return response()->json(["message" => "Student removed successfully"], 200);
    }
}