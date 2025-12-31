import { describe, it, expect } from "@jest/globals";
import { getTenantDomainFromHost } from "../../src/core/http/tenant-domain";

describe("getTenantDomainFromHost", () => {
  it("returns null when host is missing", () => {
    expect(getTenantDomainFromHost(undefined)).toBeNull();
  });

  it("returns null when host does not match base domain", () => {
    expect(getTenantDomainFromHost("example.com")).toBeNull();
  });

  it("returns null when host is base domain only", () => {
    expect(getTenantDomainFromHost("trust-taller.com")).toBeNull();
  });

  it("returns tenant domain for subdomain host", () => {
    expect(getTenantDomainFromHost("mi-taller.trust-taller.com")).toBe(
      "mi-taller.trust-taller.com"
    );
  });

  it("handles host with port and multiple hosts", () => {
    expect(getTenantDomainFromHost("mi-taller.trust-taller.com:3000")).toBe(
      "mi-taller.trust-taller.com"
    );
    expect(
      getTenantDomainFromHost("mi-taller.trust-taller.com:3000, proxy.local")
    ).toBe("mi-taller.trust-taller.com");
  });
});
