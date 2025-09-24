<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hub extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'address', 'latitude', 'longitude', 'contact_info', 'services_offered', 'is_active'
    ];

    protected $casts = [
        'contact_info' => 'array',
        'is_active' => 'boolean',
    ];
}
