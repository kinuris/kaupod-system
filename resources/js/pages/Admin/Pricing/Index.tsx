import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DollarSign, Save } from 'lucide-react';

interface PricingData {
  kit_base_price: string;
  shipping_fee: string;
  consultation_platform_fee: string;
  consultation_expert_fee: string;
  annual_moderate_subscription_price: string;
  annual_high_subscription_price: string;
  consultation_moderate_discount: string;
  consultation_high_discount: string;
}

interface PageProps {
  pricing: PricingData;
}

export default function PricingIndex({ pricing }: PageProps) {
  const [formData, setFormData] = useState({
    kit_base_price: pricing.kit_base_price,
    shipping_fee: pricing.shipping_fee,
    consultation_platform_fee: pricing.consultation_platform_fee,
    consultation_expert_fee: pricing.consultation_expert_fee,
    annual_moderate_subscription_price: pricing.annual_moderate_subscription_price,
    annual_high_subscription_price: pricing.annual_high_subscription_price,
    consultation_moderate_discount: pricing.consultation_moderate_discount,
    consultation_high_discount: pricing.consultation_high_discount,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    router.patch('/admin/pricing', formData, {
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        setSuccessMessage('Pricing settings updated successfully!');
        // Clear the success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      },
      onError: (errors) => {
        setErrors(errors);
        console.error('Pricing update errors:', errors);
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-50/20">
            <DollarSign className="h-6 w-6 text-red-700 dark:text-red-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing Settings</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage kit pricing and consultation fees
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-2xl bg-red-50 dark:bg-red-50/20 border border-red-200 dark:border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-700 dark:text-red-700">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="max-w-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  There were errors with your submission:
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(errors).map(([field, messages]) => (
                      <li key={field}>
                        <strong>{field.replace('_', ' ')}:</strong> {Array.isArray(messages) ? messages.join(', ') : String(messages)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Standard shipping fee for kit delivery
                </p>
              </div>

              {/* Section Divider */}
              <div className="border-t border-neutral-200 dark:border-neutral-600 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Pricing</h3>
              </div>

              {/* Annual Moderate Subscription Price */}
              <div className="space-y-2">
                <label 
                  htmlFor="annual_moderate_subscription_price" 
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Annual Moderate Subscription (2 kits/year)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    id="annual_moderate_subscription_price"
                    step="0.01"
                    min="0"
                    value={formData.annual_moderate_subscription_price}
                    onChange={(e) => handleInputChange('annual_moderate_subscription_price', e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Annual subscription allowing 2 kit purchases per year
                </p>
              </div>

              {/* Annual High Subscription Price */}
              <div className="space-y-2">
                <label 
                  htmlFor="annual_high_subscription_price" 
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Annual High Subscription (4 kits/year)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    id="annual_high_subscription_price"
                    step="0.01"
                    min="0"
                    value={formData.annual_high_subscription_price}
                    onChange={(e) => handleInputChange('annual_high_subscription_price', e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Annual subscription allowing 4 kit purchases per year
                </p>
              </div>

              {/* Section Divider */}
              <div className="border-t border-neutral-200 dark:border-neutral-600 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Consultation Pricing</h3>
              </div>

              {/* Consultation Discount Percentages */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="consultation_moderate_discount" 
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Moderate Tier Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="consultation_moderate_discount"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.consultation_moderate_discount}
                      onChange={(e) => handleInputChange('consultation_moderate_discount', e.target.value)}
                      className="block w-full pr-8 pl-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="15.00"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-neutral-500 dark:text-neutral-400 text-sm">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Discount percentage for 2 consultations annual plan
                  </p>
                </div>

                <div className="space-y-2">
                  <label 
                    htmlFor="consultation_high_discount" 
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    High Tier Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="consultation_high_discount"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.consultation_high_discount}
                      onChange={(e) => handleInputChange('consultation_high_discount', e.target.value)}
                      className="block w-full pr-8 pl-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="25.00"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-neutral-500 dark:text-neutral-400 text-sm">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Discount percentage for 4 consultations annual plan
                  </p>
                </div>
              </div>

              {/* Consultation Platform Fee */}
              <div className="space-y-2">
                <label 
                  htmlFor="consultation_platform_fee" 
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Platform Fee
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    id="consultation_platform_fee"
                    step="0.01"
                    min="0"
                    value={formData.consultation_platform_fee}
                    onChange={(e) => handleInputChange('consultation_platform_fee', e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Platform service fee for consultation coordination
                </p>
              </div>

              {/* Consultation Expert Fee */}
              <div className="space-y-2">
                <label 
                  htmlFor="consultation_expert_fee" 
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Expert Fee
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    id="consultation_expert_fee"
                    step="0.01"
                    min="0"
                    value={formData.consultation_expert_fee}
                    onChange={(e) => handleInputChange('consultation_expert_fee', e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Professional fee paid to the medical expert
                </p>
              </div>

              {/* Total Preview */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-lg p-4">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Kit Pricing */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Kit Pricing</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Kit Price:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₱{parseFloat(formData.kit_base_price || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Shipping:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₱{parseFloat(formData.shipping_fee || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-600 pt-1 mt-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">Kit Total:</span>
                          <span className="font-bold text-red-700 dark:text-red-700">
                            ₱{(parseFloat(formData.kit_base_price || '0') + parseFloat(formData.shipping_fee || '0')).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subscription Pricing */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Subscription Pricing</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Moderate (2 kits):</span>
                        <span className="font-medium text-gray-900 dark:text-white text-xs">
                          ₱{parseFloat(formData.annual_moderate_subscription_price || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">High (4 kits):</span>
                        <span className="font-medium text-gray-900 dark:text-white text-xs">
                          ₱{parseFloat(formData.annual_high_subscription_price || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-600 pt-1 mt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-900 dark:text-white">Per Kit Cost:</span>
                          <div className="text-xs font-bold text-red-700 dark:text-red-700">
                            <div>₱{(parseFloat(formData.annual_moderate_subscription_price || '0') / 2).toFixed(2)} / ₱{(parseFloat(formData.annual_high_subscription_price || '0') / 4).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Consultation Pricing */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Consultation Pricing</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Platform Fee:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₱{parseFloat(formData.consultation_platform_fee || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Expert Fee:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₱{parseFloat(formData.consultation_expert_fee || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-600 pt-1 mt-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">Single Consultation:</span>
                          <span className="font-bold text-red-700 dark:text-red-700">
                            ₱{(parseFloat(formData.consultation_platform_fee || '0') + parseFloat(formData.consultation_expert_fee || '0')).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-0.5 mt-2 pt-1 border-t border-neutral-200 dark:border-neutral-600">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            Moderate (2) - {parseFloat(formData.consultation_moderate_discount || '0').toFixed(1)}% off:
                          </span>
                          <span className="font-medium text-blue-600">
                            ₱{((parseFloat(formData.consultation_platform_fee || '0') + parseFloat(formData.consultation_expert_fee || '0')) * 2 * (1 - parseFloat(formData.consultation_moderate_discount || '0') / 100)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            High (4) - {parseFloat(formData.consultation_high_discount || '0').toFixed(1)}% off:
                          </span>
                          <span className="font-medium text-purple-600">
                            ₱{((parseFloat(formData.consultation_platform_fee || '0') + parseFloat(formData.consultation_expert_fee || '0')) * 4 * (1 - parseFloat(formData.consultation_high_discount || '0') / 100)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
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