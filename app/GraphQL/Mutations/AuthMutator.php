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
        if (!$userExist || !Hash::check($password, $userExist->password)) {
            return null;
        }
        $token = $userExist->createToken('AuthToken')->accessToken;
        return $token;
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
        return "Vous ne pouvez pas effectuer cette action";
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
        
        return "Mise à jour effectuée";
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
