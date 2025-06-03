<?php

namespace App\Http\Controllers\api;

use App\Mail\EmailVerification;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Faculty;
use App\Models\Principal;
use App\Models\EmailVerificationOtp;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class Auth extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user.first_name' => 'required|string|max:255',
                'user.last_name' => 'required|string|max:255',
                'user.middle_name' => 'nullable|string|max:255',
                'user.ext' => 'nullable|string|max:10',
                'user.email' => 'required|email|max:255',
                'user.password' => 'required|string|min:8',
                'user.sex' => 'required|in:male,female',
                'user.profile_picture' => 'nullable|string',
                'user.role' => 'required|in:STUDENT,FACULTY,PRINCIPAL,GUARDIAN',
                'user.date_of_birth' => 'required|date',
                'user.mobile_number' => 'required|string|max:15',
                'user.address' => 'required|string',
                'user.age' => 'required|integer|min:1',

                'faculty.position' => 'required_if:user.role,faculty|integer',
                'principal.year_started' => 'required_if:user.role,principal|date',
                'guardian.student_id' => 'required_if:user.role,guardian|exists:students,id',
                'guardian.mother_tongue' => 'required_if:user.role,guardian|string',
                'student.id' => 'nullable',
                'student.user_id' => 'nullable',
                'student.grade_level' => 'required_if:user.role,student|integer',
                'student.mother_tongue' => 'required_if:user.role,student|string',
                'student.LRN' => 'required_if:user.role,student|integer',
                'student.current_school' => 'required_if:user.role,student|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors(), "data" => $request->all()], 422);
            }

            $data = $request->all();
            $userData = $data['user'];

            $existingUser = User::where('email', $userData['email'])->first();
            if ($existingUser && $existingUser->email_verified_at !== null) {
                return response()->json(['error' => 'Email already used.'], 409);
            }

            if ($existingUser && $existingUser->email_verified_at === null) {
                $existingUser->delete();
            }

            $user = User::create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'middle_name' => $userData['middle_name'] ?? null,
                'ext' => $userData['ext'] ?? null,
                'email' => $userData['role'] === "STUDENT" ? null : $userData["email"],
                'password' => Hash::make($userData['password']),
                'sex' => $userData['sex'],
                'profile_picture' => $userData['profile_picture'],
                'role' => $userData['role'],
                'date_of_birth' => $userData['date_of_birth'],
                'mobile_number' => $userData['mobile_number'],
                'address' => $userData['address'],
                'age' => $userData['age']
            ]);

            switch ($userData['role']) {
                case 'STUDENT':
                    Student::create([
                        'user_id' => $user->id,
                        'grade_level' => $data['student']['grade_level'],
                        'mother_tongue' => $data['student']['mother_tongue'],
                        'LRN' => $data['student']['LRN'],
                        'current_school' => $data['student']['current_school'],
                    ]);
                    break;
                case 'FACULTY':
                    Faculty::create([
                        'user_id' => $user->id,
                        'position' => $data['faculty']['position'],
                    ]);
                    break;
                case 'PRINCIPAL':
                    Principal::create([
                        'user_id' => $user->id,
                        'year_started' => $data['principal']['year_started'],
                    ]);
                    break;
                case 'GUARDIAN':
                    Guardian::create([
                        'user_id' => $user->id,
                        'student_id' => $data['guardian']['student_id'],
                        'mother_tongue' => $data['guardian']['mother_tongue'],
                    ]);
                    break;
                default:
                    return response()->json(['error' => 'Invalid role.'], 400);
            }
            return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} "], 400);
        }
    }

    public function sendVerification(User $user)
    {
        try {
            if ($user->role === "STUDENT") {
                return response()->json(['message' => 'Students are not required to validate email'], 400);
            }
            $code = strtoupper(Str::random(6));
            EmailVerificationOtp::create([
                "user_id" => $user->id,
                "code" => $code
            ]);
            Mail::to($user->email)->send(new EmailVerification($code));
            return response()->json(['message' => 'Email Verification Sent', "user" => $user], 200);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} ", "user" => $user], 400);
        }
    }

    public function verifyCode(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'code' => 'required'
            ]);

            if (!$user) {
                return response()->json(['message' => 'User does not exist.'], 404);
            }

            if ($user->email_verified_at !== null) {
                return response()->json(['message' => 'User already verified.'], 400);
            }

            $otp = EmailVerificationOtp::where('user_id', $user->id)->first();

            if (!$otp) {
                return response()->json(['message' => 'User has no existing OTP.'], 404);
            }

            if (Carbon::parse($otp->created_at)->addHour()->isPast()) {
                return response()->json(['message' => 'User OTP is expired.'], 400);
            }

            if ($validated["code"] !== $otp->code) {
                return response()->json(['message' => 'OTP entered by the user does not match.'], 400);
            }

            $user->email_verified_at = now();
            $user->save();
            $otp->delete();

            return response()->json([
                'message' => 'Verification Successful!',
                'user' => $user,
            ]);
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} "], 400);
        }
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'sometimes|email',
            'student_id' => 'sometimes',
            'password' => 'required',
            'role' => 'required|in:STUDENT,FACULTY,PRINCIPAL,GUARDIAN',
        ]);

        if ($validated["role"] === "STUDENT") {

            if (!$validated["student_id"]) {
                return response()->json(["message" => "Student ID is required"], 400);
            }

            $student = Student::where("id", $validated["student_id"])->first();
            $user = User::find($student->user_id);

            if (!$student || !$user || !Hash::check($validated["password"], $user->password)) {
                return response()->json(["message" => "Credentials not found"], 404);
            }
            
            $request->session()->regenerate();
            return response()->json(['message' => 'Logged in', 'user' => $user], 200);
        }

        if (!$validated["email"]) {
            return response()->json(["message" => "Email is required"], 400);
        }
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(["message" => "Credentials not found"], 404);
        }
        $request->session()->regenerate();
        return response()->json(['message' => 'Logged in', 'user' => $user], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(["message" => "Logged out"], 200);
    }
}
