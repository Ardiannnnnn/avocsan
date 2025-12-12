export interface AvocadoClassInfo {
  label: string;
  stage: string;
  emoji: string;
  color: string;
  shelfLife: string;
  recommendation: string;
  description: string;
}

export const AVOCADO_CLASSES: Record<string, AvocadoClassInfo> = {
  "Belum Matang": {
    label: "Belum Matang",
    stage: "Belum Matang",
    emoji: "🟢",
    color: "#22c55e",
    shelfLife: "5–7 hari",
    recommendation:
      "✨ Simpan pada suhu ruang. Jangan masukkan ke kulkas agar proses pematangan tetap berlangsung. Butuh beberapa hari hingga mulai melunak.",
    description:
      "🌱 Alpukat masih keras dengan kulit hijau terang. Daging buah padat dan belum layak konsumsi. Tahap awal sebelum memasuki proses pematangan.",
  },

  "Mulai Matang": {
    label: "Mulai Matang",
    stage: "Mulai Matang",
    emoji: "🟡",
    color: "#eab308",
    shelfLife: "2–3 hari",
    recommendation:
      "⏳ Diamkan 1–2 hari lagi hingga mencapai kematangan yang diinginkan. Bisa dipercepat dengan menyimpan bersama apel atau pisang.",
    description:
      "🌤 Alpukat mulai menggelap dan sedikit empuk. Rasa mulai terbentuk tetapi belum sepenuhnya creamy.",
  },

  "Matang": {
    label: "Matang",
    stage: "Matang",
    emoji: "🟠",
    color: "#f59e0b",
    shelfLife: "1-2 hari",
    recommendation:
      "🎉 Siap dikonsumsi. Jika belum ingin digunakan, simpan di kulkas untuk memperlambat pematangan.",
    description:
      "✨ Kulit gelap dan buah empuk ketika ditekan. Rasa creamy dan tekstur lembut, cocok untuk berbagai olahan.",
  },

  "Matang Sempurna": {
    label: "Matang Sempurna",
    stage: "Matang Sempurna",
    emoji: "🟤",
    color: "#f97316",
    shelfLife: "< 1 hari",
    recommendation:
      "⚡ Konsumsi segera. Bisa disimpan sebentar di kulkas agar tidak cepat melunak. Ideal untuk smoothie, saus, dan guacamole.",
    description:
      "💯 Tekstur sangat creamy, empuk, dan rasa paling optimal. Namun kondisi ini hanya bertahan sebentar sebelum masuk tahap terlalu matang.",
  },

  "Terlalu Matang": {
    label: "Terlalu Matang",
    stage: "Terlalu Matang",
    emoji: "⚫",
    color: "#ef4444",
    shelfLife: "Sudah melewati masa simpan",
    recommendation:
      "⚠ Beberapa bagian masih dapat dikonsumsi jika warna daging tetap hijau kekuningan dan tidak berbau. Buang bagian yang coklat gelap atau berlendir.",
    description:
      "❗ Alpukat sangat lembek, sebagian daging mungkin berubah kecoklatan. Meski sudah melewati masa simpan, bagian yang masih berwarna normal dan tidak berbau dapat digunakan, terutama untuk smoothie. Namun harus dilakukan pengecekan dengan hati-hati.",
  },
};

export const getClassInfo = (label: string): AvocadoClassInfo => {
  // Normalize label (handle case sensitivity and variations)
  const normalizedLabel = label.trim();

  // Try exact match first
  if (AVOCADO_CLASSES[normalizedLabel]) {
    return AVOCADO_CLASSES[normalizedLabel];
  }

  // Try case-insensitive match
  const matchedKey = Object.keys(AVOCADO_CLASSES).find(
    (key) => key.toLowerCase() === normalizedLabel.toLowerCase()
  );

  if (matchedKey) {
    return AVOCADO_CLASSES[matchedKey];
  }

  // Default fallback to "Matang" if label not found
  console.warn(
    `⚠️ Label "${label}" not found in AVOCADO_CLASSES, using default "Matang"`
  );
  return AVOCADO_CLASSES["Matang"];
};
