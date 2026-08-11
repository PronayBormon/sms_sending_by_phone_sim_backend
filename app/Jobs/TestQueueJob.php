<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class TestQueueJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $name
    ) {}

    public function handle(): void
    {
        \Log::info('Processing Job: ' . $this->name);

        sleep(10);
    }
}
