import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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

export default function Dashboard({ users }: { users: Paginated<UserRow> }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/40">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {users?.data?.map((u) => (
                  <tr key={u.id} className="border-t border-neutral-200/60 dark:border-neutral-800">
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.username || '-'}</td>
                    <td className="px-4 py-3 capitalize">{u.role || '-'}</td>
                    <td className="px-4 py-3">{u.created_at || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ...you can keep or remove the placeholders below... */}
        {/* ...existing code... */}
      </div>
    </AppLayout>
  );
}
