import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Register() {
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
            <Head title="Register" />
            {/* Bootstrap Icons CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden flex items-center justify-center py-12">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-300/30 to-amber-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-200/10 to-yellow-200/10 rounded-full blur-3xl"></div>
                    
                    {/* Floating shapes */}
                    <div className="absolute top-20 left-20 w-20 h-20 border-4 border-orange-300/20 rounded-lg rotate-45 animate-float"></div>
                    <div className="absolute bottom-32 right-32 w-16 h-16 border-4 border-yellow-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                        {/* Left Side - Branding & Info */}
                        <div 
                            className="hidden lg:flex flex-col justify-center"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                        >
                            <div className="mb-8">
                                <Link href="/" className="text-4xl font-bold text-orange-600">
                                    Paradise Resort
                                </Link>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Join Paradise Today
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Create your Paradise Resort account and unlock access to exclusive offers, personalized experiences, and unforgettable memories.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-percent text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Member Discounts</h3>
                                        <p className="text-gray-600">Enjoy up to 25% off on all bookings and services</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-bell text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Early Access</h3>
                                        <p className="text-gray-600">Be the first to know about new packages and events</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="600">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-heart text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Personalized Service</h3>
                                        <p className="text-gray-600">Tailored recommendations based on your preferences</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Register Form */}
                        <div 
                            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                                <p className="text-gray-600">Start your journey with Paradise Resort</p>
                            </div>

            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="John Doe"
                                    className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                Already have an account?
                            </p>
                            <Link 
                                href={login()}
                                className="inline-block w-full py-3 px-4 rounded-lg border-2 border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition-colors duration-300"
                                tabIndex={6}
                            >
                                Sign In
                            </Link>
                        </div>
                    </>
                )}
            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
