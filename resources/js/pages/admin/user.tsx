import { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { showToast } from '@/hooks/use-flash-messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Plus, Search, Trash2, RotateCcw } from 'lucide-react';
import { adminStyles } from '@/lib/admin-styles';
import {
    UserActions,
    UserAvatar,
    UserRoleBadge,
    UserDeleteDialog,
    UserViewDialog,
    UserEditDialog,
    UserForm,
} from '@/components/users';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

interface User {
    id: number;
    full_name: string;
    username?: string;
    email: string;
    role: 'admin' | 'employee' | 'customer';
    avatar_path?: string;
    phone_number?: string;
    address?: string;
    city?: string;
    country?: string;
    date_of_birth?: string;
}

interface UserManagementProps {
    users: User[];
    editingUser?: User;
    openEditDialog?: boolean;
    currentUser: User;
    showingTrashed?: boolean;
    trashedCount?: number;
}

export default function UserManagement({ users, editingUser: initialEditingUser, openEditDialog: initialOpenEditDialog, currentUser, showingTrashed = false, trashedCount = 0 }: UserManagementProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(initialOpenEditDialog || false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(initialEditingUser || null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        full_name: string;
        email: string;
        role: string;
        username: string;
        password: string;
        phone_number: string;
        address: string;
        city: string;
        country: string;
        date_of_birth: string;
        avatar: File | null;
    }>({
        full_name: '',
        email: '',
        role: 'employee',
        username: '',
        password: '',
        phone_number: '',
        address: '',
        city: '',
        country: '',
        date_of_birth: '',
        avatar: null,
    });

    const { delete: deleteUser, processing: deleteProcessing } = useForm();
    const { post: restoreUser, processing: restoreProcessing } = useForm();

    const handleRestore = (userId: number) => {
        restoreUser(`/admin/users/${userId}/restore`, {
            onSuccess: () => {
                // Redirect handled by controller
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const handleView = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setViewingUser(user);
            setIsViewDialogOpen(true);
        }
    };

    const handleEdit = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setEditingUser(user);
            setIsEditDialogOpen(true);
        }
    };

    const handleDeleteClick = (user: User) => {
        // Check permissions before showing delete dialog
        if (currentUser.role === 'employee') {
            showToast.error('Employees are not authorized to delete users!');
            return;
        }
        if (currentUser.role === 'admin' && user.role === 'admin') {
            showToast.error('Admins cannot delete other admin accounts!');
            return;
        }
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!userToDelete) return;

        deleteUser(`/admin/users/${userToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
            },
        });
    };

    const getInitials = (name: string) => {
        if (!name) return 'NA';
        const words = name.split(' ');
        return words
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info: any) => info.getValue(),
            },
            {
                accessorKey: 'avatar_path',
                header: 'Avatar',
                cell: ({ row }: any) => (
                    <UserAvatar
                        avatarPath={row.original.avatar_path}
                        fullName={row.original.full_name}
                        size="md"
                    />
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'full_name',
                header: 'Full Name',
                cell: (info: any) => info.getValue() as string,
            },
            {
                accessorKey: 'username',
                header: 'Username',
                cell: (info: any) => (info.getValue() as string) || '-',
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: (info: any) => info.getValue() as string,
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: (info: any) => <UserRoleBadge role={info.getValue() as 'admin' | 'employee' | 'customer'} />,
                sortingFn: (rowA: any, rowB: any) => {
                    const roleOrder: Record<string, number> = { admin: 1, employee: 2, customer: 3 };
                    const roleA = roleOrder[rowA.original.role as string] || 999;
                    const roleB = roleOrder[rowB.original.role as string] || 999;
                    return roleA - roleB;
                },
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: ({ row }: any) => (
                    showingTrashed ? (
                        <div className="flex gap-2">
                            {currentUser.role === 'admin' && (
                                <Button
                                    onClick={() => handleRestore(row.original.id)}
                                    disabled={restoreProcessing}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <RotateCcw className="mr-1 h-4 w-4" />
                                    Restore
                                </Button>
                            )}
                        </div>
                    ) : (
                        <UserActions
                            userId={row.original.id}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={() => handleDeleteClick(row.original)}
                        />
                    )
                ),
                enableSorting: false,
            },
        ],
        []
    );

    const table = useReactTable({
        data: users,
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
            <Head title="User Management" />

            {/* Bootstrap Icons CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />
            
            <div className="bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <i className="bi bi-people-fill text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {showingTrashed ? 'Deleted Users' : 'User Management'}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {showingTrashed ? 'View and restore deleted users' : 'Manage admin and employee accounts'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {currentUser.role === 'admin' && (
                                    <Button
                                        onClick={() => router.visit(showingTrashed ? '/admin/users' : '/admin/users/trashed')}
                                        variant="outline"
                                        className="px-6 py-3 rounded-xl font-semibold"
                                    >
                                        <i className={`bi ${showingTrashed ? 'bi-people' : 'bi-trash'} mr-2`}></i>
                                        {showingTrashed ? 'View Active Users' : `Trash (${trashedCount})`}
                                    </Button>
                                )}
                                {!showingTrashed && (
                                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                                <Plus className="mr-2 h-5 w-5" />
                                                Add New User
                                            </Button>
                                        </DialogTrigger>
                                <DialogContent className={`${adminStyles.dialog.content} max-w-md max-h-[90vh] overflow-y-auto`}>
                                    <DialogHeader className={adminStyles.dialog.header}>
                                        <DialogTitle className={adminStyles.dialog.title}>Create New User</DialogTitle>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <UserForm
                                            mode="create"
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                            idPrefix="create_"
                                            centered={false}
                                        />

                                        <div className={`flex justify-end gap-2 pt-4 border-t ${adminStyles.dialog.header}`}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsModalOpen(false);
                                                    reset();
                                                }}
                                                className={adminStyles.button.outline}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                {processing ? 'Creating...' : 'Create User'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center mb-5">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <Search className="text-purple-600 h-4 w-4" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Search Users</h2>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Search by name, email, username, or role..."
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="flex-1"
                                />
                                {globalFilter && (
                                    <p className="text-sm text-gray-600 whitespace-nowrap">
                                        Found {table.getFilteredRowModel().rows.length} of {users.length}
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
                                                className={adminStyles.table.headerCell}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? 'flex cursor-pointer select-none items-center gap-2'
                                                                : ''
                                                        }
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <span>
                                                                {header.column.getIsSorted() ===
                                                                'asc' ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : header.column.getIsSorted() ===
                                                                  'desc' ? (
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
                                        <td
                                            colSpan={columns.length}
                                            className={`px-6 py-8 text-center ${adminStyles.text.muted}`}
                                        >
                                            {globalFilter ? 'No users found matching your search.' : 'No users yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={adminStyles.table.row}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className={adminStyles.table.cell}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
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

            {/* View User Dialog */}
            <UserViewDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                user={viewingUser}
                onEdit={handleEdit}
            />

            {/* Edit User Dialog */}
            <UserEditDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                user={editingUser}
            />

            {/* Delete User Dialog */}
            <UserDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                user={userToDelete}
                onConfirm={handleDeleteConfirm}
                processing={deleteProcessing}
            />
        </AppLayout>
    );
}

