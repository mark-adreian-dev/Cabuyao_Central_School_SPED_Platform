<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'grade_level',
        'mother_tongue',
        'LRN',
        'current_school',
    ];

    protected function casts(): array
    {
        return [
            'grade_level' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'student_section', 'student_id', 'section_id');
    }

    public function activeSection()
    {
        return $this->sections()->wherePivot('is_active', true)->first();
    }

    public function quizzes(){
        return $this->belongsToMany(Quiz::class, 'student_quizzes');
    }

    public function quizAnswers(){
        return $this->hasMany(StudentQuizAnswer::class);
    }
}
