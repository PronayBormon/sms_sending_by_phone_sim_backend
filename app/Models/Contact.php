<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'name',
        'email',
        'phone',
        'company',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function listContacts(): HasMany
    {
        return $this->hasMany(ListContact::class, 'contact_id');
    }

    public function lists(): BelongsToMany
    {
        return $this->belongsToMany(ContactList::class, 'list_contacts', 'contact_id', 'contact_list_id')
            ->withTimestamps();
    }
}
