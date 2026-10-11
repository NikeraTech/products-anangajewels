import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi Ananga Jewels, I have a question about your jewellery.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-30 hidden items-center gap-2 rounded-full bg-[#1fa855] p-3.5 text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.7)] transition-all duration-500 hover:pr-5 md:flex"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1fa855]/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="size-6" />
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-500 group-hover:max-w-40">
        Chat with us
      </span>
    </a>
  );
}
