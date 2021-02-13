<?php

namespace Database\Seeders;

use App\Models\Priority;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $now = now()->toDateString();
        $faker = \Faker\Factory::create("fr_FR");

        User::create([
            'pseudo'        => 'admin',
            'email'         => 'admin@gmail.com',
            'password'      => Hash::make('password'),
            "confirmToken" => Str::random(25),
            'verified_at'  => $now,
        ]);

        $priorityArray = ['Faible', 'Moyenne', 'Forte'];
        for($i = 0; $i < count($priorityArray); $i++){
            Priority::create([
                'label' => $priorityArray[$i]
            ]);
        }

        for($i = 1; $i < 11; $i++){
            Task::create([
                'title'         => "Tache {$i}",
                'description'   => $faker->text(40),
                'deadline'      => now()->addDays(1),
                'done'          => $faker->numberBetween(0,1),
                'user_id'       => 1,
                'priority_id'   => $faker->numberBetween(1, 3),
            ]);
        }
    }
}
