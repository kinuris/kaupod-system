import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DollarSign, Save } from 'lucide-react';

interface PricingData {
  kit_base_price: string;
  shipping_fee: string;
}

interface PageProps {
  pricing: PricingData;
}

export default function PricingIndex({ pricing }: PageProps) {
  const [formData, setFormData] = useState({
    kit_base_price: pricing.kit_base_price,
    shipping_fee: pricing.shipping_fee,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.patch('/admin/pricing', formData, {
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        // Optional: Show success message
      },
    });
  };

  const handleInputChange = (field: keyof PricingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AppLayout>
      <Head title="Pricing Settings" />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/20">
            <DollarSign className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing Settings</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage kit base prices and shipping fees
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="max-w-2xl">
          <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900/50 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Kit Base Price */}
              <div className="space-y-2">
                <label 
                  htmlFor="kit_base_price" 
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Kit Base Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    id="kit_base_price"
                    step="0.01"
                    min="0"
                    value={formData.kit_base_price}
                    onChange={(e) => handleInputChange('kit_base_price', e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Base price for testing kits before additional fees
                </p>
              </div>

              {/* Shipping Fee */}
              <div className="space-y-2">
                <label 
                  htmlFor="shipping_fee" 
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shipping Fee
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    id="shipping_fee"
                    step="0.01"
                    min="0"
                    value={formData.shipping_fee}
                    onChange={(e) => handleInputChange('shipping_fee', e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Standard shipping fee for kit delivery
                </p>
              </div>

              {/* Total Preview */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Kit Price:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₱{parseFloat(formData.kit_base_price || '0').toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Shipping:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₱{parseFloat(formData.shipping_fee || '0').toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Total Price:</span>
                    <span className="font-bold text-lg text-pink-600 dark:text-pink-400">
                      ₱{(parseFloat(formData.kit_base_price || '0') + parseFloat(formData.shipping_fee || '0')).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}