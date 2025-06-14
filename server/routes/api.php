<?php

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
    Route::middleware(["auth:sanctum"])->group(function() {
        Route::get("/", [AuthController::class, 'loadUser']);
        Route::post("/logout", [AuthController::class, 'logout']); // Log out (invalidate token)
    });
});

Route::group(["prefix" => "sections", 'middleware' => ['auth:sanctum']], function () {
    Route::post('/', [SectionController::class, 'store']);
    Route::get('/', [SectionController::class, 'index']);
    Route::get('/{section}', [SectionController::class, 'show']);
    Route::put('/{section}', [SectionController::class, 'update']);
    Route::delete('/{section}', [SectionController::class, 'destroy']);
    Route::get('/student/{student}', [SectionController::class, 'showStudentSections']);
    Route::get('/active', [SectionController::class, 'showActiveSections']);
    Route::get('/inactive', [SectionController::class, 'showInactiveSections']);
    Route::get('/faculty/{faculty}', [SectionController::class, 'showFacultySections']);
    Route::post('/{section}/add-students',[SectionController::class, 'addStudentsToSection']);
    Route::post('/{section}/add-students/{student}',[SectionController::class, 'addStudentToSection']);
});
