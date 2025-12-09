import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, RotateCcw, Trash2, ArrowLeft, Package } from 'lucide-react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Packages', href: '/admin/packages' },
    { title: 'Archive', href: '/admin/packages/archive' },
];

interface PackageItem {
    package_id: number;
    package_name: string;
    description: string;
    price: number;
    inclusion_details: string;
    status: 'active' | 'inactive';
    image_path: string | null;
    image_url?: string;
    formatted_price?: string;
    deleted_at?: string;
    accommodations?: Array<{
        accommodation_id: number;
        accommodation_name: string;
        pivot: { quantity: number };
    }>;
    amenities?: Array<{
        amenity_id: number;
        amenity_name: string;
        pivot: { quantity: number };
    }>;
}

interface PackageArchiveProps {
    packages: PackageItem[];
}

export default function PackageArchive({ packages = [] }: PackageArchiveProps) {
    const [search, setSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => 
            pkg.package_name.toLowerCase().includes(search.toLowerCase()) ||
            pkg.description.toLowerCase().includes(search.toLowerCase()) ||
            pkg.inclusion_details.toLowerCase().includes(search.toLowerCase())
        );
    }, [packages, search]);

    const columns: ColumnDef<PackageItem>[] = [
        {
            accessorKey: 'package_id',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    ID
                    {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : 
                     column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : 
                     <ChevronsUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue('package_id')}</div>,
        },
        {
            accessorKey: 'image_path',
            header: 'Image',
            cell: ({ row }) => {
                const pkg = row.original;
                return (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {pkg.image_url ? (
                            <img src={pkg.image_url} alt={pkg.package_name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'package_name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : 
                     column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : 
                     <ChevronsUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue('package_name')}</div>,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const description = row.getValue('description') as string;
                return <div className="max-w-xs truncate" title={description}>{description}</div>;
            },
        },
        {
            accessorKey: 'price',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Price
                    {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : 
                     column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : 
                     <ChevronsUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const price = parseFloat(row.getValue('price'));
                return <div className="font-medium">{formatCurrency(price)}</div>;
            },
        },
        {
            accessorKey: 'deleted_at',
            header: 'Archived Date',
            cell: ({ row }) => {
                const deletedAt = row.getValue('deleted_at') as string;
                return deletedAt ? new Date(deletedAt).toLocaleDateString() : 'N/A';
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const pkg = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRestore(pkg)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Restore
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handlePermanentDelete(pkg)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="w-4 h-4" />
                            Permanently Remove
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: filteredPackages,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const handleRestore = (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        setIsRestoreModalOpen(true);
    };

    const handlePermanentDelete = (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        setIsDeleteModalOpen(true);
    };

    const handleRestoreConfirm = () => {
        if (selectedPackage) {
            router.post(`/admin/packages/${selectedPackage.package_id}/restore`, {}, {
                onSuccess: () => {
                    setIsRestoreModalOpen(false);
                    setSelectedPackage(null);
                },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedPackage) {
            router.delete(`/admin/packages/${selectedPackage.package_id}/force-delete`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedPackage(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Packages" />
            
            <div className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Package className="text-white text-2xl w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Archived Packages</h1>
                                    <p className="text-gray-600 mt-1">Manage archived packages - restore or permanently remove</p>
                                </div>
                            </div>
                            
                            <Button
                                variant="outline"
                                onClick={() => router.get('/admin/packages')}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Packages
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="max-w-full px-8 py-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search archived packages..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Packages Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th key={header.id} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
                                                          )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredPackages.length === 0 && (
                            <div className="text-center py-12">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No archived packages found</h3>
                                <p className="mt-1 text-sm text-gray-500">Archived packages will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Restore Confirmation Modal */}
                <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Restore Package</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to restore "{selectedPackage?.package_name}"? This will make it active again.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsRestoreModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleRestoreConfirm}>
                                Restore Package
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Permanent Removal Confirmation Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Permanently Remove Package</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to permanently remove "{selectedPackage?.package_name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Permanently Remove
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}