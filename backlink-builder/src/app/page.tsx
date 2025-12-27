"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

type CampaignTone = "warm" | "direct" | "data";

type Campaign = {
  domain: string;
  brand: string;
  targetKeyword: string;
  industry: string;
  location: string;
  audience: string;
  differentiator: string;
  tone: CampaignTone;
};

type ToneOption = {
  id: CampaignTone;
  label: string;
  subjectTemplate: (campaign: Campaign) => string;
  opener: (campaign: Campaign) => string;
  promise: string;
  followUp: string;
};

type OpportunityItem = {
  title: string;
  description: string;
  action: string;
  metric: string;
};

type OpportunityGroup = {
  title: string;
  description: string;
  items: OpportunityItem[];
};

type TimelinePhase = {
  title: string;
  weekRange: string;
  objective: string;
  tasks: string[];
  metric: string;
};

type AssetBlueprint = {
  title: string;
  hook: string;
  format: string;
  targets: string;
};

type QuickWin = {
  title: string;
  detail: string;
};

const DIRECTORY_BANK: Record<string, string[]> = {
  saas: ["G2", "Capterra", "GetApp", "Product Hunt"],
  agency: ["Clutch", "DesignRush", "Sortlist", "Agency Spotter"],
  ecommerce: ["Shopify Experts", "BigCommerce Partners", "eCommerce CEO Directory", "Store Leads"],
  health: ["Healthgrades", "Zocdoc", "Vitals", "Wellness.com"],
  finance: ["Investopedia Advisor Directory", "Wealthtender", "Financial Advisor IQ"],
  local: ["Google Business Profile", "Yelp", "Nextdoor", "Alignable"],
  sustainability: ["Eco-Business Directory", "Sustainable Brands", "GreenBiz Network"],
  default: ["Crunchbase", "BetaList", "AngelList", "Startup Stash"],
};

const PARTNERSHIP_BANK: Record<string, string[]> = {
  saas: ["SaaStr", "Software Stories Podcast", "RevOps Weekly", "ProductLed Alliance"],
  agency: ["Agency Collective", "Marketing Mill Podcast", "The Blueprint Stories", "Demand Gen Club"],
  ecommerce: ["eComCrew Podcast", "Shopify Masters", "Marketplace Pulse", "Retail Brew"],
  health: ["Digital Health Today", "Healthcare Weekly Podcast", "MedCity News", "HITMC"],
  finance: ["Fintech Brainfood", "Bank on It Podcast", "Modern CFO", "Financial Brand"],
  sustainability: ["Climate Tech VC", "My Climate Journey", "Sustainability Live", "Green Queen"],
  default: ["Industry trade pubs", "Top 10 niche newsletters", "Community roundups", "LinkedIn collaborative articles"],
};

const DIGITAL_PR_BANK: Record<string, string[]> = {
  saas: ["GrowthHackers", "Indie Hackers", "Dev.to", "HackerNoon"],
  agency: ["AdAge Contributor Network", "MarketingProfs", "Content Marketing Institute", "Moz Community"],
  ecommerce: ["Practical eCommerce", "Modern Retail", "Digital Commerce 360", "Retail Dive"],
  health: ["Healthcare IT News", "Patient Engagement HIT", "Wellness Magazine", "Healthline Resource Pages"],
  finance: ["Finextra", "Crowdfund Insider", "Payments Dive", "Forbes Finance Council"],
  sustainability: ["GreenBiz", "Sustainable Brands", "Earth911", "Renewable Energy World"],
  default: ["Help a Reporter Out", "Qwoted", "SourceBottle", "PressPlugs"],
};

const toneOptions: ToneOption[] = [
  {
    id: "warm",
    label: "Warm relationship builder",
    subjectTemplate: (campaign) =>
      `Loved your take on ${fallbackKeyword(campaign.targetKeyword)}`,
    opener: (campaign) =>
      `I'm ${campaign.brand ? `with ${campaign.brand}` : "leading a growth initiative"} and we just published a resource that lines up with the ${fallbackKeyword(
        campaign.targetKeyword,
      )} conversations you lead.`,
    promise: "Make their brand look sharp, contribute quotes, and share traffic data post-launch.",
    followUp: "Circle back in 5 days with a fresh asset angle or quick win you unlocked.",
  },
  {
    id: "direct",
    label: "Straight to the point",
    subjectTemplate: (campaign) =>
      `${fallbackKeyword(campaign.targetKeyword)} backlink collaboration`,
    opener: (campaign) =>
      `Reaching out with a clearly mapped backlink asset that plugs into your ${campaign.industry || "industry"} coverage.`,
    promise: "Provide pre-written copy, original data points, and a co-marketing CTA that benefits both sides.",
    followUp: "Nudge after 4 days with proof of traction or organic traffic uplift from similar partners.",
  },
  {
    id: "data",
    label: "Data-led & analytical",
    subjectTemplate: (campaign) =>
      `Data drop: ${titleCase(fallbackKeyword(campaign.targetKeyword))} benchmarks`,
    opener: (campaign) =>
      `We're aggregating ${campaign.audience || "category leaders"} benchmarks across ${campaign.industry || "the space"} and thought you'd appreciate an early look.`,
    promise: "Hand over raw dataset slices, an expert quote, and a tailored chart for their audience.",
    followUp: "Share a new supporting stat or chart every 7 days to remain useful (not pushy).",
  },
];

const defaultCampaign: Campaign = {
  domain: "https://growthorbit.io",
  brand: "Growth Orbit",
  targetKeyword: "b2b lead generation agency",
  industry: "B2B SaaS marketing",
  location: "Austin, TX",
  audience: "VPs of Revenue and Demand Generation",
  differentiator: "multi-channel outbound sprints that guarantee 20 SQLs per quarter",
  tone: "warm",
};

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign>(defaultCampaign);

  const tone = useMemo(
    () => toneOptions.find((option) => option.id === campaign.tone) ?? toneOptions[0],
    [campaign.tone],
  );

  const anchorIdeas = useMemo(() => buildAnchorIdeas(campaign), [campaign]);
  const opportunityGroups = useMemo(
    () => getOpportunityGroups(campaign, anchorIdeas),
    [campaign, anchorIdeas],
  );
  const summaryMetrics = useMemo(
    () => calculateSummary(campaign, opportunityGroups),
    [campaign, opportunityGroups],
  );
  const assetBlueprints = useMemo(
    () => buildAssetBlueprints(campaign, anchorIdeas),
    [campaign, anchorIdeas],
  );
  const quickWins = useMemo(() => buildQuickWins(campaign), [campaign]);
  const timeline = useMemo(() => buildTimeline(campaign), [campaign]);

  const outreachEmail = useMemo(() => {
    const asset = assetBlueprints[0];
    const keyword = fallbackKeyword(campaign.targetKeyword);
    const differentiator = campaign.differentiator || "our unique perspective";

    const bodyLines = [
      tone.opener(campaign),
      `We're spinning up "${asset?.title ?? `${titleCase(keyword)} Trend Report`}" that reverse-engineers how ${campaign.audience || "top operators"} approach ${keyword}. ${asset?.hook ?? ""}`,
      `Would you be open to collaborating? We can capture a short quote, highlight your ${campaign.brand ? `${campaign.brand} team` : "expertise"}, and link back with ${anchorIdeas[0]}.`,
      `We'll spotlight how ${differentiator} is helping teams operationalize ${keyword} and share early performance data once it ships.`,
      `In return we'll ${tone.promise.toLowerCase()}.`,
    ].filter(Boolean);

    return bodyLines.join("\n\n");
  }, [assetBlueprints, campaign, tone, anchorIdeas]);

  const outreachChecklist = useMemo(
    () => [
      `Build a 40-contact shortlist leveraging ${opportunityGroups[1]?.title ?? "partnership sources"}.`,
      `Batch personalize 5/day using hooks about ${campaign.industry || "their recent content"} and ${campaign.audience || "their audience"}.`,
      `Repurpose ${assetBlueprints[1]?.format ?? "audio clips"} into LinkedIn carousels that cite partners.`,
      tone.followUp,
    ],
    [assetBlueprints, campaign.audience, campaign.industry, opportunityGroups, tone.followUp],
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.badge}>Backlink Blueprint</div>
          <h1>Build authority momentum with a ready-to-launch backlink playbook.</h1>
          <p>
            Feed in your campaign context and spin up instant outreach angles, authority assets,
            and KPI checkpoints tailored to {campaign.audience || "your audience"}.
          </p>
          <div className={styles.metricsRow}>
            <MetricPill label="Authority Score" value={`${summaryMetrics.readinessScore}%`} tone="accent" />
            <MetricPill label="Links / month target" value={`${summaryMetrics.monthlyLinks}`} tone="neutral" />
            <MetricPill label="Warm prospects queued" value={`${summaryMetrics.warmProspects}`} tone="success" />
          </div>
        </header>

        <section className={styles.panel}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionLabel}>Campaign Inputs</span>
              <h2>Feed the engine with your context</h2>
            </div>
            <p>
              Update any field to instantly reshape outreach copy, opportunity pools, and asset
              ideas. Everything syncs with the keyword you are prioritizing right now.
            </p>
          </div>

          <form className={styles.formGrid}>
            <Field
              label="Primary domain"
              value={campaign.domain}
              placeholder="https://yourbrand.com"
              onChange={(value) => handleCampaignChange(setCampaign, "domain", value)}
            />
            <Field
              label="Brand or product name"
              value={campaign.brand}
              placeholder="Acme Growth"
              onChange={(value) => handleCampaignChange(setCampaign, "brand", value)}
            />
            <Field
              label="Target keyword / topic"
              value={campaign.targetKeyword}
              placeholder="enterprise seo platform"
              onChange={(value) => handleCampaignChange(setCampaign, "targetKeyword", value)}
            />
            <Field
              label="Industry focus"
              value={campaign.industry}
              placeholder="SaaS sales enablement"
              onChange={(value) => handleCampaignChange(setCampaign, "industry", value)}
            />
            <Field
              label="Location emphasis"
              value={campaign.location}
              placeholder="Austin, TX"
              onChange={(value) => handleCampaignChange(setCampaign, "location", value)}
            />
            <Field
              label="Ideal audience"
              value={campaign.audience}
              placeholder="Revenue leaders at Series B SaaS"
              onChange={(value) => handleCampaignChange(setCampaign, "audience", value)}
            />
            <Field
              label="Unfair advantage"
              value={campaign.differentiator}
              placeholder="Proprietary benchmark data"
              onChange={(value) => handleCampaignChange(setCampaign, "differentiator", value)}
            />
            <div className={styles.field}>
              <label htmlFor="tone">Outreach tone</label>
              <select
                id="tone"
                value={campaign.tone}
                className={styles.select}
                onChange={(event) =>
                  handleCampaignChange(setCampaign, "tone", event.target.value as CampaignTone)
                }
              >
                {toneOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionLabel}>Opportunity Pipeline</span>
              <h2>High-fit link sources ready to activate</h2>
            </div>
            <p>
              Prioritize channels that line up with {campaign.industry || "your industry"} buying
              cycles. Each item bundles suggested positioning, deliverables, and the success metric
              to track.
            </p>
          </div>

          <div className={styles.groupGrid}>
            {opportunityGroups.map((group) => (
              <div key={group.title} className={styles.groupCard}>
                <header className={styles.groupCardHeader}>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </header>
                <ul className={styles.groupItems}>
                  {group.items.map((item) => (
                    <li key={item.title} className={styles.groupItem}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      <p>{item.description}</p>
                      <div className={styles.itemAction}>{item.action}</div>
                      <span className={styles.itemMetric}>{item.metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionLabel}>Outreach Lab</span>
              <h2>Email copy & sequencing</h2>
            </div>
            <p>
              Drop this into your outreach system and personalize the first two sentences. Keep the
              CTA focused on value exchange, not just the backlink request.
            </p>
          </div>

          <div className={styles.outreachGrid}>
            <div className={styles.emailCard}>
              <div className={styles.emailHeader}>
                <span>Subject</span>
                <code>{tone.subjectTemplate(campaign)}</code>
              </div>
              <pre className={styles.emailBody}>{outreachEmail}</pre>
              <div className={styles.emailFooter}>
                <strong>Follow-up rhythm</strong>
                <p>{tone.followUp}</p>
              </div>
            </div>
            <div className={styles.outreachChecklist}>
              <h3>Execution checklist</h3>
              <ul>
                {outreachChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.anchorBlock}>
                <span>Anchor text rotation</span>
                <div className={styles.anchorGrid}>
                  {anchorIdeas.map((anchor) => (
                    <span key={anchor} className={styles.anchorPill}>
                      {anchor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionLabel}>Linkable Assets</span>
              <h2>Build authority magnets your partners want to cite</h2>
            </div>
            <p>
              Pair strategic assets with partner intent. Each concept below can drive multiple links
              when syndicated across newsletters, podcasts, and PR channels.
            </p>
          </div>

          <div className={styles.assetGrid}>
            {assetBlueprints.map((asset) => (
              <div key={asset.title} className={styles.assetCard}>
                <h3>{asset.title}</h3>
                <p>{asset.hook}</p>
                <div className={styles.assetMeta}>
                  <span>{asset.format}</span>
                  <span>{asset.targets}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.quickWins}>
            <h3>Immediate wins (ship this week)</h3>
            <ul>
              {quickWins.map((win) => (
                <li key={win.title}>
                  <strong>{win.title}</strong>
                  <span>{win.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionLabel}>Momentum Tracker</span>
              <h2>90-day KPI & delivery roadmap</h2>
            </div>
            <p>
              Rally your team around repeatable cadences. Track inputs weekly and report on leading
              indicators — not just backlinks won.
            </p>
          </div>

          <div className={styles.timeline}>
            {timeline.map((phase) => (
              <div key={phase.title} className={styles.timelineCard}>
                <header>
                  <span>{phase.weekRange}</span>
                  <h3>{phase.title}</h3>
                  <p>{phase.objective}</p>
                </header>
                <ul>
                  {phase.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
                <footer>{phase.metric}</footer>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function handleCampaignChange<K extends keyof Campaign>(
  setter: Dispatch<SetStateAction<Campaign>>,
  key: K,
  value: Campaign[K],
) {
  setter((prev) => ({ ...prev, [key]: value }));
}

function fallbackKeyword(keyword: string) {
  return keyword.trim() || "your primary keyword";
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase().concat(word.slice(1)) ?? "")
    .join(" ");
}

function resolveCluster(industry: string) {
  const normalized = industry.toLowerCase();
  if (normalized.includes("saas") || normalized.includes("software") || normalized.includes("tech")) {
    return "saas";
  }
  if (normalized.includes("agency") || normalized.includes("marketing") || normalized.includes("consult")) {
    return "agency";
  }
  if (normalized.includes("ecom") || normalized.includes("retail") || normalized.includes("shop")) {
    return "ecommerce";
  }
  if (normalized.includes("health") || normalized.includes("med") || normalized.includes("wellness")) {
    return "health";
  }
  if (normalized.includes("fin")) {
    return "finance";
  }
  if (normalized.includes("sustain")) {
    return "sustainability";
  }
  if (normalized.includes("local") || normalized.includes("regional") || normalized.includes("city")) {
    return "local";
  }
  return "default";
}

function pickIndustryList(source: Record<string, string[]>, industry: string) {
  const cluster = resolveCluster(industry);
  return source[cluster] ?? source.default;
}

function buildAnchorIdeas(campaign: Campaign) {
  const keyword = fallbackKeyword(campaign.targetKeyword);
  const brand = campaign.brand.trim() || "your brand";
  const industry = campaign.industry.trim() || "industry";

  return [
    `${keyword} strategies by ${brand}`,
    `${brand} ${industry.includes(" ") ? industry.split(" ")[0] : industry} playbook`,
    `${keyword} checklist (${campaign.location || "expert insights"})`,
  ];
}

function getOpportunityGroups(campaign: Campaign, anchors: string[]): OpportunityGroup[] {
  const directories = pickIndustryList(DIRECTORY_BANK, campaign.industry);
  const partnerships = pickIndustryList(PARTNERSHIP_BANK, campaign.industry);
  const digitalPr = pickIndustryList(DIGITAL_PR_BANK, campaign.industry);
  const differentiator = campaign.differentiator || "your differentiator";

  return [
    {
      title: "Authority directories & citations",
      description: `Lock in entity signals that reinforce ${fallbackKeyword(campaign.targetKeyword)}.`,
      items: directories.slice(0, 3).map((name, index) => ({
        title: name,
        description: `Feature ${campaign.brand || "your brand"} with proof like client logos or metrics. Highlight ${differentiator}.`,
        action: `Deliver: brand boilerplate, ${campaign.location || "primary location"}, and anchor "${anchors[index % anchors.length]}".`,
        metric: "Success: profile approved + backlink live.",
      })),
    },
    {
      title: "Collaborative content & guesting",
      description: `Leverage trusted voices that speak to ${campaign.audience || "your ICP"}.`,
      items: partnerships.slice(0, 3).map((name, index) => ({
        title: name,
        description: `Pitch a topic around ${fallbackKeyword(campaign.targetKeyword)} with a strong POV and supporting data.`,
        action: `Prep: 3 bullet outline, partner-specific hook, and ${anchors[(index + 1) % anchors.length]} as contextual link.`,
        metric: "Success: guest slot confirmed or co-created piece scheduled.",
      })),
    },
    {
      title: "Digital PR & amplification flywheel",
      description: `Earn authority mentions by leading with data and quotable insights.`,
      items: digitalPr.slice(0, 3).map((name) => ({
        title: name,
        description: `Share exclusive angles from your ${campaign.industry || "industry"} dataset or campaign results.`,
        action: `Send: headline-ready stat, expert quote, and infographic snippet tailored for ${name}.`,
        metric: "Success: feature secured with do-follow mention.",
      })),
    },
  ];
}

function calculateSummary(campaign: Campaign, groups: OpportunityGroup[]) {
  const baseScore = 62;
  const differentiatorBoost = Math.min(campaign.differentiator.length / 3, 18);
  const keywordBoost = campaign.targetKeyword ? 10 : 0;
  const locationBoost = campaign.location ? 6 : 0;
  const readinessScore = Math.min(96, Math.round(baseScore + differentiatorBoost + keywordBoost + locationBoost));

  const monthlyLinks = 8 + groups.reduce((acc, group) => acc + group.items.length * 2, 0);
  const warmProspects = 30 + groups.reduce((acc, group) => acc + group.items.length * 5, 0);

  return { readinessScore, monthlyLinks, warmProspects };
}

function buildAssetBlueprints(campaign: Campaign, anchors: string[]): AssetBlueprint[] {
  const keyword = fallbackKeyword(campaign.targetKeyword);
  const audience = campaign.audience || "decision makers";

  return [
    {
      title: `${titleCase(keyword)} Benchmark Index`,
      hook: `Collect trends from ${audience} and rank the top plays they rely on to solve ${keyword}.`,
      format: "Data story + downloadable PDF for partners.",
      targets: "Perfect for analyst newsletters, comparison blogs, and category roundups.",
    },
    {
      title: `${campaign.location || "Regional"} Field Guide`,
      hook: `Highlight breakout companies in ${campaign.location || "your market"} with commentary from local operators.`,
      format: "Interactive map or Notion hub with embedded quotes.",
      targets: "Local press, chambers of commerce, and community Slack groups.",
    },
    {
      title: `${titleCase(keyword)} ROI Playbook`,
      hook: `Break down 3 campaigns showing how ${campaign.brand || "your team"} drives measurable outcomes.`,
      format: "Long-form article + short Loom walkthrough.",
      targets: "Great for guest posts, partner onboarding, and nurture sequences.",
    },
  ].map((asset, index) => ({
    ...asset,
    hook: `${asset.hook} Anchor suggestion: ${anchors[index % anchors.length]}.`,
  }));
}

function buildQuickWins(campaign: Campaign): QuickWin[] {
  const keyword = fallbackKeyword(campaign.targetKeyword);

  return [
    {
      title: "Reclaim unlinked mentions",
      detail: `Run a quick brand search for ${campaign.brand || "your brand"} and request links on any posts that cite your ${campaign.industry || "expertise"}.`,
    },
    {
      title: "Launch a partner resource hub",
      detail: `Create a living page mapping ${keyword} resources from collaborators. Invite partners to submit their assets for instant reciprocity.`,
    },
    {
      title: "Refresh LinkedIn feature section",
      detail: `Pin your hero asset and include ${campaign.domain || "your site"} UTM links so every share compounds.`,
    },
  ];
}

function buildTimeline(campaign: Campaign): TimelinePhase[] {
  const keyword = fallbackKeyword(campaign.targetKeyword);
  const industry = campaign.industry || "your industry";

  return [
    {
      title: "Foundation & visibility audit",
      weekRange: "Week 1",
      objective: `Audit ${campaign.brand || "your brand"} presence across key ${industry} directories.`,
      tasks: [
        `Benchmark DR/DA against top 3 ${industry} competitors.`,
        `Document every live backlink supporting ${keyword} and tag by funnel stage.`,
        `Draft one-sheeter with ${campaign.differentiator || "your differentiator"} and proof points.`,
      ],
      metric: "Output: authority baseline scorecard + prioritized gap list.",
    },
    {
      title: "Asset production sprint",
      weekRange: "Weeks 2-4",
      objective: `Ship cornerstone asset and partner co-marketing kit.`,
      tasks: [
        `Interview 5 ${campaign.audience || "subject matter experts"} for original insights.`,
        `Design visual snippets for LinkedIn, newsletters, and outreach decks.`,
        `Publish landing page optimized around ${keyword} with conversion CTA.`,
      ],
      metric: "Output: gated asset live + promo toolkit approved.",
    },
    {
      title: "Outreach & amplification",
      weekRange: "Weeks 5-8",
      objective: `Roll daily outreach using personalized angles backed by data.`,
      tasks: [
        `Send 5 partner pitches/day referencing their latest ${industry} coverage.`,
        `Queue thought leadership posts citing collaborators to unlock reciprocity.`,
        `Track responses and link status in CRM (tag wins vs. in-progress).`,
      ],
      metric: "Output: 20+ warm conversations, 8 links live or in production.",
    },
    {
      title: "Scale & iterate",
      weekRange: "Weeks 9-12",
      objective: "Double down on top-performing campaigns and expand coverage.",
      tasks: [
        "Launch second asset variant (e.g., webinar recap or playbook).",
        "Roll micro-PR angles to podcasts / newsletters that engaged.",
        "Report KPI lift and recommend next quarter's focus keywords.",
      ],
      metric: "Output: Authority score trending up + pipeline of future partners.",
    },
  ];
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function Field({ label, value, placeholder, onChange }: FieldProps) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
      />
    </div>
  );
}

type MetricPillProps = {
  label: string;
  value: string;
  tone: "accent" | "neutral" | "success";
};

function MetricPill({ label, value, tone }: MetricPillProps) {
  return (
    <div className={`${styles.metricPill} ${styles[`metricPill_${tone}`]}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
