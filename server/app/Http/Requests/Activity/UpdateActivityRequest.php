<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
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
            'deadline' => 'sometimes|date',
            'activity_description' => 'sometimes|string',
            'perfect_score' => 'sometimes|integer',
            'passing_score' => 'sometimes|integer|lt:perfect_score',
            'activity_question' => 'sometimes|string',
        ];
    }
}