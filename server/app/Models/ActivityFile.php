<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityFile extends Model
{
    protected $fillable = [
        'activity_id',
        'activity_file',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}