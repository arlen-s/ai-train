import { describe, expect, it, vi } from "vitest";

import { fetchJson } from "./api";

describe("fetchJson", () => {
  it("joins API paths against the configured base URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok" })
    });

    const result = await fetchJson("/api/health", fetchMock, "http://127.0.0.1:8000");

    expect(fetchMock).toHaveBeenCalledWith("http://127.0.0.1:8000/api/health");
    expect(result).toEqual({ status: "ok" });
  });

  it("throws a readable error for failed API responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error"
    });

    await expect(fetchJson("/api/health", fetchMock)).rejects.toThrow("API request failed: 500 Internal Server Error");
  });
});
