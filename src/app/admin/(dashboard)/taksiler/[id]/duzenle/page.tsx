import { notFound } from "next/navigation";
import { updateTaxi } from "@/app/admin/actions";
import { TaxiForm } from "../../../taxi-form";
import { getTaxiById } from "@/lib/queries";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export default async function EditTaxiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [taxi, lang] = await Promise.all([getTaxiById(id), getLang()]);

  if (!taxi) notFound();

  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">
        {taxi.name} {t(lang, "adminEditTaxiSuffix")}
      </h1>
      <TaxiForm
        action={updateTaxi}
        taxi={taxi}
        submitLabel={t(lang, "adminSaveChanges")}
        lang={lang}
      />
    </div>
  );
}
