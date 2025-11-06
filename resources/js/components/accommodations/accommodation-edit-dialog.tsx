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
import { AccommodationForm } from './accommodation-form';
import { adminStyles } from '@/lib/admin-styles';

interface Accommodation {
  accommodation_id: number;
  accommodation_name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  image_url?: string;
}

interface AccommodationEditDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accommodation: Accommodation | null;
  onSuccess?: () => void;
  asPage?: boolean;
}

export function AccommodationEditDialog({
  open = false,
  onOpenChange,
  accommodation,
  onSuccess,
  asPage = false,
}: AccommodationEditDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    accommodation_name: accommodation?.accommodation_name || '',
    description: accommodation?.description || '',
    capacity: accommodation?.capacity.toString() || '',
    price_per_night: accommodation?.price_per_night.toString() || '',
    availability_status: accommodation?.availability_status || 'available',
    image: null as File | null,
  });

  useEffect(() => {
    if (accommodation) {
      setData({
        accommodation_name: accommodation.accommodation_name,
        description: accommodation.description,
        capacity: accommodation.capacity.toString(),
        price_per_night: accommodation.price_per_night.toString(),
        availability_status: accommodation.availability_status,
        image: null,
      });
    }
  }, [accommodation]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!accommodation) return;

    setData('_method' as any, 'PUT');

    post(`/admin/accommodations/${accommodation.accommodation_id}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        if (asPage) {
          router.visit('/admin/accommodations');
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
      router.visit('/admin/accommodations');
    } else {
      onOpenChange?.(false);
      reset();
    }
  };

  if (!accommodation) return null;

  // Render as full page
  if (asPage) {
    return (
      <div className={adminStyles.page.container}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={adminStyles.text.heading}>Edit Accommodation</h1>
            <p className={`text-sm ${adminStyles.text.muted} mt-1`}>
              Update accommodation information
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/admin/accommodations')}
            className={adminStyles.button.outline}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accommodations
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Accommodation Information</CardTitle>
            <CardDescription>
              Fields left empty will keep their current values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AccommodationForm
                mode="edit"
                accommodation={accommodation}
                data={data}
                setData={setData}
                errors={errors}
                idPrefix="page_"
              />

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

  // Render as dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Accommodation</DialogTitle>
          <DialogDescription>
            Fields left empty will keep their current values
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AccommodationForm
            mode="edit"
            accommodation={accommodation}
            data={data}
            setData={setData}
            errors={errors}
            idPrefix="dialog_edit_"
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
              {processing ? 'Updating...' : 'Update Accommodation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

