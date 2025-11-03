import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/stores/taskStore";
import type {
  CreateTaskData,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskData,
} from "@/types";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskDialog({ open, onClose, task }: TaskDialogProps) {
  const { createTask, updateTask, isLoading } = useTaskStore();
  const [formData, setFormData] = useState<CreateTaskData | UpdateTaskData>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open && task) {
      let normalizedPriority: TaskPriority = "medium";
      if (task.priority) {
        const trimmed = task.priority.trim().toLowerCase();
        if (["low", "medium", "high"].includes(trimmed)) {
          normalizedPriority = trimmed as TaskPriority;
        }
      }

      let normalizedStatus: TaskStatus = "pending";
      if (task.status) {
        const trimmedStatus = task.status.trim().toLowerCase();
        if (["pending", "in-progress", "completed"].includes(trimmedStatus)) {
          normalizedStatus = trimmedStatus as TaskStatus;
        }
      }

      setFormData({
        title: task.title,
        description: task.description || "",
        priority: normalizedPriority,
        status: normalizedStatus,
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      });
    } else if (open && !task) {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
      });
    }
  }, [open, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (task) {
        const updateData: UpdateTaskData = {
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date
            ? new Date(formData.due_date + "T00:00:00").toISOString()
            : undefined,
        };

        await updateTask(task.id, updateData);
        toast.success("Task updated successfully");
      } else {
        if (!formData.title || formData.title.trim() === "") {
          alert("Title is required.");
          return;
        }

        const createData: CreateTaskData = {
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status || "pending",
          priority: formData.priority || "medium",
          due_date: formData.due_date
            ? new Date(formData.due_date + "T00:00:00").toISOString()
            : undefined,
        };

        await createTask(createData);
        toast.success("Task created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 flex-1">
          <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={isLoading}
                placeholder="Enter task title"
                className="mt-2 border border-gray-300"
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isLoading}
                placeholder="Enter task description"
                className="mt-2 border border-gray-300"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "pending"}
                  onValueChange={(value: TaskStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full border border-gray-300 mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority || "medium"}
                  onValueChange={(value: TaskPriority) =>
                    setFormData({ ...formData, priority: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full border border-gray-300 mt-2">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                disabled={isLoading}
                className="border border-gray-300 mt-2"
              />
            </div>
          </form>
        </div>

        <div className="flex gap-3 p-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border border-gray-600 cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-form"
            disabled={isLoading}
            className="flex-1 cursor-pointer"
          >
            {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </div>
    </div>
  );
}
