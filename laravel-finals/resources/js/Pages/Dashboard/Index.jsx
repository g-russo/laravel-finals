import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Package, DollarSign, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ auth, stats }) {
    const { post } = useForm();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        post('/logout');
    };

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats.users, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950' },
        { icon: Package, label: 'Products', value: stats.products, color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950' },
        { icon: LayoutDashboard, label: 'Orders', value: stats.orders, color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950' },
        { icon: DollarSign, label: 'Revenue', value: `$${stats.revenue}`, color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950' },
    ];

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
        { icon: Users, label: 'Users', href: '/users' },
        { icon: Package, label: 'Products', href: '/products' },
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
                        {menuItems.map((item) => (
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
                            Welcome back, {auth?.user?.name || 'User'}!
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
                        <h1 className="text-3xl font-bold mb-6 text-foreground">Dashboard</h1>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statCards.map((card, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {card.label}
                                        </CardTitle>
                                        <div className={`p-2 rounded-full ${card.color}`}>
                                            <card.icon className="h-4 w-4" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{card.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your latest system activity</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">No recent activity to display.</p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
