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
  // Sort by confidence highest first
  const sorted = detections.sort((a, b) => b.confidence - a.confidence);
  const keep: Detection[] = [];

  while (sorted.length > 0) {
    const current = sorted.shift()!;
    keep.push(current);

    // Remove detections that overlap too much
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
  confidenceThreshold: number = 0.45,
  iouThreshold: number = 0.45
): Detection[] {
  "worklet";

  // LOGIKA BARU: Tanpa Transpose Manual
  // Output YOLOv8 [1, 9, 8400] -> Flat Float32Array
  // Urutan data di array:
  // [8400 x-center] [8400 y-center] [8400 width] [8400 height] [8400 class0] ... [8400 class4]
  
  const numElements = 8400; 
  const numChannels = 9; // 4 box + 5 classes
  const detections: Detection[] = [];

  for (let i = 0; i < numElements; i++) {
    // Mencari Skor Tertinggi di antara 5 kelas
    let maxConf = 0;
    let maxClassIndex = -1;

    // Loop kelas mulai dari channel ke-4 sampai ke-8
    // Offset untuk setiap channel adalah 'numElements' (8400)
    for (let c = 0; c < 5; c++) {
      // Index 4 adalah awal kelas
      const classConf = output[(4 + c) * numElements + i]; 
      
      if (classConf > maxConf) {
        maxConf = classConf;
        maxClassIndex = c;
      }
    }

    if (maxConf > confidenceThreshold) {
      // Baca koordinat (masih dalam skala 0-640 pixel dari model)
      const x = output[0 * numElements + i];
      const y = output[1 * numElements + i];
      const w = output[2 * numElements + i];
      const h = output[3 * numElements + i];

      // Konversi Center-XYWH ke TopLeft-XYWH
      const xMin = x - w / 2;
      const yMin = y - h / 2;
      
      // Simpan koordinat 0-640 ini. 
      // Nanti akan di-scale ke layar HP oleh fungsi `scaleDetectionsCenterCrop`
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