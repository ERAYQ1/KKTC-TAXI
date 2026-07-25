import { createTaxi } from "@/app/admin/actions";
import { TaxiForm } from "../../taxi-form";

export default function NewTaxiPage() {
  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">Yeni taksi ekle</h1>
      <TaxiForm action={createTaxi} submitLabel="Taksiyi kaydet" />
    </div>
  );
}
