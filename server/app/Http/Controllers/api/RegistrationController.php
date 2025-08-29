<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Guardian;
use App\Models\Principal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'ext' => 'nullable|string|max:255',
            'role' => 'required|string|in:student,faculty,guardian,principal',
            'gender' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'mobile_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',

            // Role-specific fields
            'grade_level' => 'required_if:role,student|integer',
            'mother_tongue' => 'required_if:role,student|string',
            'LRN' => 'required_if:role,student|string',
            'current_school' => 'required_if:role,student|string',
            'disabilities' => 'nullable|array',
            'disabilities.*' => 'integer|exists:disabilities,id',
            'position' => 'required_if:role,faculty|string',
            'student_id' => 'required_if:role,guardian|integer',
            'year_started' => 'required_if:role,principal|integer',
            'year_ended' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'ext' => $request->ext,
            'role' => $request->role,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'mobile_number' => $request->mobile_number,
            'address' => $request->address,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        switch ($request->role) {
            case 'student':
                $student = Student::create([
                    'user_id' => $user->id,
                    'grade_level' => $request->grade_level,
                    'mother_tongue' => $request->mother_tongue,
                    'LRN' => $request->LRN,
                    'current_school' => $request->current_school,
                ]);

                if ($request->has('disabilities')) {
                    $student->disabilities()->attach($request->disabilities);
                }
                break;
            case 'faculty':
                Faculty::create([
                    'user_id' => $user->id,
                    'position' => $request->position,
                ]);
                break;
            case 'guardian':
                Guardian::create([
                    'user_id' => $user->id,
                    'student_id' => $request->student_id,
                    'mother_tongue' => $request->mother_tongue,
                ]);
                break;
            case 'principal':
                Principal::create([
                    'user_id' => $user->id,
                    'year_started' => $request->year_started,
                    'year_ended' => $request->year_ended,
                ]);
                break;
        }

        return response()->json(['message' => 'User registered successfully'], 201);
    }
}