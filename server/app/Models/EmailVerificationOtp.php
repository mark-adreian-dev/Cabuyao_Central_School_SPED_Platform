<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailVerificationOtp extends Model
{
    protected $fillable = [
        'user_id',
        'code',
    ];

    protected function casts(): array
    {
        return [
        ];
    }
}
