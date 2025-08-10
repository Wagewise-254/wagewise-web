'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';



export default function Sidebar() {
  const pathname = usePathname() || '/dashboard';

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Team', href: '/dashboard/team' },
    { label: 'Logs', href: '/dashboard/logs' },
    { label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">

      <nav className="px-2 py-6 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 rounded-md text-sm font-bold transition
                ${active ? 'bg-[#5F30E5] text-white shadow' : 'text-[#7F5AF0] hover:bg-purple-50'}`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
