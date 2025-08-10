'use client';

import Image from 'next/image';
import ProfileMenu from '../profile/ProfileMenu';

export default function Topbar() {
  return (
    <header className="h-16 bg-[#7F5EFD] border-b border-gray-200 flex items-center justify-between px-6 z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/icons/android-chrome-512x512.png"
          alt="Logo"
          width={32}
          height={32}
          priority
        />
        <span className="font-semibold  text-white text-lg">Dashboard</span>
      </div>

      {/* Profile menu aligned right */}
      <ProfileMenu />
    </header>
  );
}
