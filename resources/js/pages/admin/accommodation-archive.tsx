import { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Archive } from 'lucide-react';
import { adminStyles } from '@/lib/admin-styles';
import {
    AccommodationArchiveActions,
    AccommodationViewDialog,
    AccommodationRestoreDialog,
    AccommodationPermanentDeleteDialog,
} from '@/components/accommodations';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Accommodations', href: '/admin/accommodations' },
    { title: 'Archive', href: '/admin/accommodations/archive' },
];

interface Accommodation {
    accommodation_id: number;
    accommodation_name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    image_url?: string;
    deleted_at?: string;
}

interface AccommodationArchiveProps {
    accommodations: Accommodation[];
}

export default function AccommodationArchive({ accommodations }: AccommodationArchiveProps) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
    const [isPermanentDeleteDialogOpen, setIsPermanentDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [accommodationToRestore, setAccommodationToRestore] = useState<Accommodation | null>(null);
    const [accommodationToDelete, setAccommodationToDelete] = useState<Accommodation | null>(null);
    const [viewingAccommodation, setViewingAccommodation] = useState<Accommodation | null>(null);

    const { post: restoreAccommodation, processing: restoreProcessing } = useForm();
    const { delete: permanentDeleteAccommodation, processing: deleteProcessing } = useForm();

    const handleView = (accommodationId: number) => {
        const accommodation = accommodations.find(a => a.accommodation_id === accommodationId);
        if (accommodation) {
            setViewingAccommodation(accommodation);
            setIsViewDialogOpen(true);
        }
    };

    const handleRestoreClick = (accommodation: Accommodation) => {
        setAccommodationToRestore(accommodation);
        setIsRestoreDialogOpen(true);
    };

    const handleRestoreConfirm = () => {
        if (!accommodationToRestore) return;

        restoreAccommodation(`/admin/accommodations/${accommodationToRestore.accommodation_id}/restore`, {
            onSuccess: () => {
                setIsRestoreDialogOpen(false);
                setAccommodationToRestore(null);
            },
        });
    };

    const handlePermanentDeleteClick = (accommodation: Accommodation) => {
        setAccommodationToDelete(accommodation);
        setIsPermanentDeleteDialogOpen(true);
    };

    const handlePermanentDeleteConfirm = () => {
        if (!accommodationToDelete) return;

        permanentDeleteAccommodation(`/admin/accommodations/${accommodationToDelete.accommodation_id}/force-delete`, {
            onSuccess: () => {
                setIsPermanentDeleteDialogOpen(false);
                setAccommodationToDelete(null);
            },
        });
    };

    const formatPrice = (price: number) => {
        return '₱' + new Intl.NumberFormat('en-PH').format(price);
    };

    const getStatusBadge = (status: 'available' | 'occupied' | 'maintenance' | 'reserved') => {
        const colors = {
            available: 'bg-green-100 text-green-800',
            occupied: 'bg-red-100 text-red-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            reserved: 'bg-blue-100 text-blue-800',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status]}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns = useMemo<ColumnDef<Accommodation>[]>(
        () => [
            {
                accessorKey: 'accommodation_id',
                header: 'ID',
                cell: (info: any) => info.getValue(),
                size: 60,
            },
            {
                accessorKey: 'image_url',
                header: 'Image',
                cell: ({ row }: any) => (
                    <div className="flex items-center">
                        {row.original.image_url ? (
                            <img
                                src={row.original.image_url}
                                alt={row.original.accommodation_name}
                                className="h-10 w-10 rounded-lg object-cover opacity-60"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                                }}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                        )}
                    </div>
                ),
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: 'accommodation_name',
                header: 'Name',
                cell: (info: any) => (
                    <div className="min-w-[150px] max-w-[200px]">
                        <div className="font-medium text-gray-600 truncate">
                            {info.getValue() as string}
                        </div>
                    </div>
                ),
                size: 180,
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: (info: any) => (
                    <div className="min-w-[200px] max-w-[300px]">
                        <p className="text-sm text-gray-400 truncate">
                            {(info.getValue() as string) || '-'}
                        </p>
                    </div>
                ),
                enableSorting: false,
                size: 250,
            },
            {
                accessorKey: 'capacity',
                header: 'Capacity',
                cell: (info: any) => (
                    <span className="text-sm text-gray-600">
                        {info.getValue()} guests
                    </span>
                ),
                size: 100,
            },
            {
                accessorKey: 'price_per_night',
                header: 'Price/Night',
                cell: (info: any) => (
                    <span className="text-sm font-medium text-gray-600">
                        {formatPrice(info.getValue() as number)}
                    </span>
                ),
                size: 120,
            },
            {
                accessorKey: 'availability_status',
                header: 'Status',
                cell: (info: any) => (
                    <div className="opacity-60">
                        {getStatusBadge(info.getValue() as 'available' | 'occupied' | 'maintenance' | 'reserved')}
                    </div>
                ),
                size: 120,
            },
            {
                accessorKey: 'deleted_at',
                header: 'Archived At',
                cell: (info: any) => (
                    <span className="text-sm text-gray-500">
                        {info.getValue() ? formatDate(info.getValue() as string) : '-'}
                    </span>
                ),
                size: 140,
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: ({ row }: any) => (
                    <AccommodationArchiveActions
                        accommodationId={row.original.accommodation_id}
                        onView={handleView}
                        onRestore={() => handleRestoreClick(row.original)}
                        onPermanentDelete={() => handlePermanentDeleteClick(row.original)}
                    />
                ),
                enableSorting: false,
                size: 120,
            },
        ],
        []
    );

    const table = useReactTable({
        data: accommodations,
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
            <Head title="Accommodation Archive" />

            {/* Bootstrap Icons CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />

            <div className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Archive className="text-white h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Accommodation Archive
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Manage archived accommodations - restore or permanently delete
                                    </p>
                                </div>
                            </div>
                            <Button 
                                asChild 
                                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <a href="/admin/accommodations">
                                    <i className="bi bi-arrow-left mr-2"></i>
                                    Back to Accommodations
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
                                <h2 className="text-lg font-semibold text-gray-900">Search Archived Accommodations</h2>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Search by name, status, capacity, or price..."
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="flex-1"
                                />
                                {globalFilter && (
                                    <p className="text-sm text-gray-600 whitespace-nowrap">
                                        Found {table.getFilteredRowModel().rows.length} of {accommodations.length}
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
                                            <div className={`text-sm ${adminStyles.text.muted}`}>
                                                {globalFilter ? 'No archived accommodations found matching your search.' : 'No archived accommodations.'}
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
                </div>
            </div>

            {/* View Accommodation Dialog */}
            <AccommodationViewDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                accommodation={viewingAccommodation}
                onEdit={() => {}} // Disable edit for archived items
            />

            {/* Restore Accommodation Dialog */}
            <AccommodationRestoreDialog
                open={isRestoreDialogOpen}
                onOpenChange={setIsRestoreDialogOpen}
                accommodation={accommodationToRestore}
                onConfirm={handleRestoreConfirm}
                processing={restoreProcessing}
            />

            {/* Permanent Delete Accommodation Dialog */}
            <AccommodationPermanentDeleteDialog
                open={isPermanentDeleteDialogOpen}
                onOpenChange={setIsPermanentDeleteDialogOpen}
                accommodation={accommodationToDelete}
                onConfirm={handlePermanentDeleteConfirm}
                processing={deleteProcessing}
            />
        </AppLayout>
    );
}