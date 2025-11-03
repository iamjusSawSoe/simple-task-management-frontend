"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteTaskDialogProps {
  taskId: number;
  taskTitle: string;
  onDelete: (id: number) => Promise<void> | void;
  className?: string;
}

export function DeleteTaskDialog({
  taskId,
  taskTitle,
  onDelete,
  className,
}: DeleteTaskDialogProps) {
  const handleDelete = async () => {
    try {
      await onDelete(taskId);
      toast.success(`"${taskTitle}" deleted successfully.`);
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={`flex-1 cursor-pointer ${className || ""}`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The task{" "}
            <span className="font-medium">“{taskTitle}”</span> will be
            permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
