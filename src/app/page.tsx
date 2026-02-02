'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const SplashScreen = () => {
  const router = useRouter();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // Simulate a loading delay for the splash screen
    const splashTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 500); // Show spinner after 500ms

    // Redirect to the login page after a total of 2 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/download');
    }, 2000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#7F5EFD] text-white">
      <div className="flex flex-col items-center">
        {/* Placeholder for your logo */}
        <div className="relative h-24 w-24">
          <Image
            src="/icons/android-chrome-512x512.png" // Use your logo here
            alt="Wagewise Logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="animate-pulse"
          />
        </div>
        
      </div>
      {showSpinner && (
        <div className="mt-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-[#8D6BEE]"></div>
        </div>
      )}
      <p className="mt-6 text-xs opacity-50">v2.0.0</p>
    </div>
  );
};

export default SplashScreen;
