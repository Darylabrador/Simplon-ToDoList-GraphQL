<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Mail;
use App\Mail\RegisterNotification;

class CreateUserMutator
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
     * Register user's resolver
     */
    public function create ($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) {
        $pseudo          = $args['pseudo'];
        $email           = $args['email'];
        $password        = $args['password'];
        $passwordConfirm = $args['passwordConfirm'];

        if ($password != $passwordConfirm) {
            return null;
        }

        $confirmToken = Str::random(25);
        $user = User::create([
            "pseudo" => $pseudo,
            "email"    => $email,
            "password" => Hash::make($password),
            "confirmToken" => $confirmToken
        ]);

        $url = request()->getSchemeAndHttpHost() . "/email/verification/" . $user->confirmToken;
        Mail::to($user->email)->send(new RegisterNotification($user->name, $url));

        return "Vous pouvez à présent vous connecter";
    }
}
