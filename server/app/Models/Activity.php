<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'deadline',
        'question_count',
        'perfect_score',
        'passing_score',
        'activity_question',
        'activity_file'
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'question_count' => 'integer',
        'perfect_score' => 'integer',
        'passing_score' => 'integer',
    ];

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'activity_sections', 'activity_id', 'section_id')
            ->withTimestamps();
    }

    public function studentActivities()
    {
        return $this->hasMany(StudentActivity::class);
    }
}