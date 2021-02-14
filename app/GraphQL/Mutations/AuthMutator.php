<?php

namespace App\GraphQL\Mutations;

use DateTime;
use App\Models\User;
use App\Mail\NotificationChangePassword;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\resetForgottenPassword;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

use Carbon\Carbon;
use App\Jobs\ResetTentatives;
use App\Mail\NotificationUnlockedAccount;
use App\Mail\NotificationLockedAccount;

class AuthMutator
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
    }


    /**
     * Login's resolver
     */
    public function login($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo){
        $email    = $args['email'];
        $password = $args['password'];
        $userExist  = User::where(["email" => $email])->first();

        if (!$userExist) {
            $retour = [
                'success' => 0,
                'message' => 'Adresse email ou identifiant incorrecte'
            ];
            return $retour;
        }

        if ($userExist->verified_at == null) {
            $retour = [
                'success' => 0,
                'message' => 'Vous devez confirmer votre adresse email'
            ];
            return $retour;
        }

        $oldTentative = $userExist->tentatives;

        switch ($oldTentative) {
            case 3:
                $userExist->tentatives = 4;
                $userExist->save();

                Mail::to($userExist->email)->later(now()->addMinutes(1), new NotificationUnlockedAccount());
                $resetJob = (new ResetTentatives($userExist->id, $userExist->email))->delay(Carbon::now()->addMinutes(1));
                dispatch($resetJob);

                $ip  = $_SERVER['REMOTE_ADDR'];
                openlog('ZOTTODORE_AUTH', LOG_NDELAY, LOG_USER);
                syslog(LOG_INFO, "L'utilisateur {$userExist->email} à atteint son nombre maximal de tentative de connexion depuis l'adresse IP {$ip} ! ");
                Mail::to($userExist->email)->send(new NotificationLockedAccount());
                $retour = [
                    'success' => 0,
                    'message' => 'Veuillez reessayer dans 30 minutes'
                ];
                return $retour;
                break;
            case 4:
                $retour = [
                    'success' => 0,
                    'message' => 'Veuillez reessayer dans quelques minutes'
                ];
                return $retour;
                break;
            default:
                if (Hash::check($password, $userExist->password)) {
                    $userExist->tentatives = 0;
                    $userExist->save();
                    $token = $userExist->createToken('AuthToken')->accessToken;
                    $retour = [
                        'success' => 1,
                        'token' => $token
                    ];
                    return $retour;
                } else {
                    $tentative    = $userExist->tentatives + 1;
                    $userExist->tentatives = $tentative;
                    $userExist->save();
                    $retour = [
                        'success' => 0,
                        'message' => 'Adresse email ou identifiant incorrecte'
                    ];
                    return $retour;
                }
                break;
        }
    }


    /**
     * Update password resolver
     */
    public function updatePassword($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $oldPassword     = $args['oldPassword'];
        $password        = $args['password'];
        $passwordConfirm = $args['passwordConfirm'];
        $userExist  = User::where(["id" => Auth::id()])->first();
        if (!$userExist) {
            return "Une erreur est survenue";
        }

        if (!Hash::check($oldPassword, $userExist->password)) {
            return "Ancien mot de passe incorrecte";
        }

        if ($password != $passwordConfirm) {
            return "Les mots de passe ne sont pas identique";
        }

        $userExist->password = Hash::make($password);
        $userExist->save();

        $ip            = $_SERVER['REMOTE_ADDR'];
        $now           = now()->toDateString();
        $datenow       = new DateTime($now);
        $datenowFormat = $datenow->format('d-m-Y');
        Mail::to($userExist->email)->send(new NotificationChangePassword($userExist->pseudo, $datenowFormat, $ip));

        return null;
    }


    /**
     * Send the url to reset password resolver
     */
    public function sendForgottenMail($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $email     = $args['email'];
        $userExist  = User::where(["email" => $email])->first();
        if ($userExist) {
            $resetToken =  Str::random(15);
            $url =  request()->getSchemeAndHttpHost() . "/reset/" . $resetToken;
            $userExist->resetToken = $resetToken;
            $userExist->save();

            Mail::to($userExist->email)->send(new resetForgottenPassword($userExist->pseudo, $url));
            return  "L'e-mail de réinitialisation a été envoyé";
        }
        return null;
    }


    /**
     * Reset password from url resolver
     */
    public function resetForgotten($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $resetToken         = $args['resetToken'];
        $newPassword        = $args['newPassword'];
        $newPasswordConfirm = $args['newPasswordConfirm'];
        $userExist = User::where(["resetToken" => $resetToken])->first();

        if (!$userExist) {
            return "Token invalide";
        }

        if ($newPassword != $newPasswordConfirm) {
            return "Les mots de passe ne sont pas identique";
        }

        $userExist->password   = Hash::make($newPassword);
        $userExist->resetToken = null;
        $userExist->save();

        $ip            = $_SERVER['REMOTE_ADDR'];
        $now           = now()->toDateString();
        $datenow       = new DateTime($now);
        $datenowFormat = $datenow->format('d-m-Y');
        Mail::to($userExist->email)->send(new NotificationChangePassword($userExist->pseudo, $datenowFormat, $ip));
        
        return null;
    }



    /**
     * Verify mail resolver
     */
    public function verifymail($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $confirmToken = $args['confirmToken'];
        $userExist = User::where(['confirmToken' => $confirmToken])->first();

        if (!$userExist) {
            $retour = [
                'success' => 0,
                'message' => 'Jeton de vérification invalide'
            ];
            return $retour;
        }

        if ($userExist->verified_at != null) {
            $retour = [
                'success' => 0,
                'message' => 'Adresse e-mail déjà vérifier'
            ];
            return $retour;
        }

        $userExist->verified_at =  now();
        $userExist->save();
        $retour = [
            'success' => 1,
            'message' => 'Adresse e-mail vérifier avec succès'
        ];
        return $retour;
    }


    /**
     * check token validity
     */
    public function verifyToken($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        if(Auth::check()){
            return '';
        } else {
            return null;
        }
    }

    /**
     * Logout's resolver
     */
    public function logout($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) {
        Auth::user()->tokens->each(function ($token, $key) {
            $token->delete();
        });
        return true;
    }
}
