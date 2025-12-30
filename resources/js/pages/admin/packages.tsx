import { useState, useMemo, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Plus, Search, Eye, Edit, Trash2, Upload, RotateCcw, Trash, Package, AlertCircle } from 'lucide-react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Packages', href: '/admin/packages' },
];

interface PackageItem {
    package_id: number;
    package_name: string;
    description: string;
    price: number;
    discount_percentage?: number;
    max_guests?: number;
    inclusion_details: string;
    status: 'active' | 'inactive';
    image_path: string | null;
    image_url?: string;
    formatted_price?: string;
    deleted_at?: string | null;
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

interface Accommodation {
    accommodation_id: number;
    accommodation_name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    availability_status: string;
}

interface Amenity {
    amenity_id: number;
    amenity_name: string;
    description: string;
    price_per_use: number;
}

interface PackagesManagementProps {
    packages: PackageItem[];
    accommodations?: Accommodation[];
    amenities?: Amenity[];
    archivedCount?: number;
}

export default function PackagesManagement({ packages = [], accommodations = [], amenities = [], archivedCount = 0 }: PackagesManagementProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
    const [search, setSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    // Auto-open create modal if redirected from dashboard
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('create') === 'true') {
            setIsCreateModalOpen(true);
            // Clean up URL parameter
            window.history.replaceState({}, '', '/admin/packages');
        }
    }, []);

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        package_name: '',
        description: '',
        price: '',
        inclusion_details: '',
        status: 'active' as 'active' | 'inactive',
        image: null as File | null,
        accommodations: [] as Array<{ accommodation_id: number; quantity: number }>,
        amenities: [] as Array<{ amenity_id: number; quantity: number }>,
        discount_percentage: '',
        max_guests: '2',
    });

    const { data: editData, setData: setEditData, post: editPost, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        package_name: '',
        description: '',
        price: '',
        inclusion_details: '',
        status: 'active' as 'active' | 'inactive',
        image: null as File | null,
        _method: 'PUT',
        accommodations: [] as Array<{ accommodation_id: number; quantity: number }>,
        amenities: [] as Array<{ amenity_id: number; quantity: number }>,
        discount_percentage: '',
        max_guests: '2',
    });



    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => 
            pkg.package_name.toLowerCase().includes(search.toLowerCase()) ||
            pkg.description.toLowerCase().includes(search.toLowerCase()) ||
            pkg.inclusion_details.toLowerCase().includes(search.toLowerCase()) ||
            pkg.status.toLowerCase().includes(search.toLowerCase())
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
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const statusColors = {
                    active: 'bg-green-100 text-green-800',
                    inactive: 'bg-red-100 text-red-800',
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const pkg = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(pkg)}
                            className="flex-1"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pkg)}
                            className="flex-1"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleArchive(pkg)}
                            className="flex-1"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Archive
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

    const handleView = (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        setIsViewModalOpen(true);
    };

    const handleEdit = (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        setEditData({
            package_name: pkg.package_name,
            description: pkg.description,
            price: pkg.price.toString(),
            discount_percentage: pkg.discount_percentage?.toString() || '',
            max_guests: pkg.max_guests?.toString() || '2',
            inclusion_details: pkg.inclusion_details,
            status: pkg.status,
            image: null,
            _method: 'PUT',
            accommodations: pkg.accommodations?.map(acc => ({
                accommodation_id: acc.accommodation_id,
                quantity: acc.pivot.quantity
            })) || [],
            amenities: pkg.amenities?.map(amen => ({
                amenity_id: amen.amenity_id,
                quantity: amen.pivot.quantity
            })) || [],
        });
        setIsEditModalOpen(true);
    };

    const handleArchive = (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        setIsArchiveModalOpen(true);
    };

    // Calculate total price from selected accommodations and amenities
    const calculateTotalPrice = (selectedAccommodations: Array<{ accommodation_id: number; quantity: number }>, selectedAmenities: Array<{ amenity_id: number; quantity: number }>, discountPercentage: string) => {
        let total = 0;
        
        // Add accommodation prices
        selectedAccommodations.forEach(selected => {
            const accommodation = accommodations.find(acc => acc.accommodation_id === selected.accommodation_id);
            if (accommodation) {
                total += accommodation.price_per_night * selected.quantity;
            }
        });
        
        // Add amenity prices
        selectedAmenities.forEach(selected => {
            const amenity = amenities.find(amen => amen.amenity_id === selected.amenity_id);
            if (amenity) {
                total += amenity.price_per_use * selected.quantity;
            }
        });
        
        // Apply discount if percentage is provided
        const discount = parseFloat(discountPercentage) || 0;
        if (discount > 0) {
            total = total - (total * (discount / 100));
        }
        
        return total.toFixed(2);
    };

    // Generate inclusion details from selected accommodations and amenities
    const generateInclusionDetails = (selectedAccommodations: Array<{ accommodation_id: number; quantity: number }>, selectedAmenities: Array<{ amenity_id: number; quantity: number }>) => {
        const details: string[] = [];
        
        if (selectedAccommodations.length > 0) {
            details.push('Accommodations:');
            selectedAccommodations.forEach(selected => {
                const accommodation = accommodations.find(acc => acc.accommodation_id === selected.accommodation_id);
                if (accommodation) {
                    details.push(`- ${selected.quantity}x ${accommodation.accommodation_name}`);
                }
            });
        }
        
        if (selectedAmenities.length > 0) {
            if (details.length > 0) details.push('');
            details.push('Amenities:');
            selectedAmenities.forEach(selected => {
                const amenity = amenities.find(amen => amen.amenity_id === selected.amenity_id);
                if (amenity) {
                    details.push(`- ${selected.quantity}x ${amenity.amenity_name}`);
                }
            });
        }
        
        return details.join('\n');
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPost('/admin/packages', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
            onError: () => {
                // Keep modal open and errors will be displayed
            },
            preserveScroll: true,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPackage) {
            editPost(`/admin/packages/${selectedPackage.package_id}`, {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetEdit();
                    setSelectedPackage(null);
                },
                onError: () => {
                    // Keep modal open and errors will be displayed
                },
                preserveScroll: true,
            });
        }
    };

    const handleArchiveConfirm = () => {
        if (selectedPackage) {
            router.delete(`/admin/packages/${selectedPackage.package_id}`, {
                onSuccess: () => {
                    setIsArchiveModalOpen(false);
                    setSelectedPackage(null);
                },
                preserveState: false,
                preserveScroll: true,
            });
        }
    };

    const addAccommodation = (data: any, setData: any) => {
        setData('accommodations', [...data.accommodations, { accommodation_id: 0, quantity: 1 }]);
    };

    const updateAccommodation = (index: number, field: string, value: any, data: any, setData: any) => {
        const updated = [...data.accommodations];
        updated[index] = { ...updated[index], [field]: value };
        setData('accommodations', updated);
    };

    const removeAccommodation = (index: number, data: any, setData: any) => {
        setData('accommodations', data.accommodations.filter((_: any, i: number) => i !== index));
    };

    const addAmenity = (data: any, setData: any) => {
        setData('amenities', [...data.amenities, { amenity_id: 0, quantity: 1 }]);
    };

    const updateAmenity = (index: number, field: string, value: any, data: any, setData: any) => {
        const updated = [...data.amenities];
        updated[index] = { ...updated[index], [field]: value };
        setData('amenities', updated);
    };

    const removeAmenity = (index: number, data: any, setData: any) => {
        setData('amenities', data.amenities.filter((_: any, i: number) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packages Management" />
            
            <div className="bg-gradient-to-br from-gray-50 via-rose-50/30 to-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Package className="text-white text-2xl w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Packages Management</h1>
                                    <p className="text-gray-600 mt-1">Manage resort packages, services, and offerings</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={() => router.get('/admin/packages/archive')}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    <Trash className="w-4 h-4 mr-2" />
                                    Trash ({archivedCount})
                                </Button>
                                
                                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Package
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="!max-w-[90vw] w-full max-h-[95vh] overflow-hidden">
                                        <DialogHeader>
                                            <DialogTitle>Add New Package</DialogTitle>
                                            <DialogDescription>
                                                Create a new package with accommodations and amenities.
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        <form onSubmit={handleCreateSubmit} className="space-y-4 overflow-y-auto max-h-[calc(95vh-180px)]">
                                            {/* Error Alert */}
                                            {Object.keys(createErrors).length > 0 && (
                                                <Alert variant="destructive" className="mb-4">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>Error</AlertTitle>
                                                    <AlertDescription>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {Object.entries(createErrors).map(([key, message]) => (
                                                                <li key={key}>{message}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="package_name">Package Name</Label>
                                                    <Input
                                                        id="package_name"
                                                        value={createData.package_name}
                                                        onChange={(e) => setCreateData('package_name', e.target.value)}
                                                        placeholder="Enter package name"
                                                        className={createErrors.package_name ? 'border-red-500' : ''}
                                                    />
                                                    {createErrors.package_name && <p className="text-red-500 text-sm mt-1">{createErrors.package_name}</p>}
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="discount_percentage">Discount %</Label>
                                                    <Input
                                                        id="discount_percentage"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={createData.discount_percentage}
                                                        onChange={(e) => {
                                                            setCreateData('discount_percentage', e.target.value);
                                                            const calculatedPrice = calculateTotalPrice(createData.accommodations, createData.amenities, e.target.value);
                                                            setCreateData('price', calculatedPrice);
                                                        }}
                                                        placeholder="0.00"
                                                        className={createErrors.discount_percentage ? 'border-red-500' : ''}
                                                    />
                                                    {createErrors.discount_percentage && <p className="text-red-500 text-sm mt-1">{createErrors.discount_percentage}</p>}
                                                </div>

                                                <div>
                                                    <Label htmlFor="max_guests">Maximum Guests</Label>
                                                    <Input
                                                        id="max_guests"
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={createData.max_guests}
                                                        onChange={(e) => setCreateData('max_guests', e.target.value)}
                                                        placeholder="2"
                                                        className={createErrors.max_guests ? 'border-red-500' : ''}
                                                    />
                                                    {createErrors.max_guests && <p className="text-red-500 text-sm mt-1">{createErrors.max_guests}</p>}
                                                </div>

                                                <div>
                                                    <Label htmlFor="price">Total Price (Auto-calculated)</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        value={createData.price}
                                                        readOnly
                                                        placeholder="0.00"
                                                        className="bg-gray-50"
                                                    />
                                                    {createErrors.price && <p className="text-red-500 text-sm mt-1">{createErrors.price}</p>}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={createData.description}
                                                        onChange={(e) => setCreateData('description', e.target.value)}
                                                        placeholder="Enter package description"
                                                        rows={2}
                                                        className={createErrors.description ? 'border-red-500' : ''}
                                                    />
                                                    {createErrors.description && <p className="text-red-500 text-sm mt-1">{createErrors.description}</p>}
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="inclusion_details">Inclusion Details</Label>
                                                    <Textarea
                                                        id="inclusion_details"
                                                        value={createData.inclusion_details}
                                                        onChange={(e) => setCreateData('inclusion_details', e.target.value)}
                                                        placeholder="Enter what's included in this package"
                                                        rows={2}
                                                        className={createErrors.inclusion_details ? 'border-red-500' : ''}
                                                    />
                                                    {createErrors.inclusion_details && <p className="text-red-500 text-sm mt-1">{createErrors.inclusion_details}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Accommodations Selection */}
                                                <div>
                                                    <Label>Accommodations</Label>
                                                    <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                                                        {accommodations && accommodations.length > 0 ? (
                                                            accommodations.map((accommodation) => (
                                                                <div key={accommodation.accommodation_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                                    <div className="flex items-center space-x-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`create-accommodation-${accommodation.accommodation_id}`}
                                                                            checked={createData.accommodations.some(a => a.accommodation_id === accommodation.accommodation_id)}
                                                                            onChange={(e) => {
                                                                                let newAccommodations;
                                                                                if (e.target.checked) {
                                                                                    newAccommodations = [...createData.accommodations, { accommodation_id: accommodation.accommodation_id, quantity: 1 }];
                                                                                } else {
                                                                                    newAccommodations = createData.accommodations.filter(a => a.accommodation_id !== accommodation.accommodation_id);
                                                                                }
                                                                                setCreateData('accommodations', newAccommodations);
                                                                                const calculatedPrice = calculateTotalPrice(newAccommodations, createData.amenities, createData.discount_percentage);
                                                                                setCreateData('price', calculatedPrice);
                                                                                const inclusionDetails = generateInclusionDetails(newAccommodations, createData.amenities);
                                                                                setCreateData('inclusion_details', inclusionDetails);
                                                                            }}
                                                                            className="rounded"
                                                                        />
                                                                    <label htmlFor={`create-accommodation-${accommodation.accommodation_id}`} className="text-sm font-medium cursor-pointer">
                                                                        {accommodation.accommodation_name}
                                                                        <span className="text-gray-500 ml-2 text-xs">{formatCurrency(accommodation.price_per_night)}/night</span>
                                                                    </label>
                                                                </div>
                                                                    {createData.accommodations.some(a => a.accommodation_id === accommodation.accommodation_id) && (
                                                                        <Input
                                                                            type="number"
                                                                            min="1"
                                                                            value={createData.accommodations.find(a => a.accommodation_id === accommodation.accommodation_id)?.quantity || 1}
                                                                            onChange={(e) => {
                                                                                const newAccommodations = createData.accommodations.map(a =>
                                                                                    a.accommodation_id === accommodation.accommodation_id
                                                                                        ? { ...a, quantity: parseInt(e.target.value) || 1 }
                                                                                        : a
                                                                                );
                                                                                setCreateData('accommodations', newAccommodations);
                                                                                const calculatedPrice = calculateTotalPrice(newAccommodations, createData.amenities, createData.discount_percentage);
                                                                                setCreateData('price', calculatedPrice);
                                                                                const inclusionDetails = generateInclusionDetails(newAccommodations, createData.amenities);
                                                                                setCreateData('inclusion_details', inclusionDetails);
                                                                            }}
                                                                            className="w-20 h-8 text-sm"
                                                                            placeholder="Qty"
                                                                        />
                                                                    )}
                                                            </div>
                                                        ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No available accommodations</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Amenities Selection */}
                                                <div>
                                                    <Label>Amenities</Label>
                                                    <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                                                        {amenities && amenities.length > 0 ? (
                                                            amenities.map((amenity) => (
                                                                <div key={amenity.amenity_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                                    <div className="flex items-center space-x-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`create-amenity-${amenity.amenity_id}`}
                                                                            checked={createData.amenities.some(a => a.amenity_id === amenity.amenity_id)}
                                                                            onChange={(e) => {
                                                                                let newAmenities;
                                                                                if (e.target.checked) {
                                                                                    newAmenities = [...createData.amenities, { amenity_id: amenity.amenity_id, quantity: 1 }];
                                                                                } else {
                                                                                    newAmenities = createData.amenities.filter(a => a.amenity_id !== amenity.amenity_id);
                                                                                }
                                                                                setCreateData('amenities', newAmenities);
                                                                                const calculatedPrice = calculateTotalPrice(createData.accommodations, newAmenities, createData.discount_percentage);
                                                                                setCreateData('price', calculatedPrice);
                                                                                const inclusionDetails = generateInclusionDetails(createData.accommodations, newAmenities);
                                                                                setCreateData('inclusion_details', inclusionDetails);
                                                                            }}
                                                                            className="rounded"
                                                                        />
                                                                    <label htmlFor={`create-amenity-${amenity.amenity_id}`} className="text-sm font-medium cursor-pointer">
                                                                        {amenity.amenity_name}
                                                                        <span className="text-gray-500 ml-2 text-xs">{formatCurrency(amenity.price_per_use)}/use</span>
                                                                    </label>
                                                                </div>
                                                                    {createData.amenities.some(a => a.amenity_id === amenity.amenity_id) && (
                                                                        <Input
                                                                            type="number"
                                                                            min="1"
                                                                            value={createData.amenities.find(a => a.amenity_id === amenity.amenity_id)?.quantity || 1}
                                                                            onChange={(e) => {
                                                                                const newAmenities = createData.amenities.map(a =>
                                                                                    a.amenity_id === amenity.amenity_id
                                                                                        ? { ...a, quantity: parseInt(e.target.value) || 1 }
                                                                                        : a
                                                                                );
                                                                                setCreateData('amenities', newAmenities);
                                                                                const calculatedPrice = calculateTotalPrice(createData.accommodations, newAmenities, createData.discount_percentage);
                                                                                setCreateData('price', calculatedPrice);
                                                                                const inclusionDetails = generateInclusionDetails(createData.accommodations, newAmenities);
                                                                                setCreateData('inclusion_details', inclusionDetails);
                                                                            }}
                                                                            className="w-20 h-8 text-sm"
                                                                            placeholder="Qty"
                                                                        />
                                                                    )}
                                                            </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No amenities available</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="status">Status</Label>
                                                    <Select value={createData.status} onValueChange={(value) => setCreateData('status', value as 'active' | 'inactive')}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="image">Package Image</Label>
                                                    <Input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setCreateData('image', e.target.files?.[0] || null)}
                                                        className={createErrors.image ? 'border-red-500' : ''}
                                                    />
                                                    {createErrors.image && <p className="text-red-500 text-sm mt-1">{createErrors.image}</p>}
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={createProcessing} className="bg-rose-600 hover:bg-rose-700">
                                                    {createProcessing ? 'Creating...' : 'Create Package'}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="max-w-full px-8 py-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by name, description, or status..."
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
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new package.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Package Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="!max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Package Details</DialogTitle>
                        </DialogHeader>
                        
                        {selectedPackage && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedPackage.package_name}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{selectedPackage.description}</p>
                                        
                                        <div className="space-y-2">
                                            <div><strong>Price:</strong> {formatCurrency(selectedPackage.price)}</div>
                                            <div><strong>Status:</strong> 
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedPackage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {selectedPackage.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        {selectedPackage.image_url ? (
                                            <img src={selectedPackage.image_url} alt={selectedPackage.package_name} className="w-full h-48 object-cover rounded-lg" />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Inclusion Details</h4>
                                    <p className="text-sm text-gray-600">{selectedPackage.inclusion_details}</p>
                                </div>
                                
                                {selectedPackage.accommodations && selectedPackage.accommodations.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Included Accommodations</h4>
                                        <ul className="space-y-2">
                                            {selectedPackage.accommodations.map((acc) => (
                                                <li key={acc.accommodation_id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                                                    <span>{acc.accommodation_name}</span>
                                                    <span className="text-sm text-gray-600">Qty: {acc.pivot.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {selectedPackage.amenities && selectedPackage.amenities.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Included Amenities</h4>
                                        <ul className="space-y-2">
                                            {selectedPackage.amenities.map((amen) => (
                                                <li key={amen.amenity_id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                                                    <span>{amen.amenity_name}</span>
                                                    <span className="text-sm text-gray-600">Qty: {amen.pivot.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Package Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="!max-w-[90vw] w-full max-h-[95vh] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle>Edit Package</DialogTitle>
                            <DialogDescription>
                                Update package information
                            </DialogDescription>
                        </DialogHeader>
                        {selectedPackage && (
                            <form onSubmit={handleEditSubmit} className="space-y-6 overflow-y-auto max-h-[calc(95vh-180px)]">
                                {/* Error Alert */}
                                {Object.keys(editErrors).length > 0 && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc list-inside space-y-1">
                                                {Object.entries(editErrors).map(([key, message]) => (
                                                    <li key={key}>{message}</li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="edit_package_name">Package Name</Label>
                                        <Input
                                            id="edit_package_name"
                                            value={editData.package_name}
                                            onChange={(e) => setEditData('package_name', e.target.value)}
                                            className={editErrors.package_name ? 'border-red-500' : ''}
                                        />
                                        {editErrors.package_name && <p className="text-red-500 text-sm">{editErrors.package_name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="edit_price">Price (₱)</Label>
                                        <Input
                                            id="edit_price"
                                            type="number"
                                            step="0.01"
                                            value={editData.price}
                                            onChange={(e) => setEditData('price', e.target.value)}
                                            className={editErrors.price ? 'border-red-500' : ''}
                                        />
                                        {editErrors.price && <p className="text-red-500 text-sm">{editErrors.price}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="edit_max_guests">Maximum Guests</Label>
                                        <Input
                                            id="edit_max_guests"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={editData.max_guests}
                                            onChange={(e) => setEditData('max_guests', e.target.value)}
                                            className={editErrors.max_guests ? 'border-red-500' : ''}
                                        />
                                        {editErrors.max_guests && <p className="text-red-500 text-sm">{editErrors.max_guests}</p>}
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="edit_description">Description</Label>
                                    <Textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) => setEditData('description', e.target.value)}
                                        className={editErrors.description ? 'border-red-500' : ''}
                                        rows={3}
                                    />
                                    {editErrors.description && <p className="text-red-500 text-sm">{editErrors.description}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="edit_inclusion_details">Inclusion Details</Label>
                                    <Textarea
                                        id="edit_inclusion_details"
                                        value={editData.inclusion_details}
                                        onChange={(e) => setEditData('inclusion_details', e.target.value)}
                                        className={editErrors.inclusion_details ? 'border-red-500' : ''}
                                        rows={4}
                                    />
                                    {editErrors.inclusion_details && <p className="text-red-500 text-sm">{editErrors.inclusion_details}</p>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit_status">Status</Label>
                                        <Select value={editData.status} onValueChange={(value) => setEditData('status', value as 'active' | 'inactive')}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="edit_image">Update Image (optional)</Label>
                                        <Input
                                            id="edit_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setEditData('image', e.target.files?.[0] || null)}
                                            className={editErrors.image ? 'border-red-500' : ''}
                                        />
                                        {editErrors.image && <p className="text-red-500 text-sm">{editErrors.image}</p>}
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={editProcessing} className="bg-rose-600 hover:bg-rose-700">
                                        {editProcessing ? 'Updating...' : 'Update Package'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Archive Confirmation Modal */}
                <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Archive</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to archive "{selectedPackage?.package_name}"? This action can be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleArchiveConfirm}>
                                Archive Package
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}