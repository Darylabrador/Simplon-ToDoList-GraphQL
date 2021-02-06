<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

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
        $pseudo   = $args['pseudo'];
        $email    = $args['email'];
        $password = $args['password'];

        User::create([
            "pseudo" => $pseudo,
            "email"    => $email,
            "password" => Hash::make($password)
        ]);

        return true;
    }
}
