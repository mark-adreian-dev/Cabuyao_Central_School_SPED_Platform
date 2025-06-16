<?php

namespace App\Http\Controllers\api;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegistrationRequest;
use App\Mail\EmailVerification;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Faculty;
use App\Models\Principal;
use App\Models\EmailVerificationOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AuthController extends Controller
{
    public function register(RegistrationRequest $request)
    {
        try {
            $validated = $request->validated();
            $data = $validated;
            $userData = $data['user'];

            $existingUser = $this->getUserByRoleAndData($userData);

            if ($existingUser) {
                return response()->json(['message' => 'Email has already been used.'], 409);
            } else {
                
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
                        $studentCount = Student::count();
                        $year = now()->format('y');
                        $studentId = intval($year) * 1000 + $studentCount + 1;
                        Student::create([
                            'id' => $studentId,
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
                        return $this->respondError("Specified role is invalid", "INVALID_ROLE", 400);
                }
                return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
            }


     
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} ", "ither"=> "trigger"], 500);
        }
    }
    public function sendVerification(User $user)
    {
        try {
            if ($user->role === "STUDENT") {
                return response()->json(['message' => 'Students are not required to validate email'], 400);
            }
            else if($user->email_verified_at == null) {
                $code = strtoupper(Str::random(6));

                $otp = $this->getOtpForUser($user);
                if($otp) $otp->delete();

                EmailVerificationOtp::create([
                    "user_id" => $user->id,
                    "code" => $code
                ]);
                Mail::to($user->email)->send(new EmailVerification($code));
                return response()->json(['message' => 'Email Verification Sent', "user" => $user], 200);
            } else {
                return response() -> json([
                    "message" => "This account is already verified"
                ], 200);
            }
            
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} ", "user" => $user], 500);
        }
    }
    public function verifyCode(Request $request, User $user)
    {
        try {
        // Validate the code
        $validated = $request->validate(['code' => 'required']);

        // Check if user exists and is not already verified
        if($this->isAccountVerified($user)){
            return response() -> json([
                "message" => "Account is already verified."
            ], 200);
        }

        // Get the OTP associated with the user
        $otp = $this->getOtpForUser($user);

        if($otp) {
            // Check if OTP is expired
            if(!$this->isOTPExpired($otp)) {
                
                // Verify the code entered by the user
                if($this->isOTPMatched($validated['code'], $otp)) {

                    // Delete the OTP after verification
                    $otp->delete();

                    // Mark the user's email as verified
                    $this->verifyUser($user);

                    return response()->json([
                        'message' => 'Verification Successful!',
                    ]);

                } else {
                    //If otp does not match
                    return $this->respondError("OTP does not match", "MISMATCHED_OTP", 400);
                }
               
            } else {
                //If OTP is expired
                return $this->respondError("OTP associated to this account has expired", "EXPIRED_OTP", 400);
            }
        } else {
            //If there is no existing OTP associated to this user account
            return $this->respondError("There is no existing OTP for this account", "NO_OTP", 404);
        }

        
        } catch (\Throwable $th) {
            return response()->json(["message" => "Error: {$th->getMessage()} "], 400);
        }
    }
    public function login(LoginRequest $request)
    {
        try {
            // Validate request data
            $validated = $request->validated();

            // Determine role and fetch user
            $user = $this->getUserByRoleAndData($validated);

            if($user) {
                // Check password validity
                if($this->checkPassword($user, $validated['password'])) {
                     // Generate token for valid user
                    $token = $this->generateToken($user);

                    return response()->json([
                        'message' => 'Logged in successfully',
                        'token' => $token
                    ], 200);
                } else {
                    //If no user is found or there is a role mismatch
                     return $this->respondError( "Invalid credentials please try again", "INVALID_CREDENTIALS", 401);
                }
                
                
               
            } else {
                //If no user is found or there is a role mismatch
                return $this->respondError( "Invalid credentials please try again", "INVALID_CREDENTIALS", 401);
            }

          

        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
    public function logout(Request $request)
    {

        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Logged out successfully']);
    }
    public function loadUser(Request $request) {
        $user = $request->user();
        return response() -> json( $user);
    }
    public function loadStudentData(User $user) {
        if($user) {
            $studentData = Student::where("user_id", $user->id)->first();
            return response()->json([
                "student_id" => $studentData->id,
                "grade_level" => $studentData['grade_level'],
                "mother_tongue" => $studentData['mother_tongue'],
                "LRN" => $studentData['LRN']
            ], 200);
        }

        return $this->respondError("Student data not found", "NOT_FOUND", 404);
    }

    public function loadAdminData(User $user) {
        if($user) {
            $adminData = Principal::where("user_id", $user->id)->first();
            return response()->json([
                "year_started" => $adminData['year_started'],
                "year_ended" => $adminData['year_ended'],
            ], 200);
        }

        return $this->respondError("Admin data not found", "NOT_FOUND", 404);
    }

    public function loadFacultyData(User $user) {
        if($user) {
            $facultyData = Faculty::where("user_id", $user->id)->first();
            return response()->json([
                "position" => $facultyData['position']
            ], 200);
        }

        return $this->respondError("Faculty data not found", "NOT_FOUND", 404);
    }




    //Login Utility function
    private function getUserByRoleAndData($userData)
    {
        if ($userData['role'] === 'STUDENT') {
            // Ensure student_id is provided for student role
            if(isset($userData['student_id'])) {
                return $this->getUserForStudent($userData['student_id']);
            }
            return null;
        }

        // Handle other roles (FACULTY, PRINCIPAL, GUARDIAN)
        if ($userData['role'] !== 'STUDENT') {
            // Ensure email is provided
            if(isset($userData['email'])) {
                $user = $this->getUserByEmail($userData['email']);

               
                if($user) {
                     // Check if role matches
                    if ($userData['role'] === $user->role) {
                        return $user;
                    } 

                    return null;
                }
                return null;  
                
            }   
        } else {
            //if no user found returns null
            return null;
        }
    }
    private function getUserForStudent($studentId)
    {
        $student = Student::find($studentId);
        if (!$student)  return null;

        $user = $student->user;
        if (!$user) return null;

        return $user;
    }
    private function getUserByEmail($email)
    {
        $user = User::where('email', $email)->first();
        if ($user) {
            return $user;
        }

        return null;
    }
    private function checkPassword($user, $password)
    {
        if (Hash::check($password, $user->password)) {
            return true;
        }

        return false;
    }
    private function generateToken($user) {
        return $user->createToken("app")->plainTextToken;

       
    }



    //Verify Code Utility functions
    private function isAccountVerified($user)
    {
        if (!$user) {
            return $this->respondError("Account not found", "USER_NOT_FOUND", 404);
        }

        if ($user->email_verified_at !== null) {
            return $this->respondError("User already verified","ALREADY_VERIFIED",404);
        } 
    }
    private function getOtpForUser($user)
    {
        $otp = EmailVerificationOtp::where('user_id', $user->id)->first();
        if ($otp) { return $otp; }
        return null;
    }
    private function isOTPExpired($otp)
    {
        if (Carbon::parse($otp->created_at)->addHour()->isPast()) {
            return true;
        }

        return false;
    }
    private function isOTPMatched($inputCode, $otp)
    {
        if ($inputCode == $otp->code) { 
            
            return true; 
        }
        return false;
    }
    private function verifyUser($user) {
        $user->email_verified_at = now();
        $user->save();

        
    }



    //Registration utility function 
    public function removeExistingUser($user) {
        $role = $user->role;

        switch($role) {
            case "STUDENT":
                $account = Student::where("user_id", $user->id);
                $account->delete();
                break;
            case "PRINCIPAL":
                $account = Principal::where("user_id", $user->id);
                $account->delete();
                break;
            case "GUARDIAN":
                $account = Guardian::where("user_id", $user->id);
                $account->delete();
                break;
            case "FACULTY":
                $account = Faculty::where("user_id", $user->id);
                $account->delete();
                break;
        }

        $user->delete();
    }
    //Resuable Error handler
    private function respondError($message, $errorCode, $status) {
        return response() -> json([
            "message" => $message,
            "error_code" => $errorCode
        ], $status);
    }
}
