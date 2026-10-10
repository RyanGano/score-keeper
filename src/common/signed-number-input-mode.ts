export type SignedNumberInputMode = "decimal" | "text";

export function getSignedNumberInputMode(
  device: Pick<
    Navigator,
    "userAgent" | "platform" | "maxTouchPoints" | "vendor"
  >
): SignedNumberInputMode {
  const isIOS =
    /iPad|iPhone|iPod/i.test(device.userAgent) ||
    /iPad|iPhone|iPod/i.test(device.platform) ||
    (device.vendor === "Apple Computer, Inc." && device.maxTouchPoints > 1) ||
    (device.platform === "MacIntel" && device.maxTouchPoints > 1);

  return isIOS ? "text" : "decimal";
}
