<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\CreateStudentActivityRequest;
use App\Models\Student;
use App\Models\StudentActivity;
use App\Models\StudentActivityFile;
use Illuminate\Http\Request;
use App\Services\FileUploaderService;

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
        return response()->json(["student_activities" => Student::with(["user, activities"])], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStudentActivityRequest $request)
    {
        try {
            $validated = $request->validated();
            if ($request->hasFile('answer_files')) {

                $studentActivity = StudentActivity::create([
                    'student_id' => $validated['student_id'],
                    'activity_id' => $validated['activity_id'],
                ]);

                $paths = $this->fileUploader->storeFiles($request->file('answer_files'), 'student_activities', 's3');

                if (!$paths) {
                    return response()->json(["message" => "File upload failed"], 500);
                }

                foreach ($paths as $path) {
                    StudentActivityFile::create([
                        'student_activity_id' => $studentActivity->id,
                        'activity_file' => $path
                    ]);
                }
                return response()->json(["message" => "Submitted successfully"], 201);
            }
            return response()->json(["message" => "No files uploaded"], 400);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
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
    public function destroy(string $id)
    {
        //
    }
}