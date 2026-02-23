"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Mail,
  MoreVertical,
  MoreHorizontal,
  Shield,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  updateWorkspaceStatus,
  updateCompanyStatus,
} from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditWorkspaceDialog } from "./EditWorkspaceDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface WorkspaceUser {
  full_names: string | null;
  email: string;
  role: string;
}

export interface Company {
  id: string;
  business_name: string;
  logo_url: string | null;
  status: string;
}

export interface Workspace {
  id: string;
  name: string;
  status: string;
  created_at: string;
  workspace_users: WorkspaceUser[];
  companies: Company[];
}

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  SUSPENDED: "bg-red-100 text-red-700 border-red-200",
  APPROVED: "bg-blue-100 text-blue-700 border-blue-200",
  INACTIVE: "bg-gray-100 text-gray-700 border-gray-200",
};

interface CardActionsProps {
  workspace: Workspace;
  onEdit: () => void;
}

function CardActions({ workspace, onEdit }: CardActionsProps) {
  const router = useRouter();

  const handleStatusToggle = async () => {
    try {
      const newStatus = workspace.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      await updateWorkspaceStatus(workspace.id, newStatus);
      toast.success(`Workspace ${newStatus.toLowerCase()} successfully`);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update workspace status");
      }
    }
  };

  return (
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onEdit}>Edit Workspace</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleStatusToggle}
        className={
          workspace.status === "ACTIVE" ? "text-amber-600" : "text-green-600"
        }
      >
        {workspace.status === "ACTIVE"
          ? "Suspend Workspace"
          : "Activate Workspace"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function CompanyList({ companies }: { companies: Company[] }) {
  const [isOpen, setIsOpen] = useState(companies.length <= 3); // Auto-open if 3 or fewer companies
  const visibleCompanies = isOpen ? companies : companies.slice(0, 2);
  const hasMore = companies.length > 2;

  if (companies.length === 0) {
    return (
      <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-amber-700 font-medium">No companies onboarded</p>
            <p className="text-xs text-amber-600/70 mt-0.5">Add a company to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Companies</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {companies.length}
          </Badge>
        </div>
        
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-7 px-2 text-xs gap-1 hover:bg-slate-100"
          >
            {isOpen ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                View all ({companies.length}) <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {visibleCompanies.map((company, index) => (
          <CompanyRow key={company.id} company={company} index={index} />
        ))}
        
        {!isOpen && hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="w-full h-8 text-xs text-muted-foreground hover:text-foreground border border-dashed border-slate-200 hover:border-[#1F3A8A]/30"
          >
            <Plus className="h-3 w-3 mr-1" />
            Show {companies.length - 2} more companies
          </Button>
        )}
      </div>
    </div>
  );
}

function CompanyRow({ company, index }: { company: Company; index: number }) {
  const router = useRouter();

  return (
    <div 
      className="group/company relative bg-white rounded-lg border border-slate-200 p-3 hover:border-[#1F3A8A]/30 hover:shadow-sm transition-all"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Logo/Icon */}
        <div className="relative">
          {company.logo_url ? (
            <div className="relative h-8 w-8 rounded-md overflow-hidden border border-slate-200">
              <Image
                src={company.logo_url}
                alt={company.business_name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#1F3A8A]/10 to-[#2D4A9E]/10 flex items-center justify-center border border-slate-200">
              <Building2 className="h-4 w-4 text-[#1F3A8A]" />
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">
              {company.business_name}
            </p>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 h-4",
                statusColors[company.status as keyof typeof statusColors] || statusColors.PENDING
              )}
            >
              {company.status}
            </Badge>
          </div>
          
          {/* Quick actions row 
          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover/company:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-[#1F3A8A] hover:text-[#1F3A8A] hover:bg-[#1F3A8A]/5"
              onClick={() => {
                // Navigate to company details
                router.push(`/dashboard/companies/${company.id}`);
              }}
            >
              View Details
            </Button>
          </div>*/}
        </div>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover/company:opacity-100 transition-opacity hover:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["APPROVED", "PENDING", "SUSPENDED", "INACTIVE"].map((status) => (
              <DropdownMenuItem
                key={status}
                disabled={company.status === status}
                onClick={async () => {
                  try {
                    await updateCompanyStatus(company.id, status);
                    toast.success(`${company.business_name} set to ${status}`);
                    router.refresh();
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      toast.error(err.message);
                    } else {
                      toast.error("Failed to update company status");
                    }
                  }
                }}
                className={cn(
                  "text-xs",
                  company.status === status && "bg-slate-50 text-muted-foreground"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full mr-2",
                  status === "APPROVED" && "bg-green-500",
                  status === "PENDING" && "bg-amber-500",
                  status === "SUSPENDED" && "bg-red-500",
                  status === "INACTIVE" && "bg-gray-500",
                )} />
                Set to {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function WorkspaceCard({
  workspace,
  viewMode = "grid",
}: {
  workspace: Workspace;
  viewMode?: "grid" | "list";
}) {
  const owner = workspace.workspace_users?.[0];
  const company = workspace.companies?.[0];
  const companyCount = workspace.companies?.length || 0;
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (viewMode === "list") {
    return (
      <div className="rounded-md border border-slate-300 bg-white p-4 hover:shadow-md transition-all hover:border-[#1F3A8A]/20 hover:bg-slate-50/50">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-slate-200">
            <AvatarFallback className="bg-gradient-to-br from-[#1F3A8A] to-[#2D4A9E] text-white text-sm">
              {workspace.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">{workspace.name}</p>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  statusColors[workspace.status as keyof typeof statusColors],
                )}
              >
                {workspace.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {owner?.email}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {companyCount} {companyCount === 1 ? 'company' : 'companies'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <CardActions workspace={workspace} onEdit={() => setShowEditDialog(true)} />
            </DropdownMenu>
          </div>
        </div>

        {/* Show first 2 companies in list view if they exist */}
        {workspace.companies && workspace.companies.length > 0 && (
          <div className="mt-3 pl-14">
            <div className="flex flex-wrap gap-2">
              {workspace.companies.slice(0, 2).map(company => (
                <Badge 
                  key={company.id}
                  variant="outline"
                  className="bg-slate-50 text-xs gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  {company.business_name}
                </Badge>
              ))}
              {workspace.companies.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{workspace.companies.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="group rounded-md border border-slate-300 bg-white p-5 space-y-4 hover:shadow-lg transition-all hover:border-[#1F3A8A]/30 hover:ring-1 hover:ring-[#1F3A8A]/10 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-slate-100 group-hover:border-[#1F3A8A]/20 transition-colors shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-[#1F3A8A] to-[#2D4A9E] text-white text-lg font-semibold">
              {workspace.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-lg leading-tight truncate">
                  {workspace.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  Created{" "}
                  {formatDistanceToNow(new Date(workspace.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  statusColors[workspace.status as keyof typeof statusColors],
                )}
              >
                {workspace.status}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <CardActions workspace={workspace} onEdit={() => setShowEditDialog(true)} />
          </DropdownMenu>
        </div>

        {/* Owner Info */}
        {owner && (
          <div className="bg-slate-50/80 rounded-xl p-3 space-y-2 border border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-6 w-6 rounded-full bg-[#1F3A8A]/10 flex items-center justify-center">
                <Shield className="h-3 w-3 text-[#1F3A8A]" />
              </div>
              <span className="font-medium">Owner:</span>
              <span className="text-muted-foreground truncate">
                {owner.email}
              </span>
            </div>
            {owner.full_names && (
              <p className="text-xs text-muted-foreground pl-8">
                {owner.full_names}
              </p>
            )}
          </div>
        )}

        {/* Companies Section - Enhanced version */}
        <CompanyList companies={workspace.companies || []} />

        {/* Edit Dialog */}
        <EditWorkspaceDialog
          workspace={workspace}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      </div>
    </>
  );
}