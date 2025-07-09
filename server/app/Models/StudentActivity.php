<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Model;

class StudentActivity extends Model
{
    protected $table = 'student_activities';

    protected $fillable = [
        'activity_id',
        'student_id',
        'score',
        'isPassing',
    ];

    protected $casts = [
        'activity_id' => 'integer',
        'student_id' => 'integer',
        'score' => 'integer',
        'isPassing' => 'boolean',
    ];

    public function files()
    {
        return $this->hasMany(StudentActivityFile::class, 'student_activity_id');
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

}