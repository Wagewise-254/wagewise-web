'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // The login was successful.
    // Instead of pushing a route, we refresh the router.
    // This will re-trigger the middleware, which will then handle
    // the role-based redirect to '/dashboard/owner' or elsewhere.
    router.refresh();

    // No need to set loading to false here, as the page will be navigating away.
  };

  const handleSocialLogin = async (provider: 'google' | 'azure') => {
    setLoading(true);
    setError('');

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>
      <form onSubmit={handleEmailLogin} className="space-y-4">
        {/* ... your input fields remain the same ... */}
         <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        
        <div className="flex justify-end text-sm">
          <Link href="/auth/forgot-password" className="text-purple-600 hover:underline">
            Forgot your password?
          </Link>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <Button
          type="submit"
          className="w-full cursor-pointer bg-[#5F30E5] hover:bg-[#8D6BEE]"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      {/* ... rest of your JSX remains the same ... */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or Login with</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button
          onClick={() => handleSocialLogin('google')}
          className="flex flex-1 cursor-pointer items-center justify-center border border-gray-300 bg-white text-black hover:bg-gray-100"
          disabled={loading}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </Button>
        <Button
          onClick={() => handleSocialLogin('azure')}
          className="flex flex-1 cursor-not-allowed items-center justify-center border border-gray-300 bg-white text-black hover:bg-gray-100"
          disabled={true} // Azure login remains disabled
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Microsoft
        </Button>
      </div>

      <p className="mt-6 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-purple-600 hover:underline">
          Register Now
        </Link>
      </p>
    </div>
  );
}