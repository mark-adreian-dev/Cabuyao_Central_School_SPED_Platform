<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'deadline',
        'question_count',
        'perfect_score',
        'passing_score',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'question_count' => 'integer',
        'perfect_score' => 'integer',
        'passing_score' => 'integer',
    ];

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'quiz_sections', 'quiz_id', 'section_id')
                    ->withTimestamps();
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function studentQuizzes()
    {
        return $this->hasMany(StudentQuiz::class);
    }

    public function studentAnswers()
    {
        return $this->hasMany(StudentQuizAnswer::class);
    }
}
