import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminStyles } from '@/lib/admin-styles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type UserRow = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  username?: string | null;
  created_at?: string | null;
};

type Paginated<T> = {
  data: T[];
  // ...existing code...
  // minimal fields we use
};

interface DashboardStats {
  // User stats
  total_users: number;
  admin_users: number;
  regular_users: number;
  
  // Accommodation stats
  total_accommodations: number;
  available_accommodations: number;
  occupied_accommodations: number;
  maintenance_accommodations: number;
  
  // Amenity stats
  total_amenities: number;
  active_amenities: number;
  premium_amenities: number;
  
  // Package stats (placeholder for future)
  total_packages?: number;
  active_packages?: number;
}

export default function Dashboard({ users, filters, stats }: { users: Paginated<UserRow>; filters?: { search?: string }; stats: DashboardStats }) {
  const [search, setSearch] = useState(filters?.search ?? '');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(dashboard().url, { search }, { preserveState: true, replace: true });
  };

  const onClear = () => {
    setSearch('');
    router.get(dashboard().url, {}, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      {/* Bootstrap Icons CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
      
      <div className={adminStyles.page.container}>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your resort.</p>
        </div>

        {/* USER MANAGEMENT SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-people-fill text-purple-600 text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-people-fill text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Total Users</p>
                  <p className={adminStyles.statsCard.value}>{stats.total_users}</p>
                  <p className="text-xs text-gray-500">All registered</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-shield-fill-check text-orange-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Admins</p>
                  <p className={adminStyles.statsCard.value}>{stats.admin_users}</p>
                  <p className="text-xs text-gray-500">Admin accounts</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-person-fill text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Regular Users</p>
                  <p className={adminStyles.statsCard.value}>{stats.regular_users}</p>
                  <p className="text-xs text-gray-500">Standard accounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOMMODATION MANAGEMENT SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-building text-blue-600 text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Accommodation Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-building text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Total Units</p>
                  <p className={adminStyles.statsCard.value}>{stats.total_accommodations}</p>
                  <p className="text-xs text-gray-500">All accommodations</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-check-circle-fill text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Available</p>
                  <p className={adminStyles.statsCard.value}>{stats.available_accommodations}</p>
                  <p className="text-xs text-gray-500">Ready for booking</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-person-fill-check text-red-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Occupied</p>
                  <p className={adminStyles.statsCard.value}>{stats.occupied_accommodations}</p>
                  <p className="text-xs text-gray-500">Currently in use</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-tools text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Maintenance</p>
                  <p className={adminStyles.statsCard.value}>{stats.maintenance_accommodations}</p>
                  <p className="text-xs text-gray-500">Under repair</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accommodation Status Chart */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Accommodation Status Distribution</CardTitle>
              <CardDescription>Visual breakdown of accommodation availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Available */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Available</span>
                    <span className="text-sm text-gray-600">
                      {stats.available_accommodations} ({stats.total_accommodations > 0 ? ((stats.available_accommodations / stats.total_accommodations) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total_accommodations > 0 ? (stats.available_accommodations / stats.total_accommodations) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Occupied */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Occupied</span>
                    <span className="text-sm text-gray-600">
                      {stats.occupied_accommodations} ({stats.total_accommodations > 0 ? ((stats.occupied_accommodations / stats.total_accommodations) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total_accommodations > 0 ? (stats.occupied_accommodations / stats.total_accommodations) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Maintenance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Maintenance</span>
                    <span className="text-sm text-gray-600">
                      {stats.maintenance_accommodations} ({stats.total_accommodations > 0 ? ((stats.maintenance_accommodations / stats.total_accommodations) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total_accommodations > 0 ? (stats.maintenance_accommodations / stats.total_accommodations) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AMENITY MANAGEMENT SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-water text-cyan-600 text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Amenity Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-water text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Total Amenities</p>
                  <p className={adminStyles.statsCard.value}>{stats.total_amenities}</p>
                  <p className="text-xs text-gray-500">All amenities</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-check-circle-fill text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Active</p>
                  <p className={adminStyles.statsCard.value}>{stats.active_amenities}</p>
                  <p className="text-xs text-gray-500">Available for use</p>
                </div>
              </div>
            </div>

            <div className={adminStyles.statsCard.container}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-star-fill text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className={adminStyles.statsCard.label}>Premium</p>
                  <p className={adminStyles.statsCard.value}>{stats.premium_amenities}</p>
                  <p className="text-xs text-gray-500">High-end facilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PACKAGES SECTION (Coming Soon) */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <i className="bi bi-box-seam text-white text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Package Management</h2>
            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
              Coming Soon
            </span>
          </div>
          <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <i className="bi bi-box-seam text-orange-600"></i>
                Resort Packages
              </CardTitle>
              <CardDescription>Create bundled packages combining accommodations and amenities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Features Preview */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Package Features:</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="bi bi-house-check-fill text-orange-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bundle Accommodations</p>
                      <p className="text-sm text-gray-600">Combine multiple room types</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="bi bi-water text-pink-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Include Amenities</p>
                      <p className="text-sm text-gray-600">Add pools, spa, activities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="bi bi-tag-fill text-purple-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Special Pricing</p>
                      <p className="text-sm text-gray-600">Discounted package rates</p>
                    </div>
                  </div>
                </div>

                {/* Package Stats Placeholder */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Package Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Packages</span>
                      <span className="text-2xl font-bold text-gray-900">{stats.total_packages || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Packages</span>
                      <span className="text-2xl font-bold text-green-600">{stats.active_packages || 0}</span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white"
                      disabled
                    >
                      <i className="bi bi-plus-circle mr-2"></i>
                      Create Package (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ...existing code... */}
      </div>
    </AppLayout>
  );
}

