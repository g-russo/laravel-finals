import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, MapPin, Star, Users, Wifi, Car, Coffee, Dumbbell, Waves, Utensils } from 'lucide-react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  description: string;
  price_per_use: string | number;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [filteredAmenities, setFilteredAmenities] = useState(amenities);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter amenities based on search term
  useEffect(() => {
    const filtered = amenities.filter(amenity =>
      amenity.amenity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAmenities(filtered);
    setCurrentIndex(0); // Reset to first page when search changes
  }, [searchTerm, amenities]);

  const maxIndex = Math.max(0, filteredAmenities.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
    }
    return `/storage/${imagePath}`;
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₱' + new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numPrice);
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
      <section id="amenities" className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div 
                className="inline-block w-16 h-0.5 bg-orange-600 mb-4"
                data-aos="fade-right"
                data-aos-duration="600"
            ></div>
            <h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                data-aos="fade-up"
                data-aos-duration="800"
            >
                World-Class Amenities
            </h2>
            <p 
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="800"
            >
                Experience luxury at every turn with our comprehensive range of premium facilities and services designed for your ultimate comfort and enjoyment.
            </p>
            
            {/* Search Bar */}
            <div 
                className="max-w-2xl mx-auto mb-8"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="800"
            >
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search amenities (e.g., pool, spa, gym)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-lg outline-none shadow-sm hover:shadow-md"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="text-sm text-gray-600 mt-2">
                        Found {filteredAmenities.length} {filteredAmenities.length === 1 ? 'amenity' : 'amenities'}
                    </p>
                )}
            </div>

            <div 
                className="inline-block w-16 h-0.5 bg-orange-600 mt-4"
                data-aos="fade-left"
                data-aos-delay="400"
                data-aos-duration="600"
            ></div>
          </div>

          {filteredAmenities.length === 0 ? (
            <div className="text-center py-16" data-aos="fade-up">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <i className="bi bi-search text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Amenities Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any amenities matching "{searchTerm}". Try a different search term.
              </p>
              <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                  Clear Search
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden" data-aos="fade-up" data-aos-delay="400">
                <div
                    className={`flex ${showAll ? 'flex-wrap' : 'transition-transform duration-500 ease-out'}`}
                    style={!showAll ? {
                        transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                    } : {}}
                >
                  {(showAll ? filteredAmenities : filteredAmenities).map((amenity, index) => {
                    if (!showAll && (index < currentIndex || index >= currentIndex + itemsPerView)) {
                      return null;
                    }
                    return (
                      <div
                          key={amenity.amenity_id}
                          className={`flex-shrink-0 px-4 ${showAll ? 'w-full md:w-1/2 lg:w-1/3 mb-8' : ''}`}
                          style={!showAll ? { width: `${100 / itemsPerView}%` } : {}}
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group h-full">
                          <div className="relative overflow-hidden h-56">
                            <img
                                src={getImageUrl(amenity.image_path)}
                                alt={amenity.amenity_name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            
                            {/* Price Badge */}
                            <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                {formatPrice(amenity.price_per_use)}
                            </div>

                            {/* Amenity Name Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white text-2xl font-bold drop-shadow-lg">
                                  {amenity.amenity_name}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                                {amenity.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                  <i className="bi bi-clock mr-2"></i>
                                  <span>Per use</span>
                              </div>
                              <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md text-sm group-hover:shadow-lg">
                                  Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Arrows - Only show if there are more items than visible */}
              {!showAll && filteredAmenities.length > itemsPerView && (
                <>
                  <button
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 bg-white hover:bg-orange-600 text-orange-600 hover:text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-orange-600 disabled:hover:scale-100 group ${
                          currentIndex === 0 ? 'opacity-50' : 'opacity-100'
                      }`}
                      aria-label="Previous amenities"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                      onClick={nextSlide}
                      disabled={currentIndex >= maxIndex}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 bg-white hover:bg-orange-600 text-orange-600 hover:text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-orange-600 disabled:hover:scale-100 group ${
                          currentIndex >= maxIndex ? 'opacity-50' : 'opacity-100'
                      }`}
                      aria-label="Next amenities"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Carousel Indicators - Only show if there are more items than visible */}
              {!showAll && filteredAmenities.length > itemsPerView && (
                <div className="flex justify-center mt-8 space-x-2" data-aos="fade-up" data-aos-delay="600">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                                ? 'w-8 bg-orange-600'
                                : 'w-2 bg-gray-300 hover:bg-orange-400'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* View All Button */}
              <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="700">
                <div className="inline-flex items-center space-x-4 bg-white rounded-full shadow-lg px-6 py-3">
                  {!showAll && (
                    <>
                      <span className="text-gray-600 font-medium">
                        Showing {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, filteredAmenities.length)} of {filteredAmenities.length}
                      </span>
                      <div className="w-px h-6 bg-gray-300"></div>
                    </>
                  )}
                  <button 
                    onClick={() => setShowAll(!showAll)}
                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300 flex items-center group"
                  >
                    {showAll ? 'Show Less' : 'View All Amenities'}
                    <i className={`bi ${showAll ? 'bi-arrow-up' : 'bi-arrow-right'} ml-2 transition-transform duration-300 group-hover:translate-x-1`}></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="800">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-clock-history text-3xl text-orange-600"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">24/7 Access</h4>
              <p className="text-gray-600">Most amenities available around the clock for your convenience</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-shield-check text-3xl text-orange-600"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Safety First</h4>
              <p className="text-gray-600">All facilities maintained to the highest safety standards</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-people text-3xl text-orange-600"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Expert Staff</h4>
              <p className="text-gray-600">Professional assistance available for all amenities</p>
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

