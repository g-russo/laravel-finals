import { useState, FormEvent } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Save, X, AlertTriangle, Trash2, Edit, Search } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { AmenityCard } from '@/components/amenities/amenity-card';
import { AmenityImageUpload } from '@/components/amenities/amenity-image-upload';
import { AmenityStatsCard } from '@/components/amenities/amenity-stats-card';
import { AmenityFormFields } from '@/components/amenities/amenity-form-fields';
import { adminStyles } from '@/lib/admin-styles';

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
    premium: number;
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
  const [activeTab, setActiveTab] = useState('full-management');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
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

  const { data: imageData, setData: setImageData, post: postImage, processing: imageProcessing, reset: resetImage } = useForm({
    image: null as File | null,
  });

  const { delete: deleteAmenity, processing: deleteProcessing } = useForm();

  // Show flash messages
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

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop';
    }
    return `/storage/${imagePath}`;
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/amenities', { search }, { preserveState: true, replace: true });
  };

  const onClearSearch = () => {
    setSearch('');
    router.get('/admin/amenities', {}, { preserveState: true, replace: true });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, mode: 'create' | 'edit' | 'image-only') => {
    const file = e.target.files?.[0];
    if (file) {
      if (mode === 'create') {
        setCreateData('image', file);
      } else if (mode === 'edit') {
        setEditData('image', file);
      } else {
        setImageData('image', file);
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

  const handleImageUpdate = (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmenity || !imageData.image) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    postImage(`/admin/amenities/${selectedAmenity.amenity_id}`, {
      onSuccess: () => {
        setMessage({ type: 'success', text: `Image updated successfully for ${selectedAmenity.amenity_name}!` });
        setIsImageDialogOpen(false);
        resetImage();
        setImagePreview(null);
        setSelectedAmenity(null);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'Failed to update image. Please try again.' });
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

  const openImageDialog = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    resetImage();
    setImagePreview(null);
    setIsImageDialogOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Amenities Management" />
      
      {/* Bootstrap Icons CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
      
      <div className="bg-gradient-to-br from-gray-50 via-cyan-50/30 to-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-full px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
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
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="mr-2 h-5 w-5" />
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

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center mb-5">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                  <Search className="text-cyan-600 h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Search Amenities</h2>
              </div>
              
              <form onSubmit={onSearchSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by name, description, or price..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  Search
                </Button>
                {search && (
                  <Button type="button" variant="outline" onClick={onClearSearch}>
                    Clear
                  </Button>
                )}
              </form>
            </div>
          </div>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="full-management">Full Management</TabsTrigger>
              <TabsTrigger value="image-only">Image Updates</TabsTrigger>
            </TabsList>

            {/* Full Management Tab */}
            <TabsContent value="full-management" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {amenities?.data?.length > 0 ? (
                  amenities.data.map((amenity) => (
                    <AmenityCard
                      key={amenity.amenity_id}
                      amenity={amenity}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                      mode="full"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No amenities found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Image Only Tab */}
            <TabsContent value="image-only" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {amenities?.data?.length > 0 ? (
                  amenities.data.map((amenity) => (
                    <AmenityCard
                      key={amenity.amenity_id}
                      amenity={amenity}
                      onChangeImage={openImageDialog}
                      mode="image-only"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No amenities found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Amenity Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="bi bi-plus-circle text-orange-600"></i>
              Create New Amenity
            </DialogTitle>
            <DialogDescription>
              Add a new amenity to your resort. Fill in all the details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <AmenityFormFields
              data={createData}
              errors={createErrors}
              onChange={(field, value) => setCreateData(field as any, value)}
              idPrefix="create_"
            />

            <AmenityImageUpload
              imagePreview={imagePreview}
              onChange={(e) => handleImageChange(e, 'create')}
              id="create_image"
              label="Amenity Image"
            />
            
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
              <Button type="submit" disabled={createProcessing} className="bg-cyan-600 hover:bg-cyan-700">
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
              <Edit className="text-orange-600 h-5 w-5" />
              Edit Amenity
            </DialogTitle>
            <DialogDescription>
              Update the details for "{selectedAmenity?.amenity_name}".
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEdit} className="space-y-6">
            <AmenityFormFields
              data={editData}
              errors={editErrors}
              onChange={(field, value) => setEditData(field as any, value)}
              idPrefix="edit_"
            />

            <AmenityImageUpload
              imagePreview={imagePreview}
              onChange={(e) => handleImageChange(e, 'edit')}
              id="edit_image"
              label="New Image (optional)"
              showPreviewOnly={true}
              currentImageUrl={selectedAmenity ? getImageUrl(selectedAmenity.image_path) : null}
            />
            
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
              <Button type="submit" disabled={editProcessing} className="bg-cyan-600 hover:bg-cyan-700">
                <Save className="mr-2 h-4 w-4" />
                {editProcessing ? 'Updating...' : 'Update Amenity'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Only Update Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Update Image for {selectedAmenity?.amenity_name}
            </DialogTitle>
            <DialogDescription>
              Upload a new image to replace the current one.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleImageUpdate} className="space-y-6">
            <AmenityImageUpload
              imagePreview={imagePreview}
              onChange={(e) => handleImageChange(e, 'image-only')}
              id="image_only"
              label="New Image"
              required={true}
              showPreviewOnly={true}
              currentImageUrl={selectedAmenity ? getImageUrl(selectedAmenity.image_path) : null}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsImageDialogOpen(false);
                  resetImage();
                  setImagePreview(null);
                  setSelectedAmenity(null);
                }}
                disabled={imageProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={imageProcessing || !imageData.image} className="bg-cyan-600 hover:bg-cyan-700">
                {imageProcessing ? 'Uploading...' : 'Update Image'}
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
              Are you sure you want to delete "{amenityToDelete?.amenity_name}"? This action cannot be undone.
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
                    ₱{parseFloat(amenityToDelete.price_per_use).toLocaleString('en-PH', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} per use
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

