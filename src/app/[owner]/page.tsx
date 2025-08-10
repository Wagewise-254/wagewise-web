'use client';

import { useRouter } from 'next/navigation';
import AddCompanyCard from '@/components/owner/AddCompanyCard';
import CompanyCard from '@/components/owner/CompanyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user & companies
  useEffect(() => {
    async function loadData() {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData?.user?.id;
      if (!id) return;

      setUserId(id);
      setLoading(true);

      const { data, error } = await supabase
        .from('company')
        .select('*')
        .eq('ownerid', id)
        .order('createdat', { ascending: false });

      if (!error) setCompanies(data || []);
      setLoading(false);
    }

    loadData();
  }, []);

  // Realtime subscription for new companies
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('company-inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'company' },
        (payload) => {
          if (payload.new.ownerid === userId) {
            setCompanies((prev) => [payload.new, ...prev]);
            toast.success(`New company "${payload.new.businessname}" added!`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const filteredCompanies = companies.filter((c) =>
    c.businessname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Button
          className="flex cursor-pointer items-center bg-[#7F5EFD] text-white hover:bg-[#5F30E5]" 
          onClick={() => router.push('/dashboard/add-company')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add company
        </Button>
      </div>

      {/* Companies grid */}
      {loading ? (
        <p>Loading companies...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AddCompanyCard onClick={() => router.push('/dashboard/add-company')} />

          {filteredCompanies.map((c) => (
            <CompanyCard
              key={c.id}
              name={c.businessName}
              industry={c.businessType}
              status={c.status as 'active' | 'pending'}
              onClick={() => router.push(`/dashboard/company/${c.id}`)}
              onMenuClick={() => alert(`Menu clicked for ${c.businessName}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
