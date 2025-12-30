// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, []);

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <>
            <Head title="Email verification" />
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
                                Almost There!
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                We've sent a verification link to your email address. Please check your inbox to complete your registration.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-envelope-check text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Check Your Inbox</h3>
                                        <p className="text-gray-600">Look for an email from Paradise Resort</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-folder2-open text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Check Spam Folder</h3>
                                        <p className="text-gray-600">Sometimes emails end up in the spam folder</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="600">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-clock-history text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Link Expires Soon</h3>
                                        <p className="text-gray-600">Verify within 24 hours for security</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Verification Card */}
                        <div 
                            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        >
                            {/* Email Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                                    <i className="bi bi-envelope-paper text-orange-600 text-4xl"></i>
                                </div>
                            </div>

                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                                <p className="text-gray-600">
                                    Please verify your email address by clicking on the link we just emailed to you.
                                </p>
                            </div>

                            {status === 'verification-link-sent' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                                    <div className="flex items-center justify-center gap-2 text-green-700">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span className="font-medium">
                                            A new verification link has been sent to your email address.
                                        </span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleResend} className="space-y-6">
                                <Button 
                                    disabled={processing}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                >
                                    {processing && <Spinner />}
                                    {processing ? 'Sending...' : 'Resend Verification Email'}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white/80 text-gray-500">Or</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                    >
                                        <i className="bi bi-box-arrow-left"></i>
                                        Log out and try again
                                    </Link>
                                </div>

                                {/* Mobile-only info section */}
                                <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-3">
                                            <i className="bi bi-envelope-check text-orange-500"></i>
                                            <span>Check your inbox for the verification email</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <i className="bi bi-folder2-open text-orange-500"></i>
                                            <span>Don't forget to check your spam folder</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <i className="bi bi-clock-history text-orange-500"></i>
                                            <span>Link expires in 24 hours</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

