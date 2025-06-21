<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentActivity extends Model
{
    protected $fillable = [
        'activity_id',
        'student_id',
        'score',
        'answer_file',
        'isPassing',
    ];

    protected $casts = [
        'activity_id' => 'integer',
        'student_id' => 'integer',
        'score' => 'integer',
        'isPassing' => 'boolean',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}