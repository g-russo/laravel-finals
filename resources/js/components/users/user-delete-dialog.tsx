import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { UserAvatar } from './user-avatar';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'employee' | 'customer';
  avatar_path?: string;
}

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
  processing?: boolean;
}

export function UserDeleteDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  processing = false,
}: UserDeleteDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-4">
            <UserAvatar
              avatarPath={user.avatar_path}
              fullName={user.full_name}
              size="md"
            />
            <div>
              <p className="font-medium text-gray-900">
                {user.full_name}
              </p>
              <p className="text-sm text-gray-600">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                Role: {user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            disabled={processing}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {processing ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

