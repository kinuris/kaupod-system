import { Head, Link, router } from '@inertiajs/react';
import { Search, Package, Eye, Edit, Trash2, Plus, Filter, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    created_at: string;
    updated_at: string;
}

interface PageProps {
    products: Product[];
}

export default function ProductsIndex({ products }: PageProps) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Health Store Products', href: '/admin/products' },
    ];

    const handleDelete = (productId: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${productId}`);
        }
    };

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'condom', label: 'Condoms' },
        { value: 'pregnancy_test', label: 'Pregnancy Tests' },
        { value: 'pills', label: 'Pills' },
        { value: 'vitamins', label: 'Vitamins' },
        { value: 'other_kits', label: 'Other Kits' },
    ];

    const getCategoryLabel = (category: string) => {
        const categoryMap: { [key: string]: string } = {
            'condom': 'Condoms',
            'pregnancy_test': 'Pregnancy Tests',
            'pills': 'Pills',
            'vitamins': 'Vitamins',
            'other_kits': 'Other Kits',
        };
        return categoryMap[category] || category;
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                            product.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbItems}>
            <Head title="Products Management" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <Package className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Store Products</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage your health store products, pricing, and inventory
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/products/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Products Table */}
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/20">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                                            <p>No products found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {product.name}
                                                        {product.is_featured && (
                                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                                                    {getCategoryLabel(product.category)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                ₱{product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.stock === 0 ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                                                    product.stock < 10 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                                                    'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                                                }`}>
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.is_active ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
                                                }`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/products/${product.id}`} className="flex items-center">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/products/${product.id}/edit`} className="flex items-center">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                                        </table>
                </div>

                {/* Summary */}
                <div className="mt-6 text-sm text-gray-700 dark:text-gray-300">
                    Showing {filteredProducts.length} of {products.length} products
                </div>
            </div>
        </AppLayout>
    );
}