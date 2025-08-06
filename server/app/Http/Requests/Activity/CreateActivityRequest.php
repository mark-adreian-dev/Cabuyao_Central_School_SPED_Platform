<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class CreateActivityRequest extends FormRequest
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
            'activity_description' => 'required|string',
            'perfect_score' => 'required|integer',
            'passing_score' => 'required|integer|lt:perfect_score',
            'activity_question' => 'required|string',
            'deadline' => 'required|date_format:Y-m-d H:i:s',
            'activity_files' => 'array',
            'activity_files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,docx|max:10240',
        ];
    }
}