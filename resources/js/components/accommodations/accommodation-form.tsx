import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
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

type AccommodationFormData = {
    accommodation_name: string;
    description: string;
    capacity: string;
    price_per_night: string;
    availability_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    image: File | null;
};

interface AccommodationFormProps {
    mode: 'create' | 'edit';
    accommodation?: Accommodation;
    data: AccommodationFormData;
    setData: <K extends keyof AccommodationFormData>(key: K, value: AccommodationFormData[K]) => void;
    errors: Record<string, string>;
    idPrefix?: string;
}

export function AccommodationForm({
    mode,
    accommodation,
    data,
    setData,
    errors,
    idPrefix = '',
}: AccommodationFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getImageUrl = () => {
        if (imagePreview) return imagePreview;
        if (mode === 'edit' && accommodation?.image_url) {
            return accommodation.image_url;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Image Upload Section */}
            <div>
                <Label htmlFor={`${idPrefix}image`} className="text-sm font-medium mb-2 block">
                    Accommodation Image
                </Label>
                
                {/* Image Preview */}
                {getImageUrl() && (
                    <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                            src={getImageUrl()!}
                            alt={data.accommodation_name || 'Preview'}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop';
                            }}
                        />
                    </div>
                )}

                {/* Upload Input */}
                <div className="flex items-center gap-2">
                    <Input
                        id={`${idPrefix}image`}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className={`flex-1 ${errors.image ? 'border-red-500' : ''}`}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById(`${idPrefix}image`)?.click()}
                        className="shrink-0"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                    </Button>
                </div>
                {errors.image && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.image}</p>
                )}
                <p className={`mt-2 text-xs ${adminStyles.text.muted}`}>
                    JPG, JPEG, PNG, WebP • Max 5MB
                </p>
            </div>

            {/* Accommodation Name */}
            <div>
                <Label htmlFor={`${idPrefix}accommodation_name`} className="text-sm font-medium">
                    Accommodation Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id={`${idPrefix}accommodation_name`}
                    type="text"
                    value={data.accommodation_name}
                    onChange={(e) => setData('accommodation_name', e.target.value)}
                    placeholder="e.g., Deluxe Ocean View Suite"
                    className={`mt-1.5 ${errors.accommodation_name ? 'border-red-500' : ''}`}
                    required
                />
                {errors.accommodation_name && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.accommodation_name}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <Label htmlFor={`${idPrefix}description`} className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id={`${idPrefix}description`}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe the accommodation features, amenities, and unique selling points..."
                    className={`mt-1.5 min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                    required
                />
                {errors.description && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.description}</p>
                )}
            </div>

            {/* Capacity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor={`${idPrefix}capacity`} className="text-sm font-medium">
                        Capacity (Guests) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id={`${idPrefix}capacity`}
                        type="number"
                        value={data.capacity}
                        onChange={(e) => setData('capacity', e.target.value)}
                        placeholder="4"
                        min="1"
                        max="20"
                        className={`mt-1.5 ${errors.capacity ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.capacity && (
                        <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.capacity}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`${idPrefix}price_per_night`} className="text-sm font-medium">
                        Price per Night (₱) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id={`${idPrefix}price_per_night`}
                        type="number"
                        value={data.price_per_night}
                        onChange={(e) => setData('price_per_night', e.target.value)}
                        placeholder="5000.00"
                        min="0"
                        step="0.01"
                        className={`mt-1.5 ${errors.price_per_night ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.price_per_night && (
                        <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.price_per_night}</p>
                    )}
                </div>
            </div>

            {/* Availability Status */}
            <div>
                <Label htmlFor={`${idPrefix}availability_status`} className="text-sm font-medium">
                    Availability Status <span className="text-red-500">*</span>
                </Label>
                <select
                    id={`${idPrefix}availability_status`}
                    value={data.availability_status}
                    onChange={(e) => setData('availability_status', e.target.value as AccommodationFormData['availability_status'])}
                    className={`mt-1.5 w-full px-3 py-2 border rounded-md bg-white ${errors.availability_status ? 'border-red-500' : 'border-gray-300'}`}
                    required
                >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                </select>
                {errors.availability_status && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.availability_status}</p>
                )}
            </div>

            {mode === 'edit' && (
                <p className={`text-sm ${adminStyles.text.muted}`}>
                    Leave image field empty to keep the current image.
                </p>
            )}
        </div>
    );
}

