import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AccommodationViewModal from '@/components/AccommodationViewModal';

type AccommodationRow = {
    accommodation_id: number;
    accommodation_name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    image_url?: string;
    created_at?: string;
};

interface EditAccommodationProps {
    accommodation: AccommodationRow;
}

export default function EditAccommodation({ accommodation }: EditAccommodationProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Accommodations',
            href: '/accommodations',
        },
        {
            title: accommodation.accommodation_name,
            href: `/accommodations/${accommodation.accommodation_id}`,
        },
        {
            title: 'Edit',
            href: `/accommodations/${accommodation.accommodation_id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        accommodation_name: accommodation.accommodation_name,
        description: accommodation.description,
        capacity: accommodation.capacity.toString(),
        price_per_night: accommodation.price_per_night.toString(),
        availability_status: accommodation.availability_status,
        image: null as File | null,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(accommodation.image_url || null);
    const [hasNewImage, setHasNewImage] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/accommodations/${accommodation.accommodation_id}`, {
            forceFormData: true,
            onSuccess: () => {
                // Don't reset on success for edit page
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setHasNewImage(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearNewImage = () => {
        setData('image', null);
        setHasNewImage(false);
        setImagePreview(accommodation.image_url || null);
        // Reset the file input
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const removeExistingImage = () => {
        setImagePreview(null);
        setHasNewImage(false);
        setData('image', null);
        // Note: We'd need to add a separate flag to remove existing image
        // For now, user must upload a new image to replace
    };

    const formatPrice = (price: number) => {
        return '₱' + new Intl.NumberFormat('en-PH').format(price);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${accommodation.accommodation_name}`} />
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
                                    <i className="bi bi-pencil text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Edit Accommodation
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Update {accommodation.accommodation_name} details
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <i className="bi bi-eye mr-2 text-lg"></i>
                                    View
                                </button>
                                <Link
                                    href="/accommodations"
                                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <i className="bi bi-arrow-left mr-2 text-lg"></i>
                                    Back to List
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Main Form Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                            <i className="bi bi-info-circle text-orange-600"></i>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">Accommodation Details</h2>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Row 1: Accommodation Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                            <i className="bi bi-building mr-1"></i>Accommodation Name *
                                        </label>
                                        <Input
                                            value={data.accommodation_name}
                                            onChange={(e) => setData('accommodation_name', e.target.value)}
                                            placeholder="e.g., Deluxe Ocean View Suite"
                                            className="px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        {errors.accommodation_name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <i className="bi bi-exclamation-triangle mr-1"></i>
                                                {errors.accommodation_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Row 2: Description */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                            <i className="bi bi-card-text mr-1"></i>Description *
                                        </label>
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the accommodation features, amenities, and unique selling points..."
                                            className="px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder:text-gray-400 min-h-[100px]"
                                            required
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <i className="bi bi-exclamation-triangle mr-1"></i>
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Row 3: Capacity and Price */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                                <i className="bi bi-people mr-1"></i>Capacity (Guests) *
                                            </label>
                                            <div className="relative">
                                                <i className="bi bi-people absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                                                <Input
                                                    type="number"
                                                    value={data.capacity}
                                                    onChange={(e) => setData('capacity', e.target.value)}
                                                    placeholder="4"
                                                    min="1"
                                                    max="20"
                                                    className="pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder:text-gray-400"
                                                    required
                                                />
                                            </div>
                                            {errors.capacity && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <i className="bi bi-exclamation-triangle mr-1"></i>
                                                    {errors.capacity}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                                <i className="bi bi-currency-dollar mr-1"></i>Price per Night (₱) *
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₱</span>
                                                <Input
                                                    type="number"
                                                    value={data.price_per_night}
                                                    onChange={(e) => setData('price_per_night', e.target.value)}
                                                    placeholder="5000.00"
                                                    min="0"
                                                    step="0.01"
                                                    className="pl-8 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder:text-gray-400"
                                                    required
                                                />
                                            </div>
                                            {errors.price_per_night && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <i className="bi bi-exclamation-triangle mr-1"></i>
                                                    {errors.price_per_night}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 4: Status */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                            <i className="bi bi-flag mr-1"></i>Availability Status *
                                        </label>
                                        <select
                                            value={data.availability_status}
                                            onChange={(e) => setData('availability_status', e.target.value as 'available' | 'occupied' | 'maintenance' | 'reserved')}
                                            className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900"
                                            required
                                        >
                                            <option value="available">Available</option>
                                            <option value="occupied">Occupied</option>
                                            <option value="maintenance">Under Maintenance</option>
                                            <option value="reserved">Reserved</option>
                                        </select>
                                        {errors.availability_status && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <i className="bi bi-exclamation-triangle mr-1"></i>
                                                {errors.availability_status}
                                            </p>
                                        )}
                                    </div>

                                    {/* Row 5: Image Upload */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                            <i className="bi bi-image mr-1"></i>Accommodation Image
                                        </label>
                                        
                                        {/* Current Image Display */}
                                        {imagePreview && !hasNewImage && (
                                            <div className="mb-4">
                                                <div className="text-xs font-semibold text-gray-700 mb-2">Current Image:</div>
                                                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Current accommodation"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-700">
                                                        Current Image
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Image Upload Area */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center w-full">
                                                <label 
                                                    htmlFor="image-upload" 
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <i className="bi bi-cloud-upload text-gray-400 text-3xl mb-2"></i>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">
                                                                {imagePreview && !hasNewImage ? 'Replace image' : 'Upload new image'}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                                                    </div>
                                                    <input 
                                                        id="image-upload" 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            </div>

                                            {/* New Image Preview */}
                                            {hasNewImage && imagePreview && (
                                                <div className="relative">
                                                    <div className="text-xs font-semibold text-gray-700 mb-2">New Image Preview:</div>
                                                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                                                        <img 
                                                            src={imagePreview} 
                                                            alt="New preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                        <button
                                                            type="button"
                                                            onClick={clearNewImage}
                                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                                                            title="Remove new image"
                                                        >
                                                            <i className="bi bi-x text-sm"></i>
                                                        </button>
                                                        <div className="absolute bottom-2 left-2 bg-green-500/90 text-white px-2 py-1 rounded text-xs">
                                                            New Image
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload Instructions */}
                                            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                                                <i className="bi bi-info-circle text-blue-500 mr-1"></i>
                                                <strong>Tip:</strong> {imagePreview ? 'Upload a new image to replace the current one.' : 'Upload an image to showcase your accommodation.'} Recommended size: 1200x800 pixels.
                                            </div>
                                        </div>

                                        {errors.image && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <i className="bi bi-exclamation-triangle mr-1"></i>
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <i className="bi bi-eye text-blue-600"></i>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">Updated Preview</h2>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                        {/* Table Header */}
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-4 py-3 border-b border-gray-200">
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-1 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    <i className="bi bi-hash mr-1"></i>ID
                                                </div>
                                                <div className="col-span-5 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    <i className="bi bi-building mr-1"></i>Accommodation
                                                </div>
                                                <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    <i className="bi bi-people mr-1"></i>Capacity
                                                </div>
                                                <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    <i className="bi bi-currency-dollar mr-1"></i>Price/Night
                                                </div>
                                                <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    <i className="bi bi-flag mr-1"></i>Status
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Row */}
                                        <div className="hover:bg-orange-50/30 transition-colors duration-150 group">
                                            <div className="grid grid-cols-12 gap-4 items-center px-4 py-4">
                                                {/* ID Column */}
                                                <div className="col-span-1">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                                        <span className="text-orange-700 font-bold text-xs">
                                                            {accommodation.accommodation_id}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Accommodation Column */}
                                                <div className="col-span-5">
                                                    <div className="flex items-center space-x-4">
                                                        {imagePreview ? (
                                                            <div className="relative">
                                                                <img 
                                                                    src={imagePreview} 
                                                                    alt={data.accommodation_name || 'Preview'}
                                                                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all shadow-sm"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                                                                {hasNewImage && (
                                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                                <i className="bi bi-image text-gray-400 text-xl"></i>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-gray-900 truncate">
                                                                {data.accommodation_name || 'Accommodation Name'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate max-w-md mt-0.5">
                                                                {data.description || 'Description will appear here...'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Capacity Column */}
                                                <div className="col-span-2">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <i className="bi bi-people text-gray-600 text-sm"></i>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {data.capacity || '0'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price Column */}
                                                <div className="col-span-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {data.price_per_night ? formatPrice(parseFloat(data.price_per_night)) : '₱0.00'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">per night</span>
                                                    </div>
                                                </div>

                                                {/* Status Column */}
                                                <div className="col-span-2">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${
                                                        data.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                                                        data.availability_status === 'occupied' ? 'bg-red-100 text-red-800' :
                                                        data.availability_status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${
                                                            data.availability_status === 'available' ? 'bg-green-600' :
                                                            data.availability_status === 'occupied' ? 'bg-red-600' :
                                                            data.availability_status === 'maintenance' ? 'bg-yellow-600' :
                                                            'bg-blue-600'
                                                        }`}></span>
                                                        {data.availability_status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Note */}
                                        <div className="bg-blue-50 px-4 py-3 border-t border-gray-200">
                                            <div className="flex items-center text-xs text-blue-700">
                                                <i className="bi bi-info-circle mr-2"></i>
                                                <span>This is how your updated accommodation will appear in the main listing table</span>
                                                {hasNewImage && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                                        <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                                                        New image
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <i className="bi bi-info-circle mr-1"></i>
                                            All fields marked with * are required
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Link
                                                href="/accommodations"
                                                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                                            >
                                                Cancel
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <>
                                                        <i className="bi bi-arrow-clockwise mr-2 animate-spin"></i>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-circle mr-2"></i>
                                                        Update Accommodation
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Accommodation View Modal */}
            <AccommodationViewModal
                accommodation={accommodation}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AppLayout>
    );
}