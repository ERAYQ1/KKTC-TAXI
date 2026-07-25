import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { telHref, whatsappHref } from "@/lib/taxi";

type Props = {
  name: string;
  phone: string;
  whatsapp: string;
  /** `lg` is used on the detail page CTA bar. */
  size?: "md" | "lg";
};

export function ContactButtons({ name, phone, whatsapp, size = "md" }: Props) {
  const height = size === "lg" ? "h-14 text-base" : "h-11 text-sm";

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={telHref(phone)}
        aria-label={`${name} adlı taksiyi ara`}
        className={`${height} inline-flex items-center justify-center gap-2 rounded-lg bg-brand-strong px-4 font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-offset-4 active:brightness-95`}
      >
        <PhoneIcon className="size-[1.15em]" />
        Ara
      </a>
      <a
        href={whatsappHref(whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} ile WhatsApp üzerinden iletişime geç`}
        className={`${height} inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-offset-4 active:brightness-95`}
      >
        <WhatsAppIcon className="size-[1.2em]" />
        WhatsApp
      </a>
    </div>
  );
}
