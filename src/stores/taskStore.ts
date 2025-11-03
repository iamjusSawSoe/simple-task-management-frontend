import { taskApi } from "@/services/api";
import type {
  CreateTaskData,
  Task,
  TaskFilters,
  UpdateTaskData,
} from "@/types";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTask: (id: number) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const tasks = await taskApi.getTasks({
        status: filters.status,
        priority: filters.priority,
      });

      // Apply search filter on client side
      let filteredTasks = tasks;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower)
        );
      }

      set({ tasks: filteredTasks, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch tasks";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskApi.getTask(id);
      set({ currentTask: task, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch task";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await taskApi.createTask(data);
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create task";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await taskApi.updateTask(id, data);
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update task";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await taskApi.deleteTask(id);
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete task";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchTasks();
  },

  clearError: () => set({ error: null }),
}));
