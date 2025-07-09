<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityFile;
use App\Models\Activity;
use App\Services\FileUploaderService;

class ActivityFileController extends Controller
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
        $activities = ActivityFile::with(['activity', 'activity.sections'])->get();
        return response()->json(["activities" => $activities], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Activity $activity)
    {
        try {
            if ($request->hasFile('activity_files')) {
                $paths = $this->fileUploader->storeFiles($request->file('activity_files'), 'activities', 's3');

                if (!$paths) {
                    return response()->json(["message" => "File upload failed"], 500);
                }

                foreach ($paths as $path) {
                    ActivityFile::create([
                        'activity_id' => $activity->id,
                        'activity_file' => $path
                    ]);
                }
                return response()->json(["message" => "Files uploaded successfully", "files" => $paths], 201);
            }
            return response()->json(["message" => "No files uploaded"], 400);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivityFile $activityFile)
    {
        return response()->json(["activity_file" => $activityFile->load("activity")], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityFile $activityFile)
    {
        try {
            $this->fileUploader->deleteFile($activityFile->activity_file, 's3');
            $activityFile->delete();
            return response()->json(["message" => "File deleted successfully"], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }
}