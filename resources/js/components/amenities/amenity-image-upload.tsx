import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface AmenityImageUploadProps {
  imagePreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
  required?: boolean;
  showPreviewOnly?: boolean;
  currentImageUrl?: string | null;
}

export function AmenityImageUpload({ 
  imagePreview, 
  onChange, 
  label = 'Amenity Image',
  id = 'amenity_image',
  required = false,
  showPreviewOnly = false,
  currentImageUrl = null
}: AmenityImageUploadProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium mb-2 block">
        {label}
      </Label>
      
      {showPreviewOnly && currentImageUrl ? (
        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 mb-4">
          <img
            src={currentImageUrl}
            alt="Current image"
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}
      
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WEBP (MAX. 2MB)
              </p>
            </div>
          )}
          <Input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
            onChange={onChange}
            className="hidden"
            required={required}
          />
        </label>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Recommended: 800x600px or larger, 4:3 aspect ratio for best results
      </p>
    </div>
  );
}

