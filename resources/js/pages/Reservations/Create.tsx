import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

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
                }).join('\n');
                
                alert(`There was an error with your reservation:\n\n${errorMessages || 'Please check the form and try again.'}`);
            },
        });
    };

    return (
        <>
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
                                        <div className="space-y-3">
                                            {packages.map((pkg) => (
                                                <div
                                                    key={pkg.id}
                                                    onClick={() => setData('package_id', pkg.id.toString())}
                                                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                        data.package_id === pkg.id.toString()
                                                            ? 'border-orange-600 bg-orange-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                                                            <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold text-orange-600">{formatCurrency(pkg.price)}</div>
                                                            <div className="text-sm text-gray-600">Up to {pkg.max_guests} guests</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {amenities.map((amenity) => (
                                            <div
                                                key={amenity.id}
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    selectedAmenities.includes(amenity.id)
                                                        ? 'border-orange-600 bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{amenity.name}</h3>
                                                            {selectedAmenities.includes(amenity.id) && (
                                                                <CheckCircle size={18} className="text-orange-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                                                    </div>
                                                    <div className="text-right ml-3">
                                                        <div className="font-semibold text-orange-600">
                                                            {formatCurrency(amenity.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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

            <Footer />
        </>
    );
}
