import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';

interface AmenityCardProps {
  amenity: {
    amenity_id: number;
    amenity_name: string;
    description: string;
    price_per_use: string;
    image_path: string | null;
  };
  onEdit?: (amenity: any) => void;
  onDelete?: (amenity: any) => void;
  onView?: (amenity: any) => void;
  onChangeImage?: (amenity: any) => void;
  mode?: 'full' | 'image-only';
}

export function AmenityCard({ 
  amenity, 
  onEdit, 
  onDelete, 
  onView, 
  onChangeImage,
  mode = 'full' 
}: AmenityCardProps) {
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop';
    }
    return `/storage/${imagePath}`;
  };

  const formatPrice = (price: string) => {
    return '₱' + parseFloat(price).toLocaleString('en-PH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(amenity.image_path)}
          alt={amenity.amenity_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {formatPrice(amenity.price_per_use)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-6">
        <CardTitle className="text-xl">{amenity.amenity_name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {amenity.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        {mode === 'image-only' ? (
          <Button 
            onClick={() => onChangeImage?.(amenity)}
            className="w-full"
            variant="outline"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change Image
          </Button>
        ) : (
          <div className="flex gap-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(amenity)}
                className="flex-1"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(amenity)}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(amenity)}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

