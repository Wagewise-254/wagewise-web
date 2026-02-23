"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { sendWelcomeEmail } from "@/lib/email";

export async function getWorkspacesOverview() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("workspaces")
    .select(`
      id,
      name,
      status,
      created_at,

      workspace_users!inner(
        full_names,
        email,
        role
      ),

      companies(
        id,
        business_name,
        logo_url,
        status
      )
    `)
    .eq("workspace_users.role", "OWNER")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data
}

export async function createWorkspace(formData: {
  workspaceName: string
  ownerEmail: string
  ownerName: string
}) {
  const supabase = await createSupabaseServerClient()
  const supabaseAdmin = await createSupabaseAdmin()
  
  const tempPassword = `${formData.workspaceName.replace(/\s+/g, '')}@${new Date().getFullYear()}`

  // 1. Create User in Auth (Admin bypasses confirmation)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.ownerEmail,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: formData.ownerName }
  })

  if (authError) throw new Error(`Auth Error: ${authError.message}`)

  // 2. Create Workspace
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({
      name: formData.workspaceName,
      owner_user_id: authUser.user.id,
      status: "ACTIVE",
      email: formData.ownerEmail
    })
    .select()
    .single()

  if (wsError) throw new Error(`Workspace Error: ${wsError.message}`)

  // 3. Link User to Workspace as OWNER
  const { error: linkError } = await supabase
    .from("workspace_users")
    .insert({
      workspace_id: workspace.id,
      user_id: authUser.user.id,
      role: "OWNER",
      full_names: formData.ownerName,
      email: formData.ownerEmail
    })

  if (linkError) throw new Error(`Linking Error: ${linkError.message}`)

  revalidatePath("/dashboard")
  return { 
    success: true, 
    credentials: { email: formData.ownerEmail, password: tempPassword } 
  }
}

export async function sendClientCredentialsEmail(data: {
  email: string;
  ownerName: string;
  workspaceName: string;
  password: string;
}) {
  try {
    await sendWelcomeEmail({
      to: data.email,
      ownerName: data.ownerName,
      workspaceName: data.workspaceName,
      credentials: {
        email: data.email,
        password: data.password,
      }
    });
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to send email");
    } else {
      throw new Error("Failed to send email");
    }
  }
}

export async function updateWorkspaceStatus(id: string, status: 'ACTIVE' | 'SUSPENDED') {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("workspaces")
    .update({ status })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
}

// Action to update workspace details
export async function updateWorkspace(id: string, data: {
  workspaceName: string;
  ownerName: string;
  ownerEmail: string;
}) {
  const supabase = await createSupabaseServerClient();

  // Update workspace name
  const { error: wsError } = await supabase
    .from("workspaces")
    .update({ name: data.workspaceName })
    .eq("id", id);

  if (wsError) throw new Error(wsError.message);

  // Update workspace user details (Owner)
  const { error: userError } = await supabase
    .from("workspace_users")
    .update({ 
      full_names: data.ownerName,
      email: data.ownerEmail 
    })
    .eq("workspace_id", id)
    .eq("role", "OWNER");

  if (userError) throw new Error(userError.message);

  revalidatePath("/dashboard");
  return { success: true };
}

// Action specifically for changing company status
export async function updateCompanyStatus(companyId: string, status: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("companies")
    .update({ status })
    .eq("id", companyId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  return { success: true };
}
