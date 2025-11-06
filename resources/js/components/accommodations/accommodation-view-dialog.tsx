import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building, Users, DollarSign, Calendar, Image as ImageIcon, FileText } from 'lucide-react';

interface Accommodation {
  accommodation_id: number;
  accommodation_name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  image_url?: string;
  created_at?: string;
}

interface AccommodationViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodation: Accommodation | null;
  onEdit?: (accommodationId: number) => void;
}

export function AccommodationViewDialog({
  open,
  onOpenChange,
  accommodation,
  onEdit,
}: AccommodationViewDialogProps) {
  if (!accommodation) return null;

  const formatPrice = (price: number) => {
    return '₱' + new Intl.NumberFormat('en-PH').format(price);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      reserved: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Accommodation Details</DialogTitle>
          <DialogDescription>
            View detailed information about this accommodation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {accommodation.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={accommodation.image_url}
                alt={accommodation.accommodation_name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop';
                }}
              />
            </div>
          )}

          {/* Name and Status */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {accommodation.accommodation_name}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(accommodation.availability_status)}`}>
              {accommodation.availability_status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 text-sm">
              <Building className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Accommodation ID</p>
                <p className="text-gray-900 font-medium">
                  #{accommodation.accommodation_id}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Capacity</p>
                <p className="text-gray-900 font-medium">
                  {accommodation.capacity} guests
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Price per Night</p>
                <p className="text-gray-900 font-medium">
                  {formatPrice(accommodation.price_per_night)}
                </p>
              </div>
            </div>

            {accommodation.created_at && (
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(accommodation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex items-start gap-3 text-sm">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">
                {accommodation.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {onEdit && (
              <Button
                onClick={() => {
                  onEdit(accommodation.accommodation_id);
                  onOpenChange(false);
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Edit Accommodation
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

