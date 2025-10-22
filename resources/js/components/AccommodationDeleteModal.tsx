import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface AccommodationRow {
    accommodation_id: number;
    accommodation_name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    image_url?: string;
    created_at?: string;
}

interface AccommodationDeleteModalProps {
    accommodation: AccommodationRow | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AccommodationDeleteModal({ accommodation, isOpen, onClose }: AccommodationDeleteModalProps) {
    const { delete: deleteAccommodation, processing } = useForm();

    const handleDelete = () => {
        if (!accommodation) return;

        deleteAccommodation(`/admin/accommodations/${accommodation.accommodation_id}`, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                // Error handling is managed by the parent component via flash messages
            },
        });
    };

    const formatPrice = (price: number) => {
        return '₱' + new Intl.NumberFormat('en-PH').format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'reserved':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!accommodation) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Accommodation
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this accommodation? This action cannot be undone and will permanently remove the accommodation and all associated data.
                    </DialogDescription>
                </DialogHeader>
                
                {/* Accommodation Preview */}
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
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(accommodation.availability_status)}`}>
                                    {accommodation.availability_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-700">
                            <p className="font-medium">This action is irreversible!</p>
                            <p className="mt-1">Deleting this accommodation will also remove:</p>
                            <ul className="list-disc list-inside mt-1 space-y-0.5">
                                <li>All booking history</li>
                                <li>Associated images and media</li>
                                <li>Any related reservation data</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        variant="destructive"
                        disabled={processing}
                        className="min-w-[100px]"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </div>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}