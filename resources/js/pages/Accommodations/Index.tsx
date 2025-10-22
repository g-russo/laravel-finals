import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AccommodationViewModal from '@/components/AccommodationViewModal';
import AccommodationDeleteModal from '@/components/AccommodationDeleteModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accommodations',
        href: '/accommodations',
    },
];

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

type Paginated<T> = {
    data: T[];
    links: any[];
    meta: any;
};

type AccommodationStats = {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
};

interface AccommodationsProps {
    accommodations: Paginated<AccommodationRow>;
    filters?: { search?: string; status?: string };
    stats: AccommodationStats;
}

export default function Accommodations({ accommodations, filters, stats }: AccommodationsProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [selectedAccommodation, setSelectedAccommodation] = useState<AccommodationRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accommodationToDelete, setAccommodationToDelete] = useState<AccommodationRow | null>(null);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/accommodations', { search, status }, { preserveState: true, replace: true });
    };

    const onClear = () => {
        setSearch('');
        setStatus('');
        router.get('/accommodations', {}, { preserveState: true, replace: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'reserved':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatPrice = (price: number) => {
        return '₱' + new Intl.NumberFormat('en-PH').format(price);
    };

    const handleViewAccommodation = (accommodation: AccommodationRow) => {
        setSelectedAccommodation(accommodation);
        setIsModalOpen(true);
    };

    const handleDeleteAccommodation = (accommodation: AccommodationRow) => {
        setAccommodationToDelete(accommodation);
        setIsDeleteModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accommodations Management" />
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
                                    <i className="bi bi-building text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Accommodations Management
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Manage resort rooms, suites, and villas
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/admin/accommodations/create"
                                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <i className="bi bi-plus-circle mr-2 text-lg"></i>
                                Add New
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8 space-y-6">
                    {/* Statistics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Total Units
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
                                        <p className="text-xs text-gray-400">All accommodations</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i className="bi bi-building text-blue-600 text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-transparent h-1 rounded-b-2xl"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Available
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.available}</p>
                                        <p className="text-xs text-gray-400">Ready for booking</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i className="bi bi-check-circle-fill text-green-600 text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-transparent h-1 rounded-b-2xl"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Occupied
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.occupied}</p>
                                        <p className="text-xs text-gray-400">Currently in use</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i className="bi bi-person-fill-check text-red-600 text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-red-50 to-transparent h-1 rounded-b-2xl"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Maintenance
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.maintenance}</p>
                                        <p className="text-xs text-gray-400">Under repair</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i className="bi bi-tools text-yellow-600 text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-50 to-transparent h-1 rounded-b-2xl"></div>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center mb-5">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <i className="bi bi-funnel text-orange-600"></i>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
                            </div>
                            
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                    <div className="lg:col-span-6">
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                            <i className="bi bi-search mr-1"></i>Search
                                        </label>
                                        <div className="relative">
                                            <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                                            <Input
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search by name, description, or capacity..."
                                                className="pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-3">
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                            <i className="bi bi-flag mr-1"></i>Status Filter
                                        </label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-gray-900"
                                        >
                                            <option value="">All Status</option>
                                            <option value="available">Available</option>
                                            <option value="occupied">Occupied</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="reserved">Reserved</option>
                                        </select>
                                    </div>

                                    <div className="lg:col-span-3 flex items-end gap-2">
                                        <Button 
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <i className="bi bi-search mr-2"></i>
                                            Apply
                                        </Button>
                                        {(search || status) && (
                                            <Button 
                                                type="button" 
                                                variant="secondary" 
                                                onClick={onClear}
                                                className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                                title="Clear filters"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="bi bi-table text-orange-600"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">All Accommodations</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Showing {accommodations?.data?.length || 0} of {stats.total} total accommodations
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                        <th className="px-4 py-4 text-left w-16">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <i className="bi bi-hash mr-1"></i>ID
                                            </span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <i className="bi bi-building mr-1"></i>Accommodation
                                            </span>
                                        </th>
                                        <th className="px-4 py-4 text-left w-32">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <i className="bi bi-people mr-1"></i>Capacity
                                            </span>
                                        </th>
                                        <th className="px-4 py-4 text-left w-36">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <i className="bi bi-currency-dollar mr-1"></i>Price/Night
                                            </span>
                                        </th>
                                        <th className="px-4 py-4 text-left w-32">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <i className="bi bi-flag mr-1"></i>Status
                                            </span>
                                        </th>
                                        <th className="px-4 py-4 text-center w-32">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                <i className="bi bi-gear mr-1"></i>Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {accommodations?.data?.length > 0 ? (
                                        accommodations.data.map((accommodation, index) => (
                                            <tr 
                                                key={accommodation.accommodation_id} 
                                                className="hover:bg-orange-50/30 transition-colors duration-150 group"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                                        <span className="text-orange-700 font-bold text-xs">
                                                            {accommodation.accommodation_id}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-4">
                                                        {accommodation.image_url ? (
                                                            <div className="relative">
                                                                <img 
                                                                    src={accommodation.image_url} 
                                                                    alt={accommodation.accommodation_name}
                                                                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all shadow-sm"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                                <i className="bi bi-image text-gray-400 text-xl"></i>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-gray-900 truncate">
                                                                {accommodation.accommodation_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate max-w-md mt-0.5">
                                                                {accommodation.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <i className="bi bi-people text-gray-600 text-sm"></i>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {accommodation.capacity}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {formatPrice(accommodation.price_per_night)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">per night</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${getStatusColor(accommodation.availability_status)}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${
                                                            accommodation.availability_status === 'available' ? 'bg-green-600' :
                                                            accommodation.availability_status === 'occupied' ? 'bg-red-600' :
                                                            accommodation.availability_status === 'maintenance' ? 'bg-yellow-600' :
                                                            'bg-blue-600'
                                                        }`}></span>
                                                        {accommodation.availability_status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <button
                                                            onClick={() => handleViewAccommodation(accommodation)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                                                            title="View Details"
                                                        >
                                                            <i className="bi bi-eye text-sm"></i>
                                                        </button>
                                                        <Link
                                                            href={`/admin/accommodations/${accommodation.accommodation_id}/edit`}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all duration-200"
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil text-sm"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteAccommodation(accommodation)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                                                            title="Delete"
                                                        >
                                                            <i className="bi bi-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                                                        <i className="bi bi-building text-4xl text-gray-300"></i>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        No accommodations found
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-6">
                                                        Try adjusting your search criteria or add a new accommodation
                                                    </p>
                                                    <Link
                                                        href="/accommodations/create"
                                                        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg"
                                                    >
                                                        <i className="bi bi-plus-circle mr-2"></i>
                                                        Add Your First Accommodation
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {accommodations?.data?.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-900">
                                            {accommodations.data.length}
                                        </span> accommodations displayed
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <i className="bi bi-info-circle mr-1"></i>
                                        Last updated: {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Accommodation View Modal */}
            {selectedAccommodation && (
                <AccommodationViewModal
                    accommodation={selectedAccommodation}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedAccommodation(null);
                    }}
                />
            )}

            {/* Accommodation Delete Modal */}
            <AccommodationDeleteModal
                accommodation={accommodationToDelete}
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAccommodationToDelete(null);
                }}
            />
        </AppLayout>
    );
}