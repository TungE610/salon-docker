<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            SystemRolesSeeder::class,
            CreateInitialAdminAccount::class,
            SalonRolesSeeder::class,
            PackageSeeder::class,
            UsersSeeder::class,
            SalonsSeeder::class,
        ]);
    }
}
