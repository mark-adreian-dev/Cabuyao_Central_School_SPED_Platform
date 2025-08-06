<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class CreateLessonRequest extends FormRequest
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
            'lesson_title' => 'required|string',
            'lesson_description' => 'sometimes|string',
            'lesson_files' => 'sometimes|array',
            'lesson_files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,docx|max:10240',
            'lesson_links' => 'sometimes|array',
            'lesson_links.*.lesson_link' => 'string',
            'lesson_links.*.link_name' => 'string',
        ];
    }
}