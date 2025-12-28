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
  SOCIAL_PLATFORM_ORDER.reduce((acc, platform, index) => {
    acc[platform] = index;
    return acc;
  }, {} as Record<SocialPlatform, number>);

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

  console.log("Social links received:", validItems);

  return (
    <section className="container-page container-narrow py-6">
      <h2 className="text-4xl font-semibold">{title}</h2>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
        {validItems.map((i, key) => {
          const Icon = ICONS[i.platform];

          return (
            <a
              key={`${i.platform}-${i.value}-${key}`}
              href={i.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent1 text-accent2">
                <Icon size={16} />
              </span>

              <span className="text-sm text-secondary hover:underline">
                {i.value}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
