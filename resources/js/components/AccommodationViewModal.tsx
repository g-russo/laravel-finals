import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface AccommodationRow {
    accommodation_id: number;
    accommodation_name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    image_url?: string;
    created_at?: string;
}

interface AccommodationViewModalProps {
    accommodation: AccommodationRow | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AccommodationViewModal({ accommodation, isOpen, onClose }: AccommodationViewModalProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Sample gallery images (in a real app, these would come from the database)
    const galleryImages = accommodation ? [
        accommodation.image_url || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ] : [];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSelectedImage(0);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const formatPrice = (price: number) => {
        return '₱' + new Intl.NumberFormat('en-PH').format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'occupied':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'reserved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleEdit = () => {
        if (accommodation) {
            setLoading(true);
            router.visit(`/accommodations/${accommodation.accommodation_id}/edit`);
        }
    };

    const handleDelete = () => {
        if (accommodation && confirm('Are you sure you want to delete this accommodation?')) {
            setLoading(true);
            router.delete(`/accommodations/${accommodation.accommodation_id}`, {
                onSuccess: () => {
                    onClose();
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    if (!isOpen || !accommodation) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-building text-white text-xl"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Accommodation Details
                                        </h2>
                                        <p className="text-orange-100 text-sm">
                                            ID: {accommodation.accommodation_id}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center transition-all duration-200"
                                >
                                    <i className="bi bi-x text-lg"></i>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Image Gallery */}
                                <div className="space-y-4">
                                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                                        <img
                                            src={galleryImages[selectedImage]}
                                            alt={accommodation.accommodation_name}
                                            className="w-full h-80 object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                            <i className="bi bi-people mr-1"></i>
                                            {accommodation.capacity} guests
                                        </div>
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(accommodation.availability_status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                                                accommodation.availability_status === 'available' ? 'bg-green-600' :
                                                accommodation.availability_status === 'occupied' ? 'bg-red-600' :
                                                accommodation.availability_status === 'maintenance' ? 'bg-yellow-600' :
                                                'bg-blue-600'
                                            }`}></span>
                                            {accommodation.availability_status}
                                        </div>
                                    </div>
                                    
                                    {/* Thumbnail Gallery */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {galleryImages.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`relative rounded-lg overflow-hidden h-16 transition-all duration-300 ${
                                                    selectedImage === index 
                                                        ? 'ring-2 ring-orange-500 scale-105' 
                                                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${accommodation.accommodation_name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Accommodation Details */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {accommodation.accommodation_name}
                                        </h1>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="flex items-center">
                                                <div className="flex space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className="bi bi-star-fill text-yellow-400 text-sm"></i>
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-gray-600 text-sm">(4.9) • 127 reviews</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {accommodation.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {formatPrice(accommodation.price_per_night)}
                                        </div>
                                        <div className="text-gray-600 text-sm">per night</div>
                                    </div>

                                    {/* Features Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <i className="bi bi-people text-blue-600 text-sm"></i>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">{accommodation.capacity} Guests</div>
                                                    <div className="text-xs text-gray-600">Maximum occupancy</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <i className="bi bi-wifi text-green-600 text-sm"></i>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">Free WiFi</div>
                                                    <div className="text-xs text-gray-600">High-speed internet</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <i className="bi bi-cup-hot text-purple-600 text-sm"></i>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">Breakfast</div>
                                                    <div className="text-xs text-gray-600">Complimentary</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <i className="bi bi-p-circle text-orange-600 text-sm"></i>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">Free Parking</div>
                                                    <div className="text-xs text-gray-600">On-site parking</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Accommodation Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Accommodation ID:</span>
                                                <span className="font-medium text-gray-900">{accommodation.accommodation_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Created:</span>
                                                <span className="font-medium text-gray-900">
                                                    {accommodation.created_at ? new Date(accommodation.created_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(accommodation.availability_status)}`}>
                                                    {accommodation.availability_status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <i className="bi bi-info-circle mr-1"></i>
                                    Last updated: {accommodation.created_at ? new Date(accommodation.created_at).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                        disabled={loading}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200 font-medium text-sm inline-flex items-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                                        ) : (
                                            <i className="bi bi-pencil mr-1"></i>
                                        )}
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 font-medium text-sm inline-flex items-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
                                        ) : (
                                            <i className="bi bi-trash mr-1"></i>
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}