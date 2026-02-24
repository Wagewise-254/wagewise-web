"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import { BorderFloatingField } from "../common/custom-fields";
import {
  createWorkspace,
  sendClientCredentialsEmail,
} from "@/app/dashboard/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Mail,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  workspaceName: z.string().min(3, "Workspace name is required"),
  ownerEmail: z.string().email("Valid email required"),
  ownerName: z.string().min(2, "Owner name is required"),
});

type FormData = z.infer<typeof schema>;

interface CreateWorkspaceResult {
  success: boolean;
  credentials: {
    email: string;
    password: string;
  };
  formData: {
    // Add this
    workspaceName: string;
    ownerEmail: string;
    ownerName: string;
  };
}

export default function OnboardClientDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<CreateWorkspaceResult | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspaceName: "",
      ownerEmail: "",
      ownerName: "",
    },
  });

  const handleManualEmailSend = async () => {
    if (!result) return;

    setEmailSending(true);
    try {
      //console.log(result)
      //const formData = watch(); // Get current form values for name and workspace
      await sendClientCredentialsEmail({
        email: result.credentials.email,
        password: result.credentials.password,
         ownerName: result.formData.ownerName,
        workspaceName: result.formData.workspaceName,
      });
      toast.success("Welcome email sent successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to send email");
      } else {
        toast.error("Failed to send email");
      }
    } finally {
      setEmailSending(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await createWorkspace(data);
      setResult({
        ...res,
        formData: data, // Store the original form data
      });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
    reset();
  };

  if (result) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl mb-2">
              Workspace Created!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              The workspace is ready. Here are the login credentials:
            </DialogDescription>
          </div>

          <div className="mt-4 space-y-4 bg-slate-50 p-4 rounded-lg border">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">
                EMAIL ADDRESS
              </label>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <code className="text-sm font-mono">
                  {result.credentials.email}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(result.credentials.email);
                    toast.success("Email copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">
                TEMPORARY PASSWORD
              </label>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <code className="text-sm font-mono">
                  {showPassword ? result.credentials.password : "••••••••••••"}
                </code>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        result.credentials.password,
                      );
                      toast.success("Password copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              variant="outline"
              className="w-full border-[#7F5EFD] text-[#7F5EFD] hover:bg-blue-50"
              onClick={handleManualEmailSend}
              disabled={emailSending}
            >
              {emailSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Credentials via Email
                </>
              )}
            </Button>
            <Button
              className="w-full bg-[#7F5EFD]"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7F5EFD] rounded-sm text-white shadow-lg cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Onboard Client
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl ">Onboard New Client</DialogTitle>
          <DialogDescription>
            Create a new workspace and set up the client as the owner.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <BorderFloatingField
            label="Workspace Name"
            {...register("workspaceName")}
            value={watch("workspaceName")}
            error={errors.workspaceName?.message}
            required
          />

          <BorderFloatingField
            label="Owner Full Name"
            {...register("ownerName")}
            value={watch("ownerName")}
            error={errors.ownerName?.message}
            required
          />

          <BorderFloatingField
            label="Owner Email"
            type="email"
            {...register("ownerEmail")}
            value={watch("ownerEmail")}
            error={errors.ownerEmail?.message}
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-[#1F3A8A] hover:bg-[#1F3A8A]/90 h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Creating Workspace...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
