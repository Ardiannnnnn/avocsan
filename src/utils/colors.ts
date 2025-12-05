export const CLASS_COLORS: Record<string, string> = {
  Mentah: "#00FF00",
  Mengkal: "#FFFF00",
  Matang: "#FFA500",
  Sangat_Matang: "#FF0000",
  Busuk: "#8B0000"
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