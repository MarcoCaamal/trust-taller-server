import config from "@core/config/app.config";

export const getTenantDomainFromHost = (host: string | undefined): string | null => {
  if (!host) return null;
  const firstHost = host.split(",")[0]?.trim();
  if (!firstHost) return null;
  const normalizedHost = firstHost.split(":")[0].toLowerCase();
  const baseDomain = config.baseDomain.toLowerCase();

  if (!normalizedHost.endsWith(baseDomain)) return null;
  if (normalizedHost === baseDomain) return null;

  return normalizedHost;
};
