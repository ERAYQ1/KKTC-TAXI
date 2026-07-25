import type { Metadata } from "next";
import { ConfirmButton } from "../confirm-button";
import { approveReview, deleteReview } from "@/app/admin/reviews-actions";
import { StarIcon } from "@/components/icons";
import { getAllReviews } from "@/lib/reviews";
import { getAllTaxis } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Yorumlar",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  const [reviews, taxis] = await Promise.all([getAllReviews(), getAllTaxis()]);
  const taxiNames = new Map(taxis.map((t) => [t.id, t.name]));

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">Yorumlar</h1>
      <p className="text-sm text-muted-foreground">
        {pending.length} bekleyen / {reviews.length} toplam
      </p>

      <section className="mt-6">
        <h2 className="font-display text-base font-semibold">Onay bekleyen</h2>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Bekleyen yorum yok.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {review.author_name}{" "}
                      <span className="text-muted-foreground">
                        · {taxiNames.get(review.taxi_id) ?? "Silinmiş taksi"}
                      </span>
                    </p>
                    <p className="inline-flex items-center gap-1 text-sm text-brand-strong">
                      <StarIcon className="size-3.5" />
                      {review.rating}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={approveReview.bind(null, review.id, review.taxi_id)}>
                      <button
                        type="submit"
                        className="h-9 rounded-lg border border-whatsapp/40 px-3 text-sm font-medium text-whatsapp transition-colors hover:bg-whatsapp/10"
                      >
                        Onayla
                      </button>
                    </form>
                    <form action={deleteReview.bind(null, review.id, review.taxi_id)}>
                      <ConfirmButton
                        confirmMessage="Bu yorum kalıcı olarak silinsin mi?"
                        className="h-9 rounded-lg border border-destructive/40 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        Sil
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold">Onaylı</h2>
        {approved.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Onaylı yorum yok.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {approved.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {review.author_name}{" "}
                      <span className="text-muted-foreground">
                        · {taxiNames.get(review.taxi_id) ?? "Silinmiş taksi"}
                      </span>
                    </p>
                    <p className="inline-flex items-center gap-1 text-sm text-brand-strong">
                      <StarIcon className="size-3.5" />
                      {review.rating}
                    </p>
                  </div>
                  <form action={deleteReview.bind(null, review.id, review.taxi_id)}>
                    <ConfirmButton
                      confirmMessage="Bu yorum kalıcı olarak silinsin mi?"
                      className="h-9 rounded-lg border border-destructive/40 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Sil
                    </ConfirmButton>
                  </form>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
