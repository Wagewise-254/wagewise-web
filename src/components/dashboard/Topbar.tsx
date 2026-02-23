"use client";

import { useTransition } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/login/actions";
import Image from "next/image";
//import Link from "next/link";
import { toast } from "sonner";

interface AdminTopbarProps {
  fullName: string;
  email: string;
}

export default function AdminTopbar({ fullName, email }: AdminTopbarProps) {
  const initial = fullName?.charAt(0).toUpperCase() || "A";
  const [isPending, startTransition] = useTransition();

  return (
    <header className="h-16 bg-[#7F5EFD] flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="relative h-8 w-8">
          <Image
            src="/icons/android-chrome-512x512.png"
            alt="WageDesk Logo"
            width={32}
            height={32}
          />
        </div>
        <div className="h-6 w-px bg-white/20 mx-2" />
        <h1 className="text-white/80 text-sm font-medium">Admin</h1>
      </div>

      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-white/10 hover:border-[#AF1E23] transition">
              <AvatarFallback className="bg-white text-[#30266D] font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
            <div className="h-px bg-border my-1" />
            <DropdownMenuItem
            disabled={isPending}
              className="text-red-600 focus:text-red-600"
              onClick={() => {
                toast.success("Logging out...");
                startTransition(() => logout());
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
