import { type Task, type TaskState } from '@/types';

/**
 * Core dependency resolution engine
 * Implements recursive propagation and automatic state transitions
 */

export class TaskClass {
  private tasks: Map<string, Task>;
  private dependents: Map<string, Set<string>>; // task -> tasks that depend on it

  constructor(tasks: Task[]) {
    this.tasks = new Map(tasks.map(t => [t.id, { ...t }]));
    this.dependents = new Map();
    this.buildDependencyGraph();
  }

  /**
   * Build reverse dependency graph for efficient propagation
   */
  private buildDependencyGraph(): void {
    this.dependents.clear();
    
    for (const task of this.tasks.values()) {
      for (const depId of task.dependencies) {
        if (!this.dependents.has(depId)) {
          this.dependents.set(depId, new Set());
        }
        this.dependents.get(depId)!.add(task.id);
      }
    }
  }

  /**
   * Check if a task is actionable (all dependencies are done)
   */
  private isActionable(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    return task.dependencies.every(depId => {
      const dep = this.tasks.get(depId);
      return dep?.state === 'done';
    });
  }

  /**
   * Update task state with recursive propagation
   */
  updateTaskState(taskId: string, newState: TaskState): Task[] {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Users cannot directly set blocked state
    if (newState === 'blocked') {
      throw new Error('Cannot manually set task to blocked state');
    }

    // Check if task is actionable before allowing state change
    if (!this.isActionable(taskId) && task.state === 'blocked') {
      throw new Error('Cannot change state of blocked task');
    }

    task.state = newState;

    this.propagateChanges([taskId]);

    return Array.from(this.tasks.values());
  }

  /**
   * Recursively propagate state changes through dependent tasks
   */
  private propagateChanges(changedTaskIds: string[]): void {
    const queue = [...changedTaskIds];
    const processed = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      if (processed.has(currentId)) continue;
      processed.add(currentId);

      const dependentIds = this.dependents.get(currentId);
      if (!dependentIds) continue;

      for (const dependentId of dependentIds) {
        const dependent = this.tasks.get(dependentId);
        if (!dependent) continue;

        const wasActionable = dependent.state !== 'blocked';
        const isNowActionable = this.isActionable(dependentId);

        if (!isNowActionable && wasActionable) {
          dependent.state = 'blocked';
          queue.push(dependentId);
        }
        else if (isNowActionable && dependent.state === 'blocked') {
          dependent.state = 'todo';
          queue.push(dependentId);
        }
        else if (wasActionable && isNowActionable) {
          queue.push(dependentId);
        }
      }
    }
  }

  /**
   * Get current state of all tasks
   */
  getTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Recompute all task states based on dependencies
   */
  recomputeStates(): Task[] {
    // First pass: mark tasks as blocked if dependencies aren't met
    for (const task of this.tasks.values()) {
      if (!this.isActionable(task.id) && task.state !== 'blocked') {
        task.state = 'blocked';
      } else if (this.isActionable(task.id) && task.state === 'blocked') {
        task.state = 'todo';
      }
    }

    return this.getTasks();
  }
}