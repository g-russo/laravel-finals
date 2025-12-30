import { Head, Link } from '@inertiajs/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FlashToastHandler } from '@/components/toast-provider';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Accommodation {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    capacity: number;
    formatted_price: number;
}

interface AccommodationsProps {
    accommodations: Accommodation[];
}

export default function Accommodations({ accommodations }: AccommodationsProps) {
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
            <Head title="All Accommodations - Paradise Resort">
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
                            Our Accommodations
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover our complete collection of luxury rooms, suites, and villas designed for your perfect stay.
                        </p>
                        <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-gray-500">
                            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-orange-600">Accommodations</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accommodations Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {accommodations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {accommodations.map((accommodation, index) => (
                                <div
                                    key={accommodation.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 50}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={accommodation.image}
                                            alt={accommodation.title}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {accommodation.formatted_price > 15000 && (
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                                Premium
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                            <i className="bi bi-people mr-1"></i>
                                            {accommodation.capacity} guests
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 flex-1">
                                                {accommodation.title}
                                            </h3>
                                            <div className="ml-2 text-right">
                                                <div className="text-orange-600 font-bold text-lg">
                                                    {accommodation.formatted_price.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">per night</div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {accommodation.description}
                                        </p>

                                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <i className="bi bi-wifi mr-1"></i>
                                                <span>Free WiFi</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="bi bi-cup-hot mr-1"></i>
                                                <span>Breakfast</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <i className="bi bi-star-fill text-yellow-400 text-sm mr-1"></i>
                                                <span className="text-sm font-medium text-gray-700">4.9</span>
                                            </div>
                                            <Link
                                                href={`/reservations/create?accommodation=${accommodation.id}`}
                                                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm"
                                            >
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16" data-aos="fade-up">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <i className="bi bi-building text-4xl text-gray-400"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Accommodations Available</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                We're currently updating our accommodations. Please check back soon.
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

            <Footer />
        </>
    );
}
