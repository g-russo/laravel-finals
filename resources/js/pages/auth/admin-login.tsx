import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Form, Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
    status?: string;
    error?: string;
}

export default function AdminLogin({ status, error }: AdminLoginProps) {
    const [showPassword, setShowPassword] = useState(false);

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
            <Head title="Admin Login" />
            {/* Bootstrap Icons CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center py-12">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-600/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-700/10 to-slate-600/10 rounded-full blur-3xl"></div>
                    
                    {/* Floating shapes */}
                    <div className="absolute top-20 left-20 w-20 h-20 border-4 border-orange-500/20 rounded-lg rotate-45 animate-float"></div>
                    <div className="absolute bottom-32 right-32 w-16 h-16 border-4 border-orange-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                        {/* Left Side - Admin Branding & Info */}
                        <div 
                            className="hidden lg:flex flex-col justify-center"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                        >
                            <div className="mb-8">
                                <Link href="/" className="text-4xl font-bold text-orange-500">
                                    Paradise Resort
                                </Link>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-shield-lock text-white text-xl"></i>
                                    </div>
                                    <span className="text-2xl font-semibold text-white">Admin Portal</span>
                                </div>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Staff & Admin Access
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Secure login for Paradise Resort administrators and employees. Manage bookings, accommodations, and resort operations.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
                                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-shield-check text-orange-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Enhanced Security</h3>
                                        <p className="text-gray-300">Multi-layer authentication for staff accounts</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-speedometer2 text-orange-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Full Dashboard Access</h3>
                                        <p className="text-gray-300">Manage all resort operations from one place</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="600">
                                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-people text-orange-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">User Management</h3>
                                        <p className="text-gray-300">Control access and permissions for all users</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-4 bg-orange-600/10 border border-orange-500/30 rounded-xl">
                                <p className="text-sm text-gray-300">
                                    <i className="bi bi-info-circle text-orange-500 mr-2"></i>
                                    <strong className="text-white">Note:</strong> This portal is for staff members only. 
                                    <Link href="/login" className="text-orange-400 hover:text-orange-300 ml-1 underline">
                                        Customer login here
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Admin Login Form */}
                        <div 
                            className="bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-10 border border-slate-700/50"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        >
                            <div className="mb-8">
                                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4">
                                    <i className="bi bi-person-lock text-white text-3xl"></i>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Staff Sign In</h2>
                                <p className="text-gray-400">Enter your credentials to access the admin portal</p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <i className="bi bi-exclamation-triangle-fill text-red-500"></i>
                                        <p className="text-red-400 font-medium">{error}</p>
                                    </div>
                                </div>
                            )}

                            <Form
                                action="/admin/login"
                                method="post"
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="text-sm font-semibold text-gray-300">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="admin@paradiseresort.com"
                                                    className="px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-900/50 text-white placeholder:text-gray-500"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="password" className="text-sm font-semibold text-gray-300">
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder="••••••••"
                                                        className="px-4 py-3 pr-12 rounded-lg border border-slate-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-900/50 text-white placeholder:text-gray-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="w-4 h-4 border-slate-600"
                                                />
                                                <Label htmlFor="remember" className="text-sm text-gray-300 font-normal cursor-pointer">
                                                    Keep me logged in
                                                </Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="admin-login-button"
                                            >
                                                {processing && <Spinner />}
                                                {processing ? 'Signing in...' : 'Sign In to Portal'}
                                            </Button>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <Link 
                                                href="/login"
                                                className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                                            >
                                                <i className="bi bi-arrow-left mr-2"></i>
                                                Back to Customer Login
                                            </Link>
                                        </div>

                                        {status && (
                                            <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-center text-sm font-medium text-green-400">
                                                {status}
                                            </div>
                                        )}
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

