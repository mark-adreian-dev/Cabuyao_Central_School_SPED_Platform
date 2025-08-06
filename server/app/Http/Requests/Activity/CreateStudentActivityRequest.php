<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class CreateStudentActivityRequest extends FormRequest
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
            "activity_id" => "required|exists:activities,id",
            "activity_files" => "required|array|min:1",
            "activity_files.*" => "required|file|mimes:jpeg,png,jpg,gif,svg,pdf,docx|max:10240",
        ];
    }
}