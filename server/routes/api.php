<?php

use App\Http\Controllers\api\ActivityController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\SectionController;
use Illuminate\Support\Facades\Route;


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
        Route::delete('/{section}/remove-student/{student}', [SectionController::class, 'removeStudentsToSection']);
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
    Route::get('/section/{section}', [ActivityController::class, 'show']);

    Route::middleware(['role:FACULTY'])->group(function () {
        Route::post('/', [ActivityController::class, 'store']);
        Route::put('/{activity}', [SectionController::class, 'update']);
        Route::delete('/{activity}', [SectionController::class, 'delete']);
        Route::post('/{activity}/add-section', [ActivityController::class, 'addActivityToSection']);
        Route::delete('/{activity}/remove-section', [ActivityController::class, 'removeActivityToSection']);
    });
});