// app/[owner]/layout.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

//import type { Database } from '@/lib/database.types';
import OwnerLayout from '@/components/layout/OwnerLayout';

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Get Supabase client using sync cookies
const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();


  // If no session → redirect to login
  if (!session) {
    redirect('/login');
  }

  // Render the owner dashboard layout
  return (
      <OwnerLayout>{children}</OwnerLayout>

  );
}
