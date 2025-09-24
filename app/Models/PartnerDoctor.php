<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerDoctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'specialty', 'contact_details', 'is_active'
    ];

    protected $casts = [
        'contact_details' => 'array',
        'is_active' => 'boolean',
    ];
}
