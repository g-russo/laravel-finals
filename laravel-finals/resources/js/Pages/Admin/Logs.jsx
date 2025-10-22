import { Head, router, Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Package, LogOut, Menu, ScrollText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';

export default function Logs({ auth, logs, filters }) {
    const { post } = useForm();
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sorting, setSorting] = useState([
        {
            id: filters.sort_field || 'created_at',
            desc: (filters.sort_direction || 'desc') === 'desc',
        }
    ]);

    const handleLogout = () => {
        post('/logout');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Users', href: '/users' },
        { icon: Package, label: 'Products', href: '/products' },
        { icon: ScrollText, label: 'Activity Logs', href: '/admin/logs', active: true, roles: ['admin', 'employee'] },
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Define columns for TanStack Table
    const columns = useMemo(
        () => [
            {
                accessorKey: 'log_id',
                header: 'Log ID',
                cell: ({ getValue }) => `#${getValue()}`,
            },
            {
                accessorKey: 'user',
                header: 'User',
                enableSorting: false,
                cell: ({ getValue }) => {
                    const user = getValue();
                    if (user) {
                        return (
                            <div>
                                <div className="text-sm font-medium text-foreground">
                                    {user.full_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {user.email}
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                    {user.role}
                                </span>
                            </div>
                        );
                    }
                    return <span className="text-sm text-muted-foreground italic">System / Deleted User</span>;
                },
            },
            {
                accessorKey: 'action',
                header: 'Action',
            },
            {
                accessorKey: 'created_at',
                header: 'Date & Time',
                cell: ({ getValue }) => formatDate(getValue()),
            },
        ],
        []
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: logs.data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: (updater) => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(newSorting);
            
            if (newSorting.length > 0) {
                const sortField = newSorting[0].id;
                const sortDirection = newSorting[0].desc ? 'desc' : 'asc';
                
                router.get('/admin/logs', {
                    search,
                    date_from: dateFrom,
                    date_to: dateTo,
                    sort_field: sortField,
                    sort_direction: sortDirection,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: true, // Server-side sorting
    });

    const handleFilter = () => {
        const sortField = sorting[0]?.id || 'created_at';
        const sortDirection = sorting[0]?.desc ? 'desc' : 'asc';
        
        router.get('/admin/logs', {
            search,
            date_from: dateFrom,
            date_to: dateTo,
            sort_field: sortField,
            sort_direction: sortDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setSorting([{ id: 'created_at', desc: true }]);
        router.get('/admin/logs');
    };

    return (
        <>
            <Head title="Activity Logs" />

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
                                Activity Logs
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
                            <div className="bg-card rounded-lg shadow border border-border">
                                {/* Header */}
                                <div className="border-b border-border px-6 py-4">
                                    <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {auth?.user?.role === 'admin' 
                                            ? 'View employee and customer activity logs'
                                            : 'View customer activity logs'}
                                    </p>
                                </div>

                                {/* Filters */}
                                <div className="border-b border-border px-6 py-4 bg-muted/30">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                Search Action
                                            </label>
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search action..."
                                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                Date From
                                            </label>
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                Date To
                                            </label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <button
                                                onClick={handleFilter}
                                                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
                                            >
                                                Filter
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Logs Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead className="bg-muted/50">
                                            {table.getHeaderGroups().map(headerGroup => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(header => (
                                                        <th
                                                            key={header.id}
                                                            className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                                                                header.column.getCanSort() ? 'cursor-pointer hover:bg-muted/70 transition' : ''
                                                            }`}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <div className="flex items-center">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                                {header.column.getCanSort() && (
                                                                    <span className="ml-1">
                                                                        {header.column.getIsSorted() === 'asc' ? (
                                                                            <ArrowUp className="h-4 w-4 inline" />
                                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                                            <ArrowDown className="h-4 w-4 inline" />
                                                                        ) : (
                                                                            <ArrowUpDown className="h-4 w-4 inline opacity-30" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="bg-card divide-y divide-border">
                                            {table.getRowModel().rows.length > 0 ? (
                                                table.getRowModel().rows.map(row => (
                                                    <tr key={row.id} className="hover:bg-muted/30">
                                                        {row.getVisibleCells().map(cell => (
                                                            <td key={cell.id} className="px-6 py-4 text-sm text-foreground">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                                                        No logs found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cursor Pagination */}
                                {(logs.next_cursor || logs.prev_cursor) && (
                                    <div className="border-t border-border px-6 py-4 bg-muted/30">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                Showing {logs.data.length} logs per page
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => logs.prev_page_url && router.get(logs.prev_page_url)}
                                                    disabled={!logs.prev_cursor}
                                                    className={`px-4 py-2 rounded-md text-sm ${
                                                        logs.prev_cursor
                                                            ? 'bg-card text-foreground hover:bg-muted border border-border'
                                                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                                                    }`}
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => logs.next_page_url && router.get(logs.next_page_url)}
                                                    disabled={!logs.next_cursor}
                                                    className={`px-4 py-2 rounded-md text-sm ${
                                                        logs.next_cursor
                                                            ? 'bg-card text-foreground hover:bg-muted border border-border'
                                                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                                                    }`}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
