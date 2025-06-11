
export interface Task {
  id: number;
  taskName: string;
  // TODO: add other properties returned by your /tasks endpoints (e.g. description, createdBy, etc.)
}

export interface GetOpenTasksResponse {
  tasks: Task[];
}


export interface GetUserPostedTasksResponse {
  tasks: Task[];
}


export interface GetProviderAcceptedTasksResponse {
  tasks: Task[];
}
