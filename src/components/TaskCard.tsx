import { type Task, type TaskState } from "../types";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Circle, Lock, Pencil, GitBranch } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  onStateChange: (taskId: string, newState: TaskState) => void;
  isActionable: boolean;
}

interface StateBadgeProps {
  state: TaskState;
  className?: string;
}

const stateConfig: Record<TaskState, { label: string; color: string; dotColor: string }> = {
  todo: {
    label: "TO DO",
    color: "bg-state-todo/15 text-state-todo border-state-todo/20",
    dotColor: "fill-state-todo text-state-todo"
  },
  in_progress: {
    label: "IN PROGRESS",
    color: "bg-state-in-progress/15 text-state-in-progress border-state-in-progress/20",
    dotColor: "fill-state-in-progress text-state-in-progress"
  },
  done: {
    label: "DONE",
    color: "bg-state-done/15 text-state-done border-state-done/20",
    dotColor: "fill-state-done text-state-done"
  },
  blocked: {
    label: "BLOCKED",
    color: "bg-state-blocked/15 text-state-blocked border-state-blocked/20",
    dotColor: "fill-state-blocked text-state-blocked"
  },
};

const StateBadge = ({ state, className = "" }: StateBadgeProps) => {
  const config = stateConfig[state];

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${config.color} ${className}`}
      data-testid={`badge-state-${state}`}
    >
      <Circle className={`h-3 w-3 mr-1.5 ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
}

export const TaskCard = ({ task, allTasks, onStateChange, isActionable }: TaskCardProps) => {
  const availableStates: TaskState[] = isActionable
    ? ['todo', 'in_progress', 'done']
    : [];

  const isBlocked = task.state === 'blocked';

  const handleStateChange = (newState: string) => {
    if (isActionable) {
      onStateChange(task.id, newState as TaskState);
    }
  };

  const getBlockedReason = () => {
    const incompleteDeps = task.dependencies
      .map(depId => allTasks.find(t => t.id === depId))
      .filter(dep => dep && dep.state !== 'done');
    
    if (incompleteDeps.length === 0) return "";
    
    return `This task is blocked because the following dependencies are not complete: ${incompleteDeps.map(d => d?.title).join(", ")}`;
  };

  const getDependencyTask = (id: string): Task => {
    return allTasks.filter(task => task.id === id)[0]
  }

  return (
    <Card
      className={`px-4 py-3 border hover-elevate transition-all duration-150 ${
        isBlocked ? 'opacity-75' : ''
      }`}
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <h3
              className="text-[15px] font-medium leading-5 truncate"
              data-testid={`text-task-title-${task.id}`}
            >
              {task.title}
            </h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              ID: #{task.id.slice(0, 8)}
            </p>
            {task.dependencies.length > 0 && (
              <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
                <GitBranch className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  <span className="flex-shrink-0">Depends on:</span>
                  {task.dependencies.map(dep => (
                    <span
                      key={dep}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
                    >
                      {getDependencyTask(dep).title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* <DependencyIndicator task={task} allTasks={allTasks} /> */}
          
          <StateBadge state={task.state} />

          {isBlocked ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  disabled
                  data-testid={`button-locked-${task.id}`}
                >
                  <Lock className="h-4 w-4 text-state-blocked" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="max-w-xs"
                data-testid={`tooltip-blocked-${task.id}`}
              >
                <p className="text-xs">{getBlockedReason()}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Select
              value={task.state}
              onValueChange={handleStateChange}
              disabled={!isActionable}
            >
              <SelectTrigger
                className="h-9 w-9 p-0 border-0 bg-transparent hover-elevate"
                data-testid={`select-state-${task.id}`}
              >
                <Pencil className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                {availableStates.map(state => (
                  <SelectItem
                    key={state}
                    value={state}
                    data-testid={`option-state-${state}-${task.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <StateBadge state={state} className="scale-90" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </Card>
  );
}
