import { Head, useForm, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FlashToastHandler } from '@/components/toast-provider';
import { showToast } from '@/hooks/use-flash-messages';
import { Calendar, Users, Clock, CheckCircle, Search, X, Package, ChevronRight, Sparkles, Tag, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Accommodation {
    id: number;
    name: string;
    capacity: number;
    price_per_night: number;
    description: string;
}

interface Amenity {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface Package {
    id: number;
    name: string;
    price: number;
    max_guests: number;
    description: string;
    accommodations: Accommodation[];
    amenities: Amenity[];
}

interface Props {
    accommodations: Accommodation[];
    amenities: Amenity[];
    packages: Package[];
    bookingTypes: Record<string, any>;
}

export default function CreateReservation({ accommodations, amenities, packages }: Props) {
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
    const [bookingType, setBookingType] = useState<'accommodation' | 'package'>('accommodation');
    const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
    const [packageSearchQuery, setPackageSearchQuery] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');
    const [viewingPackage, setViewingPackage] = useState<Package | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        accommodation_id: '',
        package_id: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        booking_type: 'overnight',
        amenities: [] as Array<{ amenity_id: number; booking_date: string }>,
        special_requests: '',
    });

    // Read accommodation and amenity query parameters and pre-select them
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accommodationParam = urlParams.get('accommodation');
        const amenityParam = urlParams.get('amenity');
        
        if (accommodationParam) {
            // Find the accommodation by ID
            const preSelectedAccommodation = accommodations.find(
                acc => acc.id === parseInt(accommodationParam)
            );
            
            if (preSelectedAccommodation) {
                setData('accommodation_id', accommodationParam);
                setBookingType('accommodation');
            }
        }

        // Pre-select amenity if provided
        if (amenityParam) {
            const amenityId = parseInt(amenityParam);
            const amenity = amenities.find(a => a.id === amenityId);
            if (amenity && !selectedAmenities.includes(amenityId)) {
                setSelectedAmenities(prev => [...prev, amenityId]);
            }
        }
    }, [accommodations, amenities]);

    const selectedAccommodation = useMemo(() => {
        return accommodations.find(acc => acc.id === parseInt(data.accommodation_id));
    }, [data.accommodation_id, accommodations]);

    const calculateTotalCost = useMemo(() => {
        let total = 0;

        if (bookingType === 'accommodation' && selectedAccommodation && data.check_in_date && data.check_out_date) {
            const checkIn = new Date(data.check_in_date);
            const checkOut = new Date(data.check_out_date);
            const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
            
            if (nights > 0) {
                total = Number(selectedAccommodation.price_per_night) * nights;
            }
        }

        // Add package price if booking type is package
        if (bookingType === 'package' && data.package_id) {
            const selectedPackage = packages.find(pkg => pkg.id === parseInt(data.package_id));
            if (selectedPackage && selectedPackage.price) {
                total = Number(selectedPackage.price);
            }
        }

        // Add amenities cost
        selectedAmenities.forEach(amenityId => {
            const amenity = amenities.find(a => a.id === amenityId);
            if (amenity && amenity.price) {
                total += Number(amenity.price);
            }
        });

        return total;
    }, [bookingType, selectedAccommodation, data.check_in_date, data.check_out_date, data.package_id, selectedAmenities, amenities, packages]);

    // Filter packages based on search and price range
    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => {
            // Search filter
            const matchesSearch = packageSearchQuery === '' || 
                pkg.name.toLowerCase().includes(packageSearchQuery.toLowerCase()) ||
                pkg.description.toLowerCase().includes(packageSearchQuery.toLowerCase());
            
            // Price range filter
            let matchesPrice = true;
            if (selectedPriceRange === 'budget') {
                matchesPrice = pkg.price <= 10000;
            } else if (selectedPriceRange === 'mid') {
                matchesPrice = pkg.price > 10000 && pkg.price <= 25000;
            } else if (selectedPriceRange === 'premium') {
                matchesPrice = pkg.price > 25000;
            }
            
            return matchesSearch && matchesPrice;
        });
    }, [packages, packageSearchQuery, selectedPriceRange]);

    // Get selected package details
    const selectedPackage = useMemo(() => {
        return packages.find(pkg => pkg.id === parseInt(data.package_id));
    }, [data.package_id, packages]);

    // Get amenity IDs included in the selected package
    const packageAmenityIds = useMemo(() => {
        if (bookingType === 'package' && selectedPackage && selectedPackage.amenities) {
            return selectedPackage.amenities.map(a => a.id);
        }
        return [];
    }, [bookingType, selectedPackage]);

    // Remove amenities from selection when they become included in a package
    useEffect(() => {
        if (packageAmenityIds.length > 0) {
            setSelectedAmenities(prev => prev.filter(id => !packageAmenityIds.includes(id)));
        }
    }, [packageAmenityIds]);

    // Get package category based on price
    const getPackageCategory = (price: number) => {
        if (price <= 10000) return { label: 'Budget Friendly', color: 'bg-green-100 text-green-700' };
        if (price <= 25000) return { label: 'Mid-Range', color: 'bg-blue-100 text-blue-700' };
        return { label: 'Premium', color: 'bg-purple-100 text-purple-700' };
    };

    const toggleAmenity = (amenityId: number) => {
        setSelectedAmenities(prev => {
            if (prev.includes(amenityId)) {
                return prev.filter(id => id !== amenityId);
            }
            return [...prev, amenityId];
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Format amenities data with booking_date
        const formattedAmenities = selectedAmenities.map(amenityId => ({
            amenity_id: amenityId,
            booking_date: data.check_in_date,
        }));

        // Create submission data based on booking type
        const submissionData = {
            accommodation_id: bookingType === 'accommodation' && data.accommodation_id ? parseInt(data.accommodation_id) : null,
            package_id: bookingType === 'package' && data.package_id ? parseInt(data.package_id) : null,
            check_in_date: data.check_in_date,
            check_out_date: data.check_out_date,
            number_of_guests: data.number_of_guests,
            booking_type: data.booking_type,
            amenities: formattedAmenities,
            special_requests: data.special_requests,
        };

        // Submit the form using router.post for better control
        router.post('/reservations', submissionData, {
            preserveState: false,
            onSuccess: () => {
                // Success will be handled by redirect to payment page from backend
            },
            onError: (errors) => {
                console.error('Reservation errors:', errors);
                // Display specific error messages if available
                const errorMessages = Object.entries(errors).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.join(', ');
                    }
                    return String(value);
                }).join(' | ');
                
                showToast.error(errorMessages || 'Please check the form and try again.', {
                    description: 'There was an error with your reservation'
                });
            },
        });
    };

    return (
        <>
            <FlashToastHandler />
            <Head title="Book Your Stay" />
            <Navigation />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-24 pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">Book Your Stay</h1>
                        <p className="text-gray-600 text-lg">Create your perfect vacation experience</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Booking Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                                {/* Booking Type Selection */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Booking Type</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('accommodation')}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                bookingType === 'accommodation'
                                                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="font-semibold text-lg">Accommodation Only</div>
                                            <div className="text-sm mt-1 opacity-75">Choose your suite</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('package')}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                bookingType === 'package'
                                                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="font-semibold text-lg">Package Deal</div>
                                            <div className="text-sm mt-1 opacity-75">All-inclusive</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Accommodation Selection */}
                                {bookingType === 'accommodation' && (
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                                            Choose Your Suite
                                        </label>
                                        <select
                                            value={data.accommodation_id}
                                            onChange={(e) => setData('accommodation_id', e.target.value)}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                errors.accommodation_id ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <option value="">Select an accommodation</option>
                                            {accommodations.map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.name} - {formatCurrency(acc.price_per_night)}/night (Up to {acc.capacity} guests)
                                                </option>
                                            ))}
                                        </select>
                                        {errors.accommodation_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.accommodation_id}</p>
                                        )}

                                        {selectedAccommodation && (
                                            <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                                                <p className="text-gray-700">{selectedAccommodation.description}</p>
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={16} />
                                                        Up to {selectedAccommodation.capacity} guests
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {formatCurrency(selectedAccommodation.price_per_night)}/night
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Package Selection */}
                                {bookingType === 'package' && (
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                                            Choose Your Package
                                        </label>
                                        
                                        {/* Selected Package Display or Browse Button */}
                                        {selectedPackage ? (
                                            <div className="border-2 border-orange-600 bg-orange-50 rounded-xl p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-lg text-gray-800">{selectedPackage.name}</h3>
                                                            <Badge className={getPackageCategory(selectedPackage.price).color}>
                                                                {getPackageCategory(selectedPackage.price).label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{selectedPackage.description}</p>
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <span className="flex items-center gap-1 text-sm text-gray-600">
                                                                <Users size={16} />
                                                                Up to {selectedPackage.max_guests} guests
                                                            </span>
                                                            <span className="text-xl font-bold text-orange-600">
                                                                {formatCurrency(selectedPackage.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 ml-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewingPackage(selectedPackage)}
                                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                        >
                                                            <Eye size={14} />
                                                            View Details
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsPackageDialogOpen(true)}
                                                            className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                                        >
                                                            <Package size={14} />
                                                            Change Package
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsPackageDialogOpen(true)}
                                                className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all group"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                                        <Package size={28} className="text-orange-600" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-semibold text-gray-800 text-lg">Browse Packages</p>
                                                        <p className="text-sm text-gray-500 mt-1">{packages.length} packages available</p>
                                                    </div>
                                                    <span className="text-orange-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Explore All Packages <ChevronRight size={18} />
                                                    </span>
                                                </div>
                                            </button>
                                        )}
                                        
                                        {/* Quick Package Preview - Show 3 featured packages */}
                                        {!selectedPackage && packages.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-600 mb-3">Featured packages:</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {packages.slice(0, 3).map((pkg) => (
                                                        <div
                                                            key={pkg.id}
                                                            onClick={() => {
                                                                setData('package_id', pkg.id.toString());
                                                            }}
                                                            className="p-3 border rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
                                                        >
                                                            <h4 className="font-medium text-sm text-gray-800 truncate">{pkg.name}</h4>
                                                            <p className="text-xs text-gray-500 mt-1">Up to {pkg.max_guests} guests</p>
                                                            <p className="text-sm font-semibold text-orange-600 mt-2">{formatCurrency(pkg.price)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {packages.length > 3 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsPackageDialogOpen(true)}
                                                        className="w-full mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                                    >
                                                        View all {packages.length} packages →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                                            <Calendar className="inline mr-2" size={20} />
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.check_in_date}
                                            onChange={(e) => setData('check_in_date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                errors.check_in_date ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.check_in_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.check_in_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                                            <Calendar className="inline mr-2" size={20} />
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.check_out_date}
                                            onChange={(e) => setData('check_out_date', e.target.value)}
                                            min={data.check_in_date || new Date().toISOString().split('T')[0]}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                errors.check_out_date ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.check_out_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.check_out_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Number of Guests */}
                                <div>
                                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                                        <Users className="inline mr-2" size={20} />
                                        Number of Guests
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedAccommodation?.capacity || 10}
                                        value={data.number_of_guests}
                                        onChange={(e) => setData('number_of_guests', parseInt(e.target.value))}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.number_of_guests ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.number_of_guests && (
                                        <p className="text-red-500 text-sm mt-1">{errors.number_of_guests}</p>
                                    )}
                                </div>

                                {/* Amenities Selection */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Amenities</h2>
                                    <p className="text-gray-600 mb-4">Enhance your stay with additional services</p>
                                    
                                    {/* Package Amenities Info */}
                                    {bookingType === 'package' && packageAmenityIds.length > 0 && (
                                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                            <div>
                                                <p className="text-green-800 font-medium">Package Amenities Included</p>
                                                <p className="text-green-700 text-sm mt-1">
                                                    Some amenities are already included in your selected package and are shown as greyed out below.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Monday Pool Maintenance Warning */}
                                    {data.check_in_date && new Date(data.check_in_date).getDay() === 1 && (
                                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                                            <Clock className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                                            <div>
                                                <p className="text-yellow-800 font-medium">Pool Maintenance Notice</p>
                                                <p className="text-yellow-700 text-sm mt-1">
                                                    Pool amenities are closed on Mondays from 8:00 AM to 2:00 PM for routine maintenance.
                                                    Please plan your pool activities accordingly.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {amenities.map((amenity) => {
                                            const isIncludedInPackage = packageAmenityIds.includes(amenity.id);
                                            const isSelected = selectedAmenities.includes(amenity.id);
                                            
                                            return (
                                                <div
                                                    key={amenity.id}
                                                    onClick={() => !isIncludedInPackage && toggleAmenity(amenity.id)}
                                                    className={`p-4 border-2 rounded-xl transition-all ${
                                                        isIncludedInPackage
                                                            ? 'border-green-300 bg-green-50 cursor-not-allowed opacity-75'
                                                            : isSelected
                                                                ? 'border-orange-600 bg-orange-50 cursor-pointer'
                                                                : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className={`font-semibold ${isIncludedInPackage ? 'text-gray-500' : ''}`}>
                                                                    {amenity.name}
                                                                </h3>
                                                                {isIncludedInPackage && (
                                                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                                                        <CheckCircle size={12} className="mr-1" />
                                                                        Included in Package
                                                                    </Badge>
                                                                )}
                                                                {isSelected && !isIncludedInPackage && (
                                                                    <CheckCircle size={18} className="text-orange-600" />
                                                                )}
                                                            </div>
                                                            <p className={`text-sm mt-1 ${isIncludedInPackage ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {amenity.description}
                                                            </p>
                                                        </div>
                                                        <div className="text-right ml-3">
                                                            <div className={`font-semibold ${isIncludedInPackage ? 'text-gray-400 line-through' : 'text-orange-600'}`}>
                                                                {formatCurrency(amenity.price)}
                                                            </div>
                                                            {isIncludedInPackage && (
                                                                <div className="text-green-600 text-sm font-medium">FREE</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Special Requests */}
                                <div>
                                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        rows={4}
                                        placeholder="Any special requirements or preferences..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing...' : 'Complete Booking'}
                                </button>
                            </form>
                        </div>

                        {/* Booking Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h3>

                                {selectedAccommodation && data.check_in_date && data.check_out_date && (
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-700">
                                            <span>Accommodation:</span>
                                            <span className="font-semibold">{selectedAccommodation.name}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Check-in:</span>
                                            <span className="font-semibold">{new Date(data.check_in_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Check-out:</span>
                                            <span className="font-semibold">{new Date(data.check_out_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Nights:</span>
                                            <span className="font-semibold">
                                                {Math.ceil((new Date(data.check_out_date).getTime() - new Date(data.check_in_date).getTime()) / (1000 * 60 * 60 * 24))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Guests:</span>
                                            <span className="font-semibold">{data.number_of_guests}</span>
                                        </div>
                                    </div>
                                )}

                                {selectedAmenities.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-700 mb-3">Selected Amenities:</h4>
                                        <div className="space-y-2">
                                            {selectedAmenities.map(amenityId => {
                                                const amenity = amenities.find(a => a.id === amenityId);
                                                return amenity ? (
                                                    <div key={amenity.id} className="flex justify-between text-sm text-gray-600">
                                                        <span>{amenity.name}</span>
                                                        <span>{formatCurrency(amenity.price)}</span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t-2 border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-800">Total Cost:</span>
                                        <span className="text-3xl font-bold text-orange-600">
                                            {formatCurrency(calculateTotalCost)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Clock size={18} />
                                        Booking Information
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Free cancellation up to 48 hours before check-in</li>
                                        <li>• Confirmation email will be sent within 24 hours</li>
                                        <li>• Payment can be made upon arrival</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Package Selection Dialog */}
            <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                <DialogContent className="!max-w-6xl w-[98vw] sm:w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
                    {/* Fixed Header */}
                    <div className="p-4 sm:p-6 pb-3 border-b bg-white shrink-0">
                        <DialogHeader className="mb-0">
                            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
                                <Package className="text-orange-600" size={24} />
                                Browse Packages
                                <Badge className="ml-2 bg-orange-100 text-orange-700">{packages.length} Available</Badge>
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    
                    {/* Search and Filter Bar */}
                    <div className="px-4 sm:px-6 py-3 border-b bg-gray-50 shrink-0">
                        <div className="flex flex-col lg:flex-row gap-3">
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search packages by name or description..."
                                    value={packageSearchQuery}
                                    onChange={(e) => setPackageSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                {packageSearchQuery && (
                                    <button
                                        onClick={() => setPackageSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap shrink-0">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'budget', label: 'Budget (≤₱10k)' },
                                { key: 'mid', label: 'Mid-Range' },
                                { key: 'premium', label: 'Premium' },
                            ].map((filter) => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setSelectedPriceRange(filter.key as any)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedPriceRange === filter.key
                                            ? 'bg-orange-600 text-white shadow-md'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Results Count */}
                    <div className="px-6 py-2 text-sm text-gray-500 border-b">
                        Showing {filteredPackages.length} of {packages.length} packages
                    </div>
                    
                    {/* Package Grid - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {filteredPackages.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="mx-auto text-gray-300 mb-3" size={48} />
                                <p className="text-gray-500">No packages found matching your criteria</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPackageSearchQuery('');
                                        setSelectedPriceRange('all');
                                    }}
                                    className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                                {filteredPackages.map((pkg) => {
                                    const category = getPackageCategory(pkg.price);
                                    const isSelected = data.package_id === pkg.id.toString();
                                    
                                    return (
                                        <div
                                            key={pkg.id}
                                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg flex flex-col ${
                                                isSelected
                                                    ? 'border-orange-600 bg-orange-50 shadow-lg ring-2 ring-orange-200'
                                                    : 'border-gray-200 hover:border-orange-300 bg-white'
                                            }`}
                                            onClick={() => {
                                                setData('package_id', pkg.id.toString());
                                                setIsPackageDialogOpen(false);
                                            }}
                                        >
                                            {/* Package Header */}
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-800 text-sm leading-tight flex-1 pr-2">{pkg.name}</h3>
                                                {isSelected && (
                                                    <CheckCircle size={18} className="text-orange-600 flex-shrink-0" />
                                                )}
                                            </div>
                                            
                                            <Badge className={category.color + ' text-xs mb-2'}>
                                                {category.label}
                                            </Badge>
                                            
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-1">{pkg.description}</p>
                                            
                                            {/* Price and Guests */}
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Users size={12} />
                                                    {pkg.max_guests} guests
                                                </span>
                                                <div className="text-base font-bold text-orange-600">
                                                    {formatCurrency(pkg.price)}
                                                </div>
                                            </div>
                                            
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewingPackage(pkg);
                                                }}
                                                className="mt-3 w-full py-2 text-xs font-medium text-orange-600 hover:bg-orange-100 rounded-lg transition-colors flex items-center justify-center gap-1 border border-orange-200"
                                            >
                                                <Eye size={12} />
                                                View Details
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            
            {/* Package Details Dialog */}
            <Dialog open={viewingPackage !== null} onOpenChange={(open) => !open && setViewingPackage(null)}>
                <DialogContent 
                    className="!max-w-4xl w-[98vw] sm:w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden z-[60]"
                    overlayClassName="z-[55]"
                >
                    {viewingPackage && (
                        <>
                            {/* Fixed Header */}
                            <div className="p-4 sm:p-6 pb-4 border-b bg-white shrink-0">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{viewingPackage.name}</DialogTitle>
                                        <Badge className={getPackageCategory(viewingPackage.price).color}>
                                            {getPackageCategory(viewingPackage.price).label}
                                        </Badge>
                                    </div>
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                                            {formatCurrency(viewingPackage.price)}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1 sm:justify-end mt-1">
                                            <Users size={14} />
                                            Up to {viewingPackage.max_guests} guests
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                                {/* Description */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">Description</h4>
                                    <p className="text-gray-600 leading-relaxed">{viewingPackage.description}</p>
                                </div>
                                
                                {/* Package Highlights */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                                        <Users className="mx-auto text-orange-600 mb-2" size={24} />
                                        <div className="text-sm text-gray-600">Max Guests</div>
                                        <div className="font-bold text-gray-800">{viewingPackage.max_guests}</div>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4 text-center">
                                        <Tag className="mx-auto text-green-600 mb-2" size={24} />
                                        <div className="text-sm text-gray-600">Category</div>
                                        <div className="font-bold text-gray-800">{getPackageCategory(viewingPackage.price).label}</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                                        <Sparkles className="mx-auto text-blue-600 mb-2" size={24} />
                                        <div className="text-sm text-gray-600">All-Inclusive</div>
                                        <div className="font-bold text-gray-800">Yes</div>
                                    </div>
                                </div>
                                
                                {/* Included Accommodations */}
                                {viewingPackage.accommodations && viewingPackage.accommodations.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                                            <Sparkles size={20} className="text-orange-600" />
                                            Included Accommodations
                                        </h4>
                                        <div className="space-y-2">
                                            {viewingPackage.accommodations.map((acc) => (
                                                <div key={acc.id} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-800">{acc.name}</span>
                                                        {acc.description && (
                                                            <p className="text-sm text-gray-500 mt-1">{acc.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Users size={14} />
                                                            {acc.capacity} guests
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Included Amenities */}
                                {viewingPackage.amenities && viewingPackage.amenities.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                                            <Tag size={20} className="text-orange-600" />
                                            Included Amenities
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {viewingPackage.amenities.map((amenity) => (
                                                <div key={amenity.id} className="bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-orange-600 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* What's Included Summary */}
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                                    <h4 className="font-semibold text-gray-800 mb-2">What's Included</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-green-600" />
                                            All taxes and service charges
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-green-600" />
                                            Access to resort facilities
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-green-600" />
                                            24/7 customer support
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Fixed Footer */}
                            <div className="p-6 pt-4 border-t bg-white sticky bottom-0 z-10">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setViewingPackage(null)}
                                        className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('package_id', viewingPackage.id.toString());
                                            setViewingPackage(null);
                                            setIsPackageDialogOpen(false);
                                        }}
                                        className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <CheckCircle size={18} />
                                        Select This Package
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </>
    );
}
