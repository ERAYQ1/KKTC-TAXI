"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CarIcon, ClockIcon, MapPinIcon, StarIcon } from "@/components/icons";
import { FavoriteButton } from "@/components/favorite-button";
import { getFavoriteIds, onFavoritesChange } from "@/lib/favorites";
import { regionLabel, type Taxi } from "@/lib/taxi";

type Copy = {
  empty: string;
  favoriteAdd: string;
  favoriteRemove: string;
  featured: string;
  hours: string;
};

export function FavoritesList({ copy }: { copy: Copy }) {
  const [taxis, setTaxis] = useState<Taxi[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const ids = getFavoriteIds();
      if (ids.length === 0) {
        if (!cancelled) setTaxis([]);
        return;
      }
      const res = await fetch(`/api/favorites?ids=${ids.join(",")}`);
      const body = (await res.json()) as { taxis: Taxi[] };
      if (!cancelled) setTaxis(body.taxis);
    }

    load();
    const unsubscribe = onFavoritesChange(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (taxis === null) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (taxis.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-brand-soft px-6 py-14 text-center">
        <CarIcon className="mx-auto size-10 text-brand" />
        <p className="mt-4 text-sm text-muted-foreground">{copy.empty}</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {taxis.map((taxi) => (
        <li key={taxi.id} className="flex *:w-full">
          <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
            <div className="relative aspect-16/10 bg-brand-soft">
              {taxi.photo_url ? (
                <Image
                  src={taxi.photo_url}
                  alt={`${taxi.name} taksi aracı`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-brand">
                  <CarIcon className="size-10" />
                </div>
              )}
              <FavoriteButton
                taxiId={taxi.id}
                addLabel={copy.favoriteAdd}
                removeLabel={copy.favoriteRemove}
                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur"
              />
              {(taxi.featured || taxi.is_24_7) && (
                <ul className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {taxi.featured && (
                    <li className="inline-flex items-center gap-1 rounded-full bg-brand-strong px-2 py-1 text-xs font-semibold text-white">
                      <StarIcon className="size-3" />
                      {copy.featured}
                    </li>
                  )}
                  {taxi.is_24_7 && (
                    <li className="inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2 py-1 text-xs font-semibold text-background">
                      <ClockIcon className="size-3" />
                      {copy.hours}
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="font-display text-lg leading-tight font-semibold">
                <Link
                  href={`/taksi/${taxi.id}`}
                  className="rounded transition-colors hover:text-brand-strong"
                >
                  {taxi.name}
                </Link>
              </h3>
              <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPinIcon className="size-4 shrink-0" />
                {regionLabel(taxi.region)}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
