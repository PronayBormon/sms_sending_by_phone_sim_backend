<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrLoginToken extends Model
{
    protected $fillable = [
        "token_hash",
        "browser_session_id",
        "user_id",
        "expires_at",
        "approved_at",
        "used_at",
    ];
}
