import type {
  AuthResponse,
  CreateTaskData,
  LoginCredentials,
  RegisterData,
  Task,
  UpdateTaskData,
  User,
} from "@/types";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 error
    if (error.response?.status === 401) {
      // Get the request URL
      const requestUrl = error.config?.url || "";

      // Don't redirect if it's a login or register attempt
      const isAuthEndpoint =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register");

      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
};

export const taskApi = {
  getTasks: async (filters?: {
    status?: string;
    priority?: string;
  }): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status_filter", filters.status);
    if (filters?.priority) params.append("priority_filter", filters.priority);

    const response = await api.get<Task[]>("/tasks", { params });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post<Task>("/tasks", data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const cleanData: Partial<UpdateTaskData> = {};

    if (data.title !== undefined && data.title !== "") {
      cleanData.title = data.title;
    }
    if (data.description !== undefined) {
      cleanData.description = data.description;
    }
    if (data.status) {
      cleanData.status = data.status;
    }
    if (data.priority) {
      cleanData.priority = data.priority;
    }
    if (data.due_date !== undefined) {
      cleanData.due_date = data.due_date;
    }

    try {
      const response = await api.put<Task>(`/tasks/${id}`, cleanData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;
