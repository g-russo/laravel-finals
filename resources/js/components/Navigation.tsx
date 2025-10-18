import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { useState } from 'react';

export default function Navigation() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl lg:text-3xl font-bold text-orange-600">
                            Paradise Resort
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        <Link href="#home" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="#accommodations" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                            Accommodations
                        </Link>
                        <Link href="#amenities" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                            Amenities
                        </Link>
                        <Link href="#experiences" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                            Experiences
                        </Link>
                        <Link href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                            Contact
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link href="#home" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="#accommodations" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Accommodations
                            </Link>
                            <Link href="#amenities" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Amenities
                            </Link>
                            <Link href="#experiences" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Experiences
                            </Link>
                            <Link href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Contact
                            </Link>
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium text-center"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-center"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium text-center"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}