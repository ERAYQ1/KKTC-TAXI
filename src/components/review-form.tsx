"use client";

import { useActionState } from "react";
import { submitReview, type ReviewFormState } from "@/app/taksi/[id]/actions";

type Copy = {
  title: string;
  note: string;
  nameLabel: string;
  ratingLabel: string;
  commentLabel: string;
  submitLabel: string;
  submittedMessage: string;
};

const initialState: ReviewFormState = {};

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 h-11 text-base";

export function ReviewForm({ taxiId, copy }: { taxiId: string; copy: Copy }) {
  const action = submitReview.bind(null, taxiId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <p className="rounded-lg border border-whatsapp/30 bg-whatsapp/10 px-3 py-2 text-sm text-whatsapp">
        {copy.submittedMessage}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <h3 className="font-display text-base font-semibold">{copy.title}</h3>
      <p className="text-xs text-muted-foreground">{copy.note}</p>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="author_name" className="block text-sm font-medium">
          {copy.nameLabel}
        </label>
        <input
          id="author_name"
          name="author_name"
          required
          maxLength={60}
          aria-invalid={Boolean(errors.author_name)}
          className={field}
        />
        {errors.author_name && (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errors.author_name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium">
          {copy.ratingLabel}
        </label>
        <select
          id="rating"
          name="rating"
          required
          defaultValue="5"
          aria-invalid={Boolean(errors.rating)}
          className={field}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {errors.rating && (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errors.rating}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium">
          {copy.commentLabel}
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          maxLength={500}
          aria-invalid={Boolean(errors.comment)}
          className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-base"
        />
        {errors.comment && (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errors.comment}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-brand-strong px-5 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "…" : copy.submitLabel}
      </button>
    </form>
  );
}
