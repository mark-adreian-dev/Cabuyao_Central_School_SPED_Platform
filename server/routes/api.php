<?php

use App\Http\Controllers\api\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;

// Route::get('/sanctum/csrf-cookie', function () {
//     return response()->json(['csrf_token' => csrf_token()]);
// });


Route::group(["prefix" => "user"], function () {
    Route::get("/", function(){
        return response()->json(["message" => "Hello user"]);
    })->middleware('auth:sanctum');
    Route::post("/", [Auth::class, 'register']);
    Route::post("/send-email-verification/{user}", [Auth::class, 'sendVerification']);
    Route::post("/verify-email/{user}", [Auth::class, 'verifyCode']);
    Route::post("/login", [Auth::class, 'login']);
});
