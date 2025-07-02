<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ActivitySection extends Pivot
{
    protected $casts = [
        'grading_period' => 'integer',
        'deadline' => 'datetime',
    ];
}