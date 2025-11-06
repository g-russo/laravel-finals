interface UserRoleBadgeProps {
  role: 'admin' | 'employee' | 'customer';
  className?: string;
}

const roleStyles = {
  admin: 'bg-purple-100 text-purple-800',
  employee: 'bg-blue-100 text-blue-800',
  customer: 'bg-green-100 text-green-800',
};

export function UserRoleBadge({ role, className = '' }: UserRoleBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleStyles[role]} ${className}`}>
      {role}
    </span>
  );
}

