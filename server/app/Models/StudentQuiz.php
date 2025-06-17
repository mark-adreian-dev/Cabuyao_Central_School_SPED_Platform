<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentQuiz extends Model
{
    protected $fillable = [
        'quiz_id',
        'student_id',
        'score',
        'isPassing',
    ];

    protected $casts = [
        'quiz_id' => 'integer',
        'student_id' => 'integer',
        'score' => 'integer',
        'isPassing' => 'boolean',
    ];

    public function quiz(){
        return $this->belongsTo(Quiz::class);
    }

    public function student(){
        return $this->belongsTo(Student::class);
    }
}
