"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
};

export function ConfirmButton({ children, confirmMessage, className }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}

export function SubmitButton({
  children,
  className,
  pendingLabel,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}
