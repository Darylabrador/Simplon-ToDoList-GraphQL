<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ResetTentatives implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userId;
    public $userEmail;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId, $userEmail)
    {
        $this->userId    = $userId;
        $this->userEmail = $userEmail;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $user = User::whereId($this->userId)->first();
        $user->tentatives = 0;
        $user->save();
        openlog('ZOTTODORE_AUTH', LOG_NDELAY, LOG_USER);
        syslog(LOG_INFO, "Le compte {$user->email} a été débloqué !");
    }
}
