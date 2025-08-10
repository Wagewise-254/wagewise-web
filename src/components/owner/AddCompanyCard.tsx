'use client';

import { Plus } from 'lucide-react';

export default function AddCompanyCard({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm p-5 hover:shadow-md transition cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-[#5F30E5] flex items-center justify-center text-white">
        <Plus size={20} />
      </div>
      <div className="font-medium text-[#5F30E5]">Add company</div>
    </div>
  );
}
