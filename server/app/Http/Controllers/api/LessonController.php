<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\CreateLessonRequest;
use App\Models\Lesson;
use App\Models\Section;
use App\Models\Student;
use App\Models\LessonFile;
use App\Models\LessonLink;
use App\Models\Faculty;
use Illuminate\Http\Request;
use App\Services\FileUploaderService;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    protected $fileUploaderService;

    public function __construct(FileUploaderService $fileUploaderService)
    {
        $this->fileUploaderService = $fileUploaderService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lessons = Lesson::with(["sections", "files", "links"])->get();
        return response()->json(["lessons" => $lessons], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateLessonRequest $request)
    {
        try {
            $validated = $request->validated();
            $faculty = Faculty::where('user_id', Auth::id())->first();
            $lesson = Lesson::create([
                'lesson_title' => $validated['lesson_title'],
                'lesson_description' => $validated['lesson_description'],
                'faculty_id' => $faculty->id,
            ]);

            if ($request->hasFile('lesson_files')) {
                $files = $this->fileUploaderService->storeFiles($request->file('lesson_files'), 'lessons', 's3');
                foreach ($files as $file) {
                    LessonFile::create([
                        'lesson_file' => $file['path'],
                        'file_name' => $file['file_name'],
                        'file_size' => $file['file_size'],
                        'lesson_id' => $lesson->id,
                    ]);
                }
            }

            if ($request->has('lesson_links')) {
                foreach ($validated['lesson_links'] as $link) {
                    LessonLink::create([
                        'lesson_link' => $link["lesson_link"],
                        'link_name' => $link["link_name"],
                        'lesson_id' => $lesson->id,
                    ]);
                }
            }

            return response()->json([
                'lesson' => $lesson->load(['files', 'links']),
            ], 201);
        } catch (\Throwable $th) {
            $validated = $request->validated();
            return response()->json(["message" => $th->getMessage(), "req" => $validated], 500);
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson)
    {
        return response()->json(['lesson' => $lesson->load(['sections', 'files', 'links'])], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'lesson_title' => 'sometimes|string',
            'lesson_description' => 'sometimes|string',
        ]);

        $lesson->update($validated);

        return response()->json(['lesson' => $lesson], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lesson $lesson)
    {
        try {
            $lesson->files()->each(function ($file) {
                $this->fileUploaderService->deleteFile($file->lesson_file, 's3');
                $file->delete();
            });
            foreach ($lesson->links as $link) {
                $link->delete();
            }
            $lesson->sections()->detach();
            $lesson->delete();
            return response()->json(['message' => 'Lesson deleted successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], $th->getCode() ?: 500);
        }
    }

    public function removeFileFromLesson(LessonFile $file)
    {
        try {
            $this->fileUploaderService->deleteFile($file->lesson_file, 's3');
            $file->delete();

            return response()->json(['message' => 'Files removed successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    public function addFileFromLesson(Request $request, Lesson $lesson)
    {
        try {
            if ($request->hasFile('lesson_files')) {
                $paths = $this->fileUploaderService->storeFiles($request->file('lesson_files'), 'lessons', 's3');

                if (!$paths) {
                    return response()->json(["message" => "File upload failed"], 500);
                }

                foreach ($paths as $path) {
                    LessonFile::create([
                        'lesson_id' => $lesson->id,
                        'lesson_file' => $path
                    ]);
                }
                return response()->json(["message" => "Files uploaded successfully", "files" => $paths], 201);
            }
            return response()->json(["message" => "No files uploaded"], 400);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    public function addLessonToSection(Request $request, Lesson $lesson)
    {
        try {
            $validated = $request->validate([
                'section_id' => 'required|exists:sections,id',
            ]);

            $lesson->sections()->attach($validated['section_id']);

            return response()->json(['message' => 'Lesson added to section successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }

    }

    public function removeLessonFromSection(Request $request, Lesson $lesson)
    {
        try {
            $validated = $request->validate([
                'section_id' => 'required|exists:sections,id',
            ]);

            $lesson->sections()->detach($validated['section_id']);

            return response()->json(['message' => 'Lesson removed from section successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    public function getLessonsBySection(Section $section)
    {
        $lessons = Lesson::whereHas('sections', function ($query) use ($section) {
            $query->where('section_id', $section->id);
        })->with(['files', 'links'])->get();

        return response()->json(['lessons' => $lessons], 200);
    }

    public function getLessonsByFaculty(Faculty $faculty)
    {
        $lessons = Lesson::where('faculty_id', $faculty->id)->withCount(['comments', 'files', 'links'])->get();
        return response()->json(['lessons' => $lessons], 200);
    }

    public function getLessonsByStudent(Student $student)
    {
        $lessons = Lesson::whereHas('sections.students', function ($query) use ($student) {
            $query->where('student_id', $student->id);
        })->with(['files', 'links'])->get();

        return response()->json(['lessons' => $lessons], 200);
    }

    public function addLessonLink(Request $request, Lesson $lesson)
    {
        try {
            $validated = $request->validate([
                'lesson_link' => 'required|string',
                'link_name' => 'required|string',
            ]);

            $link = LessonLink::create([
                'lesson_link' => $validated['lesson_link'],
                'link_name' => $validated['link_name'],
                'lesson_id' => $lesson->id,
            ]);

            return response()->json(['link' => $link], 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }

    public function removeLessonLink(Request $request, Lesson $lesson)
    {
        try {
            $validated = $request->validate([
                'link_id' => 'required|exists:lesson_links,id',
            ]);

            $link = LessonLink::findOrFail($validated['link_id']);
            $link->delete();

            return response()->json(['message' => 'Link removed successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }
}