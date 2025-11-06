import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AmenityFormFieldsProps {
  data: {
    amenity_name: string;
    description: string;
    price_per_use: string;
  };
  errors?: {
    amenity_name?: string;
    description?: string;
    price_per_use?: string;
  };
  onChange: (field: string, value: string) => void;
  idPrefix?: string;
}

export function AmenityFormFields({ data, errors, onChange, idPrefix = '' }: AmenityFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${idPrefix}amenity_name`} className="text-sm font-medium">
            Amenity Name *
          </Label>
          <Input
            id={`${idPrefix}amenity_name`}
            value={data.amenity_name}
            onChange={(e) => onChange('amenity_name', e.target.value)}
            placeholder="e.g., Swimming Pool, Spa, Gym"
            className={errors?.amenity_name ? 'border-red-500' : ''}
            required
          />
          {errors?.amenity_name && (
            <p className="text-sm text-red-500 mt-1">{errors.amenity_name}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor={`${idPrefix}price_per_use`} className="text-sm font-medium">
            Price per Use (₱) *
          </Label>
          <Input
            id={`${idPrefix}price_per_use`}
            type="number"
            step="0.01"
            min="0"
            value={data.price_per_use}
            onChange={(e) => onChange('price_per_use', e.target.value)}
            placeholder="0.00"
            className={errors?.price_per_use ? 'border-red-500' : ''}
            required
          />
          {errors?.price_per_use && (
            <p className="text-sm text-red-500 mt-1">{errors.price_per_use}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}description`} className="text-sm font-medium">
          Description *
        </Label>
        <Textarea
          id={`${idPrefix}description`}
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe the amenity and what guests can expect. Include any special features, hours of operation, or requirements..."
          rows={3}
          className={errors?.description ? 'border-red-500' : ''}
          required
        />
        {errors?.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
    </>
  );
}

