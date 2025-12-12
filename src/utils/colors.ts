export const CLASS_COLORS: Record<string, string> = {
  "Belum Matang": "#22c55e",  // Green - fresh
  "Mulai Matang": "#eab308",  // Yellow - ripening
  "Matang": "#f59e0b",         // Orange - ripe
  "Matang Sempurna": "#f97316", // Deep orange - perfect
  "Terlalu Matang": "#ef4444"  // Red - overripe
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