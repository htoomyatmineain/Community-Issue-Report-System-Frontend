import { toast } from "sonner";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Placeholder editorial content — swap for a CMS / campaigns endpoint when the
 * backend has one. `cta` is either "Join" (sign-up intent) or "Read more".
 */
const CAMPAIGNS = [
  {
    id: "clean-yangon",
    title: "Clean Yangon Weekend",
    body: "Neighbourhood clean-up teams are forming across townships this Saturday. Gloves and bags are provided at every meeting point.",
    cta: "Join",
  },
  {
    id: "streetlights",
    title: "Light Up Every Street",
    body: "The city is replacing 5,000 broken streetlights this quarter. See which wards are next and how your reports move them up the queue.",
    cta: "Read more",
  },
  {
    id: "monsoon-drains",
    title: "Monsoon Drain Check",
    body: "Before the heavy rains arrive, report blocked drains near you. Priority crews are on standby throughout the wet season.",
    cta: "Read more",
  },
];

export default function NewsCampaignsCarousel() {
  const { t } = useLanguage();

  function handleCta(cta) {
    toast(cta === "Join" ? t("You're on the list — we'll be in touch.") : t("Full story coming soon."));
  }

  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none px-5 pb-1">
      {CAMPAIGNS.map((campaign) => (
        <article
          key={campaign.id}
          className="flex w-[82%] shrink-0 snap-start flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <h3 className="font-display text-[15px] font-bold text-foreground">{campaign.title}</h3>
          <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">{campaign.body}</p>
          <button
            type="button"
            onClick={() => handleCta(campaign.cta)}
            className="mt-1 w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {campaign.cta === "Join" ? t("Join") : t("Read more")}
          </button>
        </article>
      ))}
    </div>
  );
}
