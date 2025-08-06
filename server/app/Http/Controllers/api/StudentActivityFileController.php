<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\CreateStudentActivityFileRequest;
use App\Models\StudentActivity;
use App\Models\StudentActivityFile;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\FileUploaderService;

class StudentActivityFileController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStudentActivityFileRequest $request)
    {
        $validated = $request->validated();
        $studentId = Student::where('user_id', Auth::id())->value('id');
        $studentActivity = StudentActivity::find($validated['student_activity_id']);

        if (!$studentActivity) {
            return response()->json(["message" => "Activity submission doesn't exist"], 404);
        }

        if ($studentActivity->student_id !== $studentId) {
            return response()->json(["message" => "You are not unauthorized to access this data"], 401);
        }

        try {
            $path = $this->fileUploader->storeFile($request->file('activity_file'), 'student_activities', 's3');

            $file = StudentActivityFile::create([
                'student_activity_id' => $validated['student_activity_id'],
                'activity_file' => $path["path"],
                'file_name' => $path["file_name"],
                'file_size' => $path["file_size"]
            ]);

            return response()->json([
                "message" => "File uploaded successfully",
                "file" => $file
            ], 201);

        } catch (\Throwable $th) {
            return response()->json([
                "message" => "File upload failed: " . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.z
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, StudentActivityFile $file)
    {
        $validated = $request->validate([
            'student_activity_id' => 'required|exists:student_activities,id'
        ]);

        $studentId = Student::where('user_id', Auth::id())->value('id');
        $studentActivity = StudentActivity::find($validated['student_activity_id']);

        if (!$file) {
            return response()->json(["message" => "File doesn't exist"], 404);
        }

        if (!$studentActivity) {
            return response()->json(["message" => "Activity submission doesn't exist"], 404);
        }

        if ($studentActivity->student_id !== $studentId) {
            return response()->json(["message" => "You are not unauthorized to access this data"], 401);
        }
        try {
            $file->delete();
            return response()->json(["message" => "File deleted successfully"], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }

    }
}