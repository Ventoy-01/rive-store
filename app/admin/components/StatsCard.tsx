import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    change?: number;
    color: 'primary' | 'green' | 'purple' | 'blue' | 'orange';
}

const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
};

export default function StatsCard({
                                      title,
                                      value,
                                      icon: Icon,
                                      change,
                                      color,
                                  }: StatsCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <div className={`p-2 rounded-xl ${colorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-800">{value}</span>
                {change !== undefined && (
                    <span
                        className={`text-sm font-medium flex items-center gap-1 ${
                            change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
                )}
            </div>
        </div>
    );
}