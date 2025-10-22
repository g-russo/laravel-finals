import { useState, FormEvent } from 'react';
import { Head, router, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload, Save, X, AlertTriangle, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Amenities Management',
        href: '/admin/amenities',
    },
];

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  description: string;
  price_per_use: string;
  image_path: string | null;
  created_at?: string;
  updated_at?: string;
}

type Paginated<T> = {
    data: T[];
    links: any[];
    meta: any;
};

type AmenityStats = {
    total: number;
    active: number;
    premium: number; // amenities with price > 1000
};

interface PageProps {
  amenities: Paginated<Amenity>;
  filters?: { search?: string };
  stats: AmenityStats;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function AmenitiesManagement({ amenities, filters, stats, flash }: PageProps) {
  const [search, setSearch] = useState(filters?.search ?? '');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
    amenity_name: '',
    description: '',
    price_per_use: '',
    image: null as File | null,
  });

  const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
    amenity_name: '',
    description: '',
    price_per_use: '',
    image: null as File | null,
  });

  const { delete: deleteAmenity, processing: deleteProcessing } = useForm();

  // Show flash messages if any
  useState(() => {
    if (flash?.success) {
      setMessage({ type: 'success', text: flash.success });
      setTimeout(() => setMessage(null), 5000);
    }
    if (flash?.error) {
      setMessage({ type: 'error', text: flash.error });
      setTimeout(() => setMessage(null), 5000);
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/amenities', { search }, { preserveState: true, replace: true });
  };

  const onClear = () => {
    setSearch('');
    router.get('/admin/amenities', {}, { preserveState: true, replace: true });
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop';
    }
    return `/storage/${imagePath}`;
  };

  const formatPrice = (price: string) => {
    return '₱' + new Intl.NumberFormat('en-PH').format(parseFloat(price));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit) {
        setEditData('image', file);
      } else {
        setCreateData('image', file);
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    
    post('/admin/amenities', {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Amenity created successfully!' });
        setIsCreateDialogOpen(false);
        resetCreate();
        setImagePreview(null);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'Failed to create amenity. Please check your inputs.' });
      },
    });
  };

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmenity) return;

    put(`/admin/amenities/${selectedAmenity.amenity_id}`, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Amenity updated successfully!' });
        setIsEditDialogOpen(false);
        resetEdit();
        setImagePreview(null);
        setSelectedAmenity(null);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'Failed to update amenity. Please check your inputs.' });
      },
    });
  };

  const handleDelete = () => {
    if (!amenityToDelete) return;

    deleteAmenity(`/admin/amenities/${amenityToDelete.amenity_id}`, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Amenity deleted successfully!' });
        setIsDeleteDialogOpen(false);
        setAmenityToDelete(null);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'Failed to delete amenity.' });
      },
    });
  };

  const openCreateDialog = () => {
    resetCreate();
    setImagePreview(null);
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setEditData({
      amenity_name: amenity.amenity_name,
      description: amenity.description,
      price_per_use: amenity.price_per_use,
      image: null,
    });
    setImagePreview(null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (amenity: Amenity) => {
    setAmenityToDelete(amenity);
    setIsDeleteDialogOpen(true);
  };

  const handleViewAmenity = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setIsViewModalOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Amenities Management" />
      {/* Bootstrap Icons CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
      
      <div className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
        {/* Admin Header Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-full px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="bi bi-water text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Amenities Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage resort amenities, pricing, and descriptions
                  </p>
                </div>
              </div>
              <Button 
                onClick={openCreateDialog} 
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i className="bi bi-plus-circle mr-2 text-lg"></i>
                Add New Amenity
              </Button>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-6">
          {/* Success/Error Message */}
          {message && (
            <Alert className={`${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Total Amenities
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
                    <p className="text-xs text-gray-400">All amenities</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <i className="bi bi-water text-blue-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-transparent h-1 rounded-b-2xl"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Active
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.active}</p>
                    <p className="text-xs text-gray-400">Available for use</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <i className="bi bi-check-circle-fill text-green-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-transparent h-1 rounded-b-2xl"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Premium
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.premium}</p>
                    <p className="text-xs text-gray-400">High-end facilities</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <i className="bi bi-star-fill text-yellow-600 text-2xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-transparent h-1 rounded-b-2xl"></div>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center mb-5">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="bi bi-funnel text-orange-600"></i>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
              </div>
              
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-9">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      <i className="bi bi-search mr-1"></i>Search
                    </label>
                    <div className="relative">
                      <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by amenity name, description, or price..."
                        className="pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex items-end gap-2">
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <i className="bi bi-search mr-2"></i>
                      Apply
                    </Button>
                    {search && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={onClear}
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        title="Clear filters"
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="bi bi-table text-orange-600"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">All Amenities</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Showing {amenities?.data?.length || 0} of {stats.total} total amenities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <th className="px-4 py-4 text-left w-16">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <i className="bi bi-hash mr-1"></i>ID
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <i className="bi bi-water mr-1"></i>Amenity
                      </span>
                    </th>
                    <th className="px-4 py-4 text-left w-36">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <i className="bi bi-currency-dollar mr-1"></i>Price/Use
                      </span>
                    </th>
                    <th className="px-4 py-4 text-center w-32">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <i className="bi bi-gear mr-1"></i>Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {amenities?.data?.length > 0 ? (
                    amenities.data.map((amenity, index) => (
                      <tr 
                        key={amenity.amenity_id} 
                        className="hover:bg-orange-50/30 transition-colors duration-150 group"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <span className="text-orange-700 font-bold text-xs">
                              {amenity.amenity_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img 
                                src={getImageUrl(amenity.image_path)} 
                                alt={amenity.amenity_name}
                                className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop';
                                }}
                              />
                              {parseFloat(amenity.price_per_use) > 1000 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                  <i className="bi bi-star-fill text-white text-xs"></i>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {amenity.amenity_name}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {amenity.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {formatPrice(amenity.price_per_use)}
                            </span>
                            <span className="text-xs text-gray-500">per use</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleViewAmenity(amenity)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                              title="View Details"
                            >
                              <i className="bi bi-eye text-sm"></i>
                            </button>
                            <button
                              onClick={() => openEditDialog(amenity)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all duration-200"
                              title="Edit"
                            >
                              <i className="bi bi-pencil text-sm"></i>
                            </button>
                            <button
                              onClick={() => openDeleteDialog(amenity)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                              title="Delete"
                            >
                              <i className="bi bi-trash text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                            <i className="bi bi-water text-4xl text-gray-300"></i>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No amenities found
                          </h3>
                          <p className="text-sm text-gray-500 mb-6">
                            Try adjusting your search criteria or add a new amenity
                          </p>
                          <Button
                            onClick={openCreateDialog}
                            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg"
                          >
                            <i className="bi bi-plus-circle mr-2"></i>
                            Add Your First Amenity
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {amenities?.data?.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {amenities.data.length}
                    </span> amenities displayed
                  </div>
                  <div className="text-xs text-gray-500">
                    <i className="bi bi-info-circle mr-1"></i>
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Amenity Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedAmenity && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="bi bi-water text-orange-600"></i>
                  </div>
                  {selectedAmenity.amenity_name}
                </DialogTitle>
                <DialogDescription>
                  View detailed information about this amenity
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src={getImageUrl(selectedAmenity.image_path)}
                    alt={selectedAmenity.amenity_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/95 text-gray-900 shadow-lg font-bold px-4 py-2">
                      {formatPrice(selectedAmenity.price_per_use)} per use
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedAmenity.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">Amenity ID</p>
                    <p className="text-lg font-bold text-orange-600">#{selectedAmenity.amenity_id}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">Price Category</p>
                    <p className="text-lg font-bold text-orange-600">
                      {parseFloat(selectedAmenity.price_per_use) > 1000 ? 'Premium' : 'Standard'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditDialog(selectedAmenity);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Amenity
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-6"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Amenity Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="bi bi-plus-circle text-orange-600"></i>
              Create New Amenity
            </DialogTitle>
            <DialogDescription>
              Add a new amenity to your resort. Fill in all the details below to showcase what guests can enjoy.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create_amenity_name" className="text-sm font-medium">
                  Amenity Name *
                </Label>
                <Input
                  id="create_amenity_name"
                  value={createData.amenity_name}
                  onChange={(e) => setCreateData('amenity_name', e.target.value)}
                  placeholder="e.g., Swimming Pool, Spa, Gym"
                  className={createErrors.amenity_name ? 'border-red-500' : ''}
                  required
                />
                {createErrors.amenity_name && (
                  <p className="text-sm text-red-500 mt-1">{createErrors.amenity_name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="create_price_per_use" className="text-sm font-medium">
                  Price per Use (₱) *
                </Label>
                <Input
                  id="create_price_per_use"
                  type="number"
                  step="0.01"
                  min="0"
                  value={createData.price_per_use}
                  onChange={(e) => setCreateData('price_per_use', e.target.value)}
                  placeholder="0.00"
                  className={createErrors.price_per_use ? 'border-red-500' : ''}
                  required
                />
                {createErrors.price_per_use && (
                  <p className="text-sm text-red-500 mt-1">{createErrors.price_per_use}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="create_description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="create_description"
                value={createData.description}
                onChange={(e) => setCreateData('description', e.target.value)}
                placeholder="Describe the amenity and what guests can expect. Include any special features, hours of operation, or requirements..."
                rows={3}
                className={createErrors.description ? 'border-red-500' : ''}
                required
              />
              {createErrors.description && (
                <p className="text-sm text-red-500 mt-1">{createErrors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="create_image" className="text-sm font-medium mb-2 block">
                Amenity Image
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="create_image"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, WEBP (MAX. 2MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="create_image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={(e) => handleImageChange(e, false)}
                    className="hidden"
                  />
                </label>
              </div>
              {createErrors.image && (
                <p className="text-sm text-red-500 mt-1">{createErrors.image}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Recommended: 800x600px or larger, 4:3 aspect ratio for best results
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetCreate();
                  setImagePreview(null);
                }}
                disabled={createProcessing}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={createProcessing} className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" />
                {createProcessing ? 'Creating...' : 'Create Amenity'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Amenity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="bi bi-pencil text-orange-600"></i>
              Edit Amenity
            </DialogTitle>
            <DialogDescription>
              Update the details for "{selectedAmenity?.amenity_name}". Make any necessary changes below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_amenity_name" className="text-sm font-medium">
                  Amenity Name *
                </Label>
                <Input
                  id="edit_amenity_name"
                  value={editData.amenity_name}
                  onChange={(e) => setEditData('amenity_name', e.target.value)}
                  placeholder="e.g., Swimming Pool, Spa, Gym"
                  className={editErrors.amenity_name ? 'border-red-500' : ''}
                  required
                />
                {editErrors.amenity_name && (
                  <p className="text-sm text-red-500 mt-1">{editErrors.amenity_name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit_price_per_use" className="text-sm font-medium">
                  Price per Use (₱) *
                </Label>
                <Input
                  id="edit_price_per_use"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editData.price_per_use}
                  onChange={(e) => setEditData('price_per_use', e.target.value)}
                  placeholder="0.00"
                  className={editErrors.price_per_use ? 'border-red-500' : ''}
                  required
                />
                {editErrors.price_per_use && (
                  <p className="text-sm text-red-500 mt-1">{editErrors.price_per_use}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit_description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="edit_description"
                value={editData.description}
                onChange={(e) => setEditData('description', e.target.value)}
                placeholder="Describe the amenity and what guests can expect..."
                rows={3}
                className={editErrors.description ? 'border-red-500' : ''}
                required
              />
              {editErrors.description && (
                <p className="text-sm text-red-500 mt-1">{editErrors.description}</p>
              )}
            </div>

            {/* Current Image */}
            {selectedAmenity && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Current Image</Label>
                <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={getImageUrl(selectedAmenity.image_path)}
                    alt={selectedAmenity.amenity_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="edit_image" className="text-sm font-medium mb-2 block">
                New Image (optional)
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="edit_image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Click to upload new image
                      </p>
                    </div>
                  )}
                  <Input
                    id="edit_image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={(e) => handleImageChange(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
              {editErrors.image && (
                <p className="text-sm text-red-500 mt-1">{editErrors.image}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Leave empty to keep current image
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetEdit();
                  setImagePreview(null);
                  setSelectedAmenity(null);
                }}
                disabled={editProcessing}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={editProcessing} className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" />
                {editProcessing ? 'Updating...' : 'Update Amenity'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Amenity
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{amenityToDelete?.amenity_name}"? This action cannot be undone and will permanently remove this amenity from your resort.
            </DialogDescription>
          </DialogHeader>
          
          {amenityToDelete && (
            <div className="my-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(amenityToDelete.image_path)}
                  alt={amenityToDelete.amenity_name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{amenityToDelete.amenity_name}</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(amenityToDelete.price_per_use)} per use
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setAmenityToDelete(null);
              }}
              disabled={deleteProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              variant="destructive"
              disabled={deleteProcessing}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteProcessing ? 'Deleting...' : 'Delete Amenity'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}