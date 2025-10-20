import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
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
            <Head title="Log in" />
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
                                Welcome Back to Luxury
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Log in to your Paradise Resort account and continue your journey to the most exclusive beachfront destination in the region.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-shield-check text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Secure Access</h3>
                                        <p className="text-gray-600">Your account is protected with enterprise-grade security</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-gift text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Exclusive Offers</h3>
                                        <p className="text-gray-600">Access special promotions and member-only rates</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="600">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-star text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">VIP Rewards</h3>
                                        <p className="text-gray-600">Earn points on every booking and redeem amazing benefits</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div 
                            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                                <p className="text-gray-600">Access your Paradise Resort account</p>
                            </div>

<Form
  {...store.form()}
  resetOnSuccess={['password']}
  className="flex flex-col gap-6"
>
  {({ processing, errors }) => (
    <>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="you@example.com"
            className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder:text-gray-500 caret-orange-600"
          />
          <InputError message={errors.email} />
        </div>

        <div className="grid gap-2">
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder:text-gray-500 caret-orange-600"
          />
          <InputError message={errors.password} />
        </div>

        <label className="flex items-center gap-2">
          <Checkbox id="remember" name="remember" />
          <span className="text-sm text-gray-700">Remember me</span>
        </label>
      </div>

      <Button type="submit" disabled={processing} className="w-full">
        {processing ? 'Signing in…' : 'Sign in'}
      </Button>

      {status && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center text-sm font-medium text-green-700">
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
