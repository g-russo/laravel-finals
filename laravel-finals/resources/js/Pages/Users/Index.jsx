import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LayoutDashboard, Users, Package, LogOut, Menu, UserCircle, ScrollText, UserPlus, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import CreateUserModal from '@/components/CreateUserModal';

export default function UsersPage({ auth, users }) {
    const { post } = useForm();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const handleLogout = () => {
        post('/logout');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Users', href: '/users', active: true },
        { icon: Package, label: 'Products', href: '/products' },
        { icon: ScrollText, label: 'Activity Logs', href: '/admin/logs', roles: ['admin', 'employee'] },
    ];

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'employee':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'customer':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    // Custom role sorting function
    const roleOrder = { admin: 1, employee: 2, customer: 3 };
    
    // Get initials from full name
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    
    const columns = useMemo(
        () => [
            {
                accessorKey: 'user_id',
                header: 'ID',
                cell: info => <span className="font-medium">{info.getValue()}</span>,
                filterFn: 'includesString',
            },
            {
                accessorKey: 'avatar_path',
                header: 'Avatar',
                cell: info => {
                    const avatarPath = info.getValue();
                    const fullName = info.row.original.full_name;
                    
                    // Check if it's an initials placeholder or actual image
                    if (avatarPath && avatarPath.startsWith('initials:')) {
                        const initials = avatarPath.replace('initials:', '');
                        return (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                                <span className="text-xs font-bold text-muted-foreground">
                                    {initials}
                                </span>
                            </div>
                        );
                    } else if (avatarPath) {
                        return (
                            <img
                                src={`/${avatarPath}`}
                                alt="Avatar"
                                className="h-8 w-8 rounded-full object-cover border-2 border-border"
                            />
                        );
                    } else {
                        // No avatar at all, show initials from full_name
                        return (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                                <span className="text-xs font-bold text-muted-foreground">
                                    {getInitials(fullName)}
                                </span>
                            </div>
                        );
                    }
                },
            },
            {
                accessorKey: 'full_name',
                header: 'Full Name',
                cell: info => <span className="font-medium">{info.getValue()}</span>,
                filterFn: 'includesString',
            },
            {
                accessorKey: 'username',
                header: 'Username',
                cell: info => <span className="text-muted-foreground">{info.getValue()}</span>,
                filterFn: 'includesString',
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: info => <span className="text-muted-foreground">{info.getValue()}</span>,
                filterFn: 'includesString',
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: info => (
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(info.getValue())}`}>
                        {info.getValue()}
                    </span>
                ),
                sortingFn: (rowA, rowB) => {
                    const roleA = roleOrder[rowA.original.role] || 999;
                    const roleB = roleOrder[rowB.original.role] || 999;
                    return roleA - roleB;
                },
                filterFn: 'includesString',
            },
        ],
        []
    );

    const table = useReactTable({
        data: users || [],
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
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            
            // Search across all columns
            return (
                row.original.user_id?.toString().includes(search) ||
                row.original.full_name?.toLowerCase().includes(search) ||
                row.original.username?.toLowerCase().includes(search) ||
                row.original.email?.toLowerCase().includes(search) ||
                row.original.role?.toLowerCase().includes(search)
            );
        },
    });

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="flex items-center justify-between p-4 border-b border-border">
                    {sidebarOpen && <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems
                            .filter(item => !item.roles || item.roles.includes(auth?.user?.role))
                            .map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                                            item.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {sidebarOpen && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        {sidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-card border-b border-border">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h2 className="text-2xl font-semibold text-foreground">
                            User Management
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-foreground">{auth?.user?.full_name}</p>
                                <p className="text-xs text-muted-foreground">{auth?.user?.email}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleBadgeColor(auth?.user?.role)}`}>
                                    {auth?.user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-background">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Users</h1>
                                <p className="text-muted-foreground mt-1">Manage all system users</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    Total: {users.length} users
                                </span>
                                {auth?.user?.role === 'admin' && (
                                    <Button
                                        onClick={() => setCreateModalOpen(true)}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Create User
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name, username, email, or role..."
                                        value={globalFilter ?? ''}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                {globalFilter && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Found {table.getFilteredRowModel().rows.length} of {users.length} users
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Users Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCircle className="h-5 w-5" />
                                    All Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            {table.getHeaderGroups().map(headerGroup => (
                                                <TableRow key={headerGroup.id} className="bg-muted/50">
                                                    {headerGroup.headers.map(header => (
                                                        <TableHead
                                                            key={header.id}
                                                            className="cursor-pointer select-none"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                                {header.column.getIsSorted() ? (
                                                                    header.column.getIsSorted() === 'desc' ? (
                                                                        <ArrowDown className="h-4 w-4" />
                                                                    ) : (
                                                                        <ArrowUp className="h-4 w-4" />
                                                                    )
                                                                ) : (
                                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                                )}
                                                            </div>
                                                        </TableHead>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableHeader>
                                        <TableBody>
                                            {table.getRowModel().rows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                                                        No users found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                table.getRowModel().rows.map(row => (
                                                    <TableRow key={row.id} className="hover:bg-muted/50">
                                                        {row.getVisibleCells().map(cell => (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </div>
    );
}
