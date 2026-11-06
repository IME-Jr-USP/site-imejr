import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { ActivityStory } from "@/data/initiatives";

// Set media.src in src/data/initiatives.ts to replace a reserved image.
export default function ActivityMedia({ media, className = "", wide = false }: { media: ActivityStory["media"]; className?: string; wide?: boolean }) {
  return (
    <figure className={className}>
      <div className={`${media.src ? "" : "activity-media"} relative ${wide ? "aspect-video" : "aspect-[4/3]"} overflow-hidden bg-[#1A1A1A]`}>
        {media.src ? (
          <Image src={media.src} alt={media.alt} fill sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div role="img" aria-label={media.alt} className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A0A0A0]">Atividades / IME Jr</span>
            <div aria-hidden="true" className="activity-media-symbol text-[clamp(3rem,10vw,7rem)] leading-none text-[#777777] self-center">
              {media.motif === "statistics" ? "∑" : media.motif === "code" ? "{ }" : "a + b"}
            </div>
            <span className="flex items-center gap-2 text-xs text-[#A0A0A0]"><ImageIcon size={14} aria-hidden="true" /> Imagem em breve</span>
          </div>
        )}
      </div>
    </figure>
  );
}
