<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Principal extends Model
{
    /** @use HasFactory<\Database\Factories\PrincipalFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'year_started',
        'year_ended'
    ];

    protected function casts(): array
    {
        return [
            'year_started' => 'integer',
            'year_ended' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}