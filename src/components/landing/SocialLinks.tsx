import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

const ICONS = {
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  tiktok: FaTiktok,
};

type SocialItem = {
  label: string;
  value: string;
  href: string;
  icon: string;
};

export function SocialLinks({
  title,
  items,
}: {
  title: string;
  items: SocialItem[];
}) {
  return (
    <section className="container-page container-narrow py-6">
      <h2 className="text-4xl font-semibold">{title}</h2>

      <div className="flex flex-col gap-2 md:flex-row md:gap-4 mt-8">
        {items.map((i) => {
          const Icon = ICONS[i.icon as keyof typeof ICONS];

          return (
            <a
              key={i.label}
              href={i.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent1 text-accent2">
                <Icon size={16} />
              </span>

              <div className="flex flex-col">
                {/* <span className="font-medium text-primary">{i.label}</span> */}
                <span className="text-sm text-secondary hover:underline">
                  {i.value}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
