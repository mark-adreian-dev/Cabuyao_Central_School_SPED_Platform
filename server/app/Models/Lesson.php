<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'lesson_title',
        'lesson_description',
        'faculty_id',
    ];

    protected $casts = [
        'faculty_id' => 'integer',
    ];

    public function sections()
    {
        return $this
            ->belongsToMany(Section::class, 'lesson_sections', 'lesson_id', 'section_id')
            ->withTimestamps();
    }

    public function files()
    {
        return $this->hasMany(LessonFile::class);
    }

    public function links()
    {
        return $this->hasMany(LessonLink::class);
    }
}