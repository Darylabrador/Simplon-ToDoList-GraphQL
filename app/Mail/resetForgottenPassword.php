<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class resetForgottenPassword extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $pseudo;
    public $url;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($pseudo, $url)
    {
        $this->pseudo  = $pseudo;
        $this->url     = $url;
        $this->subject('ZotTodoRe - Réinitialisation mot de passe');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mails.forgottenPassword');
    }
}
