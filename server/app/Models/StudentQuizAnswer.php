<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentQuizAnswer extends Model
{
    protected $fillable = [
        'quiz_id',
        'quiz_question_id',
        'student_id',
        'answer',
        'isCorrect',
    ];

    protected $casts = [
        'quiz_id' => 'integer',
        'quiz_question_id' => 'integer',
        'student_id' => 'integer',
        'isCorrect' => 'boolean',
    ];

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }

    public function quizQuestion(){
        return $this->belongsTo(QuizQuestion::class);
    }

    public function student(){
        return $this->belongsTo(Student::class);
    }


}
