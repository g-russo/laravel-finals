import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Calendar as CalendarIcon, Table, ChevronLeft, ChevronRight, Filter, Eye, XCircle, Trash2, X, Users, MapPin, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Accommodation {
    accommodation_id: number;
    accommodation_name: string;
}

interface Reservation {
    reservation_id: number;
    user: User;
    accommodation: Accommodation | null;
    booking_name: string;
    package_name: string | null;
    check_in_date: string;
    check_out_date: string;
    number_of_guests: number;
    status: string;
    payment_status: string;
    total_cost: number;
    created_at: string;
}

interface CalendarEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    accommodation_name: string;
    package_name: string | null;
    guest_name: string;
    guests: number;
    status: string;
    payment_status: string;
    total_cost: number;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    reservations: PaginatedData<Reservation>;
    calendarEvents: CalendarEvent[];
    accommodations: Accommodation[];
    cancelledCount: number;
}

export default function ReservationsIndex({ reservations, calendarEvents, accommodations, cancelledCount }: Props) {
    const [view, setView] = useState<'calendar' | 'table'>('calendar');
    const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAccommodation, setSelectedAccommodation] = useState<number | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Filter events by selected accommodation
    const filteredEvents = useMemo(() => {
        if (!selectedAccommodation) return calendarEvents;
        return calendarEvents.filter(event => 
            event.accommodation_name === accommodations.find(a => a.accommodation_id === selectedAccommodation)?.accommodation_name
        );
    }, [calendarEvents, selectedAccommodation, accommodations]);

    // Calendar navigation
    const navigateCalendar = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (calendarView === 'month') {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        } else if (calendarView === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get calendar days for month view
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days: Date[] = [];
        const current = new Date(startDate);
        
        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        // Format date as YYYY-MM-DD in local timezone (avoid toISOString which converts to UTC)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        return filteredEvents.filter(event => {
            // Parse dates as local dates to avoid timezone shifting
            const start = event.start.split('T')[0];
            const end = event.end.split('T')[0];
            return dateStr >= start && dateStr <= end;
        });
    };

    // Get week days for week view
    const getWeekDays = () => {
        const days: Date[] = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }

        return days;
    };

    // Status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Payment status badge color
    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Action handlers
    const handleView = (reservationId: number) => {
        router.visit(`/reservations/${reservationId}`);
    };

    const handleCancel = (reservationId: number) => {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            router.post(`/reservations/${reservationId}/cancel`);
        }
    };

    const handleDelete = (reservationId: number) => {
        if (confirm('Are you sure you want to permanently delete this reservation? This action cannot be undone.')) {
            router.delete(`/admin/reservations/${reservationId}`);
        }
    };

    const calendarDays = calendarView === 'month' ? getCalendarDays() : getWeekDays();

    return (
        <AppLayout>
            <Head title="Reservations Management" />

            <div className="bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CalendarIcon className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Reservations Management
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    View and manage all resort reservations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setView('calendar')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    view === 'calendar'
                                        ? 'bg-white shadow-sm text-orange-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <CalendarIcon size={18} />
                                Calendar
                            </button>
                            <button
                                onClick={() => setView('table')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    view === 'table'
                                        ? 'bg-white shadow-sm text-amber-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Table size={18} />
                                Table
                            </button>
                        </div>

                        {/* Calendar View Toggle (only shown in calendar view) */}
                        {view === 'calendar' && (
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setCalendarView('day')}
                                    className={`px-3 py-2 rounded-lg transition-all ${
                                        calendarView === 'day'
                                            ? 'bg-white shadow-sm text-amber-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Day
                                </button>
                                <button
                                    onClick={() => setCalendarView('week')}
                                    className={`px-3 py-2 rounded-lg transition-all ${
                                        calendarView === 'week'
                                            ? 'bg-white shadow-sm text-amber-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setCalendarView('month')}
                                    className={`px-3 py-2 rounded-lg transition-all ${
                                        calendarView === 'month'
                                            ? 'bg-white shadow-sm text-amber-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Month
                                </button>
                            </div>
                        )}

                        {/* Accommodation Filter */}
                        <div className="flex items-center gap-2 ml-auto">
                            <Filter size={18} className="text-gray-600" />
                            <select
                                value={selectedAccommodation || ''}
                                onChange={(e) => setSelectedAccommodation(e.target.value ? parseInt(e.target.value) : null)}
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                <option value="">All Accommodations</option>
                                {accommodations.map(acc => (
                                    <option key={acc.accommodation_id} value={acc.accommodation_id}>
                                        {acc.accommodation_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => router.visit('/admin/reservations/cancelled')}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all"
                            >
                                <XCircle size={18} />
                                Cancelled ({cancelledCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar View */}
                {view === 'calendar' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        {/* Calendar Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {currentDate.toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric',
                                    ...(calendarView === 'day' ? { day: 'numeric' } : {})
                                })}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToToday}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => navigateCalendar('prev')}
                                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => navigateCalendar('next')}
                                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        {(calendarView === 'month' || calendarView === 'week') && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Day headers */}
                                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="py-2 text-center text-sm font-semibold text-gray-700">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar days */}
                                <div className={`grid grid-cols-7 ${calendarView === 'month' ? 'grid-rows-6' : ''}`}>
                                    {calendarDays.map((day, index) => {
                                        const events = getEventsForDate(day);
                                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                        const isToday = day.toDateString() === new Date().toDateString();

                                        return (
                                            <div
                                                key={index}
                                                className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                                                    !isCurrentMonth ? 'bg-gray-50' : ''
                                                } ${isToday ? 'bg-amber-50' : ''}`}
                                            >
                                                <div className={`text-sm font-medium mb-1 ${
                                                    isToday ? 'text-amber-600' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                                                }`}>
                                                    {day.getDate()}
                                                </div>
                                                <div className="space-y-1">
                                                    {events.slice(0, 3).map(event => (
                                                        <div
                                                            key={event.id}
                                                            onClick={() => setSelectedEvent(event)}
                                                            className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(event.status)}`}
                                                            title={`${event.accommodation_name} - ${event.guest_name} (${event.guests} guests)`}
                                                        >
                                                            {event.guest_name}
                                                        </div>
                                                    ))}
                                                    {events.length > 3 && (
                                                        <div className="text-xs text-gray-600 font-medium">
                                                            +{events.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Day View */}
                        {calendarView === 'day' && (
                            <div className="space-y-3">
                                {getEventsForDate(currentDate).map(event => (
                                    <div 
                                        key={event.id} 
                                        onClick={() => setSelectedEvent(event)}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">{event.accommodation_name}</h3>
                                                <p className="text-gray-600 mt-1">Guest: {event.guest_name}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">{event.guests} guests</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                                    {event.status}
                                                </span>
                                                <p className="text-lg font-bold text-amber-600 mt-2">
                                                    {formatCurrency(event.total_cost)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {getEventsForDate(currentDate).length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No reservations for this day
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Table View */}
                {view === 'table' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accommodation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reservations.data.map((reservation) => (
                                        <tr key={reservation.reservation_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{reservation.reservation_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{reservation.user.name}</div>
                                                <div className="text-sm text-gray-500">{reservation.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {reservation.booking_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {reservation.package_name ? (
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                        {reservation.package_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(reservation.check_in_date + 'T00:00:00').toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(reservation.check_out_date + 'T00:00:00').toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">
                                                {formatCurrency(reservation.total_cost)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(reservation.payment_status)}`}>
                                                    {reservation.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                                    {reservation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleView(reservation.reservation_id)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                                                        <button
                                                            onClick={() => handleCancel(reservation.reservation_id)}
                                                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Cancel Reservation"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    {reservation.status === 'cancelled' && (
                                                        <button
                                                            onClick={() => handleDelete(reservation.reservation_id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Reservation"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {reservations.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{reservations.data.length}</span> of{' '}
                                    <span className="font-medium">{reservations.total}</span> results
                                </div>
                                <div className="flex gap-2">
                                    {/* Add pagination buttons here if needed */}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                </div>
            </div>

            {/* Reservation Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Reservation Details</h2>
                                <p className="text-sm text-gray-500">#{selectedEvent.id}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status & Payment */}
                            <div className="flex flex-wrap gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                                    {selectedEvent.status === 'confirmed' && <CheckCircle className="w-4 h-4" />}
                                    {selectedEvent.status === 'pending' && <Clock className="w-4 h-4" />}
                                    {selectedEvent.status === 'cancelled' && <XCircle className="w-4 h-4" />}
                                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                                    selectedEvent.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                    selectedEvent.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    <CreditCard className="w-4 h-4" />
                                    {selectedEvent.payment_status === 'paid' ? 'Paid' :
                                     selectedEvent.payment_status === 'partial' ? 'Partial Payment' : 'Unpaid'}
                                </span>
                            </div>

                            {/* Accommodation */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedEvent.accommodation_name}</h3>
                                        {selectedEvent.package_name && (
                                            <p className="text-sm text-amber-700 mt-1">{selectedEvent.package_name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Guest Information */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">Guest Information</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Guest Name</span>
                                        <p className="font-medium text-gray-900">{selectedEvent.guest_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Number of Guests</span>
                                        <p className="font-medium text-gray-900">{selectedEvent.guests} guests</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <CalendarIcon className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">Reservation Dates</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Check-in</span>
                                        <p className="font-medium text-gray-900">{new Date(selectedEvent.start).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Check-out</span>
                                        <p className="font-medium text-gray-900">{new Date(selectedEvent.end).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <span className="text-gray-500 text-sm">Duration</span>
                                    <p className="font-medium text-gray-900">
                                        {(() => {
                                            const start = new Date(selectedEvent.start);
                                            const end = new Date(selectedEvent.end);
                                            const diffTime = Math.abs(end.getTime() - start.getTime());
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            return diffDays === 1 ? 'Overnight Stay' : `${diffDays}-Day Stay`;
                                        })()}
                                    </p>
                                </div>
                            </div>

                            {/* Total Cost */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 text-amber-600" />
                                        <span className="font-semibold text-gray-900">Total Cost</span>
                                    </div>
                                    <span className="text-2xl font-bold text-amber-600">{formatCurrency(selectedEvent.total_cost)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center rounded-b-2xl">
                            <button
                                onClick={() => router.visit(`/reservations/${selectedEvent.id}`)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                View Full Details
                            </button>
                            <div className="flex gap-2">
                                {selectedEvent.status !== 'cancelled' && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to cancel this reservation?')) {
                                                router.patch(`/reservations/${selectedEvent.id}/cancel`, {}, {
                                                    onSuccess: () => setSelectedEvent(null)
                                                });
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Cancel Reservation
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
