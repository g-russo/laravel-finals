import { useState, useMemo } from 'react';import { Head, useForm } from '@inertiajs/react';import AppLayout from '@/layouts/app-layout';import { Button } from '@/components/ui/button';import { Input } from '@/components/ui/input';import { Label } from '@/components/ui/label';import { Textarea } from '@/components/ui/textarea';import {    Dialog,    DialogContent,    DialogHeader,    DialogTitle,    DialogTrigger,    DialogDescription,} from '@/components/ui/dialog';import {    useReactTable,    getCoreRowModel,    getSortedRowModel,    getFilteredRowModel,    flexRender,    type ColumnDef,    type SortingState,} from '@tanstack/react-table';import { ChevronUp, ChevronDown, ChevronsUpDown, Plus, Search, Eye, Edit, Trash2, Upload } from 'lucide-react';import { adminStyles } from '@/lib/admin-styles';const breadcrumbs = [    { title: 'Dashboard', href: '/admin/dashboard' },    { title: 'Amenities', href: '/admin/amenities' },];interface Amenity {    amenity_id: number;    amenity_name: string;    description: string;    price_per_use: number;    image_path: string | null;    image_url?: string;    formatted_price?: string;}interface AmenitiesManagementProps {    amenities: Amenity[];}export default function AmenitiesManagement({ amenities }: AmenitiesManagementProps) {    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);    const [isEditModalOpen, setIsEditModalOpen] = useState(false);    const [isViewModalOpen, setIsViewModalOpen] = useState(false);    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);    const [globalFilter, setGlobalFilter] = useState('');    const [sorting, setSorting] = useState<SortingState>([]);    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);    const [viewingAmenity, setViewingAmenity] = useState<Amenity | null>(null);    const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);    const [imagePreview, setImagePreview] = useState<string | null>(null);    const { data: createData, setData: setCreateData, post: postCreate, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({        amenity_name: '',        description: '',        price_per_use: '',        image: null as File | null,    });    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({        amenity_name: '',        description: '',        price_per_use: '',        image: null as File | null,        _method: 'PUT',    });    const { delete: deleteAmenity, processing: deleteProcessing } = useForm();    const handleCreateSubmit = (e: React.FormEvent) => {        e.preventDefault();        postCreate('/admin/amenities', {            forceFormData: true,            onSuccess: () => {                resetCreate();                setIsCreateModalOpen(false);                setImagePreview(null);            },        });    };    const handleEditSubmit = (e: React.FormEvent) => {        e.preventDefault();        if (!editingAmenity) return;        postEdit(`/admin/amenities/${editingAmenity.amenity_id}`, {            forceFormData: true,            onSuccess: () => {                resetEdit();                setIsEditModalOpen(false);                setEditingAmenity(null);                setImagePreview(null);            },        });    };    const handleEdit = (amenity: Amenity) => {        setEditingAmenity(amenity);        setEditData({            amenity_name: amenity.amenity_name,            description: amenity.description,            price_per_use: amenity.price_per_use.toString(),            image: null,            _method: 'PUT',        });        setImagePreview(null);        setIsEditModalOpen(true);    };    const handleView = (amenity: Amenity) => {        setViewingAmenity(amenity);        setIsViewModalOpen(true);    };    const handleDeleteClick = (amenity: Amenity) => {        setAmenityToDelete(amenity);        setIsDeleteDialogOpen(true);    };    const handleDeleteConfirm = () => {        if (!amenityToDelete) return;        deleteAmenity(`/admin/amenities/${amenityToDelete.amenity_id}`, {            onSuccess: () => {                setIsDeleteDialogOpen(false);                setAmenityToDelete(null);            },        });    };    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {        const file = e.target.files?.[0];        if (file) {            if (isEdit) {                setEditData('image', file);            } else {                setCreateData('image', file);            }            const reader = new FileReader();            reader.onloadend = () => {                setImagePreview(reader.result as string);            };            reader.readAsDataURL(file);        }    };    const getImageUrl = (imagePath: string | null) => {        if (!imagePath) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';        return `/storage/${imagePath}`;    };    const formatPrice = (price: number) => {        return '₱' + new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);    };    const columns = useMemo<ColumnDef<Amenity>[]>(        () => [            {                accessorKey: 'amenity_id',                header: 'ID',                cell: (info: any) => info.getValue(),            },            {                accessorKey: 'image_path',                header: 'Image',                cell: ({ row }: any) => (                    <div className="flex items-center">                        <img                            src={getImageUrl(row.original.image_path)}                            alt={row.original.amenity_name}                            className="h-12 w-16 rounded-lg object-cover shadow-sm"                            onError={(e) => {                                e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';                            }}                        />                    </div>                ),                enableSorting: false,            },            {                accessorKey: 'amenity_name',                header: 'Name',                cell: (info: any) => (                    <div className="font-medium text-gray-900">                        {info.getValue() as string}                    </div>                ),            },            {                accessorKey: 'description',                header: 'Description',                cell: (info: any) => (                    <div className="max-w-xs">                        <p className="text-sm text-gray-600 truncate">                            {(info.getValue() as string)}                        </p>                    </div>                ),                enableSorting: false,            },            {                accessorKey: 'price_per_use',                header: 'Price',                cell: (info: any) => (                    <span className="text-sm font-semibold text-gray-900">                        {formatPrice(info.getValue() as number)}                    </span>                ),            },            {                accessorKey: 'actions',                header: 'Actions',                cell: ({ row }: any) => (                    <div className="flex items-center gap-2">                        <Button                            variant="ghost"                            size="sm"                            onClick={() => handleView(row.original)}                            className="h-8 w-8 p-0"                        >                            <Eye className="h-4 w-4 text-blue-600" />                        </Button>                        <Button                            variant="ghost"                            size="sm"                            onClick={() => handleEdit(row.original)}                            className="h-8 w-8 p-0"                        >                            <Edit className="h-4 w-4 text-orange-600" />                        </Button>                        <Button                            variant="ghost"                            size="sm"                            onClick={() => handleDeleteClick(row.original)}                            className="h-8 w-8 p-0"                        >                            <Trash2 className="h-4 w-4 text-red-600" />                        </Button>                    </div>                ),                enableSorting: false,            },        ],        []    );    const table = useReactTable({        data: amenities,        columns,        state: {            sorting,            globalFilter,        },        onSortingChange: setSorting,        onGlobalFilterChange: setGlobalFilter,        getCoreRowModel: getCoreRowModel(),        getSortedRowModel: getSortedRowModel(),        getFilteredRowModel: getFilteredRowModel(),    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Amenities Management" />

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
                                    <i className="bi bi-gem text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Amenities Management
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Manage resort amenities, services, and facilities
                                    </p>
                                </div>
                            </div>
                            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add Amenity
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create New Amenity</DialogTitle>
                                        <DialogDescription>
                                            Add a new amenity to your resort's offerings
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                                        {/* Image Upload */}
                                        <div>
                                            <Label htmlFor="create_image">Amenity Image</Label>
                                            {imagePreview && (
                                                <div className="mt-2 mb-4">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <Input
                                                    id="create_image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, false)}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => document.getElementById('create_image')?.click()}
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload
                                                </Button>
                                            </div>
                                            {createErrors.image && (
                                                <p className="text-sm text-red-600 mt-1">{createErrors.image}</p>
                                            )}
                                        </div>

                                        {/* Amenity Name */}
                                        <div>
                                            <Label htmlFor="create_amenity_name">Amenity Name</Label>
                                            <Input
                                                id="create_amenity_name"
                                                type="text"
                                                value={createData.amenity_name}
                                                onChange={(e) => setCreateData('amenity_name', e.target.value)}
                                                placeholder="e.g., Swimming Pool, Spa, Gym"
                                                className="mt-1"
                                                required
                                            />
                                            {createErrors.amenity_name && (
                                                <p className="text-sm text-red-600 mt-1">{createErrors.amenity_name}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor="create_description">Description</Label>
                                            <Textarea
                                                id="create_description"
                                                value={createData.description}
                                                onChange={(e) => setCreateData('description', e.target.value)}
                                                placeholder="Describe the amenity features and benefits..."
                                                className="mt-1 min-h-[100px]"
                                                required
                                            />
                                            {createErrors.description && (
                                                <p className="text-sm text-red-600 mt-1">{createErrors.description}</p>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <Label htmlFor="create_price_per_use">Price per Use (₱)</Label>
                                            <Input
                                                id="create_price_per_use"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={createData.price_per_use}
                                                onChange={(e) => setCreateData('price_per_use', e.target.value)}
                                                placeholder="0.00"
                                                className="mt-1"
                                                required
                                            />
                                            {createErrors.price_per_use && (
                                                <p className="text-sm text-red-600 mt-1">{createErrors.price_per_use}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsCreateModalOpen(false);
                                                    resetCreate();
                                                    setImagePreview(null);
                                                }}
                                                disabled={createProcessing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={createProcessing}
                                                className="bg-orange-600 hover:bg-orange-700"
                                            >
                                                {createProcessing ? 'Creating...' : 'Create Amenity'}
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
                                <h2 className="text-lg font-semibold text-gray-900">Search Amenities</h2>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Search by name, description, or price..."
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="flex-1"
                                />
                                {globalFilter && (
                                    <p className="text-sm text-gray-600 whitespace-nowrap">
                                        Found {table.getFilteredRowModel().rows.length} of {amenities.length}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
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
                                            <div className="text-sm text-gray-500">
                                                {globalFilter ? 'No amenities found matching your search.' : 'No amenities yet.'}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50 transition-colors"
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

            {/* View Dialog */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{viewingAmenity?.amenity_name}</DialogTitle>
                    </DialogHeader>
                    {viewingAmenity && (
                        <div className="space-y-4">
                            <img
                                src={getImageUrl(viewingAmenity.image_path)}
                                alt={viewingAmenity.amenity_name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                <p className="text-gray-600">{viewingAmenity.description}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Price</h4>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatPrice(viewingAmenity.price_per_use)}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Amenity</DialogTitle>
                        <DialogDescription>
                            Update amenity information
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        {/* Current Image */}
                        {editingAmenity && !imagePreview && (
                            <div>
                                <Label>Current Image</Label>
                                <img
                                    src={getImageUrl(editingAmenity.image_path)}
                                    alt={editingAmenity.amenity_name}
                                    className="w-full h-48 object-cover rounded-lg mt-2"
                                />
                            </div>
                        )}

                        {/* New Image Upload */}
                        <div>
                            <Label htmlFor="edit_image">New Image (optional)</Label>
                            {imagePreview && (
                                <div className="mt-2 mb-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                    id="edit_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, true)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('edit_image')?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload
                                </Button>
                            </div>
                            {editErrors.image && (
                                <p className="text-sm text-red-600 mt-1">{editErrors.image}</p>
                            )}
                        </div>

                        {/* Amenity Name */}
                        <div>
                            <Label htmlFor="edit_amenity_name">Amenity Name</Label>
                            <Input
                                id="edit_amenity_name"
                                type="text"
                                value={editData.amenity_name}
                                onChange={(e) => setEditData('amenity_name', e.target.value)}
                                className="mt-1"
                                required
                            />
                            {editErrors.amenity_name && (
                                <p className="text-sm text-red-600 mt-1">{editErrors.amenity_name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                                className="mt-1 min-h-[100px]"
                                required
                            />
                            {editErrors.description && (
                                <p className="text-sm text-red-600 mt-1">{editErrors.description}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <Label htmlFor="edit_price_per_use">Price per Use (₱)</Label>
                            <Input
                                id="edit_price_per_use"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editData.price_per_use}
                                onChange={(e) => setEditData('price_per_use', e.target.value)}
                                className="mt-1"
                                required
                            />
                            {editErrors.price_per_use && (
                                <p className="text-sm text-red-600 mt-1">{editErrors.price_per_use}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingAmenity(null);
                                    resetEdit();
                                    setImagePreview(null);
                                }}
                                disabled={editProcessing}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={editProcessing}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {editProcessing ? 'Updating...' : 'Update Amenity'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Amenity</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{amenityToDelete?.amenity_name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setAmenityToDelete(null);
                            }}
                            disabled={deleteProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleteProcessing}
                        >
                            {deleteProcessing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
