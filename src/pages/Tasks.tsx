import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckSquare } from "lucide-react";
import { type Task, type TaskState } from "../types";
import { TaskCard } from "@/components/TaskCard";
import { getTasks, patchTask } from "@/api/client";
import { useToast } from "@/hooks/useToast";
import { TaskClass } from "@/class/Task";

export default function Tasks() {
  const [selectedFilter, setSelectedFilter] = useState<TaskState | 'all'>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    queryFn: getTasks
  });

  // Batch update mutation for handling multiple task updates
  const batchUpdateMutation = useMutation({
    mutationFn: async (updates: { id: string; task: Task }[]) => {
      const promises = updates.map(({ id, task }) => patchTask(id, task));
      return Promise.all(promises);
    },
    onSuccess: (results, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });

      if (variables.length > 1) {
        toast({
          title: "Batch update completed",
          description: `${variables.length} tasks updated successfully`,
        });
      } else if (variables.length === 1) {
        toast({
          title: "Task updated",
          description: `State changed successfully`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Batch update failed",
        description: "Some tasks failed to update",
        variant: "destructive",
      });
    }
  })

  const isTaskActionable = (task: Task, allTasks: Task[]): boolean => {
    if (task.dependencies.length === 0) return true;

    return task.dependencies.every(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask?.state === 'done';
    });
  };

  const updatedTasks = useMemo(() => {
    const model = new TaskClass(tasks)
    return model.getTasks();
  }, [tasks]);

  const filteredTasks = updatedTasks.filter(task => {
    if (selectedFilter === 'all') return true;
    return task.state === selectedFilter;
  });

  const taskCounts = {
    all: updatedTasks.length,
    todo: updatedTasks.filter(t => t.state === 'todo').length,
    in_progress: updatedTasks.filter(t => t.state === 'in_progress').length,
    done: updatedTasks.filter(t => t.state === 'done').length,
    blocked: updatedTasks.filter(t => t.state === 'blocked').length,
  };

  const handleStateChange = (taskId: string, newState: TaskState) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      const model = new TaskClass(tasks);
      const updatedTasks = model.updateTaskState(taskId, newState).map(t => ({ id: t.id, task: t }));
      batchUpdateMutation.mutate(updatedTasks);
    }
  };

  useEffect(() => {
    console.log(updatedTasks)
  }, [updatedTasks])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Smart To-Do List
              </h1>
            </div>
            <p className="text-muted-foreground">
              Dependency-aware task management with automatic state propagation
            </p>
          </div>

          {isLoading ? (
            <div
              className="flex items-center justify-center py-16"
            >
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-sm">
                {selectedFilter === 'all'
                  ? 'No tasks yet. Tasks will appear here when created.'
                  : `No tasks with state "${selectedFilter}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  allTasks={updatedTasks}
                  onStateChange={handleStateChange}
                  isActionable={isTaskActionable(task, updatedTasks)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
