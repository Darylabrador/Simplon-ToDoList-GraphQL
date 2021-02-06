<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationChangePassword extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $pseudo;
    public $datenow;
    public $adresseIP;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($pseudo, $datenow, $adresseIP)
    {
        $this->pseudo     = $pseudo;
        $this->datenow    = $datenow;
        $this->adresseIP  = $adresseIP;
        $this->subject('ZotTodoRe - Modification mot de passe');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mails.notificationChangePassword');
    }
}
