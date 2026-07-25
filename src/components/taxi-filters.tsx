import Form from "next/form";
import Link from "next/link";
import { ClockIcon, SearchIcon } from "@/components/icons";
import { REGIONS, type Region } from "@/lib/taxi";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

type Props = {
  q: string;
  region?: Region;
  only24_7: boolean;
};

function hrefWith(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/?${qs}` : "/";
}

const chip =
  "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors";
const chipOn = "border-brand-strong bg-brand-strong text-white";
const chipOff =
  "border-border bg-surface text-foreground hover:border-brand-strong hover:text-brand-strong";

export async function TaxiFilters({ q, region, only24_7 }: Props) {
  const only = only24_7 ? "1" : undefined;
  const lang = await getLang();

  return (
    <section aria-label="Taksi arama ve filtreleme" className="space-y-4">
      <Form action="/" className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t(lang, "searchPlaceholder")}
            aria-label={t(lang, "searchPlaceholder")}
            className="h-12 w-full rounded-lg border border-border bg-surface pr-3 pl-10 text-base placeholder:text-muted-foreground"
          />
        </div>
        {region && <input type="hidden" name="region" value={region} />}
        {only24_7 && <input type="hidden" name="only" value="1" />}
        <button
          type="submit"
          className="h-12 shrink-0 rounded-lg bg-foreground px-5 font-semibold text-background transition-opacity hover:opacity-90"
        >
          {t(lang, "searchButton")}
        </button>
      </Form>

      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <ul className="flex w-max gap-2">
          <li>
            <Link
              href={hrefWith({ q, only })}
              aria-current={!region ? "true" : undefined}
              className={`${chip} ${!region ? chipOn : chipOff}`}
            >
              {t(lang, "filterAll")}
            </Link>
          </li>
          {REGIONS.map((r) => (
            <li key={r.value}>
              <Link
                href={hrefWith({ q, region: r.value, only })}
                aria-current={region === r.value ? "true" : undefined}
                className={`${chip} ${region === r.value ? chipOn : chipOff}`}
              >
                {r.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={hrefWith({
                q,
                region,
                only: only24_7 ? undefined : "1",
              })}
              aria-current={only24_7 ? "true" : undefined}
              className={`${chip} gap-1.5 ${only24_7 ? chipOn : chipOff}`}
            >
              <ClockIcon className="size-4" />
              7/24
              <span className="sr-only">
                {only24_7 ? " filtresi açık" : " filtresi uygula"}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
