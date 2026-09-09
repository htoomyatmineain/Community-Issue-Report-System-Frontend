import { useLanguage } from "@/app/providers/LanguageProvider";

const YCDC_URBAN_CLEAN =
  "https://www.myanmaritv.com/news/urban-clean-campaign-ycdc-carried-out-public-awareness-campaigns";

/**
 * Placeholder editorial content — swap for a CMS / campaigns endpoint when the
 * backend has one. `cta` is either "Join" (sign-up intent) or "Read more".
 * `image` is a full-bleed card background (poster art lives in public/assets).
 * `url` is the external article each card opens.
 */
const CAMPAIGNS = [
  {
    id: "clean-yangon",
    title: "Clean Yangon Weekend",
    body: "Neighbourhood clean-up teams are forming across townships this Saturday. Gloves and bags provided at every meeting point.",
    cta: "Join",
    image: "/assets/campaigns/clean-yangon.jpg",
    url: YCDC_URBAN_CLEAN,
  },
  {
    id: "streetlights",
    title: "Light Up Every Street",
    body: "The city is replacing 5,000 broken streetlights this quarter. See which wards are next and how your reports move them up the queue.",
    cta: "Read more",
    image: "/assets/campaigns/streetlights.jpg",
    url: YCDC_URBAN_CLEAN,
  },
  {
    id: "monsoon-drains",
    title: "Monsoon Drain Check",
    body: "Before the heavy rains arrive, report blocked drains near you. Priority crews are on standby throughout the wet season.",
    cta: "Read more",
    image: "/assets/campaigns/monsoon-drains.png",
    url: YCDC_URBAN_CLEAN,
  },
];

export default function NewsCampaignsCarousel() {
  const { t } = useLanguage();

  // Full-bleed strip (-mx-5): a small resting gap before the first card (pl-4),
  // edge-to-edge once you scroll. No scroll-snap so the leading gap isn't
  // snapped away.
  return (
    <div className="-mx-5 flex gap-3 overflow-x-auto scrollbar-none pb-1 pl-4 pr-5">
      {CAMPAIGNS.map((campaign) => (
        <a
          key={campaign.id}
          href={campaign.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-52 w-[82%] shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-border shadow-sm transition-transform active:scale-[0.98]"
        >
          <img
            src={campaign.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />

          <div className="relative flex flex-col gap-1.5 p-4">
            <h3 className="font-display text-[15px] font-bold text-white">{campaign.title}</h3>
            <p className="line-clamp-2 text-[12px] leading-relaxed text-white/85">{campaign.body}</p>
            <span className="mt-1 w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
              {campaign.cta === "Join" ? t("Join") : t("Read more")}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
