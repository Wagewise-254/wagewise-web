'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AddCompanyForm from '@/components/forms/AddCompanyForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AddCompanyPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        toast.error('You must be logged in');
        router.push('/login');
        return;
      }
      setOwnerId(data.user.id);
      setLoading(false);
    }
    getUser();
  }, [router, supabase]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Add Company</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="border-[#7F5EFD] text-[#7F5EFD] hover:bg-[#7F5EFD] hover:text-white"
        >
          Cancel
        </Button>
      </div>
      {ownerId && <AddCompanyForm ownerId={ownerId} />}
    </div>
  );
}
