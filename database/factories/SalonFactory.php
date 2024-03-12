<?php

namespace Database\Factories;

use App\Models\Package;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'owner_email' => User::where('id', '!=', 1)->pluck('email')->unique()->random(),
            'name' => $this->faker->text(),
            'address' => $this->faker->address(),
            'package_id' => Package::all()->random()->id,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
