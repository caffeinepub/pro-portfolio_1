import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type { Priority, Task } from "../types/task";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    dueDate?: string;
  }) => void;
  editTask?: Task | null;
}

export function TaskModal({
  open,
  onClose,
  onSubmit,
  editTask,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(editTask?.title ?? "");
      setDescription(editTask?.description ?? "");
      setPriority(editTask?.priority ?? "medium");
      setDueDate(editTask?.dueDate ?? "");
      setTitleError("");
    }
  }, [open, editTask]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError("Title is required.");
      return;
    }
    onSubmit({ title, description, priority, dueDate: dueDate || undefined });
    onClose();
  }

  const isEditing = !!editTask;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-[480px]"
        data-ocid={isEditing ? "task.edit.dialog" : "task.add.dialog"}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
              data-ocid="task.input"
              className={titleError ? "border-destructive" : ""}
              autoFocus
            />
            {titleError && (
              <p
                className="text-xs text-destructive"
                data-ocid="task.title.error_state"
              >
                {titleError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="task-desc"
              placeholder="Optional description…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="task.textarea"
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger id="task-priority" data-ocid="task.select">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due-date" className="text-sm font-medium">
                Due Date
              </Label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                data-ocid="task.due_date.input"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="task.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:opacity-90"
              data-ocid={isEditing ? "task.save_button" : "task.submit_button"}
            >
              {isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
