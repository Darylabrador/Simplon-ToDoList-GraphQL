<?php

namespace App\GraphQL\Mutations;

use App\Models\Task;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class TaskMutator
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
     * Create user's task resolver
     */
    public function create($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $title          = $args['title'];
        $description    = $args['description'];
        $deadline       = $args['deadline'];
        $priority_id    = $args['priority_id'];

        $task = Task::create([
            "title"         => $title,
            "description"   => $description,
            "deadline"      => $deadline,
            "user_id"       => Auth::id(),
            "priority_id"   => $priority_id
        ]);
        
        return $task;
    }
}
