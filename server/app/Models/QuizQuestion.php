<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = [
        'quiz_id',
        'question',
        'a',
        'b',
        'c',
        'd',
        'correct_answer'
    ];

    public function quiz(){
        return $this->belongsTo(Quiz::class);
    }
}
