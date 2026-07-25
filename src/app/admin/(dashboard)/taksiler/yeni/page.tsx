import { createTaxi } from "@/app/admin/actions";
import { TaxiForm } from "../../taxi-form";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export default async function NewTaxiPage() {
  const lang = await getLang();
  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">{t(lang, "adminNewTaxiHeading")}</h1>
      <TaxiForm action={createTaxi} submitLabel={t(lang, "adminSaveTaxi")} lang={lang} />
    </div>
  );
}
