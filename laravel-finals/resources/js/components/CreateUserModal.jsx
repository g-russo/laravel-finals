import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateUserModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        role: 'employee',
        username: '',
        email: '',
        password: '',
        avatar: null,
    });

    const [preview, setPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post('/users', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                onClose();
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-foreground">Create New User</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Avatar preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-border"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                                    {data.full_name ? (
                                        <span className="text-4xl font-bold text-muted-foreground">
                                            {getInitials(data.full_name)}
                                        </span>
                                    ) : (
                                        <User className="h-16 w-16 text-muted-foreground" />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Avatar
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <span className="text-xs text-muted-foreground mt-2">
                                Optional - JPG, JPEG, PNG or WebP (will be converted to WebP)
                            </span>
                        </div>
                        {errors.avatar && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.avatar}</p>
                        )}
                    </div>

                    {/* Full Name - Required */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                                errors.full_name 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-border focus:ring-primary'
                            }`}
                            placeholder="John Doe"
                        />
                        {errors.full_name && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.full_name}</p>
                        )}
                    </div>

                    {/* Email - Required */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                                errors.email 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-border focus:ring-primary'
                            }`}
                            placeholder="john.doe@example.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Role - Radio Buttons */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Role
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="admin"
                                    checked={data.role === 'admin'}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Admin</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="employee"
                                    checked={data.role === 'employee'}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Employee</span>
                            </label>
                        </div>
                        {errors.role && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.role}</p>
                        )}
                    </div>

                    {/* Username - Optional */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Username <span className="text-xs text-muted-foreground">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                                errors.username 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-border focus:ring-primary'
                            }`}
                            placeholder={data.full_name ? data.full_name.toLowerCase().replace(/\s+/g, '') : 'johndoe'}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            If left empty, will use full name without spaces (lowercase)
                        </p>
                        {errors.username && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Password - Optional */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Password <span className="text-xs text-muted-foreground">(Optional)</span>
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                                errors.password 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-border focus:ring-primary'
                            }`}
                            placeholder="Enter user password"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Default password will be set if left empty.
                        </p>
                        {errors.password && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {processing ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
