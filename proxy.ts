import { NextResponse, NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

export default  async function middleware(req: NextRequest) {
  const { supabase, res } = createSupabaseMiddlewareClient(req)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const publicRoutes = ['/login', '/download']

  const isPublic = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isPublic) return res

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: platformUser } = await supabase
    .from('platform_users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!platformUser || platformUser.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/clients/:path*'],
}
