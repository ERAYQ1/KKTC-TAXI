"use client";

import { useCallback, useSyncExternalStore } from "react";
import { StarIcon, StarOutlineIcon } from "@/components/icons";
import { isFavorite, onFavoritesChange, toggleFavorite } from "@/lib/favorites";

type Props = {
  taxiId: string;
  addLabel: string;
  removeLabel: string;
  className?: string;
};

function getServerSnapshot() {
  return false;
}

export function FavoriteButton({
  taxiId,
  addLabel,
  removeLabel,
  className,
}: Props) {
  const subscribe = useCallback(
    (callback: () => void) => onFavoritesChange(callback),
    [],
  );
  const getSnapshot = useCallback(() => isFavorite(taxiId), [taxiId]);
  // Server snapshot is always `false`; the real value syncs in on the
  // client's first paint after hydration, avoiding a markup mismatch.
  const favorite = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? removeLabel : addLabel}
      onClick={(event) => {
        event.preventDefault();
        toggleFavorite(taxiId);
      }}
      className={className}
    >
      {favorite ? (
        <StarIcon className="size-5 text-brand-strong" />
      ) : (
        <StarOutlineIcon className="size-5" />
      )}
    </button>
  );
}
