import { Head, useForm, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { User, Calendar, Mail, Phone, Globe, Camera, Lock, Eye, EyeOff, LogOut, CreditCard, ExternalLink } from 'lucide-react';
import { profile } from '@/routes';
import { formatCurrency } from '@/lib/currency';

interface Reservation {
    id: number;
    accommodation: {
        id: number;
        name: string;
        type: string;
        images: string[];
    };
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    status: string;
    payment_status: string;
    is_upcoming: boolean;
    is_past: boolean;
    can_rate: boolean;
}

interface ProfileUser {
    id: number;
    full_name: string;
    username: string;
    email: string;
    phone_number: string;
    country: string;
    date_of_birth: string;
    avatar?: string;
}

interface Props {
    user: ProfileUser;
    reservations: {
        upcoming: Reservation[];
        past: Reservation[];
    };
}

export default function Profile({ user, reservations }: Props) {
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'password'>('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        country: user.country,
        date_of_birth: user.date_of_birth,
        avatar: null as File | null,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
        });
    };

    const handlePasswordSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        passwordForm.put('/profile/password');
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            router.post('/logout');
        }
    };

    return (
        <>
            <Head title="My Profile" />
            <Navigation />
            
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-24 pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-600 mt-2">Manage your account and view your bookings</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold mb-3">
                                        {user.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{user.full_name}</h2>
                                    <p className="text-sm text-gray-600">@{user.username}</p>
                                </div>

                                <nav className="space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === 'profile'
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <User size={20} />
                                        <span className="font-medium">Profile Info</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('bookings')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === 'bookings'
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Calendar size={20} />
                                        <span className="font-medium">My Bookings</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === 'password'
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Lock size={20} />
                                        <span className="font-medium">Change Password</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={20} />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
                                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <User className="inline mr-2" size={16} />
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.full_name}
                                                        onChange={(e) => setData('full_name', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            errors.full_name ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <User className="inline mr-2" size={16} />
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.username}
                                                        onChange={(e) => setData('username', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            errors.username ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Mail className="inline mr-2" size={16} />
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            errors.email ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Phone className="inline mr-2" size={16} />
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={data.phone_number}
                                                        onChange={(e) => setData('phone_number', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            errors.phone_number ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Globe className="inline mr-2" size={16} />
                                                        Country
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.country}
                                                        onChange={(e) => setData('country', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            errors.country ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Calendar className="inline mr-2" size={16} />
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={data.date_of_birth}
                                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            errors.date_of_birth ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                                            >
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Bookings Tab */}
                                {activeTab === 'bookings' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
                                        
                                        {/* Upcoming Bookings */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Reservations</h3>
                                            {reservations.upcoming.length > 0 ? (
                                                <div className="space-y-4">
                                                    {reservations.upcoming.map((reservation) => (
                                                        <div 
                                                            key={reservation.id} 
                                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer group"
                                                            onClick={() => router.visit(`/reservations/${reservation.id}`)}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <img
                                                                        src={reservation.accommodation?.images?.[0] 
                                                                            ? (reservation.accommodation.images[0].startsWith('http') 
                                                                                ? reservation.accommodation.images[0] 
                                                                                : `/storage/${reservation.accommodation.images[0]}`)
                                                                            : '/placeholder.svg'}
                                                                        alt={reservation.accommodation?.name || 'Booking'}
                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                                                                        <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">
                                                                        {reservation.accommodation?.name || 'Booking'}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600">{reservation.accommodation?.type || ''}</p>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {reservation.check_in_date} - {reservation.check_out_date}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-orange-600 mt-1">
                                                                        {formatCurrency(reservation.total_price)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2 items-end" onClick={(e) => e.stopPropagation()}>
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                        reservation.status === 'confirmed' 
                                                                            ? 'bg-green-100 text-green-700' 
                                                                            : reservation.status === 'pending'
                                                                            ? 'bg-yellow-100 text-yellow-700'
                                                                            : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {reservation.status}
                                                                    </span>
                                                                    {reservation.status === 'pending' && reservation.payment_status === 'unpaid' && (
                                                                        <Link 
                                                                            href="/payment"
                                                                            className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
                                                                        >
                                                                            <CreditCard size={14} />
                                                                            Pay Now
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No upcoming reservations</p>
                                            )}
                                        </div>

                                        {/* Past Bookings */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Past Reservations</h3>
                                            {reservations.past.length > 0 ? (
                                                <div className="space-y-4">
                                                    {reservations.past.map((reservation) => (
                                                        <div 
                                                            key={reservation.id} 
                                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer group"
                                                            onClick={() => router.visit(`/reservations/${reservation.id}`)}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <img
                                                                        src={reservation.accommodation?.images?.[0] 
                                                                            ? (reservation.accommodation.images[0].startsWith('http') 
                                                                                ? reservation.accommodation.images[0] 
                                                                                : `/storage/${reservation.accommodation.images[0]}`)
                                                                            : '/placeholder.svg'}
                                                                        alt={reservation.accommodation?.name || 'Booking'}
                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                                                                        <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">
                                                                        {reservation.accommodation?.name || 'Booking'}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600">{reservation.accommodation?.type || ''}</p>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {reservation.check_in_date} - {reservation.check_out_date}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-orange-600 mt-1">
                                                                        {formatCurrency(reservation.total_price)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                        reservation.status === 'confirmed' 
                                                                            ? 'bg-green-100 text-green-700' 
                                                                            : reservation.status === 'cancelled'
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {reservation.status}
                                                                    </span>
                                                                    {reservation.can_rate && (
                                                                        <button className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-200">
                                                                            Rate Stay
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No past reservations</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Password Tab */}
                                {activeTab === 'password' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                                        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                        passwordForm.errors.current_password ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                />
                                                {passwordForm.errors.current_password && (
                                                    <p className="text-red-500 text-sm mt-1">{passwordForm.errors.current_password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.password}
                                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            passwordForm.errors.password ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                {passwordForm.errors.password && (
                                                    <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.password_confirmation}
                                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                            passwordForm.errors.password_confirmation ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                {passwordForm.errors.password_confirmation && (
                                                    <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password_confirmation}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={passwordForm.processing}
                                                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                                            >
                                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
