import { SocialItem, SocialPlatform } from "@/lib/data/types";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaEnvelope,
  FaGlobe,
  FaPenNib,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIAL_PLATFORM_ORDER: SocialPlatform[] = [
  "WHATSAPP",
  "EMAIL",
  "BLOG",
  "WEB",
  "INSTAGRAM",
  "FACEBOOK",
  "X",
  "TIKTOK",
];

const SOCIAL_PLATFORM_INDEX: Record<SocialPlatform, number> =
  SOCIAL_PLATFORM_ORDER.reduce(
    (acc, platform, index) => {
      acc[platform] = index;
      return acc;
    },
    {} as Record<SocialPlatform, number>,
  );

const ICONS: Record<SocialPlatform, React.ComponentType<{ size?: number }>> = {
  WHATSAPP: FaWhatsapp,
  EMAIL: FaEnvelope,
  BLOG: FaPenNib,
  WEB: FaGlobe,
  INSTAGRAM: FaInstagram,
  FACEBOOK: FaFacebookF,
  X: FaXTwitter,
  TIKTOK: FaTiktok,
};

export function SocialLinks({
  title,
  items,
}: {
  title: string;
  items: SocialItem[];
}) {
  // 🔒 Seguridad + performance:
  // solo renderizamos links con href real
  const validItems = items
    .filter((i) => i.href && i.href.trim().length > 0)
    .sort((a, b) => {
      const aIndex = SOCIAL_PLATFORM_INDEX[a.platform] ?? 999;
      const bIndex = SOCIAL_PLATFORM_INDEX[b.platform] ?? 999;
      return aIndex - bIndex;
    });

  if (!validItems.length) return null;

  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-5xl">
          {title}
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {validItems.map((i, key) => {
            const Icon = ICONS[i.platform];

            return (
              <a
                key={`${i.platform}-${i.value}-${key}`}
                href={i.href}
                target="_blank"
                rel="noreferrer"
                className="surface-card flex items-center gap-4 rounded-3xl p-4 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b8914c_0%,#d8b26c_100%)] text-white">
                  <Icon size={17} />
                </span>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent1">
                    {i.platform}
                  </p>
                  <span className="mt-1 block text-sm text-secondary">
                    {i.value}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
