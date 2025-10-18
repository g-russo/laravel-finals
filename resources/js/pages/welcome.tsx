import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Welcome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
            title: "Paradise Beach Resort",
            description: "Experience luxury and tranquility at our exclusive beachfront resort with pristine white sand beaches",
            cta: "Book Now"
        },
        {
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
            title: "Mountain View Villas",
            description: "Escape to our stunning mountain retreat with breathtaking views and world-class amenities",
            cta: "Explore Villas"
        },
        {
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
            title: "Luxury Pool Suites",
            description: "Indulge in our premium suites featuring private pools and personalized concierge service",
            cta: "View Suites"
        }
    ];

    const accommodations = [
        {
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            title: "Ocean View Suite",
            description: "Spacious suite with panoramic ocean views",
            price: "From ₱13,000/night"
        },
        {
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            title: "Private Villa",
            description: "Exclusive villa with private beach access",
            price: "From ₱27,000/night"
        },
        {
            image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            title: "Garden Bungalow",
            description: "Cozy bungalow surrounded by tropical gardens",
            price: "From ₱8,999/night"
        },
        {
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            title: "Penthouse Suite",
            description: "Ultimate luxury with rooftop infinity pool",
            price: "From ₱50,000/night"
        }
    ];

    const amenities = [
        {
            icon: "bi-water",
            title: "Infinity Pool",
            description: "Multiple infinity pools with ocean views"
        },
        {
            icon: "bi-cup-hot",
            title: "Fine Dining",
            description: "Michelin-starred restaurants and bars"
        },
        {
            icon: "bi-heart-pulse",
            title: "Spa & Wellness",
            description: "World-class spa and wellness center"
        },
        {
            icon: "bi-flag",
            title: "Golf Course",
            description: "Championship 18-hole golf course"
        },
        {
            icon: "bi-tsunami",
            title: "Water Sports",
            description: "Diving, surfing, and water activities"
        },
        {
            icon: "bi-airplane",
            title: "Helicopter Tours",
            description: "Scenic helicopter tours and transfers"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <>
            <Head title="Experience Paradise with a Resort">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
                    rel="stylesheet"
                />
                <style>{`
                    /* Custom animations for enhanced effects */
                    .hover-lift {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    
                    .hover-lift:hover {
                        transform: translateY(-8px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    }
                    
                    .pulse-glow {
                        animation: pulse-glow 2s infinite;
                    }
                    
                    @keyframes pulse-glow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }
                    
                    .shimmer-effect {
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .shimmer-effect::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            90deg,
                            transparent,
                            rgba(255, 255, 255, 0.3),
                            transparent
                        );
                        transition: left 0.5s;
                    }
                    
                    .shimmer-effect:hover::before {
                        left: 100%;
                    }
                    
                    .floating {
                        animation: floating 3s ease-in-out infinite;
                    }
                    
                    @keyframes floating {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    
                    .gradient-text {
                        background: linear-gradient(45deg, #ea580c, #f97316, #fb923c);
                        background-size: 200% 200%;
                        animation: gradient-shift 3s ease infinite;
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    
                    @keyframes gradient-shift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
            </Head>
            
            <Navigation />
            {/* Hero Slider Section */}
            <section id="home" className="relative h-screen overflow-hidden">
                <div className="absolute inset-0">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slide Content */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="max-w-3xl">
                            <h1 
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
                                data-aos="fade-down"
                                data-aos-duration="1000"
                            >
                                {slides[currentSlide].title}
                            </h1>
                            <p 
                                className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg max-w-2xl"
                                data-aos="fade-up"
                                data-aos-delay="300"
                                data-aos-duration="1000"
                            >
                                {slides[currentSlide].description}
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                data-aos="zoom-in"
                                data-aos-delay="600"
                                data-aos-duration="800"
                            >
                                {slides[currentSlide].cta}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slider Controls */}
                <div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20"
                    data-aos="fade-up"
                    data-aos-delay="800"
                >
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                                index === currentSlide ? 'bg-orange-600 pulse-glow' : 'bg-white/50 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 floating"
                    data-aos="fade-right"
                    data-aos-delay="700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 floating"
                    data-aos="fade-left"
                    data-aos-delay="700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </section>
            
            {/* Accommodations Section */}
            <section id="accommodations" className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
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
                            Luxury Accommodations
                        </h2>
                        <p 
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="200"
                            data-aos-duration="800"
                        >
                            Choose from our carefully curated selection of rooms, suites, and villas, each designed to provide the ultimate in comfort and luxury.
                        </p>
                        <div 
                            className="inline-block w-16 h-0.5 bg-orange-600 mt-4"
                            data-aos="fade-left"
                            data-aos-delay="400"
                            data-aos-duration="600"
                        ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {accommodations.map((accommodation, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover-lift group shimmer-effect"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                data-aos-duration="800"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={accommodation.image}
                                        alt={accommodation.title}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        Premium
                                    </div>
                                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        <div className="flex space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                                        {accommodation.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                                        {accommodation.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-orange-600 font-bold text-lg group-hover:pulse-glow">
                                            {accommodation.price}
                                        </span>
                                        <button className="text-orange-600 hover:text-orange-700 font-medium transition-all duration-300 hover:translate-x-1">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section id="amenities" className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-blue-50 opacity-30"></div>
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div 
                            className="inline-block w-16 h-0.5 bg-orange-600 mb-4"
                            data-aos="zoom-in"
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
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="200"
                            data-aos-duration="800"
                        >
                            Experience unparalleled luxury with our extensive range of premium facilities and services designed to exceed your expectations.
                        </p>
                        <div 
                            className="inline-block w-16 h-0.5 bg-orange-600 mt-4"
                            data-aos="zoom-in"
                            data-aos-delay="400"
                            data-aos-duration="600"
                        ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {amenities.map((amenity, index) => (
                            <div
                                key={index}
                                className="text-center p-8 bg-white rounded-2xl shadow-lg hover-lift group relative overflow-hidden"
                                data-aos="flip-up"
                                data-aos-delay={index * 100}
                                data-aos-duration="800"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-500">
                                        <i className={`${amenity.icon} text-3xl text-orange-600 group-hover:text-orange-700 transition-all duration-300`}></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                                        {amenity.title}
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                        {amenity.description}
                                    </p>
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        <div className="flex justify-center space-x-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-2 h-2 bg-orange-600 rounded-full pulse-glow" style={{ animationDelay: `${i * 100}ms` }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Experience Section */}
            <section id="experiences" className="py-20 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-800/20"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-orange-600 rounded-full floating"></div>
                    <div className="absolute top-20 right-20 w-16 h-16 bg-orange-400 rounded-full floating" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-500 rounded-full floating" style={{animationDelay: '0.5s'}}></div>
                </div>
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div data-aos="fade-right" data-aos-duration="1000">
                            <div 
                                className="inline-block w-16 h-0.5 bg-orange-600 mb-4"
                                data-aos="fade-right"
                                data-aos-delay="200"
                            ></div>
                            <h2 
                                className="text-4xl md:text-5xl font-bold text-white mb-6"
                                data-aos="fade-up"
                                data-aos-delay="300"
                                data-aos-duration="800"
                            >
                                Experience Paradise
                            </h2>
                            <p 
                                className="text-xl text-gray-300 mb-8"
                                data-aos="fade-up"
                                data-aos-delay="400"
                                data-aos-duration="800"
                            >
                                Immerse yourself in the beauty, culture, and adventures that await you at Paradise Resort. From stunning beaches to exciting water sports, every moment is designed to create unforgettable memories.
                            </p>
                            <button 
                                className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                                data-aos="zoom-in"
                                data-aos-delay="600"
                            >
                                <span className="relative z-10">Discover More</span>
                                <div className="absolute inset-0 bg-orange-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                            </button>
                        </div>
                        <div 
                            className="relative"
                            data-aos="fade-left"
                            data-aos-delay="300"
                            data-aos-duration="1000"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                                <iframe
                                    className="w-full h-80 lg:h-96 transition-transform duration-500"
                                    src="https://www.youtube.com/embed/qtRBMkipXBo?si=VohtJI2i6uDg965U"
                                    title="Paradise Resort Experience"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-600 rounded-full pulse-glow"></div>
                                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full floating"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                        data-aos="fade-in"
                        data-aos-duration="300"
                    ></div>
                    <div 
                        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 scale-100 shadow-2xl"
                        data-aos="zoom-in"
                        data-aos-duration="500"
                    >
                        <div className="text-center">
                            <div 
                                className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow"
                                data-aos="bounce-in"
                                data-aos-delay="200"
                            >
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 
                                className="text-2xl font-bold text-gray-900 mb-2"
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                Booking Inquiry
                            </h3>
                            <p 
                                className="text-gray-600 mb-6"
                                data-aos="fade-up"
                                data-aos-delay="400"
                            >
                                We'll contact you shortly to finalize your reservation details and preferences.
                            </p>
                            <div 
                                className="flex justify-center space-x-1 mb-6"
                                data-aos="fade-in"
                                data-aos-delay="500"
                            >
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-2 h-2 bg-orange-600 rounded-full pulse-glow" style={{ animationDelay: `${i * 100}ms` }}></div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-all duration-300 font-medium transform hover:scale-105 group relative overflow-hidden"
                                data-aos="fade-up"
                                data-aos-delay="600"
                            >
                                <span className="relative z-10">Close</span>
                                <div className="absolute inset-0 bg-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}