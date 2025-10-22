import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface AccommodationDetail {
    id: number;
    title: string;
    description: string;
    price: number;
    formatted_price: string;
    image: string;
    capacity: number;
    status: string;
}

interface RelatedAccommodation {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    capacity: number;
    formatted_price: number;
}

interface AccommodationDetailProps {
    accommodation: AccommodationDetail;
    relatedAccommodations: RelatedAccommodation[];
}

export default function AccommodationDetail({ accommodation, relatedAccommodations }: AccommodationDetailProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Sample gallery images (in a real app, these would come from the database)
    const galleryImages = [
        accommodation.image,
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ];

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
        });
    }, []);

    return (
        <>
            <Head title={`${accommodation.title} - Paradise Resort`}>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
                    rel="stylesheet"
                />
            </Head>
            
            <Navigation />

            <div className="pt-20">
                {/* Hero Section */}
                <section className="relative">
                    <div className="container mx-auto px-4 lg:px-8 py-8">
                        {/* Breadcrumb */}
                        <nav className="mb-6" data-aos="fade-right">
                            <ol className="flex items-center space-x-2 text-sm text-gray-600">
                                <li>
                                    <Link href="/" className="hover:text-orange-600 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li><i className="bi bi-chevron-right"></i></li>
                                <li>
                                    <Link href="/#accommodations" className="hover:text-orange-600 transition-colors">
                                        Accommodations
                                    </Link>
                                </li>
                                <li><i className="bi bi-chevron-right"></i></li>
                                <li className="text-gray-900 font-medium">{accommodation.title}</li>
                            </ol>
                        </nav>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Image Gallery */}
                            <div className="space-y-4" data-aos="fade-right">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={galleryImages[selectedImage]}
                                        alt={accommodation.title}
                                        className="w-full h-96 object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        <i className="bi bi-people mr-1"></i>
                                        {accommodation.capacity} guests
                                    </div>
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        <i className="bi bi-check-circle mr-1"></i>
                                        Available
                                    </div>
                                </div>
                                
                                {/* Thumbnail Gallery */}
                                <div className="grid grid-cols-4 gap-2">
                                    {galleryImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative rounded-lg overflow-hidden h-20 transition-all duration-300 ${
                                                selectedImage === index 
                                                    ? 'ring-2 ring-orange-500 scale-105' 
                                                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${accommodation.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accommodation Details */}
                            <div className="space-y-6" data-aos="fade-left">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                        {accommodation.title}
                                    </h1>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="flex items-center">
                                            <div className="flex space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className="bi bi-star-fill text-yellow-400"></i>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-gray-600">(4.9) • 127 reviews</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {accommodation.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="bg-orange-50 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-orange-600">
                                                {accommodation.formatted_price}
                                            </div>
                                            <div className="text-gray-600">per night</div>
                                        </div>
                                        <button
                                            onClick={() => setShowBookingModal(true)}
                                            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i className="bi bi-people text-blue-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{accommodation.capacity} Guests</div>
                                                <div className="text-sm text-gray-600">Maximum occupancy</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <i className="bi bi-wifi text-green-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Free WiFi</div>
                                                <div className="text-sm text-gray-600">High-speed internet</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <i className="bi bi-cup-hot text-purple-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Breakfast</div>
                                                <div className="text-sm text-gray-600">Complimentary</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <i className="bi bi-p-circle text-orange-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Free Parking</div>
                                                <div className="text-sm text-gray-600">On-site parking</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                                    <div className="space-y-3">
                                        <a href="tel:+1234567890" className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors">
                                            <i className="bi bi-telephone text-orange-600"></i>
                                            <span>+1 (234) 567-8900</span>
                                        </a>
                                        <a href="mailto:info@paradiseresort.com" className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors">
                                            <i className="bi bi-envelope text-orange-600"></i>
                                            <span>info@paradiseresort.com</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Accommodations */}
                {relatedAccommodations.length > 0 && (
                    <section className="py-20 bg-gray-50">
                        <div className="container mx-auto px-4 lg:px-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center" data-aos="fade-up">
                                You Might Also Like
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedAccommodations.map((related, index) => (
                                    <div
                                        key={related.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <div className="relative">
                                            <img
                                                src={related.image}
                                                alt={related.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                                <i className="bi bi-people mr-1"></i>
                                                {related.capacity} guests
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {related.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {related.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-orange-600 font-bold text-lg">
                                                        ₱{related.formatted_price.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">per night</div>
                                                </div>
                                                <Link
                                                    href={`/accommodations/${related.id}`}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            <Footer />

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowBookingModal(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-calendar-check text-orange-600 text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Book {accommodation.title}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We'll contact you shortly to finalize your reservation details and preferences.
                            </p>
                            <div className="text-center mb-6">
                                <div className="text-2xl font-bold text-orange-600">
                                    {accommodation.formatted_price}
                                </div>
                                <div className="text-gray-600">per night</div>
                            </div>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-all duration-300 font-medium w-full"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}