import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminTopbar from "@/components/dashboard/Topbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // get platform role
  const { data: platformUser } = await supabase
    .from("platform_users")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!platformUser || platformUser.role !== "SUPER_ADMIN") {
    redirect("/login")
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Admin"

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7]">
      <AdminTopbar fullName={fullName} email={user.email!} />

      <main className="flex-1 overflow-auto p-6 bg-white
      ">
        {children}
      </main>
    </div>
  )
}
