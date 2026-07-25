export default async function TaxiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-10 text-center">
        <p className="text-foreground/60">
          Taksi detayı (id: {id}) yakında burada görünecek.
        </p>
      </div>
    </div>
  );
}
