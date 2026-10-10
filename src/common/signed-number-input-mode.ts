export type SignedNumberInputMode = "decimal" | "text";

export function getSignedNumberInputMode(
  device: Pick<Navigator, "userAgent" | "platform" | "maxTouchPoints">
): SignedNumberInputMode {
  const isIOS =
    /iPad|iPhone|iPod/.test(device.userAgent) ||
    (device.platform === "MacIntel" && device.maxTouchPoints > 1);

  return isIOS ? "text" : "decimal";
}
