import { Head, Link } from '@inertiajs/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FlashToastHandler } from '@/components/toast-provider';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Amenity {
    amenity_id: number;
    amenity_name: string;
    description: string;
    price_per_use: string;
    image_path: string | null;
}

interface AmenitiesProps {
    amenities: Amenity[];
}

const defaultAmenityImages: Record<string, string> = {
    'Swimming Pool': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Spa & Wellness': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Fitness Center': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Beach Access': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Room Service': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'WiFi': 'https://images.unsplash.com/photo-1516044734145-07ca8eef8731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Parking': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
};

const getAmenityImage = (amenity: Amenity): string => {
    if (amenity.image_path) {
        return amenity.image_path.startsWith('http') 
            ? amenity.image_path 
            : `/storage/${amenity.image_path}`;
    }
    return defaultAmenityImages[amenity.amenity_name] || defaultAmenityImages['default'];
};

export default function Amenities({ amenities }: AmenitiesProps) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, []);

    return (
        <>
            <FlashToastHandler />
            <Head title="Our Amenities - Paradise Resort">
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
                            Resort Amenities
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Enjoy our world-class facilities and services designed to make your stay exceptional.
                        </p>
                        <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-gray-500">
                            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-orange-600">Amenities</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {amenities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {amenities.map((amenity, index) => (
                                <div
                                    key={amenity.amenity_id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 50}
                                >
                                    <div className="relative overflow-hidden h-48">
                                        <img
                                            src={getAmenityImage(amenity)}
                                            alt={amenity.amenity_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = defaultAmenityImages['default'];
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white">
                                                {amenity.amenity_name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {amenity.description}
                                        </p>
                                        
                                        {parseFloat(amenity.price_per_use) > 0 ? (
                                            <div className="flex items-center justify-between">
                                                <span className="text-orange-600 font-bold">
                                                    ₱{parseFloat(amenity.price_per_use).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-500">per use</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                                    Complimentary
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16" data-aos="fade-up">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <i className="bi bi-stars text-4xl text-gray-400"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Amenities Available</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                We're currently updating our amenities list. Please check back soon.
                            </p>
                            <Link
                                href="/"
                                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
                            >
                                Go Back Home
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700">
                <div className="container mx-auto px-4 lg:px-8 text-center" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Experience Luxury?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Book your stay now and enjoy all our premium amenities during your visit.
                    </p>
                    <Link
                        href="/reservations/create"
                        className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        <span>Book Your Stay</span>
                        <i className="bi bi-arrow-right ml-2"></i>
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
