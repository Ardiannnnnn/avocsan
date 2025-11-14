export const CLASS_COLORS: Record<string, string> = {
  mentah: "#ef4444",
  matang: "#22c55e",
  terlalu_matang: "#f59e0b",
  busuk: "#6b7280",
};

export function getColorForClass(
  className: string,
  confidence: number
): string {
  const baseColor = CLASS_COLORS[className] || "#3b82f6";

  // Fade color if low confidence
  if (confidence < 0.5) {
    return baseColor + "80"; // 50% opacity
  }
  return baseColor;
}