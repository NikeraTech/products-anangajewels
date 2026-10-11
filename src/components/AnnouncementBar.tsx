import { Sparkle } from "lucide-react";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  // Duplicated once so the CSS marquee can loop seamlessly at -50%.
  const items = [...messages, ...messages, ...messages, ...messages];
  return (
    <div className="overflow-hidden bg-emerald-950 py-2 text-[0.7rem] font-medium tracking-[0.2em] text-gold-200 uppercase">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]" aria-label={messages.join(". ")}>
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap" aria-hidden="true">
            {m}
            <Sparkle className="size-3 text-gold-400" />
          </span>
        ))}
      </div>
    </div>
  );
}
