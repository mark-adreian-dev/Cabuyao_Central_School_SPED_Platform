<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['grade_level', 'faculty_id', 'school_year', 'isActive'];

    protected function casts(): array
    {
        return [
            'grade_level' => 'integer',
            'faculty_id' => 'integer'
        ];
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_section', 'section_id', 'student_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
