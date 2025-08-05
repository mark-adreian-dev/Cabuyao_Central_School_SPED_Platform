<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class LessonFile extends Model
{
    protected $fillable = [
        'lesson_file',
        'file_name',
        'file_size',
        'lesson_id',
    ];

    protected $casts = [
        'lesson_id' => 'integer',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function getLessonFileAttribute($value): string
    {
        return Storage::disk('s3')->temporaryUrl($value, Carbon::now()->addHour());
    }
}