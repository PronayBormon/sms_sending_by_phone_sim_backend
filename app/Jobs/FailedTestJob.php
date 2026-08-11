<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class FailedTestJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        throw new \Exception('This is a demo failed job');
    }
}
