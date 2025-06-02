<?php

use App\Http\Controllers\api\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Route::get('/test-email', function(){
//     try {
//         Mail::to("heradurajones@gmail.com")->send(new EmailVerification());
//         return response()->json(['message'=>"Mail sent"], 200);
//     } catch (\Throwable $th) {
//         return response()->json(['message'=> $th->getMessage()], 500);
//     }
    
// });

Route::group(["prefix" => "user"], function () {
    Route::post("/", [Auth::class, 'register']);
    Route::post("/send-email-verification/{user}", [Auth::class, 'sendVerification']);
    Route::post("/verify-email/{user}", [Auth::class, 'verifyCode']);
});
