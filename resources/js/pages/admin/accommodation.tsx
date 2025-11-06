import { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Plus, Search } from 'lucide-react';
import { adminStyles } from '@/lib/admin-styles';
import {
    AccommodationActions,
    AccommodationViewDialog,
    AccommodationEditDialog,
    AccommodationDeleteDialog,
    AccommodationForm,
} from '@/components/accommodations';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Accommodations', href: '/admin/accommodations' },
];

interface Accommodation {
    accommodation_id: number;
    accommodation_name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    image_url?: string;
    created_at?: string;
}

interface AccommodationManagementProps {
    accommodations: Accommodation[];
    editingAccommodation?: Accommodation;
    openEditDialog?: boolean;
}

export default function AccommodationManagement({ accommodations, editingAccommodation: initialEditingAccommodation, openEditDialog: initialOpenEditDialog }: AccommodationManagementProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(initialOpenEditDialog || false);
    const [accommodationToDelete, setAccommodationToDelete] = useState<Accommodation | null>(null);
    const [viewingAccommodation, setViewingAccommodation] = useState<Accommodation | null>(null);
    const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(initialEditingAccommodation || null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        accommodation_name: string;
        description: string;
        capacity: string;
        price_per_night: string;
        availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
        image: File | null;
    }>({
        accommodation_name: '',
        description: '',
        capacity: '',
        price_per_night: '',
        availability_status: 'available',
        image: null,
    });

    const { delete: deleteAccommodation, processing: deleteProcessing } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/accommodations', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const handleView = (accommodationId: number) => {
        const accommodation = accommodations.find(a => a.accommodation_id === accommodationId);
        if (accommodation) {
            setViewingAccommodation(accommodation);
            setIsViewDialogOpen(true);
        }
    };

    const handleEdit = (accommodationId: number) => {
        const accommodation = accommodations.find(a => a.accommodation_id === accommodationId);
        if (accommodation) {
            setEditingAccommodation(accommodation);
            setIsEditDialogOpen(true);
        }
    };

    const handleDeleteClick = (accommodation: Accommodation) => {
        setAccommodationToDelete(accommodation);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!accommodationToDelete) return;

        deleteAccommodation(`/admin/accommodations/${accommodationToDelete.accommodation_id}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
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

    const columns = useMemo<ColumnDef<Accommodation>[]>(
        () => [
            {
                accessorKey: 'accommodation_id',
                header: 'ID',
                cell: (info: any) => info.getValue(),
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
                                className="h-10 w-10 rounded-lg object-cover"
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
            },
            {
                accessorKey: 'accommodation_name',
                header: 'Name',
                cell: (info: any) => (
                    <div className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">
                            {info.getValue() as string}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: (info: any) => (
                    <div className="max-w-sm">
                        <p className="text-sm text-gray-500 truncate">
                            {(info.getValue() as string) || '-'}
                        </p>
                    </div>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'capacity',
                header: 'Capacity',
                cell: (info: any) => (
                    <span className="text-sm text-gray-900">
                        {info.getValue()} guests
                    </span>
                ),
            },
            {
                accessorKey: 'price_per_night',
                header: 'Price/Night',
                cell: (info: any) => (
                    <span className="text-sm font-medium text-gray-900">
                        {formatPrice(info.getValue() as number)}
                    </span>
                ),
            },
            {
                accessorKey: 'availability_status',
                header: 'Status',
                cell: (info: any) => getStatusBadge(info.getValue() as 'available' | 'occupied' | 'maintenance' | 'reserved'),
                sortingFn: (rowA: any, rowB: any) => {
                    const statusOrder: Record<string, number> = { available: 1, reserved: 2, occupied: 3, maintenance: 4 };
                    const statusA = statusOrder[rowA.original.availability_status as string] || 999;
                    const statusB = statusOrder[rowB.original.availability_status as string] || 999;
                    return statusA - statusB;
                },
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: ({ row }: any) => (
                    <AccommodationActions
                        accommodationId={row.original.accommodation_id}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={() => handleDeleteClick(row.original)}
                    />
                ),
                enableSorting: false,
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
            <Head title="Accommodation Management" />

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
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <i className="bi bi-building text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Accommodation Management
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Manage resort rooms, suites, and villas
                                    </p>
                                </div>
                            </div>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add Accommodation
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className={`${adminStyles.dialog.content} max-w-2xl max-h-[90vh] overflow-y-auto`}>
                                    <DialogHeader className={adminStyles.dialog.header}>
                                        <DialogTitle className={adminStyles.dialog.title}>Create New Accommodation</DialogTitle>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <AccommodationForm
                                            mode="create"
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                            idPrefix="create_"
                                        />

                                        <div className={`flex justify-end gap-2 pt-4 border-t ${adminStyles.dialog.header}`}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsModalOpen(false)}
                                                disabled={processing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing} className="bg-orange-600 hover:bg-orange-700">
                                                {processing ? 'Creating...' : 'Create Accommodation'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center mb-5">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <Search className="text-orange-600 h-4 w-4" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Search Accommodations</h2>
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
                    <div className={adminStyles.table.container}>
                        <table className="w-full">
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
                                                {globalFilter ? 'No accommodations found matching your search.' : 'No accommodations yet.'}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={`${adminStyles.table.row} hover:bg-gray-50`}
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
                onEdit={handleEdit}
            />

            {/* Edit Accommodation Dialog */}
            <AccommodationEditDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                accommodation={editingAccommodation}
            />

            {/* Delete Accommodation Dialog */}
            <AccommodationDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                accommodation={accommodationToDelete}
                onConfirm={handleDeleteConfirm}
                processing={deleteProcessing}
            />
        </AppLayout>
    );
}

