import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, CircleX, Eye, Trash2, ArrowLeft, XCircle } from 'lucide-react';
import { adminStyles } from '@/lib/admin-styles';
import { formatCurrency } from '@/lib/currency';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Reservations', href: '/admin/reservations' },
    { title: 'Cancelled', href: '/admin/reservations/cancelled' },
];

interface User {
    id: number;
    full_name: string;
    email: string;
}

interface Reservation {
    reservation_id: number;
    user: User;
    booking_name: string;
    package_name: string | null;
    check_in_date: string;
    check_out_date: string;
    number_of_guests: number;
    status: string;
    total_cost: number;
    cancelled_at: string;
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
}

export default function CancelledReservations({ reservations }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleDelete = (reservationId: number) => {
        if (confirm('Are you sure you want to permanently delete this reservation? This action cannot be undone.')) {
            router.delete(`/admin/reservations/${reservationId}`);
        }
    };

    const handleView = (reservationId: number) => {
        router.visit(`/reservations/${reservationId}`);
    };

    const columns = useMemo<ColumnDef<Reservation>[]>(
        () => [
            {
                accessorKey: 'reservation_id',
                header: 'ID',
                cell: (info: any) => (
                    <span className="text-sm font-medium text-gray-600">
                        #{info.getValue()}
                    </span>
                ),
                size: 60,
            },
            {
                accessorKey: 'user',
                header: 'Guest',
                cell: ({ row }: any) => (
                    <div className="min-w-[150px]">
                        <div className="font-medium text-gray-900">{row.original.user.full_name}</div>
                        <div className="text-sm text-gray-500">{row.original.user.email}</div>
                    </div>
                ),
                size: 200,
            },
            {
                accessorKey: 'booking_name',
                header: 'Booking',
                cell: ({ row }: any) => (
                    <div className="min-w-[150px]">
                        <div className="font-medium text-gray-900">{row.original.booking_name}</div>
                        {row.original.package_name && (
                            <div className="text-sm text-amber-600">{row.original.package_name}</div>
                        )}
                    </div>
                ),
                size: 180,
            },
            {
                accessorKey: 'check_in_date',
                header: 'Dates',
                cell: ({ row }: any) => (
                    <div className="text-sm text-gray-600">
                        {new Date(row.original.check_in_date).toLocaleDateString()} - {new Date(row.original.check_out_date).toLocaleDateString()}
                    </div>
                ),
                size: 180,
            },
            {
                accessorKey: 'number_of_guests',
                header: 'Guests',
                cell: (info: any) => (
                    <span className="text-sm text-gray-600">
                        {info.getValue()} guests
                    </span>
                ),
                size: 100,
            },
            {
                accessorKey: 'total_cost',
                header: 'Total',
                cell: (info: any) => (
                    <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(info.getValue() as number)}
                    </span>
                ),
                size: 120,
            },
            {
                accessorKey: 'cancelled_at',
                header: 'Cancelled At',
                cell: (info: any) => (
                    <span className="text-sm text-gray-500">
                        {info.getValue()}
                    </span>
                ),
                size: 140,
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: ({ row }: any) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleView(row.original.reservation_id)}
                            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.reservation_id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Permanently"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
                enableSorting: false,
                size: 120,
            },
        ],
        []
    );

    const table = useReactTable({
        data: reservations.data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cancelled Reservations" />

            {/* Bootstrap Icons CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />

            <div className="bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mr-3">
                                    <XCircle className="text-gray-600 h-10 w-10" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Cancelled Reservations
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        View and manage cancelled bookings
                                    </p>
                                </div>
                            </div>
                            <Button 
                                asChild 
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                            >
                                <a href="/admin/reservations">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Reservations
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center mb-5">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                    <Search className="text-gray-600 h-4 w-4" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Search Cancelled Reservations</h2>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Search by guest name, booking, or email..."
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="flex-1"
                                />
                                {globalFilter && (
                                    <p className="text-sm text-gray-600 whitespace-nowrap">
                                        Found {table.getFilteredRowModel().rows.length} of {reservations.data.length}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`${adminStyles.table.container} overflow-x-auto`}>
                        <table className="w-full min-w-max">
                            <thead className={adminStyles.table.header}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${adminStyles.text.muted}`}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                                            }`}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {header.column.getCanSort() && (
                                                            <span className="ml-auto">
                                                                {header.column.getIsSorted() === 'asc' ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : header.column.getIsSorted() === 'desc' ? (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronsUpDown className="h-4 w-4" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                                            <CircleX className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                            <div className={`text-sm ${adminStyles.text.muted}`}>
                                                {globalFilter ? 'No cancelled reservations found matching your search.' : 'No cancelled reservations.'}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={`${adminStyles.table.row} hover:bg-gray-50 bg-gray-50/50`}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {reservations.last_page > 1 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {((reservations.current_page - 1) * reservations.per_page) + 1} to {Math.min(reservations.current_page * reservations.per_page, reservations.total)} of {reservations.total} results
                            </div>
                            <div className="flex gap-2">
                                {reservations.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(`/admin/reservations/cancelled?page=${reservations.current_page - 1}`)}
                                    >
                                        Previous
                                    </Button>
                                )}
                                {reservations.current_page < reservations.last_page && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(`/admin/reservations/cancelled?page=${reservations.current_page + 1}`)}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
