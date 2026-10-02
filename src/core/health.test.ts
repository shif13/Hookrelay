import { describe, expect, it } from "vitest";
import { healthCheck } from "./health.js";

describe("healthCheck", () => {
  it("returns the backend health message", () => {
    expect(healthCheck()).toBe("Hookrelay backend is running");
  });
});
