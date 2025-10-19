import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Package } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    is_active: boolean;
    is_featured: boolean;
}

interface EditProductForm {
    name: string;
    description: string;
    price: number | string;
    stock: number | string;
    category: string;
    is_active: boolean;
    is_featured: boolean;
}

interface PageProps {
    product: Product;
}

export default function ProductsEdit({ product }: PageProps) {
    const { data, setData, patch, processing, errors } = useForm<EditProductForm>({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        is_active: product.is_active,
        is_featured: product.is_featured,
    });

    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Health Store Products', href: '/admin/products' },
        { title: 'Edit Product', href: `/admin/products/${product.id}/edit` },
    ];

    const categories = [
        { value: 'condom', label: 'Condoms' },
        { value: 'pregnancy_test', label: 'Pregnancy Tests' },
        { value: 'pills', label: 'Pills' },
        { value: 'vitamins', label: 'Vitamins' },
        { value: 'other_kits', label: 'Other Kits' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/products/${product.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbItems}>
            <Head title={`Edit ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                            <Package className="h-5 w-5 text-orange-700 dark:text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Update product information and settings
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Product Form */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/5 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Basic Information */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Update the basic details for your product
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Product Name */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                                            placeholder="Enter product name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
                                            placeholder="Enter product description"
                                            rows={4}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <Label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">Price (₱) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
                                            placeholder="0.00"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <Label htmlFor="stock" className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity *</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            min="0"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            className={`mt-1 ${errors.stock ? 'border-red-500' : ''}`}
                                            placeholder="0"
                                        />
                                        {errors.stock && (
                                            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category *</Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(value) => setData('category', value)}
                                        >
                                            <SelectTrigger className={`mt-1 ${errors.category ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Settings */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Settings</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Configure visibility and features
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                                            <Checkbox
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', !!checked)}
                                                className='border border-white'
                                            />
                                            <div>
                                                <Label htmlFor="is_active" className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Active Product
                                                </Label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Active products are visible to customers in the store.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                                            <Checkbox
                                                id="is_featured"
                                                checked={data.is_featured}
                                                onCheckedChange={(checked) => setData('is_featured', !!checked)}
                                                className='border border-white'
                                            />
                                            <div>
                                                <Label htmlFor="is_featured" className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Featured Product
                                                </Label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Featured products are highlighted in the store.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <Package className="h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Product'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}