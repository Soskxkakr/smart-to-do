import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type Task, type TaskState } from "../types";
import { TaskCard } from "@/components/TaskCard";
import { getTasks } from "@/api/client";

export default function Tasks() {
  const [selectedFilter, setSelectedFilter] = useState<TaskState | 'all'>('all');

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    queryFn: getTasks
  });

  const isTaskActionable = (task: Task, allTasks: Task[]): boolean => {
    if (task.dependencies.length === 0) return true;
    
    return task.dependencies.every(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask?.state === 'done';
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    return task.state === selectedFilter;
  });

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.state === 'todo').length,
    in_progress: tasks.filter(t => t.state === 'in_progress').length,
    done: tasks.filter(t => t.state === 'done').length,
    blocked: tasks.filter(t => t.state === 'blocked').length,
  };

  useEffect(() => {
    console.log(tasks);
  }, [tasks])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="heading-main">
              Smart To-Do
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Dependency-aware task management with automatic state propagation
            </p>
          </div>

          {isLoading ? (
            <div
              className="flex items-center justify-center py-16"
              data-testid="loading-tasks"
            >
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div
              className="text-center py-16"
              data-testid="empty-state"
            >
              <p className="text-muted-foreground text-sm">
                {selectedFilter === 'all'
                  ? 'No tasks yet. Tasks will appear here when created.'
                  : `No tasks with state "${selectedFilter}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-2" data-testid="task-list">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  allTasks={tasks}
                  onStateChange={() => {}}
                  isActionable={isTaskActionable(task, tasks)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
