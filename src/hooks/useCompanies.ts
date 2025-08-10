"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useCompanies(ownerId: string) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;

    async function loadCompanies() {
      setLoading(true);
      const { data, error } = await supabase
        .from("Company")
        .select("*")
        .eq("ownerId", ownerId)
        .order("created_at", { ascending: false });

      if (!error) setCompanies(data || []);
      setLoading(false);
    }

    loadCompanies();

    // Realtime subscription
    const channel = supabase
      .channel("company-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Company" },
        (payload) => {
          if (payload.new.ownerId === ownerId) {
            setCompanies((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { companies, loading };
}
