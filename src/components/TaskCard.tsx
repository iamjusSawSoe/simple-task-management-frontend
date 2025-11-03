import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Task } from "@/types";
import { Calendar, Clock, Pencil } from "lucide-react";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 border-gray-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <Badge className={statusColors[task.status]}>
              {task.status.replace("-", " ")}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        {task.description && (
          <CardDescription className="line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2 text-sm text-gray-600">
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(task.due_date)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Created: {formatDateTime(task.created_at)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
          className="flex-1 border border-gray-600 cursor-pointer hover:bg-gray-200"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <DeleteTaskDialog
          taskId={task.id}
          taskTitle={task.title}
          onDelete={onDelete}
          className="flex-1"
        />
      </CardFooter>
    </Card>
  );
}
