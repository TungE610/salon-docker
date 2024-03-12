<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salon;

class SalonsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Salon::factory()->count(2)->create();
    }
}
