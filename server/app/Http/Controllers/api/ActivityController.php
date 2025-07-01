<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\CreateActivityRequest;
use App\Services\FileUploaderService;
use App\Models\Activity;
use App\Models\ActivityFile;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    protected $fileUploader;
    public function __construct(FileUploaderService $fileUploader)
    {
        $this->fileUploader = $fileUploader;
    }

    public function index()
    {
        $activities = Activity::with('files')->get();
        return response()->json(["activities" => $activities], 200);
    }

    public function store(CreateActivityRequest $request)
    {
        try {
            $validated = $request->validated();
            $faculty = Faculty::where('user_id', Auth::id())->first();
            $activity = Activity::create([
                "faculty_id" => $faculty->id,
                "deadline" => $validated["deadline"],
                "activity_description" => $validated["activity_description"],
                "passing_score" => $validated["passing_score"],
                "perfect_score" => $validated["perfect_score"],
                "activity_question" => $validated["activity_question"],
            ]);

            $paths = [];
            if ($request->hasFile('activity_files')) {
                $paths = $this->fileUploader->storeFiles($request->file('activity_files'), 'activities', 's3');
            }

            foreach ($paths as $path) {
                ActivityFile::create([
                    'activity_id' => $activity->id,
                    'activity_file' => $path
                ]);
            }

            return response()->json(["message" => "Uploaded", "files" => $paths, "activity" => $activity], 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }



    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        return response()->json(["activity" => $activity->with("files"), "sections" => $activity->with("sections")], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activity $activity)
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