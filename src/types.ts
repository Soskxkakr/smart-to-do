// Task state enum
export const TASK_STATES = ['todo', 'in_progress', 'done', 'blocked'] as const;
export type TaskState = typeof TASK_STATES[number];

// Task interface
export interface Task {
  id: string;
  title: string;
  state: TaskState;
  dependencies: string[];
}
