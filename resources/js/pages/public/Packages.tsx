import { Head, Link, usePage } from '@inertiajs/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FlashToastHandler } from '@/components/toast-provider';
import { useEffect, useState } from 'react';
import { type SharedData } from '@/types';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    discount_percentage: number;
    max_guests: number;
    inclusion_details: string;
    image_path: string | null;
    accommodations: Array<{
        accommodation_id: number;
        accommodation_name: string;
    }>;
    amenities: Array<{
        amenity_id: number;
        amenity_name: string;
    }>;
}

interface PackagesProps {
    packages: Package[];
    showWelcomeModal?: boolean;
}

export default function Packages({ packages, showWelcomeModal = false }: PackagesProps) {
    const { auth } = usePage<SharedData>().props;
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, []);

    useEffect(() => {
        // Check if this is the first visit and there are packages available
        if (showWelcomeModal && packages.length > 0) {
            const hasSeenPackageModal = localStorage.getItem('hasSeenPackageModal');
            if (!hasSeenPackageModal) {
                setTimeout(() => {
                    setShowModal(true);
                }, 1500);
                localStorage.setItem('hasSeenPackageModal', 'true');
            }
        }
    }, [showWelcomeModal, packages.length]);

    // Local package images for fast loading
    const packageImages = [
        '/package-images/LuxuryPoolVilla.avif',
        '/package-images/ResortInfinityPool.avif',
        '/package-images/HotelRoomwithView.avif',
        '/package-images/BeachResortAerial.avif',
        '/package-images/MaldivesOverwaterBungaloo.avif',
        '/package-images/ResortPoolSunset.avif',
        '/package-images/LuxuryHotelLobby.avif',
        '/package-images/TropicalResort.avif',
        '/package-images/BeachCabana.avif',
        '/package-images/HotelwMountainView.avif',
        '/package-images/LuxurySpaResort.avif',
        '/package-images/CozyHotelRoom.avif',
        '/package-images/BEachResortPool.avif',
        '/package-images/LuxuryBedroom.avif',
        '/package-images/ModernVillaExterior.avif',
    ];

    const getPackageImage = (pkg: Package, index: number = 0): string => {
        if (pkg.image_path) {
            // Handle different path formats
            if (pkg.image_path.startsWith('http')) {
                return pkg.image_path;
            }
            // For paths that already include full path
            if (pkg.image_path.startsWith('/')) {
                return pkg.image_path;
            }
            // For relative paths stored in public folder (package-images/ or packages/)
            return `/${pkg.image_path}`;
        }
        // Return a different image based on package id or index for variety
        return packageImages[(pkg.id || index) % packageImages.length];
    };

    const getFallbackImage = (index: number): string => {
        return packageImages[index % packageImages.length];
    };

    const calculateDiscountedPrice = (price: number, discount: number): number => {
        return price - (price * discount / 100);
    };

    return (
        <>
            <FlashToastHandler />
            <Head title="Special Packages - Paradise Resort">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
                    rel="stylesheet"
                />
            </Head>

            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center" data-aos="fade-up">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Special Packages
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover our exclusive packages designed to give you the ultimate resort experience at incredible value.
                        </p>
                        <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-gray-500">
                            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-orange-600">Packages</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {packages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {packages.map((pkg, index) => (
                                <div
                                    key={pkg.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={getPackageImage(pkg, index)}
                                            alt={pkg.name}
                                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = getFallbackImage(index);
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        
                                        {pkg.discount_percentage > 0 && (
                                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                {pkg.discount_percentage}% OFF
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 left-4">
                                            <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                                <i className="bi bi-people mr-1"></i>
                                                Up to {pkg.max_guests} guests
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                            {pkg.name}
                                        </h3>
                                        
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {pkg.description}
                                        </p>

                                        {/* Inclusions */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Package Includes:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {pkg.accommodations.slice(0, 2).map((acc) => (
                                                    <span key={acc.accommodation_id} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full">
                                                        <i className="bi bi-house mr-1"></i>
                                                        {acc.accommodation_name}
                                                    </span>
                                                ))}
                                                {pkg.amenities.slice(0, 2).map((amenity) => (
                                                    <span key={amenity.amenity_id} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                                        <i className="bi bi-star mr-1"></i>
                                                        {amenity.amenity_name}
                                                    </span>
                                                ))}
                                                {(pkg.accommodations.length + pkg.amenities.length) > 4 && (
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                        +{(pkg.accommodations.length + pkg.amenities.length) - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-end justify-between mb-4">
                                            <div>
                                                {pkg.discount_percentage > 0 ? (
                                                    <>
                                                        <span className="text-gray-400 line-through text-sm">
                                                            ₱{pkg.price.toLocaleString()}
                                                        </span>
                                                        <div className="text-2xl font-bold text-orange-600">
                                                            ₱{calculateDiscountedPrice(pkg.price, pkg.discount_percentage).toLocaleString()}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        ₱{pkg.price.toLocaleString()}
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-500">per package</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={auth.user ? `/reservations/create?package=${pkg.id}` : '/login'}
                                            className="w-full block text-center bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            {auth.user ? 'Book This Package' : 'Login to Book'}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16" data-aos="fade-up">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <i className="bi bi-box-seam text-4xl text-gray-400"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Packages Available</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                We're currently preparing exciting new packages. Check back soon for amazing deals!
                            </p>
                            <Link
                                href="/accommodations"
                                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
                            >
                                Browse Accommodations
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Packages Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12" data-aos="fade-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Packages?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our carefully curated packages offer the best value and experience for your perfect getaway.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6" data-aos="fade-up" data-aos-delay="100">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-piggy-bank text-3xl text-orange-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Save More</h3>
                            <p className="text-gray-600">
                                Get exclusive discounts when you book package deals instead of individual services.
                            </p>
                        </div>

                        <div className="text-center p-6" data-aos="fade-up" data-aos-delay="200">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-check2-all text-3xl text-orange-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">All-Inclusive</h3>
                            <p className="text-gray-600">
                                Enjoy accommodations, amenities, and experiences all bundled in one convenient package.
                            </p>
                        </div>

                        <div className="text-center p-6" data-aos="fade-up" data-aos-delay="300">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-stars text-3xl text-orange-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Experience</h3>
                            <p className="text-gray-600">
                                Curated experiences designed to give you the most memorable vacation possible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Welcome Package Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div 
                        className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all"
                        data-aos="zoom-in"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <i className="bi bi-x-lg text-xl"></i>
                        </button>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-gift text-4xl text-white"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Special Packages Available! 🎉
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Welcome to Paradise Resort! We have {packages.length} exclusive package{packages.length > 1 ? 's' : ''} available right now with amazing discounts. Don't miss out on these limited-time offers!
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/packages"
                                    className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
                                >
                                    View Packages
                                </Link>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
