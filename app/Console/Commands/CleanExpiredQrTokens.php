<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:clean-expired-qr-tokens')]
#[Description('Command description')]
class CleanExpiredQrTokens extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $deleted = DB::table('qr_login_tokens')
            ->where('expires_at', '<', now())
            ->delete();

        $this->info("Deleted {$deleted} expired QR login token(s).");
    }
}
