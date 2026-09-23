"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses, inputErrorClasses } from "@/components/ui/FormField";
import {
  timesheetSchema,
  type TimesheetFormInput,
  type TimesheetFormValues,
} from "@/lib/validations/timesheet";
import { PROJECTS } from "@/lib/projects";
import { TYPES_OF_WORK } from "@/lib/typesOfWork";
import type { TimesheetEntry, TimesheetInput } from "@/types/timesheet";

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TimesheetInput) => Promise<void>;
  /** Date the "+ Add new task" row was clicked from, prefilled into the form. */
  defaultDate: string;
  /** Entry being edited, or null when adding a new one. */
  entry: TimesheetEntry | null;
}

function emptyValues(date: string): TimesheetFormInput {
  return {
    date,
    // Left unset on purpose so the select shows the "Project Name"
    // placeholder rather than defaulting to the first project — zod
    // rejects "" via the PROJECTS enum check if it's never changed.
    project: "" as TimesheetFormInput["project"],
    typeOfWork: TYPES_OF_WORK[0],
    description: "",
    hours: 12,
  };
}

/** Filled "i" info bubble next to a label, matching the design's tooltip hint. */
function LabelHint({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 align-middle text-[10px] font-semibold text-white"
    >
      i
    </span>
  );
}

export function TimesheetModal({
  isOpen,
  onClose,
  onSubmit,
  defaultDate,
  entry,
}: TimesheetModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TimesheetFormInput, unknown, TimesheetFormValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: emptyValues(defaultDate),
  });

  // Re-seed the form whenever the modal opens for a different entry/date.
  useEffect(() => {
    if (!isOpen) return;
    reset(
      entry
        ? {
            date: entry.date,
            project: entry.project,
            typeOfWork: entry.typeOfWork,
            description: entry.description,
            hours: entry.hours,
          }
        : emptyValues(defaultDate)
    );
  }, [isOpen, entry, defaultDate, reset]);

  const hours = useWatch({ control, name: "hours" });
  const watchedProject = useWatch({ control, name: "project" });

  function adjustHours(delta: number) {
    const current = Number(hours) || 0;
    const next = Math.min(24, Math.max(0.5, current + delta));
    setValue("hours", next, { shouldValidate: true });
  }

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry ? "Edit Entry" : "Add New Entry"}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <input type="hidden" {...register("date")} />

        <FormField
          label={
            <>
              Select Project * <LabelHint text="The project this task belongs to" />
            </>
          }
          htmlFor="project"
          error={errors.project?.message}
        >
          <div className="relative">
            <select
              id="project"
              className={clsx(
                inputClasses,
                "appearance-none pr-8",
                !watchedProject && "text-gray-400",
                errors.project && inputErrorClasses
              )}
              {...register("project")}
            >
              <option value="" disabled>
                Project Name
              </option>
              {PROJECTS.map((project) => (
                <option key={project} value={project} className="text-gray-900">
                  {project}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </FormField>

        <FormField
          label={
            <>
              Type of Work * <LabelHint text="What kind of work this task involved" />
            </>
          }
          htmlFor="typeOfWork"
          error={errors.typeOfWork?.message}
        >
          <div className="relative">
            <select
              id="typeOfWork"
              className={clsx(
                inputClasses,
                "appearance-none pr-8",
                errors.typeOfWork && inputErrorClasses
              )}
              {...register("typeOfWork")}
            >
              {TYPES_OF_WORK.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </FormField>

        <FormField
          label="Task description *"
          htmlFor="description"
          error={errors.description?.message}
        >
          <textarea
            id="description"
            rows={7}
            placeholder="Write text here ..."
            className={clsx(inputClasses, errors.description && inputErrorClasses)}
            {...register("description")}
          />
          <p className="mt-1 text-xs text-gray-400">A note for extra info</p>
        </FormField>

        <FormField label="Hours *" htmlFor="hours" error={errors.hours?.message}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustHours(-0.5)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              aria-label="Decrease hours"
            >
              <Minus size={14} />
            </button>
            <input
              id="hours"
              type="number"
              step={0.5}
              min={0.5}
              max={24}
              className={clsx(
                inputClasses,
                "text-center",
                errors.hours && inputErrorClasses
              )}
              {...register("hours")}
            />
            <button
              type="button"
              onClick={() => adjustHours(0.5)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              aria-label="Increase hours"
            >
              <Plus size={14} />
            </button>
          </div>
        </FormField>

        <div className="flex justify-start gap-3 border-t border-gray-100 pt-4">
          <Button type="submit" isLoading={isSubmitting}>
            {entry ? "Save changes" : "Add entry"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
