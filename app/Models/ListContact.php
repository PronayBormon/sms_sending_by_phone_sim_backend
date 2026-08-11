<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_id',
        'contact_list_id',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function contactList(): BelongsTo
    {
        return $this->belongsTo(ContactList::class, 'contact_list_id');
    }
}
