<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonLink extends Model
{
    protected $fillable = [
        'lesson_link',
        'link_name',
        'lesson_id',
    ];

    protected $casts = [
        'lesson_id' => 'integer',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}