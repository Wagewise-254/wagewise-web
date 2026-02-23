'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string


  // Authenticate
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

 if (error || !data.user) {
    return { error: 'Invalid email or password' }
  }

  // 🔐 Check platform role
  const { data: platformUser } = await supabase
    .from('platform_users')
    .select('role')
    .eq('user_id', data.user.id)
    .single()

  if (!platformUser || platformUser.role !== 'SUPER_ADMIN') {
    await supabase.auth.signOut()
    return { error: 'Not authorized for admin access' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()

  redirect('/login')
}