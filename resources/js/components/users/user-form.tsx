import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { adminStyles } from '@/lib/admin-styles';
import { UserAvatar } from './user-avatar';

interface User {
    id: number;
    full_name: string;
    username?: string;
    email: string;
    role: 'admin' | 'employee' | 'customer';
    avatar_path?: string;
}

interface UserFormProps {
    mode: 'create' | 'edit';
    user?: User;
    data: {
        full_name: string;
        email: string;
        role: string;
        username: string;
        password: string;
        avatar: File | null;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    idPrefix?: string;
    centered?: boolean;
}

export function UserForm({
    mode,
    user,
    data,
    setData,
    errors,
    idPrefix = '',
    centered = true,
}: UserFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

    // Password validation
    const validatePassword = (password: string) => {
        return {
            minLength: password.length >= 8,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasDigit: /\d/.test(password),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        };
    };

    const passwordChecks = validatePassword(data.password);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('File selected:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getAvatarUrl = () => {
        if (imagePreview) return imagePreview;
        if (mode === 'edit' && user?.avatar_path) {
            if (user.avatar_path.startsWith('initials:')) return null;
            return `/${user.avatar_path}`;
        }
        return null;
    };

    const getAvatarInitials = () => {
        if (mode === 'edit' && user) {
            return user.avatar_path || `initials:${user.full_name}`;
        }
        return data.full_name ? `initials:${data.full_name}` : 'initials:NA';
    };

    // Generate username from full name in real-time
    const getGeneratedUsername = () => {
        if (!data.full_name) return '';
        return data.full_name.toLowerCase().replace(/\s+/g, '');
    };

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
                <Label className="text-sm font-medium mb-4">Avatar</Label>
                
                {/* Circle Preview - Centered */}
                <div className="relative mb-4 flex justify-center">
                    <label
                        htmlFor={`${idPrefix}avatar`}
                        className="cursor-pointer block"
                    >
                        {getAvatarUrl() ? (
                            <div className="relative group">
                                <img
                                    src={getAvatarUrl()!}
                                    alt={data.full_name || 'Avatar'}
                                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 hover:border-orange-500 transition-colors"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        ) : (
                            <UserAvatar
                                avatarPath={getAvatarInitials()}
                                fullName={data.full_name || 'New User'}
                                size="lg"
                                className="h-32 w-32 text-2xl cursor-pointer hover:ring-4 hover:ring-orange-500 transition-all"
                            />
                        )}
                    </label>
                </div>

                {/* Upload Input - Rectangle */}
                <div className="w-full max-w-md flex flex-col items-center">
                    <Input
                        id={`${idPrefix}avatar`}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className={`${adminStyles.input.base} ${errors.avatar ? 'border-red-500' : ''}`}
                    />
                    {errors.avatar && (
                        <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.avatar}</p>
                    )}
                    <p className={`mt-2 text-xs text-center ${adminStyles.text.muted}`}>
                        Click the circle or choose file to upload • JPG, JPEG, PNG, WebP
                    </p>
                </div>
            </div>

            {/* Full Name */}
            <div>
                <Label htmlFor={`${idPrefix}full_name`} className={adminStyles.input.label}>
                    Full Name {mode === 'create' && <span className={adminStyles.text.error}>*</span>}
                </Label>
                <Input
                    id={`${idPrefix}full_name`}
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    placeholder={mode === 'edit' ? 'Leave empty to keep current value' : 'Enter full name'}
                    className={`${adminStyles.input.base} ${errors.full_name ? 'border-red-500' : ''} mt-1`}
                />
                {errors.full_name && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>
                        {errors.full_name}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <Label htmlFor={`${idPrefix}email`} className={adminStyles.input.label}>
                    Email {mode === 'create' && <span className={adminStyles.text.error}>*</span>}
                </Label>
                <Input
                    id={`${idPrefix}email`}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder={mode === 'edit' ? 'Leave empty to keep current value' : 'example@gmail.com'}
                    className={`${adminStyles.input.base} ${errors.email ? 'border-red-500' : ''} mt-1`}
                />
                {errors.email && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.email}</p>
                )}
            </div>

            {/* Role - Radio Buttons */}
            <div>
                <Label className={adminStyles.input.label}>Role</Label>
                <div className="mt-3 flex gap-6">
                    <div className="flex items-center">
                        <input
                            id={`${idPrefix}role_employee`}
                            type="radio"
                            name={`${idPrefix}role`}
                            value="employee"
                            checked={data.role === 'employee'}
                            onChange={(e) => setData('role', e.target.value)}
                            className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label
                            htmlFor={`${idPrefix}role_employee`}
                            className="ml-3 block text-sm font-medium text-gray-700"
                        >
                            Employee
                            <span className="ml-2 text-xs text-gray-500">
                                (Standard access)
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id={`${idPrefix}role_admin`}
                            type="radio"
                            name={`${idPrefix}role`}
                            value="admin"
                            checked={data.role === 'admin'}
                            onChange={(e) => setData('role', e.target.value)}
                            className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label
                            htmlFor={`${idPrefix}role_admin`}
                            className="ml-3 block text-sm font-medium text-gray-700"
                        >
                            Admin
                            <span className="ml-2 text-xs text-gray-500">
                                (Full access)
                            </span>
                        </label>
                    </div>
                </div>
                {errors.role && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>{errors.role}</p>
                )}
            </div>

            {/* Username */}
            <div>
                <Label htmlFor={`${idPrefix}username`} className={adminStyles.input.label}>
                    Username (optional)
                </Label>
                <Input
                    id={`${idPrefix}username`}
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                    placeholder={mode === 'create' ? (getGeneratedUsername() || 'Auto-generated from full name') : 'Leave empty to keep current value'}
                    className={`${adminStyles.input.base} ${errors.username ? 'border-red-500' : ''} mt-1`}
                />
                {errors.username && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>
                        {errors.username}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="relative">
                <Label htmlFor={`${idPrefix}password`} className={adminStyles.input.label}>
                    {mode === 'create' ? 'Password (optional)' : 'New Password'}
                </Label>
                <div className="relative">
                    <Input
                        id={`${idPrefix}password`}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        onFocus={() => setShowPasswordTooltip(true)}
                        onBlur={() => setShowPasswordTooltip(false)}
                        placeholder={mode === 'create' ? 'Leave blank for auto-generated' : 'Leave empty to keep current password'}
                        className={`${adminStyles.input.base} ${errors.password ? 'border-red-500' : ''} mt-1`}
                    />
                    
                    {/* Password Requirements Tooltip */}
                    {showPasswordTooltip && data.password && (
                        <div className="absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                            <p className="text-sm font-semibold mb-2 text-gray-700">
                                Password Requirements:
                            </p>
                            <ul className="space-y-1 text-xs">
                                <li className={`flex items-center gap-2 ${passwordChecks.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span>{passwordChecks.minLength ? '✓' : '○'}</span>
                                    At least 8 characters
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span>{passwordChecks.hasLowercase ? '✓' : '○'}</span>
                                    One lowercase letter (a-z)
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span>{passwordChecks.hasUppercase ? '✓' : '○'}</span>
                                    One uppercase letter (A-Z)
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.hasDigit ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span>{passwordChecks.hasDigit ? '✓' : '○'}</span>
                                    One digit (0-9)
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span>{passwordChecks.hasSpecial ? '✓' : '○'}</span>
                                    One special character (!@#$%^&*)
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                {errors.password && (
                    <p className={`mt-1 text-sm ${adminStyles.text.error}`}>
                        {errors.password}
                    </p>
                )}
                <p className={`mt-1 text-xs ${adminStyles.text.muted}`}>
                    {mode === 'create' 
                        ? 'Auto-generated password if left blank' 
                        : 'Must be at least 8 characters with uppercase, lowercase, digit, and special character'}
                </p>
            </div>
        </div>
    );
}

