// app/types/tasks.ts

/**
 * Payload for POST /api/tasks
 */
export interface CreateTaskPayload {
  category: "GARDENING" | "CLEANING" | "TUTORING";
  taskName: string;
  taskDescription: string;
  expectedStartDate: string; // ISO date string, e.g. "2025-06-15"
  expectedHours: number;
  hourlyRate: number;
  currency: "USD" | "AUD" | "SGD" | "INR";
}

/**
 * Response shape for POST /api/tasks (201)
 */
export type CreateTaskResponse = void;

/**
 * Represents a Task object as returned by your API endpoints
 */
export interface Task {
  id: number;
  category: string;
  taskName: string;
  taskDescription: string;
  expectedStartDate: string;
  expectedHours: number;
  hourlyRate: number;
  currency: string;
  // TODO: add other fields returned by GET endpoints (status, createdBy, etc.)
}

/**
 * Response shape for GET /api/tasks/open
 */
export interface GetOpenTasksResponse {
  tasks: Task[];
}

/**
 * Response shape for GET /api/tasks/user/posted
 */
export interface GetUserPostedTasksResponse {
  tasks: Task[];
}

/**
 * Response shape for GET /api/tasks/provider/accepted
 */
export interface GetProviderAcceptedTasksResponse {
  tasks: Task[];
}
