"use client";

import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open (accessibility)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-2xl">
        {/* Icon */}
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ember/10">
          <FiAlertTriangle className="h-5 w-5 text-ember" />
        </div>

        <h2
          id="confirm-dialog-title"
          className="font-display text-lg font-semibold text-ink"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ash">{description}</p>

        <div className="mt-6 flex gap-3">
          <Button
            ref={cancelRef}
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <button
            className="flex flex-1 items-center justify-center rounded-full bg-ember px-6 py-2.5 text-sm font-medium text-ink transition-all hover:brightness-95 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
