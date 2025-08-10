'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (data?.user) {
        const meta: any = data.user.user_metadata || {};
        setUser({ email: data.user.email || '', name: meta.full_name || '' });
      } else {
        setUser(null);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully', {
        description: 'Redirecting you to login...',
      });

      router.push('/login');
    } catch (err: any) {
      toast.error('Logout failed', {
        description: err.message || 'Something went wrong.',
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const initial = (user?.name?.[0] || user?.email?.[0] || 'A').toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex items-center gap-3 rounded-full px-3 py-1 hover:bg-white/10 text-white"
      >
        <div className="hidden md:block text-white text-sm pr-2">{user?.name || ''}</div>
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-semibold text-white">
          {initial}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border z-50">
          <div className="px-4 py-3 border-b">
            <div className="font-medium text-sm">{user?.name || 'John Doe'}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email || 'example@email.com'}</div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/settings');
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50"
            >
              Account Settings
            </button>

            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              disabled={loggingOut}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
            >
              {loggingOut && <Loader2 className="h-4 w-4 animate-spin text-purple-600" />}
              {loggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
