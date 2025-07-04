<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class StudentActivity extends Pivot
{
    protected $casts = [
        'score' => 'integer',
        'isPassing' => 'boolean',
    ];

}