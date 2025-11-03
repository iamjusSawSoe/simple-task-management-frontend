import ConfirmLogoutDialog from "@/components/ConfirmLogoutDialog";
import TaskCard from "@/components/TaskCard";
import TaskCardSkeleton from "@/components/TaskCardSkeleton";
import TaskDialog from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResponsiveSkeletonCount } from "@/hooks/useResponsiveSkeletonCount";
import { useAuthStore } from "@/stores/authStore";
import { useTaskStore } from "@/stores/taskStore";
import type { Task, TaskPriority, TaskStatus } from "@/types";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { tasks, filters, isLoading, fetchTasks, setFilters, deleteTask } =
    useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const skeletonCount = useResponsiveSkeletonCount();

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const handleStatusFilter = (status: TaskStatus | "") => {
    setFilters({ ...filters, status: status || undefined });
  };

  const handlePriorityFilter = (priority: TaskPriority | "") => {
    setFilters({ ...filters, priority: priority || undefined });
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Task Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage your tasks efficiently
              </p>
            </div>
            <ConfirmLogoutDialog onConfirm={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stats - Sidebar on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:w-64 shrink-0">
            <Card className=" hover:border-blue-300">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </CardContent>
            </Card>
            <Card className=" hover:border-blue-300">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card className=" hover:border-blue-300">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </CardContent>
            </Card>
            <Card className=" hover:border-blue-300">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border border-gray-300"
                  />
                </div>

                {/* Status Select */}
                <Select
                  value={filters.status || "all"}
                  onValueChange={(val: TaskStatus | "all") =>
                    handleStatusFilter(val === "all" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-[180px] border border-gray-300 cursor-pointer">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Priority Select */}
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(val: TaskPriority | "all") =>
                    handlePriorityFilter(val === "all" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-[180px] border-gray-300 cursor-pointer">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300">
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleCreateTask} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </div>
            </div>

            {/* Task List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(skeletonCount)].map((_, i) => (
                  <TaskCardSkeleton key={i} />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">
                    No tasks found. Create your first task to get started!
                  </p>
                  <Button onClick={handleCreateTask} className="mt-16">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />
    </div>
  );
}
