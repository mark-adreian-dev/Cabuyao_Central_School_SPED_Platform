<?php

// use App\Http\Controllers\api\Auth;
use App\Http\Controllers\api\AuthController;
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
    Route::get("/trial", function(){
        return response()->json(["message" => "Hello user", "user" => Auth::user()]);
    })->middleware('auth:sanctum');
    Route::post("/", [AuthController::class, 'register']);
    Route::post("/send-email-verification/{user}", [AuthController::class, 'sendVerification']);
    Route::post("/verify-email/{user}", [AuthController::class, 'verifyCode']);
    Route::post("/login", [AuthController::class, 'login']);
    Route::post("/logout", [AuthController::class, 'logout'])->middleware('auth:sanctum');
});
