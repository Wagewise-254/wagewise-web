"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BorderFloatingField } from "../common/custom-fields" 
import { updateWorkspace } from "@/app/dashboard/actions" // You'll need to create this action
import { toast } from "sonner"

const schema = z.object({
  workspaceName: z.string().min(2, "Workspace name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Invalid email address"),
})

type FormData = z.infer<typeof schema>

interface EditWorkspaceDialogProps {
  workspace: {
    id: string
    name: string
    ownerName?: string
    ownerEmail?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditWorkspaceDialog({ workspace, open, onOpenChange }: EditWorkspaceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspaceName: workspace.name,
      ownerName: workspace.ownerName || "",
      ownerEmail: workspace.ownerEmail || "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Logic to update the workspace via Server Action
      await updateWorkspace(workspace.id, data)
      toast.success("Workspace updated successfully")
      onOpenChange(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to update workspace")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{workspace.name}&quot;.
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}