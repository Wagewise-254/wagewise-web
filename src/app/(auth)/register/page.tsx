'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'owner', // Assign default role
            banned: false,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        // Redirect directly since email confirmation is disabled
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'azure') => {
    setError('');
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Create an Account</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </div>
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
        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full cursor-pointer bg-[#5F30E5] hover:bg-[#8D6BEE]"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or Register with</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <Button
          onClick={() => handleSocialLogin('google')}
          className="flex-1 border cursor-pointer border-gray-300 bg-white text-black hover:bg-gray-100 flex items-center justify-center"
          disabled={loading}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Google_icon_2025.png"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </Button>
        <Button
          onClick={() => handleSocialLogin('azure')}
          className="flex-1 cursor-not-allowed border border-gray-300 bg-white text-black hover:bg-gray-100 flex items-center justify-center"
          //disabled={loading}
          disabled={true} // Temporarily disabled for Azure login
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
        Already have an account?{' '}
        <Link href="/login" className="text-purple-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
