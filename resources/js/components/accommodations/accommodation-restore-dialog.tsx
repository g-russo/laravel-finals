import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface Accommodation {
  accommodation_id: number;
  accommodation_name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  image_url?: string;
}

interface AccommodationRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodation: Accommodation | null;
  onConfirm: () => void;
  processing?: boolean;
}

export function AccommodationRestoreDialog({
  open,
  onOpenChange,
  accommodation,
  onConfirm,
  processing = false,
}: AccommodationRestoreDialogProps) {
  if (!accommodation) return null;

  const formatPrice = (price: number) => {
    return '₱' + new Intl.NumberFormat('en-PH').format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <RotateCcw className="h-5 w-5" />
            Restore Accommodation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to restore this accommodation? It will be moved back to the active accommodations list.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-start gap-4">
            {accommodation.image_url && (
              <img
                src={accommodation.image_url}
                alt={accommodation.accommodation_name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {accommodation.accommodation_name}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {accommodation.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(accommodation.price_per_night)}/night
                </span>
                <span className="text-sm text-gray-500">
                  {accommodation.capacity} guests
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <RotateCcw className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <p className="font-medium">This accommodation will be restored</p>
              <p className="mt-1">The accommodation will be moved back to the active list and will be available for bookings.</p>
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
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={processing}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {processing ? 'Restoring...' : 'Restore Accommodation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}