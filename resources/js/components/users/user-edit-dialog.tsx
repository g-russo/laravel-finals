import { FormEvent, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, router } from '@inertiajs/react';
import { Save, X, ArrowLeft } from 'lucide-react';
import { UserForm } from './user-form';
import { adminStyles } from '@/lib/admin-styles';

interface User {
  id: number;
  full_name: string;
  username?: string;
  email: string;
  role: 'admin' | 'employee' | 'customer';
  avatar_path?: string;
}

interface UserEditDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  user: User | null;
  onSuccess?: () => void;
  asPage?: boolean; // New prop to render as full page instead of dialog
}

export function UserEditDialog({
  open = false,
  onOpenChange,
  user,
  onSuccess,
  asPage = false,
}: UserEditDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    full_name: user?.full_name || '',
    email: user?.email || '',
    role: user?.role === 'customer' ? 'employee' : (user?.role || 'employee'), // Default to employee if customer
    username: user?.username || '',
    password: '',
    avatar: null as File | null,
  });

  useEffect(() => {
    if (user) {
      setData({
        full_name: user.full_name,
        email: user.email,
        role: user.role === 'customer' ? 'employee' : user.role,
        username: user.username || '',
        password: '',
        avatar: null,
      });
    }
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    console.log('Submitting form with data:', {
      ...data,
      avatar: data.avatar ? `File: ${data.avatar.name}` : 'No file'
    });

    // Include _method in the form data for Laravel
    setData('_method' as any, 'PUT');

    post(`/admin/users/${user.id}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        if (asPage) {
          router.visit('/admin/users');
        } else {
          onOpenChange?.(false);
          reset();
          onSuccess?.();
        }
      },
    });
  };

  const handleCancel = () => {
    if (asPage) {
      router.visit('/admin/users');
    } else {
      onOpenChange?.(false);
      reset();
    }
  };

  if (!user) return null;

  // Render as full page
  if (asPage) {
    return (
      <div className={adminStyles.page.container}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={adminStyles.text.heading}>Edit User</h1>
            <p className={`text-sm ${adminStyles.text.muted} mt-1`}>
              Update user information and permissions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/admin/users')}
            className={adminStyles.button.outline}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Fields left empty will keep their current values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <UserForm
                mode="edit"
                user={user}
                data={data}
                setData={setData}
                errors={errors}
                idPrefix="page_"
                centered={true}
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className={adminStyles.button.outline}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render as dialog/modal
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Fields left empty will keep their current values
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <UserForm
            mode="edit"
            user={user}
            data={data}
            setData={setData}
            errors={errors}
            idPrefix="dialog_edit_"
            centered={false}
          />

          <div className={`flex justify-end gap-2 pt-4 border-t ${adminStyles.dialog.header}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
              className={adminStyles.button.outline}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {processing ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

