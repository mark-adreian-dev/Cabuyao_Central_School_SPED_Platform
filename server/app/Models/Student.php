<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'grade_level',
        'mother_tongue',
        'LRN',
        'current_school',
    ];

    protected function casts(): array
    {
        return [
            'grade_level' => 'integer',
        ];
    }
}