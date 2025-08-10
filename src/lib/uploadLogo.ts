// lib/uploadLogo.ts
import { supabase } from "@/lib/supabase/client";

export async function uploadCompanyLogo(file: File, ownerId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${ownerId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error, data } = await supabase.storage
    .from("company-logos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("company-logos")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
