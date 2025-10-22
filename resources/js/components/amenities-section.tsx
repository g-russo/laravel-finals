import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, MapPin, Star, Users, Wifi, Car, Coffee, Dumbbell, Waves, Utensils } from 'lucide-react';

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  description: string;
  price_per_use: string;
  image_path: string | null;
}

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

const getAmenityIcon = (amenityName: string) => {
  const name = amenityName.toLowerCase();
  if (name.includes('pool') || name.includes('swimming')) return <Waves className="h-6 w-6" />;
  if (name.includes('gym') || name.includes('fitness')) return <Dumbbell className="h-6 w-6" />;
  if (name.includes('wifi') || name.includes('internet')) return <Wifi className="h-6 w-6" />;
  if (name.includes('parking') || name.includes('car')) return <Car className="h-6 w-6" />;
  if (name.includes('restaurant') || name.includes('dining')) return <Utensils className="h-6 w-6" />;
  if (name.includes('coffee') || name.includes('cafe')) return <Coffee className="h-6 w-6" />;
  if (name.includes('spa') || name.includes('massage')) return <Star className="h-6 w-6" />;
  return <Star className="h-6 w-6" />; // Default icon
};

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop';
    }
    return `/storage/${imagePath}`;
  };

  const handleViewDetails = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setIsDetailModalOpen(true);
  };

  if (!amenities || amenities.length === 0) {
    return null; // Don't render the section if no amenities
  }

  return (
    <>
      {/* Amenities Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Resort Amenities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our exceptional facilities designed to enhance your stay and create unforgettable experiences
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity) => (
              <Card key={amenity.amenity_id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(amenity.image_path)}
                    alt={amenity.amenity_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/95 text-gray-900 shadow-lg font-semibold px-3 py-1 text-sm">
                      ₱{parseFloat(amenity.price_per_use).toLocaleString('en-PH', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </Badge>
                  </div>

                  {/* Amenity Icon */}
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <div className="text-orange-600">
                        {getAmenityIcon(amenity.amenity_name)}
                      </div>
                    </div>
                  </div>

                  {/* Hover Details Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      onClick={() => handleViewDetails(amenity)}
                      className="w-full bg-white/90 text-gray-900 hover:bg-white font-semibold shadow-lg"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {amenity.amenity_name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {amenity.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Available daily</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(amenity)}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Experience Our Amenities?
              </h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Book your stay now and enjoy access to all our premium facilities and services. 
                Create memories that will last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3 shadow-lg"
                >
                  Book Your Stay
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-3"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenity Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedAmenity && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="text-orange-600">
                      {getAmenityIcon(selectedAmenity.amenity_name)}
                    </div>
                  </div>
                  {selectedAmenity.amenity_name}
                </DialogTitle>
                <DialogDescription className="text-base">
                  Discover what makes this amenity special and plan your perfect experience.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Large Image */}
                <div className="relative h-80 rounded-xl overflow-hidden">
                  <img
                    src={getImageUrl(selectedAmenity.image_path)}
                    alt={selectedAmenity.amenity_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/95 text-gray-900 shadow-lg font-bold px-4 py-2 text-lg">
                      ₱{parseFloat(selectedAmenity.price_per_use).toLocaleString('en-PH', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })} per use
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">About This Amenity</h4>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {selectedAmenity.description}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Daily Access</p>
                    <p className="text-xs text-gray-600">Available 24/7</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">All Guests</p>
                    <p className="text-xs text-gray-600">Family friendly</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">On-Site</p>
                    <p className="text-xs text-gray-600">Resort grounds</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Star className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Premium</p>
                    <p className="text-xs text-gray-600">High quality</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3"
                  >
                    Book This Amenity
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6 border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
