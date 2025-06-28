<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

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

    public function getActivityFileAttribute($value): string
    {
        return Storage::disk('s3')->temporaryUrl($value, Carbon::now()->addHour());
    }
}