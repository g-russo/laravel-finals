import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

export default function Dashboard({ users, filters }: { users: Paginated<UserRow>; filters?: { search?: string } }) {
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
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <form onSubmit={onSubmit} className="mb-2 flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email, username, role, or date..."
            className="max-w-md bg-white text-gray-900 placeholder:text-gray-500"
          />
          <Button type="submit">Search</Button>
          {search ? (
            <Button type="button" variant="secondary" onClick={onClear}>
              Reset
            </Button>
          ) : null}
        </form>

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

        {/* ...existing code... */}
      </div>
    </AppLayout>
  );
}
