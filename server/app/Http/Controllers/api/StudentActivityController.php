<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\CreateStudentActivityRequest;
use App\Models\Activity;
use App\Models\Student;
use App\Models\StudentActivity;
use App\Models\StudentActivityFile;
use App\Models\Section;
use DB;
use Illuminate\Http\Request;
use App\Services\FileUploaderService;
use Illuminate\Support\Facades\Auth;

class StudentActivityController extends Controller
{

    protected $fileUploader;

    public function __construct(FileUploaderService $fileUploader)
    {
        $this->fileUploader = $fileUploader;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            "student_activities" => StudentActivity::all()
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStudentActivityRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            if ($request->hasFile('activity_files')) {

                $activity = Activity::with('sections.students')->find($validated['activity_id']);
                $studentId = Student::where('user_id', Auth::id())->value('id');
                $isEnrolled = $activity->sections->contains(function ($section) use ($studentId) {
                    return $section->students->contains('id', $studentId);
                });
                if (!$isEnrolled) {
                    return response()->json(["message" => "You are not enrolled in this activity's section", "isEnrolled" => $isEnrolled], 403);
                }

                $studentActivity = StudentActivity::create([
                    'student_id' => $studentId,
                    'activity_id' => $validated['activity_id'],
                ]);



                $paths = $this->fileUploader->storeFiles($request->file('activity_files'), 'student_activities', 's3');

                if (!$paths) {
                    return response()->json(["message" => "File upload failed"], 500);
                }

                foreach ($paths as $path) {
                    StudentActivityFile::create([
                        'student_activity_id' => $studentActivity->id,
                        'activity_file' => $path["path"],
                        'file_name' => $path["file_name"],
                        'file_size' => $path["file_size"]
                    ]);
                }
                DB::commit();
                return response()->json(["message" => "Submitted successfully", "student_activity" => $studentActivity, "paths" => $paths], 201);
            }
            return response()->json(["message" => "No files uploaded"], 400);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentActivity $studentActivity)
    {
        return response()->json(["student_activity" => $studentActivity->load(['activity', 'files'])], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StudentActivity $studentActivity)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentActivity $studentActivity)
    {
        DB::beginTransaction();
        try {
            $studentId = Student::where('user_id', Auth::id())->value('id');
            if ($studentActivity->student_id !== $studentId) {
                return response()->json(["message" => "You are not unauthorized to access this data"], 401);
            }
            if (!$studentActivity->files->isEmpty()) {
                foreach ($studentActivity->files as $file) {
                    $this->fileUploader->deleteFile($file->activity_file, 's3');
                    $file->delete();
                }
            }
            $studentActivity->delete();
            DB::commit();
            return response()->json(["message" => "Student activity deleted successfully"], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(["message" => $th->getMessage()], 400);
        }

    }

    public function getStudentActivityFiles(StudentActivity $studentActivity)
    {
        return response()->json(["files" => $studentActivity->files], 200);
    }

    public function getStudentActivitiesBySection(Section $section)
    {
        $sectionId = $section->id;
        $activities = StudentActivity::with(['activity', 'files'])
            ->whereHas('activity.sections', function ($query) use ($sectionId) {
                $query->where('id', $sectionId);
            })
            ->get();

        return response()->json(["student_activities" => $activities], 200);
    }

    public function getStudentActivitiesByStudent(Student $student)
    {
        $activities = StudentActivity::with(['activity', 'files'])
            ->where('student_id', $student->id)
            ->get();

        return response()->json(["student_activities" => $activities], 200);
    }

    public function getStudentActivitiesByActivity(Activity $activity)
    {
        $activities = StudentActivity::with(['activity', 'files'])
            ->where('activity_id', $activity->id)
            ->get();

        return response()->json(["student_activities" => $activities], 200);
    }

    public function markStudentActivity(Request $request, StudentActivity $studentActivity)
    {
        $validated = $request->validate([
            'score' => 'required|integer',
            'isPassing' => 'required|boolean',
        ]);

        $studentActivity->update([
            'score' => $validated['score'],
            'isPassing' => $validated['isPassing'],
        ]);

        return response()->json(["message" => "Student activity marked successfully", "student_activity" => $studentActivity], 200);

    }
}