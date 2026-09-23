"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses, inputErrorClasses } from "@/components/ui/FormField";
import {
  timesheetSchema,
  type TimesheetFormInput,
  type TimesheetFormValues,
} from "@/lib/validations/timesheet";
import { PROJECTS } from "@/lib/projects";
import type { TimesheetEntry, TimesheetInput } from "@/types/timesheet";

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TimesheetInput) => Promise<void>;
  weekStart: string;
  weekEnd: string;
  /** Entry being edited, or null when adding a new one. */
  entry: TimesheetEntry | null;
}

const EMPTY_VALUES: TimesheetFormInput = {
  date: "",
  project: PROJECTS[0],
  task: "",
  description: "",
  hours: 1,
  status: "INCOMPLETE",
};

export function TimesheetModal({
  isOpen,
  onClose,
  onSubmit,
  weekStart,
  weekEnd,
  entry,
}: TimesheetModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TimesheetFormInput, unknown, TimesheetFormValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: EMPTY_VALUES,
  });

  // Re-seed the form whenever the modal opens for a different entry.
  useEffect(() => {
    if (!isOpen) return;
    reset(
      entry
        ? {
            date: entry.date,
            project: entry.project,
            task: entry.task,
            description: entry.description,
            hours: entry.hours,
            status: entry.status,
          }
        : { ...EMPTY_VALUES, date: weekStart }
    );
  }, [isOpen, entry, weekStart, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, description: values.description ?? "" });
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry ? "Edit Entry" : "Add Entry"}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormField label="Date" htmlFor="date" error={errors.date?.message}>
          <input
            id="date"
            type="date"
            min={weekStart}
            max={weekEnd}
            className={clsx(inputClasses, errors.date && inputErrorClasses)}
            {...register("date")}
          />
        </FormField>

        <FormField label="Project" htmlFor="project" error={errors.project?.message}>
          <select
            id="project"
            className={clsx(inputClasses, errors.project && inputErrorClasses)}
            {...register("project")}
          >
            {PROJECTS.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Task" htmlFor="task" error={errors.task?.message}>
          <input
            id="task"
            type="text"
            placeholder="e.g. Homepage layout"
            className={clsx(inputClasses, errors.task && inputErrorClasses)}
            {...register("task")}
          />
        </FormField>

        <FormField
          label="Description (optional)"
          htmlFor="description"
          error={errors.description?.message}
        >
          <textarea
            id="description"
            rows={3}
            placeholder="Any extra notes about this entry"
            className={clsx(inputClasses, errors.description && inputErrorClasses)}
            {...register("description")}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Hours" htmlFor="hours" error={errors.hours?.message}>
            <input
              id="hours"
              type="number"
              step={0.5}
              min={0.5}
              max={24}
              className={clsx(inputClasses, errors.hours && inputErrorClasses)}
              {...register("hours")}
            />
          </FormField>

          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <select
              id="status"
              className={clsx(inputClasses, errors.status && inputErrorClasses)}
              {...register("status")}
            >
              <option value="COMPLETED">Completed</option>
              <option value="INCOMPLETE">Incomplete</option>
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {entry ? "Save changes" : "Add entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
