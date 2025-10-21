import { type Task, type TaskState } from "../types";
// import { StateBadge } from "./StateBadge";
// import { DependencyIndicator } from "./DependencyIndicator";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  onStateChange: (taskId: string, newState: TaskState) => void;
  isActionable: boolean;
}

export function TaskCard({ task, allTasks, onStateChange, isActionable }: TaskCardProps) {
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
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* <DependencyIndicator task={task} allTasks={allTasks} />
          
          <StateBadge state={task.state} /> */}

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
                      {/* <StateBadge state={state} className="scale-90" /> */}
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
