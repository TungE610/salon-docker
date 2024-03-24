<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'category_id' => Category::all()->random()->id,
            'name' => $this->faker->text(10),
            'unit' => $this->faker->text(),
            'cost' => $this->faker->randomNumber(),
            'quantity' =>$this->faker->randomNumber(),
            'description' => $this->faker->text(),
            'is_active' => true,
            'product_type' => $this->faker->randomElement([0, 1, 2]),
            'origin' => $this->faker->text(10),
            'price' => $this->faker->randomNumber(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
