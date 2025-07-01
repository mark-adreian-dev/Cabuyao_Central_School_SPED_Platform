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
        return response()->json(["section" => $section->load(["students.user, faculty.user"])], 200);
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
        ]);

        return response()->json(["section" => $section], 201);
    }

    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'grade_level' => 'required|integer',
            'faculty_id' => 'required|exists:faculties,id',
            'school_year' => 'required|string',
            'isActive' => 'required|boolean',
        ]);
        $section->update([
            'grade_level' => $validated['grade_level'],
            'faculty_id' => $validated['faculty_id'],
            'school_year' => $validated['school_year'],
            'isActive' => $validated['isActive'],
        ]);

        return response()->json(["section" => $section], 200);
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

    public function showActiveSections()
    {
        $sections = Section::where('isActive', true)->with(['students.user', 'faculty.user'])->get();

        return response()->json(["sections" => $sections], 200);
    }

    public function showInactiveSections()
    {
        $sections = Section::where('isActive', false)->with(['students.user', 'faculty.user'])->get();

        return response()->json(["sections" => $sections], 200);
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
                    "section" => $section->load(["students.user, faculty.user"])
                ],
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function addStudentToSection(Section $section, Student $student)
    {
        try {
            $activeSection = $student->activeSection();

            if ($activeSection) {
                return response()->json(["message" => "A student is already enlisted on an active section."], 400);
            }
            $section->students()->attach($student->id);
            return response()->json(
                [
                    'message' => 'Students successfully added to the section.',
                    "section" => $section->load(["students.user, faculty.user"])
                ],
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
