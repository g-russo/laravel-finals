import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ScrollText, User, Clock, Search } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Log {
    log_id: number;
    user_id: number;
    action: string;
    created_at: string;
    user: User;
}

interface Props {
    logs: {
        data: Log[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ logs }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logs based on search term
    const filteredLogs = logs.data.filter(log => 
        log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Activity Logs" />

            <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-full px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <ScrollText className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Activity Logs
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        View system activity and user actions
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                <ScrollText size={18} />
                                <span className="font-medium">{logs.total} total logs</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Search Bar */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search logs by user name, email, or action..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log.log_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{log.log_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User size={16} className="text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {log.user ? log.user.name : 'Unknown User'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {log.user ? log.user.email : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{log.action}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {new Date(log.created_at).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <ScrollText size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">
                                                {searchTerm ? 'No logs match your search' : 'No logs found'}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {searchTerm ? 'Try adjusting your search terms' : 'System activity logs will appear here'}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {filteredLogs.length} of {logs.total} logs
                                {searchTerm && <span className="ml-1 text-blue-600">(filtered)</span>}
                            </div>
                            <div className="flex gap-2">
                                {logs.current_page > 1 && (
                                    <a
                                        href={`/admin/logs?page=${logs.current_page - 1}`}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                                    >
                                        Previous
                                    </a>
                                )}
                                {logs.current_page < logs.last_page && (
                                    <a
                                        href={`/admin/logs?page=${logs.current_page + 1}`}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                                    >
                                        Next
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
