import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Users, Phone, Mail, Badge } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface PartnerDoctor {
  id: number;
  name: string;
  specialty: string;
  contact_details?: {
    email?: string;
    phone?: string;
  };
  is_active: boolean;
  created_at: string;
}

interface PageProps {
  doctors: PartnerDoctor[];
}

export default function PartnerDoctorsIndex({ doctors }: PageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<PartnerDoctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    contact_email: '',
    contact_phone: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      contact_email: '',
      contact_phone: '',
      is_active: true,
    });
    setShowAddForm(false);
    setEditingDoctor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoctor) {
      router.patch(`/admin/partner-doctors/${editingDoctor.id}`, formData, {
        onSuccess: () => resetForm(),
      });
    } else {
      router.post('/admin/partner-doctors', formData, {
        onSuccess: () => resetForm(),
      });
    }
  };

  const handleEdit = (doctor: PartnerDoctor) => {
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      contact_email: doctor.contact_details?.email || '',
      contact_phone: doctor.contact_details?.phone || '',
      is_active: doctor.is_active,
    });
    setEditingDoctor(doctor);
    setShowAddForm(true);
  };

  const handleDelete = (doctor: PartnerDoctor) => {
    if (confirm(`Are you sure you want to delete ${doctor.name}?`)) {
      router.delete(`/admin/partner-doctors/${doctor.id}`);
    }
  };

  const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/dashboard' },
    { title: 'Partner Doctors', href: '/admin/partner-doctors' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Partner Doctors Management" />
      
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <Users className="h-5 w-5 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Doctors Management</h1>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Manage healthcare professionals for consultation assignments</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
          >
            <Plus className="w-4 h-4" />
            Add Partner Doctor
          </button>
        </div>
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {editingDoctor ? 'Edit Partner Doctor' : 'Add New Partner Doctor'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Doctor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Specialty *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specialty}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Cardiology, General Practice, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="doctor@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                  
                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                    >
                      {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-500 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring focus:ring-gray-200 disabled:opacity-25 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Doctors List */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              {doctors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Partner Doctors
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You need to add partner doctors before managing consultations.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Partner Doctor
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {doctor.name}
                            </h4>
                            {doctor.is_active ? (
                              <Badge className="w-4 h-4 text-green-600" />
                            ) : (
                              <Badge className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {doctor.specialty}
                          </p>
                          
                          {doctor.contact_details && (
                            <div className="space-y-1">
                              {doctor.contact_details.email && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Mail className="w-3 h-3" />
                                  {doctor.contact_details.email}
                                </div>
                              )}
                              {doctor.contact_details.phone && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Phone className="w-3 h-3" />
                                  {doctor.contact_details.phone}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Edit doctor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete doctor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        Added {new Date(doctor.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>
    </AppLayout>
  );
}