<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'category' => $product->category,
                'is_active' => (bool) $product->is_active,
                'is_featured' => (bool) $product->is_featured,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });
        
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|in:condom,pregnancy_test,pills,vitamins,other_kits',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Admin/Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'category' => $product->category,
                'is_active' => (bool) $product->is_active,
                'is_featured' => (bool) $product->is_featured,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'category' => $product->category,
                'is_active' => (bool) $product->is_active,
                'is_featured' => (bool) $product->is_featured,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|in:condom,pregnancy_test,pills,vitamins,other_kits',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
