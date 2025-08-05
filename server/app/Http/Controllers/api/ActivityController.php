<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\CreateActivityRequest;
use App\Http\Requests\Activity\UpdateActivityRequest;
use App\Services\FileUploaderService;
use App\Models\Activity;
use App\Models\ActivityFile;
use App\Models\Faculty;
use App\Models\Section;
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
        $activities = Activity::with(['files', 'sections'])->get();
        return response()->json(["activities" => $activities], 200);
    }

    public function store(CreateActivityRequest $request)
    {
        try {
            $validated = $request->validated();
            $faculty = Faculty::where('user_id', Auth::id())->first();
            $activity = Activity::create([
                "faculty_id" => $faculty->id,
                "activity_description" => $validated["activity_description"],
                "passing_score" => $validated["passing_score"],
                "perfect_score" => $validated["perfect_score"],
                "activity_question" => $validated["activity_question"],
            ]);

            $files = [];
            if ($request->hasFile('activity_files')) {
                $files = $this->fileUploader->storeFiles($request->file('activity_files'), 'activities', 's3');
            }
            foreach ($files as $file) {
                ActivityFile::create([
                    'activity_id' => $activity->id,
                    'activity_file' => $file["path"],
                    'file_name' => $file["file_name"],
                    'file_size' => $file["file_size"],
                ]);
            }

            return response()->json(["message" => "Uploaded", "activity" => $activity->load("files")], 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        return response()->json(["activity" => $activity->load("files", "sections")], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActivityRequest $request, Activity $activity)
    {
        try {
            $validated = $request->validated();
            $activity->update($validated);
            return response()->json(["activity" => $activity], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
    {
        try {
            $activity->files()->each(function ($file) {
                $this->fileUploader->deleteFile($file->activity_file, 's3');
                $file->delete();
            });
            $activity->delete();
            return response()->json(['message' => 'Activity deleted successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], $th->getCode() ?: 500);
        }
    }

    public function getActivityBySection(Section $section)
    {
        $activities = $section->activities()->with(['files', 'sections'])->get();
        return response()->json(["activities" => $activities], 200);
    }

    public function addActivityToSection(Request $request, Activity $activity)
    {
        try {
            $validated = $request->validate([
                'section_id' => 'required|exists:sections,id',
                'deadline' => 'required|date',
                'grading_period' => 'required|integer|min:1|max:4',
            ]);

            $activity->sections()->attach($validated['section_id'], [
                'deadline' => $validated['deadline'],
                'grading_period' => $validated['grading_period']
            ]);

            return response()->json(["message" => "Activity added to section successfully", "activity" => $activity], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    public function removeActivityToSection(Request $request, Activity $activity)
    {
        try {
            $validated = $request->validate([
                'section_id' => 'required|exists:sections,id',
            ]);

            $activity->sections()->detach($validated['section_id']);

            return response()->json(["message" => "Activity removed from section successfully", "activity" => $activity], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }
}