<?php

use App\Http\Controllers\api\ActivityController;
use App\Http\Controllers\api\ActivityFileController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\SectionController;
use App\Http\Controllers\api\StudentActivityController;
use App\Http\Controllers\api\StudentActivityFileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\LessonController;


Route::prefix("user")->group(function () {
    // Unprotected Routes (Available to unauthenticated users)
    Route::post("/register", [AuthController::class, 'register']); // Register user
    Route::post("/send-email-verification/{user}", [AuthController::class, 'sendVerification']);
    Route::post("/verify-email/{user}", [AuthController::class, 'verifyCode']);
    Route::post("/login", [AuthController::class, 'login']); // Login user to get token (no auth:sanctum middleware)

    // Protected Routes for User (Requires Auth)
    Route::middleware(["auth:sanctum"])->group(function () {
        Route::get("/", [AuthController::class, 'loadUser']);
        Route::post("/logout", [AuthController::class, 'logout']);
        Route::get("/student-data/{user}", [AuthController::class, 'loadStudentData']);
        Route::get("/admin/{user}", [AuthController::class, 'loadAdminData']);
        Route::get("/faculty/{user}", [AuthController::class, 'loadFacultyData']);
    });
});

Route::group(["prefix" => "sections", 'middleware' => ['auth:sanctum']], function () {
    Route::get('/{section}', [SectionController::class, 'show']);
    Route::get('/student/{student}', [SectionController::class, 'showStudentSections']);
    Route::middleware(['role:FACULTY'])->group(function () {
        Route::put('/{section}', [SectionController::class, 'update']);
        Route::delete('/{section}', [SectionController::class, 'destroy']);
        Route::post('/{section}/add-students', [SectionController::class, 'addStudentsToSection']);
        Route::delete('/{section}/remove-student', [SectionController::class, 'removeStudentToSection']);
        Route::post('/', [SectionController::class, 'store']);
    });
    Route::middleware(['role:FACULTY,PRINCIPAL'])->group(function () {
        Route::get('/', [SectionController::class, 'index']);
        Route::get('/status/{status}', [SectionController::class, 'showActiveSections']);
        Route::get('/faculty/{faculty}', [SectionController::class, 'showFacultySections']);
    });
});

Route::group(["prefix" => "activities", 'middleware' => ['auth:sanctum']], function () {
    Route::get('/', [ActivityController::class, 'index']);
    Route::get('/{activity}', [ActivityController::class, 'show']);
    Route::get('/section/{section}', [ActivityController::class, 'getActivityBySection']);

    Route::middleware(['role:FACULTY'])->group(function () {
        Route::post('/', [ActivityController::class, 'store']);
        Route::put('/{activity}', [ActivityController::class, 'update']);
        Route::delete('/{activity}', [ActivityController::class, 'destroy']);
        Route::post('/{activity}/add-section', [ActivityController::class, 'addActivityToSection']);
        Route::delete('/{activity}/remove-section', [ActivityController::class, 'removeActivityToSection']);
        Route::get('/files', [ActivityFileController::class, 'index']);
        Route::get('/{activity}/section/{section}', [StudentActivityController::class, 'getActivityBySection']);
        Route::get('/student', [StudentActivityController::class, 'index']);
        Route::post('{activity}/file-upload', [ActivityController::class, 'addFileFromActivity']);
        Route::delete('/file-delete/{file}', [ActivityController::class, 'removeFileFromActivity']);
    });



    Route::group(["prefix" => "student", 'middleware' => ['role:STUDENT']], function () {
        Route::post('/', [StudentActivityController::class, 'store']);
        Route::delete('/{studentActivity}', [StudentActivityController::class, 'destroy']);
        Route::post('/file-upload', [StudentActivityFileController::class, 'store']);
        Route::post('/file-delete/{file}', [StudentActivityFileController::class, 'destroy']);
    });

    Route::middleware(['role:FACULTY,STUDENT'])->group(function () {
        Route::get('/student/{studentActivity}', [StudentActivityController::class, 'show']);
        Route::get('/student/section/{section}', [StudentActivityController::class, 'getStudentActivitiesBySection']);
        Route::get('/student/{studentActivity}/files', [StudentActivityController::class, 'getStudentActivityFiles']);
    });
});

Route::group(["prefix" => "lessons", 'middleware' => ['auth:sanctum']], function () {
    Route::get('/', [LessonController::class, 'index']);
    Route::get('/{lesson}', [LessonController::class, 'show']);

    Route::middleware(['role:FACULTY'])->group(function () {
        Route::post('/', [LessonController::class, 'store']);
        Route::put('/{lesson}', [LessonController::class, 'update']);
        Route::delete('/{lesson}', [LessonController::class, 'destroy']);
        Route::post('/{lesson}/add-section', [LessonController::class, 'addLessonToSection']);
        Route::delete('/{lesson}/remove-section', [LessonController::class, 'removeLessonFromSection']);
        Route::post('/{lesson}/file-upload', [LessonController::class, 'addFileFromLesson']);
        Route::post('/file-delete/{file}', [LessonController::class, 'removeFileFromLesson']);
        Route::post('/{lesson}/add-link', [LessonController::class, 'addLessonLink']);
        Route::delete('/remove-link/{link}', [LessonController::class, 'removeLessonLink']);
        Route::get('/section/{section}', [LessonController::class, 'getLessonsBySection']);
        Route::get('/faculty/{faculty}', [LessonController::class, 'getLessonsByFaculty']);
        Route::get('/student/{student}', [LessonController::class, 'getLessonsByStudent']);
    });

});