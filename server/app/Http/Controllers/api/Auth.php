<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Principal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class Auth extends Controller
{
    public function register(Request $request)
    {
        try {

            $validated = $request->validate([
                'user.first_name' => "required|max:255",
                'user.last_name' => "required|max:255",
                'user.middle_name' => "nullable|max:255",
                'user.ext' => "nullable",
                'user.email' => "required|email|unique:users",
                'user.password' => "required|min:6",
                'user.sex' => "required|in:MALE,FEMALE",
                'user.profile_picture' => "nullable",
                'user.role' => "required|in:PRINCIPAL,STUDENT,FACULTY",
                'user.date_of_birth' => "required|date",
                'user.mobile_number' => "required|string|size:10",
                'user.address' => "required|max:255",
                'user.age' => "required|integer"
            ]);
            $data = User::create($validated);

            if ($validated["role"] === "PRINCIPAL") {
                $principalDetails = $request->validate([
                    'principal.year_started' => "required|integer",
                ]);
                $principalDetails["user_id"] = $data->id;
                Principal::create($principalDetails);
            }

            if ($validated["role"] === "FACULTY") {
                $facultyDetails = $request->validate([
                    'faculty.position' => "required|integer",
                ]);
                $facultyDetails["user_id"] = $data->id;
                Faculty::create($facultyDetails);
            }


            return response()->json(["user" => $data], 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} "], 400);
        }

    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(["message" => "Credentials not found"], 404);
        }
        $token = $user->createToken($user->email);
        return response()->json(["message" => "Welcome {$user->name}", "user" => $user, "token" => $token->plainTextToken], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(["message" => "Logged out"], 200);
    }
}