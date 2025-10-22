import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  description: string;
  price_per_use: string;
  image_path: string | null;
}

interface PageProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function AmenitiesManagement({ auth }: PageProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    amenity_name: '',
    description: '',
    price_per_use: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAmenities();
  }, [searchTerm]);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const url = searchTerm
        ? `/api/amenities?search=${encodeURIComponent(searchTerm)}`
        : '/api/amenities';
      
      const response = await fetch(url);
      const data = await response.json();
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('amenity_name', formData.amenity_name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price_per_use', formData.price_per_use);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const url = editingAmenity 
        ? `/api/amenities/${editingAmenity.amenity_id}`
        : '/api/amenities';
      
      const method = editingAmenity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchAmenities();
      }
    } catch (error) {
      console.error('Error saving amenity:', error);
    }
  };

  const handleDelete = async (amenityId: number) => {
    if (!confirm('Are you sure you want to delete this amenity?')) return;

    try {
      const response = await fetch(`/api/amenities/${amenityId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        fetchAmenities();
      }
    } catch (error) {
      console.error('Error deleting amenity:', error);
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      amenity_name: amenity.amenity_name,
      description: amenity.description,
      price_per_use: amenity.price_per_use,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      amenity_name: '',
      description: '',
      price_per_use: '',
    });
    setImageFile(null);
    setEditingAmenity(null);
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    return `/storage/${imagePath}`;
  };

  return (
    <AppLayout>
      <Head title="Manage Amenities" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Amenities Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Manage your resort's world-class amenities
                  </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Amenity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingAmenity 
                          ? 'Update the amenity details below.'
                          : 'Fill in the details to create a new amenity.'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="amenity_name">Amenity Name</Label>
                        <Input
                          id="amenity_name"
                          value={formData.amenity_name}
                          onChange={(e) => setFormData({ ...formData, amenity_name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price_per_use">Price Per Use (₱)</Label>
                        <Input
                          id="price_per_use"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price_per_use}
                          onChange={(e) => setFormData({ ...formData, price_per_use: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="image">Image</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Max file size: 2MB. Formats: JPEG, PNG, JPG, GIF
                        </p>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setIsDialogOpen(false); resetForm(); }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAmenity ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search amenities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Amenities Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p>Loading amenities...</p>
                </div>
              ) : amenities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No amenities found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {amenities.map((amenity) => (
                    <Card key={amenity.amenity_id}>
                      {amenity.image_path && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={getImageUrl(amenity.image_path) || ''}
                            alt={amenity.amenity_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{amenity.amenity_name}</CardTitle>
                            <CardDescription className="mt-2 line-clamp-2">
                              {amenity.description}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            ₱{parseFloat(amenity.price_per_use).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(amenity)}
                            className="flex-1"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(amenity.amenity_id)}
                            className="flex-1"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
