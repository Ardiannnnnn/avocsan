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
  'Mentah': {
    label: 'Mentah',
    stage: 'Mentah',
    emoji: '🟢',
    color: '#22c55e',
    shelfLife: '5-7 hari',
    recommendation: '✨ Simpan pada suhu ruang hingga empuk saat ditekan. Proses pematangan memakan waktu 3-5 hari. Jangan simpan di dalam kulkas saat masih mentah.',
    description: '🌱 Alpukat masih keras dan belum matang. Kulit masih berwarna hijau terang, daging buah masih keras, dan belum cocok untuk dikonsumsi. Tunggu beberapa hari sampai matang sempurna.'
  },
  'Mengkal': {
    label: 'Mengkal',
    stage: 'Mengkal',
    emoji: '🟡',
    color: '#eab308',
    shelfLife: '2-3 hari',
    recommendation: '⏳ Hampir siap. Tunggu 1-2 hari lagi untuk hasil terbaik. Tekstur akan semakin lembut dan creamy. Cocok untuk yang suka alpukat semi-firm.',
    description: '🌤️ Alpukat dalam tahap transisi menuju matang. Kulit mulai gelap, sedikit empuk saat ditekan dengan lembut. Rasa sudah mulai berkembang namun belum optimal.'
  },
  'Matang': {
    label: 'Matang',
    stage: 'Matang',
    emoji: '🟠',
    color: '#f59e0b',
    shelfLife: '1-2 hari',
    recommendation: '🎉 Sempurna untuk dikonsumsi. Nikmati dalam salad, toast, smoothie bowl, atau guacamole. Tekstur creamy maksimal dan rasa yang kaya.',
    description: '✨ Alpukat matang sempurna! Empuk saat ditekan, kulit berwarna hijau gelap hingga ungu kehitaman. Daging buah lembut, creamy, dan kaya rasa. Ini saat terbaik!'
  },
  'Sangat Matang': {
    label: 'Sangat Matang',
    stage: 'Sangat Matang',
    emoji: '🟤',
    color: '#f97316',
    shelfLife: '< 1 hari',
    recommendation: '⚡ Segera konsumsi atau simpan didalam kulkas. Cocok untuk smoothie atau saus. Jangan biarkan lebih dari 1 hari pada suhu ruangan.',
    description: '⚠️ Alpukat sangat matang, hampir terlalu lunak. Kulit kehitaman, daging sangat lembut. Masih aman dikonsumsi tapi harus segera digunakan. Mulai ada tanda-tanda overripe.'
  },
  'Busuk': {
    label: 'Terlalu Matang',
    stage: 'Terlalu Matang',
    emoji: '⚫',
    color: '#ef4444',
    shelfLife: 'Tidak layak',
    recommendation: '🚫 JANGAN konsumsi! Buang ke tempat sampah organik atau kompos. Alpukat sudah tidak aman untuk dimakan dan dapat menyebabkan masalah kesehatan.',
    description: '❌ Alpukat sudah membusuk. Bau tidak sedap, daging berlendir atau berjamur, warna coklat kehitaman dengan bintik-bintik. Tidak layak konsumsi sama sekali.'
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
    key => key.toLowerCase() === normalizedLabel.toLowerCase()
  );
  
  if (matchedKey) {
    return AVOCADO_CLASSES[matchedKey];
  }
  
  // Default fallback to "Matang" if label not found
  console.warn(`⚠️ Label "${label}" not found in AVOCADO_CLASSES, using default "Matang"`);
  return AVOCADO_CLASSES['Matang'];
};