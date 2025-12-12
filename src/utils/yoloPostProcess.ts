export interface Detection {
  bbox: [number, number, number, number]; // x1, y1, width, height (Pixel 0-640)
  confidence: number;
  className: string;
  classIndex: number;
}

export function calculateIoU(
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number]
): number {
  "worklet";
  const [x1, y1, w1, h1] = bbox1;
  const [x2, y2, w2, h2] = bbox2;

  const xLeft = Math.max(x1, x2);
  const yTop = Math.max(y1, y2);
  const xRight = Math.min(x1 + w1, x2 + w2);
  const yBottom = Math.min(y1 + h1, y2 + h2);

  if (xRight < xLeft || yBottom < yTop) return 0.0;

  const intersectionArea = (xRight - xLeft) * (yBottom - yTop);
  const bbox1Area = w1 * h1;
  const bbox2Area = w2 * h2;
  const unionArea = bbox1Area + bbox2Area - intersectionArea;

  return intersectionArea / unionArea;
}

export function applyNMS(
  detections: Detection[],
  iouThreshold: number
): Detection[] {
  "worklet";
  const sorted = detections.sort((a, b) => b.confidence - a.confidence);
  const keep: Detection[] = [];

  while (sorted.length > 0) {
    const current = sorted.shift()!;
    keep.push(current);

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (calculateIoU(current.bbox, sorted[i].bbox) > iouThreshold) {
        sorted.splice(i, 1);
      }
    }
  }
  return keep;
}

export function parseYOLOOutput(
  output: Float32Array,
  labels: string[],
  inputSize: number, // 640
  confidenceThreshold: number = 0.6,
  iouThreshold: number = 0.5
): Detection[] {
  "worklet";

  const numElements = 8400; 
  // ✅ PERBAIKAN 1: Hitung jumlah kelas secara dinamis dari labels
  const numClasses = labels.length; 
  const detections: Detection[] = [];

  // Validasi keamanan array agar tidak crash jika output model tidak sesuai label
  if (output.length < (4 + numClasses) * numElements) {
    console.log(`⚠️ Output size mismatch. Model output len: ${output.length}, Expected > ${(4 + numClasses) * numElements}`);
    return [];
  }

  for (let i = 0; i < numElements; i++) {
    let maxConf = 0;
    let maxClassIndex = -1;

    // ✅ PERBAIKAN 2: Loop sesuai jumlah kelas asli (bukan hardcode 5)
    for (let c = 0; c < numClasses; c++) {
      // Index 4 adalah awal kelas (0=x, 1=y, 2=w, 3=h)
      const classConf = output[(4 + c) * numElements + i]; 
      
      if (classConf > maxConf) {
        maxConf = classConf;
        maxClassIndex = c;
      }
    }

    // ✅ PERBAIKAN 3: Filter ketat menggunakan threshold yang dioper
    if (maxConf > confidenceThreshold) {
      // Debugging: Intip apa yang dideteksi dan berapa persen yakinnya
      // console.log(`🧐 Kandidat: ${labels[maxClassIndex]} (${(maxConf * 100).toFixed(0)}%)`);

      const x = output[0 * numElements + i];
      const y = output[1 * numElements + i];
      const w = output[2 * numElements + i];
      const h = output[3 * numElements + i];

      const xMin = x - w / 2;
      const yMin = y - h / 2;
      
      detections.push({
        bbox: [xMin, yMin, w, h], 
        confidence: maxConf,
        className: labels[maxClassIndex] || `unknown_${maxClassIndex}`,
        classIndex: maxClassIndex,
      });
    }
  }

  return applyNMS(detections, iouThreshold);
}