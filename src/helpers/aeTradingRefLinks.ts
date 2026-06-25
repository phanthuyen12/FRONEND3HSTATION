export interface AeTradingRefLinkItem {
  key: string;
  label: string;
  url: string;
  buttonText: string;
  description: string;
  enabled: boolean;
}

const defaultLinks: AeTradingRefLinkItem[] = [
  {
    key: "default",
    label: "Cong dong AE Trading",
    url: "https://zalo.me/0911809909",
    buttonText: "Tham gia cong dong ngay",
    description: "Link mac dinh duoc dung khi ref khong khop voi cau hinh rieng.",
    enabled: true,
  },
  {
    key: "zalo",
    label: "Nhom Zalo AE Trading",
    url: "https://zalo.me/0911809909",
    buttonText: "Tham gia nhom Zalo ngay",
    description: "Ref mau cho chien dich quang cao Zalo.",
    enabled: true,
  },
];

const normalizeItem = (
  key: string,
  input?: Partial<AeTradingRefLinkItem> | null
): AeTradingRefLinkItem => ({
  key: String(input?.key || key || "").trim(),
  label: String(input?.label || key || "").trim(),
  url: String(input?.url || "").trim(),
  buttonText: String(input?.buttonText || "Tham gia ngay").trim(),
  description: String(input?.description || "").trim(),
  enabled: input?.enabled !== false,
});

export const getDefaultAeTradingRefLinks = (): AeTradingRefLinkItem[] =>
  defaultLinks.map((item) => ({ ...item }));

export const parseAeTradingRefLinks = (raw?: string | null): AeTradingRefLinkItem[] => {
  if (!raw || !raw.trim()) {
    return getDefaultAeTradingRefLinks();
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      const items = parsed
        .map((item) => normalizeItem(item?.key || "", item))
        .filter((item) => item.key);
      return items.length ? items : getDefaultAeTradingRefLinks();
    }

    if (parsed && typeof parsed === "object") {
      const items = Object.entries(parsed)
        .map(([key, value]) => normalizeItem(key, value as Partial<AeTradingRefLinkItem>))
        .filter((item) => item.key);
      return items.length ? items : getDefaultAeTradingRefLinks();
    }
  } catch (error) {
    console.error("Khong the parse landing_ref_links:", error);
  }

  return getDefaultAeTradingRefLinks();
};

export const serializeAeTradingRefLinks = (items: AeTradingRefLinkItem[]): string => {
  const cleaned = items.reduce<Record<string, Omit<AeTradingRefLinkItem, "key">>>((acc, item) => {
    const key = String(item.key || "").trim();
    if (!key) return acc;

    acc[key] = {
      label: String(item.label || key).trim(),
      url: String(item.url || "").trim(),
      buttonText: String(item.buttonText || "Tham gia ngay").trim(),
      description: String(item.description || "").trim(),
      enabled: item.enabled !== false,
    };

    return acc;
  }, {});

  return JSON.stringify(cleaned, null, 2);
};

export const resolveAeTradingRefLink = (
  items: AeTradingRefLinkItem[],
  refCode?: string | null
): AeTradingRefLinkItem => {
  const normalizedRef = String(refCode || "").trim().toLowerCase();
  const enabledItems = items.filter((item) => item.enabled !== false);

  const matched = enabledItems.find((item) => item.key.toLowerCase() === normalizedRef);
  if (matched) return matched;

  const fallback = enabledItems.find((item) => item.key.toLowerCase() === "default");
  if (fallback) return fallback;

  return enabledItems[0] || getDefaultAeTradingRefLinks()[0];
};

export const buildAeTradingLandingShareLink = (origin: string, refCode: string) =>
  `${origin}/landing-ae-trading-qcao?ref=${encodeURIComponent(refCode)}`;
