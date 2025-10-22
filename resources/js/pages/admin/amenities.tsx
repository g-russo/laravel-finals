import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  description: string;
  price_per_use: string;
  image_path: string | null;
}

interface PageProps {
  amenities: Amenity[];
}

export default function AdminAmenities({ amenities }: PageProps) {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop';
    }
    return `/storage/${imagePath}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmenity || !imageFile) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    setProcessing(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('_method', 'POST'); // Laravel method spoofing for file uploads

    try {
      // Use Inertia's router.post with formData
      router.post(`/api/amenities/${selectedAmenity.amenity_id}`, formData, {
        onSuccess: () => {
          setMessage({ type: 'success', text: `Image updated successfully for ${selectedAmenity.amenity_name}!` });
          setIsDialogOpen(false);
          resetForm();
          // Reload the page to see changes
          router.reload({ only: ['amenities'] });
        },
        onError: (errors) => {
          console.error('Update error:', errors);
          setMessage({ type: 'error', text: 'Failed to update image. Please try again.' });
        },
        onFinish: () => {
          setProcessing(false);
        },
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setSelectedAmenity(null);
  };

  const handleEditClick = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setImagePreview(null);
    setImageFile(null);
    setMessage(null);
    setIsDialogOpen(true);
  };

  return (
    <AppLayout>
      <Head title="Manage Amenities" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Manage Amenities</h2>
                <p className="text-muted-foreground mt-1">
                  Update amenity images. Changes will reflect on the homepage immediately.
                </p>
              </div>

              {/* Success/Error Message */}
              {message && (
                <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {message.text}
                  </p>
                </Alert>
              )}

              {/* Amenities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {amenities.map((amenity) => (
                  <Card key={amenity.amenity_id} className="overflow-hidden">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={getImageUrl(amenity.image_path)}
                        alt={amenity.amenity_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                          ₱{parseFloat(amenity.price_per_use).toLocaleString('en-PH', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{amenity.amenity_name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {amenity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleEditClick(amenity)}
                        className="w-full"
                        variant="outline"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Change Image
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Image Upload Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Update Image for {selectedAmenity?.amenity_name}
                    </DialogTitle>
                    <DialogDescription>
                      Upload a new image to replace the current one. Changes will be visible on the homepage.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Image */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Current Image</Label>
                      <div className="relative h-48 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={getImageUrl(selectedAmenity?.image_path || null)}
                          alt={selectedAmenity?.amenity_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* New Image Upload */}
                    <div>
                      <Label htmlFor="image" className="text-sm font-medium mb-2 block">
                        New Image
                      </Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="image"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF, WEBP (MAX. 2MB)
                              </p>
                            </div>
                          )}
                          <Input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended: 800x600px or larger, 4:3 aspect ratio
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                        disabled={processing}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={processing || !imageFile}>
                        {processing ? 'Uploading...' : 'Update Image'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
