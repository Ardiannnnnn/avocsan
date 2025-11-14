export interface Detection {
  bbox: [number, number, number, number];
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

    const remaining = sorted.filter((det) => {
      const iou = calculateIoU(current.bbox, det.bbox);
      return iou < iouThreshold;
    });

    sorted.length = 0;
    sorted.push(...remaining);
  }

  return keep;
}

export function parseYOLOOutput(
  output: Float32Array,
  labels: string[],
  inputSize: number,
  confidenceThreshold: number = 0.4,
  iouThreshold: number = 0.45
): Detection[] {
  "worklet";

  const numClasses = labels.length;
  const numBoxes = 8400;
  const detections: Detection[] = [];

  for (let i = 0; i < numBoxes; i++) {
    const baseIdx = i * 9;

    const x = output[baseIdx + 0];
    const y = output[baseIdx + 1];
    const w = output[baseIdx + 2];
    const h = output[baseIdx + 3];

    const classScores: number[] = [];
    for (let c = 0; c < numClasses; c++) {
      const score = output[baseIdx + 5 + c];
      classScores.push(score);
    }

    const maxScore = Math.max(...classScores);
    const classIndex = classScores.indexOf(maxScore);
    const confidence = maxScore;

    if (confidence > confidenceThreshold) {
      const xMin = (x - w / 2) * inputSize;
      const yMin = (y - h / 2) * inputSize;
      const width = w * inputSize;
      const height = h * inputSize;

      detections.push({
        bbox: [xMin, yMin, width, height],
        confidence,
        className: labels[classIndex],
        classIndex,
      });
    }
  }

  return applyNMS(detections, iouThreshold);
}

export function scaleDetections(
  detections: Detection[],
  inputSize: number,
  screenWidth: number,
  screenHeight: number
): Detection[] {
  "worklet";

  return detections.map((det) => {
    const [x, y, w, h] = det.bbox;
    return {
      ...det,
      bbox: [
        (x / inputSize) * screenWidth,
        (y / inputSize) * screenHeight,
        (w / inputSize) * screenWidth,
        (h / inputSize) * screenHeight,
      ],
    };
  });
}