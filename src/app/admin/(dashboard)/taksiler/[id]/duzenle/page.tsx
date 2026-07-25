import { notFound } from "next/navigation";
import { updateTaxi } from "@/app/admin/actions";
import { TaxiForm } from "../../../taxi-form";
import { getTaxiById } from "@/lib/queries";

export default async function EditTaxiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taxi = await getTaxiById(id);

  if (!taxi) notFound();

  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">
        {taxi.name} — düzenle
      </h1>
      <TaxiForm
        action={updateTaxi}
        taxi={taxi}
        submitLabel="Değişiklikleri kaydet"
      />
    </div>
  );
}
