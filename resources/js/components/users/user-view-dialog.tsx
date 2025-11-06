import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './user-avatar';
import { UserRoleBadge } from './user-role-badge';
import { Mail, User as UserIcon, Calendar, Shield } from 'lucide-react';

interface User {
  id: number;
  full_name: string;
  username?: string;
  email: string;
  role: 'admin' | 'employee' | 'customer';
  avatar_path?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit?: (userId: number) => void;
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
  onEdit,
}: UserViewDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <UserAvatar
              avatarPath={user.avatar_path}
              fullName={user.full_name}
              size="lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.full_name}
              </h3>
              <UserRoleBadge role={user.role} className="mt-1" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <UserIcon className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Username</p>
                <p className="text-gray-900">
                  {user.username || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Role</p>
                <p className="text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>

            {user.created_at && (
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {onEdit && (
              <Button
                onClick={() => {
                  onEdit(user.id);
                  onOpenChange(false);
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Edit User
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

