interface AmenityStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: string;
  colorClass: 'blue' | 'green' | 'yellow';
}

export function AmenityStatsCard({ title, value, description, icon, colorClass }: AmenityStatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100',
      text: 'text-blue-600',
      gradient: 'from-blue-50'
    },
    green: {
      bg: 'from-green-50 to-green-100',
      text: 'text-green-600',
      gradient: 'from-green-50'
    },
    yellow: {
      bg: 'from-yellow-50 to-yellow-100',
      text: 'text-yellow-600',
      gradient: 'from-yellow-50'
    }
  };

  const colors = colorClasses[colorClass];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
          <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
            <i className={`bi ${icon} ${colors.text} text-2xl`}></i>
          </div>
        </div>
      </div>
      <div className={`bg-gradient-to-r ${colors.gradient} to-transparent h-1 rounded-b-2xl`}></div>
    </div>
  );
}

