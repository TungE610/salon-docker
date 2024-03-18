<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;


class RegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'salon_name' => $this->faker->text(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'phone_number'=> $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('12345678'), // password
            'address' => $this->faker->address(),
            'seats_number' => $this->faker->numberBetween(1,5000),
            'staffs_number' => $this->faker->numberBetween(1,5000),
            'package_id' => Package::all()->random()->id,
            'status' => $this->faker->numberBetween(0, 2),
            'approved_by' => User::where('system_role_id', 1)->get()->random()->id,
            'approved_at' => now(),
        ];
    }
}
