import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';
import login from '@/routes/login';
import Select from 'react-select';
import countryList from 'country-list';
import { Eye, EyeOff } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        username: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        country: 'Philippines',
        date_of_birth: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength validation
    const passwordValidation = useMemo(() => {
        const password = data.password;
        return {
            minLength: password.length >= 8,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[@$!%*?&#]/.test(password),
        };
    }, [data.password]);

    const countries = useMemo(() => {
        const allCountries = countryList.getData().map(country => {
            // Clean up country names for better readability
            let displayName = country.name;
            
            // Remove "the" prefix for cleaner display
            displayName = displayName.replace(/^the\s+/i, '');
            
            // Make Korea names more descriptive
            if (displayName === "Korea (Democratic People's Republic of)") {
                displayName = "North Korea";
            } else if (displayName === "Korea (Republic of)") {
                displayName = "South Korea";
            }
            
            // Simplify other complex names
            displayName = displayName
                .replace("United States of America", "United States")
                .replace("United Kingdom of Great Britain and Northern Ireland", "United Kingdom")
                .replace("Russian Federation", "Russia")
                .replace("Iran (Islamic Republic of)", "Iran")
                .replace("Syrian Arab Republic", "Syria")
                .replace("Venezuela (Bolivarian Republic of)", "Venezuela")
                .replace("Viet Nam", "Vietnam")
                .replace("Bolivia (Plurinational State of)", "Bolivia")
                .replace("Tanzania, United Republic of", "Tanzania")
                .replace("Moldova (Republic of)", "Moldova")
                .replace("Macedonia (the former Yugoslav Republic of)", "North Macedonia")
                .replace("Lao People's Democratic Republic", "Laos")
                .replace("Congo (Democratic Republic of the)", "Democratic Republic of Congo")
                .replace("Congo", "Republic of Congo")
                .replace("Palestine, State of", "Palestine")
                .replace("Virgin Islands (British)", "British Virgin Islands")
                .replace("Virgin Islands (U.S.)", "U.S. Virgin Islands");
            
            return {
                value: country.name, // Keep original for backend
                label: displayName,
            };
        });
        
        // Sort alphabetically by display name
        return allCountries.sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const selectedCountry = useMemo(() => {
        return countries.find(c => c.value === data.country) || { value: 'Philippines', label: 'Philippines' };
    }, [data.country, countries]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(store(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

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
                                Begin Your Paradise Journey
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Create your account and unlock exclusive access to the most luxurious beachfront resort experience.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-percent text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Special Welcome Offer</h3>
                                        <p className="text-gray-600">Get 15% off your first booking as a new member</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-calendar-check text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Easy Booking</h3>
                                        <p className="text-gray-600">Reserve your perfect getaway in just a few clicks</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="600">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="bi bi-star-fill text-orange-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Loyalty Rewards</h3>
                                        <p className="text-gray-600">Earn points on every stay and enjoy exclusive perks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Registration Form */}
                        <div 
                            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                                <p className="text-gray-600">Join Paradise Resort today</p>
                            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            value={data.full_name}
                            className={`rounded-lg border transition-all bg-white text-gray-900 ${
                                errors.full_name 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                            }`}
                            style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                            autoComplete="name"
                            autoFocus
                            placeholder="Juan Dela Cruz"
                            onChange={(e) => setData('full_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.full_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                            Username <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            value={data.username}
                            className={`rounded-lg border transition-all bg-white text-gray-900 ${
                                errors.username 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                            }`}
                            style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                            autoComplete="username"
                            placeholder="juandelacruz"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                        <InputError message={errors.username} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`rounded-lg border transition-all bg-white text-gray-900 ${
                            errors.email 
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        }`}
                        style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                        autoComplete="email"
                        placeholder="you@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone_number" className="text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        value={data.phone_number}
                        className={`rounded-lg border transition-all bg-white text-gray-900 ${
                            errors.phone_number 
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        }`}
                        style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                        autoComplete="tel"
                        placeholder="+63 912 345 6789"
                        onChange={(e) => setData('phone_number', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone_number} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                        Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="address"
                        type="text"
                        name="address"
                        value={data.address}
                        className={`rounded-lg border transition-all bg-white text-gray-900 ${
                            errors.address 
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        }`}
                        style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                        autoComplete="street-address"
                        placeholder="Street, Barangay"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                            City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="city"
                            type="text"
                            name="city"
                            value={data.city}
                            className={`rounded-lg border transition-all bg-white text-gray-900 ${
                                errors.city 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                            }`}
                            style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                            autoComplete="address-level2"
                            placeholder="Manila"
                            onChange={(e) => setData('city', e.target.value)}
                            required
                        />
                        <InputError message={errors.city} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                            Country
                        </Label>
                        <Select
                            id="country"
                            name="country"
                            options={countries}
                            value={selectedCountry}
                            onChange={(option) => setData('country', option?.value || '')}
                            placeholder="Select your country"
                            isSearchable={true}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '48px',
                                    borderRadius: '0.5rem',
                                    borderWidth: '1px',
                                    borderColor: state.isFocused ? '#ea580c' : '#e5e7eb',
                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(234, 88, 12, 0.2)' : 'none',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: '#ea580c',
                                    },
                                }),
                                valueContainer: (base) => ({
                                    ...base,
                                    padding: '0.75rem 1rem',
                                }),
                                input: (base) => ({
                                    ...base,
                                    margin: '0',
                                    padding: '0',
                                    color: '#111827',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: '#9ca3af',
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: '#111827',
                                }),
                                indicatorsContainer: (base) => ({
                                    ...base,
                                }),
                                indicatorSeparator: (base) => ({
                                    ...base,
                                    display: 'none',
                                }),
                                dropdownIndicator: (base) => ({
                                    ...base,
                                    color: '#6b7280',
                                    padding: '8px',
                                    '&:hover': {
                                        color: '#ea580c',
                                    },
                                }),
                                menu: (base) => ({
                                    ...base,
                                    borderRadius: '0.5rem',
                                    marginTop: '0.25rem',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    overflow: 'hidden',
                                }),
                                menuList: (base) => ({
                                    ...base,
                                    padding: '0.5rem 0',
                                    maxHeight: '300px',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    padding: '0.75rem 1rem',
                                    backgroundColor: state.isSelected ? '#ea580c' : state.isFocused ? '#fed7aa' : 'white',
                                    color: state.isSelected ? 'white' : '#111827',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    '&:active': {
                                        backgroundColor: '#ea580c',
                                    },
                                }),
                            }}
                        />
                        <InputError message={errors.country} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="date_of_birth" className="text-sm font-semibold text-gray-700">
                        Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="date_of_birth"
                        type="date"
                        name="date_of_birth"
                        value={data.date_of_birth}
                        className={`rounded-lg border transition-all bg-white text-gray-900 ${
                            errors.date_of_birth 
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        }`}
                        style={{ minHeight: '48px', padding: '0.75rem 1rem' }}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setData('date_of_birth', e.target.value)}
                        required
                    />
                    <InputError message={errors.date_of_birth} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className={`rounded-lg border transition-all bg-white text-gray-900 ${
                                    errors.password 
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                }`}
                                style={{ minHeight: '48px', padding: '0.75rem 3rem 0.75rem 1rem' }}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700">
                            Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={`rounded-lg border transition-all bg-white text-gray-900 ${
                                    errors.password_confirmation 
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                }`}
                                style={{ minHeight: '48px', padding: '0.75rem 3rem 0.75rem 1rem' }}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                {data.password && (
                    <div className="mt-2 space-y-1 text-xs">
                        <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                            <span>{passwordValidation.minLength ? '✓' : '○'}</span>
                            <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                            <span>{passwordValidation.hasLowercase ? '✓' : '○'}</span>
                            <span>One lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                            <span>{passwordValidation.hasUppercase ? '✓' : '○'}</span>
                            <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                            <span>{passwordValidation.hasNumber ? '✓' : '○'}</span>
                            <span>One number</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                            <span>{passwordValidation.hasSpecial ? '✓' : '○'}</span>
                            <span>One special character (@$!%*?&#)</span>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    disabled={processing}
                >
                    {processing && <Spinner />}
                    {processing ? 'Creating Account...' : 'Create Account'}
                </Button>

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
                        href={login.store.url()}
                        className="inline-block w-full py-3 px-4 rounded-lg border-2 border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition-colors duration-300"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


