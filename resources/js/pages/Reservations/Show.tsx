import { Head, Link, router } from '@inertiajs/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/currency';
import { 
    Calendar, 
    Clock, 
    Users, 
    MapPin, 
    CreditCard, 
    ArrowLeft,
    CheckCircle,
    XCircle,
    AlertCircle,
    Package,
    Star
} from 'lucide-react';

interface Accommodation {
    accommodation_id: number;
    accommodation_name: string;
    accommodation_type?: string;
    description?: string;
    capacity: number;
    price_per_night: number;
    image_url?: string;
}

interface PackageData {
    package_id: number;
    package_name: string;
    description?: string;
    price: number;
    max_guests: number;
    image?: string;
}

interface Amenity {
    amenity_id: number;
    amenity_name: string;
    description?: string;
    price_per_use: number;
    pivot?: {
        price: number;
        booking_date: string;
    };
}

interface ReservationData {
    id: number;
    check_in_date: string;
    check_out_date: string;
    booking_type: string;
    booking_type_label: string;
    start_time: string;
    end_time: string;
    number_of_guests: number;
    status: string;
    payment_status?: string;
    accommodation: Accommodation | null;
    package: PackageData | null;
    amenities: Amenity[];
    accommodation_price: number;
    package_price: number;
    amenities_price: number;
    total_price: number;
    special_requests: string | null;
    created_at: string;
    confirmed_at: string | null;
    cancelled_at: string | null;
}

interface Props {
    reservation: ReservationData;
}

export default function Show({ reservation }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle size={16} />
                        Confirmed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        <AlertCircle size={16} />
                        Pending Payment
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <XCircle size={16} />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {status}
                    </span>
                );
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
            router.post(`/reservations/${reservation.id}/cancel`);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStayDuration = () => {
        const checkIn = new Date(reservation.check_in_date + 'T00:00:00');
        const checkOut = new Date(reservation.check_out_date + 'T00:00:00');
        const diffTime = checkOut.getTime() - checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If it's exactly 1 day difference (check in one day, checkout next day)
        if (diffDays === 1) {
            return 'Overnight Stay';
        }
        
        return `${diffDays}-Day Stay`;
    };

    return (
        <>
            <Head title={`Reservation #${reservation.id}`} />
            <Navigation />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-24 pb-16">
                <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                    {/* Back Button */}
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to My Bookings
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Reservation #{reservation.id}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Booked on {reservation.created_at}
                                </p>
                            </div>
                            {getStatusBadge(reservation.status)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Accommodation/Package Details */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="text-orange-500" size={20} />
                                    Booking Details
                                </h2>

                                {reservation.accommodation && (
                                    <div className="border border-gray-200 rounded-xl p-4 mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {reservation.accommodation.image_url ? (
                                                    <img
                                                        src={reservation.accommodation.image_url.startsWith('http') 
                                                            ? reservation.accommodation.image_url 
                                                            : `/storage/${reservation.accommodation.image_url}`}
                                                        alt={reservation.accommodation.accommodation_name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <MapPin className="text-gray-400" size={32} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">
                                                    {reservation.accommodation.accommodation_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {reservation.accommodation.accommodation_type || 'Accommodation'}
                                                </p>
                                                <p className="text-sm text-orange-600 font-medium mt-1">
                                                    {formatCurrency(reservation.accommodation_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {reservation.package && (
                                    <div className="border border-purple-200 bg-purple-50 rounded-xl p-4 mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="text-purple-500" size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-800">
                                                        {reservation.package.package_name}
                                                    </h3>
                                                    <span className="px-2 py-0.5 bg-purple-200 text-purple-700 text-xs rounded-full">
                                                        Package
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {reservation.package.description}
                                                </p>
                                                <p className="text-sm text-purple-600 font-medium mt-1">
                                                    {formatCurrency(reservation.package_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Dates & Times */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-orange-500 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Check-in</p>
                                            <p className="font-medium text-gray-800">
                                                {formatDate(reservation.check_in_date)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatTime(reservation.start_time)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-orange-500 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Check-out</p>
                                            <p className="font-medium text-gray-800">
                                                {formatDate(reservation.check_out_date)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatTime(reservation.end_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                    <Users className="text-orange-500" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-500">Guests</p>
                                        <p className="font-medium text-gray-800">
                                            {reservation.number_of_guests} {reservation.number_of_guests === 1 ? 'Guest' : 'Guests'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <Clock className="text-orange-500" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-500">Stay Duration</p>
                                        <p className="font-medium text-gray-800">
                                            {getStayDuration()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            {reservation.amenities && reservation.amenities.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Star className="text-orange-500" size={20} />
                                        Add-on Amenities
                                    </h2>
                                    <div className="space-y-3">
                                        {reservation.amenities.map((amenity) => (
                                            <div 
                                                key={amenity.amenity_id}
                                                className="flex items-center justify-between py-2 border-b last:border-0"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {amenity.amenity_name}
                                                    </p>
                                                    {amenity.pivot?.booking_date && (
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(amenity.pivot.booking_date + 'T00:00:00').toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="font-medium text-orange-600">
                                                    {formatCurrency(amenity.pivot?.price || amenity.price_per_use)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Special Requests */}
                            {reservation.special_requests && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                        Special Requests
                                    </h2>
                                    <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                                        {reservation.special_requests}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Pricing & Actions */}
                        <div className="space-y-6">
                            {/* Price Summary */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="text-orange-500" size={20} />
                                    Price Summary
                                </h2>
                                <div className="space-y-3">
                                    {reservation.accommodation_price > 0 && (
                                        <div className="flex items-center justify-between text-gray-600 gap-4">
                                            <span className="flex-shrink-0">Accommodation</span>
                                            <span className="font-medium text-right">{formatCurrency(reservation.accommodation_price)}</span>
                                        </div>
                                    )}
                                    {reservation.package_price > 0 && (
                                        <div className="flex items-center justify-between text-gray-600 gap-4">
                                            <span className="flex-shrink-0">Package</span>
                                            <span className="font-medium text-right">{formatCurrency(reservation.package_price)}</span>
                                        </div>
                                    )}
                                    {reservation.amenities_price > 0 && (
                                        <div className="flex items-center justify-between text-gray-600 gap-4">
                                            <span className="flex-shrink-0">Amenities</span>
                                            <span className="font-medium text-right">{formatCurrency(reservation.amenities_price)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex items-center justify-between font-bold text-lg gap-4">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-orange-600 text-right">
                                                {formatCurrency(reservation.total_price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Actions
                                </h2>
                                <div className="space-y-3">
                                    {reservation.status === 'pending' && (
                                        <Link
                                            href="/payment"
                                            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                                        >
                                            <CreditCard size={18} />
                                            Complete Payment
                                        </Link>
                                    )}
                                    {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                                        <button
                                            onClick={handleCancel}
                                            className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                        >
                                            <XCircle size={18} />
                                            Cancel Reservation
                                        </button>
                                    )}
                                    <Link
                                        href="/profile"
                                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <ArrowLeft size={18} />
                                        Back to Bookings
                                    </Link>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Timeline
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">Booking Created</p>
                                            <p className="text-sm text-gray-500">{reservation.created_at}</p>
                                        </div>
                                    </div>
                                    {reservation.confirmed_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Payment Confirmed</p>
                                                <p className="text-sm text-gray-500">{reservation.confirmed_at}</p>
                                            </div>
                                        </div>
                                    )}
                                    {reservation.cancelled_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Cancelled</p>
                                                <p className="text-sm text-gray-500">{reservation.cancelled_at}</p>
                                            </div>
                                        </div>
                                    )}
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
