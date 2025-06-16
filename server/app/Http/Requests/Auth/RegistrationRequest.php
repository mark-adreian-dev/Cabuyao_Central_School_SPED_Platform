<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user.first_name' => 'required|string|max:255',
            'user.last_name' => 'required|string|max:255',
            'user.middle_name' => 'nullable|string|max:255',
            'user.ext' => 'nullable|string|max:10',   
            'user.password' => 'required|string|min:8',
            'user.sex' => 'required|in:male,female',
            'user.profile_picture' => 'nullable|string',
            'user.role' => 'required|in:STUDENT,FACULTY,PRINCIPAL,GUARDIAN',
            'user.email' => 'nullable|email|max:255|required_if:user.role,PRINCIPAL,FACULTY',
            'user.date_of_birth' => 'required|date',
            'user.mobile_number' => 'required|string|max:15',
            'user.address' => 'required|string',
            'user.age' => 'required|integer|min:1',

            'faculty.position' => 'required_if:user.role,FACULTY|integer',
            'principal.year_started' => 'required_if:user.role,PRINCIPAL|integer',
            'guardian.student_id' => 'required_if:user.role,GUARDIAN|exists:students,id',
            'guardian.mother_tongue' => 'required_if:user.role,GUARDIAN|string',
            'student.id' => 'nullable',
            'student.user_id' => 'nullable',
            'student.grade_level' => 'required_if:user.role,STUDENT|integer',
            'student.mother_tongue' => 'required_if:user.role,STUDENT|string',
            'student.LRN' => 'required_if:user.role,STUDENT|integer',
            'student.current_school' => 'required_if:user.role,STUDENT|string'
        ];
    }
}
