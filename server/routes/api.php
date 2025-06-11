<?php

// use App\Http\Controllers\api\Auth;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\SectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use Illuminate\Support\Facades\Auth;

// Route::get('/sanctum/csrf-cookie', function () {
//     return response()->json(['csrf_token' => csrf_token()]);
// });


Route::group(["prefix" => "user"], function () {
    Route::get("/", function(){
        return response()->json(["message" => "Hello user", "user" => Auth::user()]);
    })->middleware('auth:sanctum');
    Route::post("/", [AuthController::class, 'register']);
    Route::post("/send-email-verification/{user}", [AuthController::class, 'sendVerification']);
    Route::post("/verify-email/{user}", [AuthController::class, 'verifyCode']);
    Route::post("/login", [AuthController::class, 'login']);
    Route::post("/logout", [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::group(["prefix" => "sections", 'middleware' => ['auth:sanctum']], function () {
    Route::post('/', [SectionController::class, 'store']);
    Route::get('/', [SectionController::class, 'index']);
    Route::get('/{id}', [SectionController::class, 'show']);
    Route::put('/{section}', [SectionController::class, 'update']);
    Route::delete('/{section}', [SectionController::class, 'destroy']);
    Route::get('/student/{student}', [SectionController::class, 'showStudentSections']);
    Route::get('/active', [SectionController::class, 'showActiveSections']);
    Route::get('/inactive', [SectionController::class, 'showInactiveSections']);
    Route::get('/faculty/{faculty}', [SectionController::class, 'showFacultySections']);
    Route::post('/{section}/add-students',[SectionController::class, 'addStudentsToSection']);
    Route::post('/{section}/add-students/{student}',[SectionController::class, 'addStudentToSection']);
});
