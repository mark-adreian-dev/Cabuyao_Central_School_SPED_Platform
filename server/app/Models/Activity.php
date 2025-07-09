<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'faculty_id',
        'deadline',
        'question_count',
        'perfect_score',
        'passing_score',
        'activity_question',
        'activity_description'
    ];

    protected $casts = [
        'faculty_id' => 'integer',
        'deadline' => 'datetime',
        'question_count' => 'integer',
        'perfect_score' => 'integer',
        'passing_score' => 'integer',
    ];

    public function sections()
    {
        return $this
            ->belongsToMany(Section::class, 'activity_sections', 'activity_id', 'section_id')
            ->withPivot('deadline', 'grading_period')
            ->withTimestamps();
    }

    public function files()
    {
        return $this->hasMany(ActivityFile::class);
    }

    public function studentActivities()
    {
        return $this->hasMany(StudentActivity::class);
    }

}