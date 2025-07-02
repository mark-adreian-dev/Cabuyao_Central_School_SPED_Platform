<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['grade_level', 'faculty_id', 'school_year', 'isActive', 'section_name'];

    protected function casts(): array
    {
        return [
            'grade_level' => 'integer',
            'faculty_id' => 'integer',
            'isActive' => 'boolean'
        ];
    }

    public function students()
    {
        return $this
            ->belongsToMany(Student::class, 'student_sections', 'section_id', 'student_id')
            ->withTimestamps();
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function activities()
    {
        return $this
            ->belongsToMany(Activity::class, 'activity_sections', 'section_id', 'activity_id')
            ->withPivot('deadline', 'grading_period')
            ->withTimestamps();
    }
}