interface UserAvatarProps {
  avatarPath?: string | null;
  fullName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
};

export function UserAvatar({ avatarPath, fullName, size = 'md', className = '' }: UserAvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return 'NA';
    const words = name.split(' ');
    return words
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClass = sizeClasses[size];

  // Handle initials-based avatars
  if (avatarPath?.startsWith('initials:')) {
    const initials = avatarPath.replace('initials:', '');
    return (
      <div className={`flex items-center justify-center rounded-full bg-blue-600 font-medium text-white ${sizeClass} ${className}`}>
        {initials}
      </div>
    );
  }

  // Handle image avatars
  if (avatarPath) {
    return (
      <img
        src={`/${avatarPath}`}
        alt={fullName}
        className={`rounded-full object-cover border-2 border-gray-200 ${sizeClass} ${className}`}
      />
    );
  }

  // Default: generate initials
  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-600 font-medium text-white ${sizeClass} ${className}`}>
      {getInitials(fullName)}
    </div>
  );
}

