'use client';

import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  name: string;
  industry?: string;
  status?: 'active' | 'pending' | 'inactive';
  onClick?: () => void;
  onMenuClick?: () => void;
}

export default function CompanyCard({
  name,
  industry,
  status = 'active',
  onClick,
  onMenuClick
}: CompanyCardProps) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-500',
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition cursor-pointer relative"
      onClick={onClick}
    >
      {/* More menu button */}
      <button
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick?.();
        }}
      >
        <MoreHorizontal size={18} />
      </button>

      <div className="font-semibold text-lg mb-1">{name}</div>
      {industry && <div className="text-sm text-gray-500 mb-3">{industry}</div>}

      <span
        className={cn(
          'text-xs font-medium px-2 py-1 rounded-full',
          statusColors[status]
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}
