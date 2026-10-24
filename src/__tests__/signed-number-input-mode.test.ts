import { describe, expect, it } from "vitest";
import { getSignedNumberInputMode } from "../common/signed-number-input-mode";

describe("getSignedNumberInputMode", () => {
  it("uses the full keyboard on iPhone", () => {
    expect(
      getSignedNumberInputMode({
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
        platform: "iPhone",
        maxTouchPoints: 5,
        vendor: "Apple Computer, Inc.",
      })
    ).toBe("text");
  });

  it("uses the full keyboard on iPadOS when it reports a desktop platform", () => {
    expect(
      getSignedNumberInputMode({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
        platform: "MacIntel",
        maxTouchPoints: 5,
        vendor: "Apple Computer, Inc.",
      })
    ).toBe("text");
  });

  it("uses the full keyboard when an iPhone has a reduced user agent", () => {
    expect(
      getSignedNumberInputMode({
        userAgent: "Mozilla/5.0 (Mobile)",
        platform: "iPhone",
        maxTouchPoints: 5,
        vendor: "",
      })
    ).toBe("text");
  });

  it("uses the full keyboard on an Apple touch device with a reduced user agent and platform", () => {
    expect(
      getSignedNumberInputMode({
        userAgent: "Mozilla/5.0 (Mobile)",
        platform: "Mobile",
        maxTouchPoints: 5,
        vendor: "Apple Computer, Inc.",
      })
    ).toBe("text");
  });

  it("uses the decimal number keyboard on Android", () => {
    expect(
      getSignedNumberInputMode({
        userAgent: "Mozilla/5.0 (Linux; Android 14)",
        platform: "Linux armv8l",
        maxTouchPoints: 5,
        vendor: "Google Inc.",
      })
    ).toBe("decimal");
  });

  it("uses the decimal number keyboard on desktop", () => {
    expect(
      getSignedNumberInputMode({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        platform: "Win32",
        maxTouchPoints: 0,
        vendor: "",
      })
    ).toBe("decimal");
  });
});
