import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Package, Calendar, Eye, EyeOff, Star } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image?: string | null;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    product: Product;
}

export default function ProductsShow({ product }: PageProps) {
    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Health Store Products', href: '/admin/products' },
        { title: 'Product Details', href: `/admin/products/${product.id}` },
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbItems}>
            <Head title={product.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <Package className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Product details and information
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link href={`/admin/products/${product.id}/edit`}>
                        <Button className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Product
                        </Button>
                    </Link>
                </div>

                {/* Product Information */}
                <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/5 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Basic Information */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                                            {getCategoryLabel(product.category)}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                            product.is_active ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
                                        }`}>
                                            {product.is_active ? (
                                                <>
                                                    <Eye className="h-3 w-3" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3" />
                                                    Inactive
                                                </>
                                            )}
                                        </span>
                                        {product.is_featured && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                                                <Star className="h-3 w-3" />
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</div>
                                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">₱{product.price.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</div>
                                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                        {product.stock}
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">units</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${
                                            product.stock === 0 ? 'bg-red-500' :
                                            product.stock < 10 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}></span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {product.stock === 0 ? 'Out of Stock' :
                                             product.stock < 10 ? 'Low Stock' :
                                             'In Stock'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Timestamps */}
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Product History</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</div>
                                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(product.created_at)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
                                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(product.updated_at)}</div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}