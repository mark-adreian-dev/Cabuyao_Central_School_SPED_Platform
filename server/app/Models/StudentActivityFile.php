<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class StudentActivityFile extends Model
{
    protected $fillable = [
        'student_activity_id',
        'activity_file',
    ];

    public function studentActivity()
    {
        return $this->belongsTo(StudentActivity::class);
    }

    public function getActivityFileAttribute($value): string
    {
        return Storage::disk('s3')->temporaryUrl($value, Carbon::now()->addHour());
    }
}