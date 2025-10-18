<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Condoms
            [
                'name' => 'Premium Latex Condoms (12 pack)',
                'category' => 'condom',
                'price' => 299.00,
                'stock' => 50,
                'description' => 'High-quality latex condoms for safe protection',
                'is_active' => true,
            ],
            [
                'name' => 'Ultra-Thin Condoms (6 pack)',
                'category' => 'condom',
                'price' => 199.00,
                'stock' => 30,
                'description' => 'Ultra-thin for enhanced sensitivity',
                'is_active' => true,
            ],
            [
                'name' => 'Flavored Condoms (3 pack)',
                'category' => 'condom',
                'price' => 149.00,
                'stock' => 25,
                'description' => 'Variety pack with different flavors',
                'is_active' => true,
            ],
            
            // Pregnancy Tests
            [
                'name' => 'Digital Pregnancy Test',
                'category' => 'pregnancy_test',
                'price' => 450.00,
                'stock' => 40,
                'description' => 'Digital display with clear results',
                'is_active' => true,
            ],
            [
                'name' => 'Early Detection Test Strip',
                'category' => 'pregnancy_test',
                'price' => 199.00,
                'stock' => 60,
                'description' => 'Accurate results from day 1 of missed period',
                'is_active' => true,
            ],
            [
                'name' => 'Pregnancy Test Kit (2 tests)',
                'category' => 'pregnancy_test',
                'price' => 350.00,
                'stock' => 35,
                'description' => 'Pack of 2 test strips for confirmation',
                'is_active' => true,
            ],
            
            // Pills
            [
                'name' => 'Emergency Contraceptive Pill',
                'category' => 'pills',
                'price' => 650.00,
                'stock' => 20,
                'description' => 'Morning-after pill (consult healthcare provider)',
                'is_active' => true,
            ],
            [
                'name' => 'Iron Supplement Pills',
                'category' => 'pills',
                'price' => 299.00,
                'stock' => 45,
                'description' => 'Iron deficiency supplement (30 tablets)',
                'is_active' => true,
            ],
            [
                'name' => 'Folic Acid Pills',
                'category' => 'pills',
                'price' => 199.00,
                'stock' => 55,
                'description' => 'Essential for pregnancy planning (60 tablets)',
                'is_active' => true,
            ],
            
            // Vitamins
            [
                'name' => 'Multivitamin for Women',
                'category' => 'vitamins',
                'price' => 799.00,
                'stock' => 30,
                'description' => 'Complete daily nutrition for women',
                'is_active' => true,
            ],
            [
                'name' => 'Vitamin D3 Supplements',
                'category' => 'vitamins',
                'price' => 499.00,
                'stock' => 40,
                'description' => 'Bone health and immunity support',
                'is_active' => true,
            ],
            [
                'name' => 'Prenatal Vitamins',
                'category' => 'vitamins',
                'price' => 899.00,
                'stock' => 25,
                'description' => 'Essential vitamins during pregnancy',
                'is_active' => true,
            ],
            
            // Other Kits
            [
                'name' => 'Blood Glucose Testing Kit',
                'category' => 'other_kits',
                'price' => 1299.00,
                'stock' => 15,
                'description' => 'Complete glucose monitoring system',
                'is_active' => true,
            ],
            [
                'name' => 'Blood Pressure Monitor',
                'category' => 'other_kits',
                'price' => 2499.00,
                'stock' => 10,
                'description' => 'Digital blood pressure monitoring device',
                'is_active' => true,
            ],
            [
                'name' => 'Thermometer Kit',
                'category' => 'other_kits',
                'price' => 399.00,
                'stock' => 35,
                'description' => 'Digital thermometer with protective case',
                'is_active' => true,
            ],
            [
                'name' => 'First Aid Kit',
                'category' => 'other_kits',
                'price' => 899.00,
                'stock' => 20,
                'description' => 'Complete emergency first aid supplies',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
