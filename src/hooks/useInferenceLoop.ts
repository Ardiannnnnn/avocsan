import { useEffect, useRef } from "react";
import { Camera } from "react-native-vision-camera";
import { parseYOLOOutput, Detection } from "../utils/yoloPostProcess";
import {
  decodeImageCenterCrop,
  normalizeImage,
  scaleDetectionsCenterCrop,
} from "../utils/imageProcessing";

interface UseInferenceLoopProps {
  isScanning: boolean;
  model: any;
  labels: string[];
  cameraRef: React.RefObject<Camera>;
  screenWidth: number;
  screenHeight: number;
  onDetectionsUpdate: (detections: Detection[]) => void;
  onStatsUpdate: (fps: number, inferenceTime: number) => void;
  onAutoCapture?: (
    photoUri: string,
    detection: Detection,
    allDetections: Detection[]
  ) => void; // ✅ Keep interface but won't use
  confidenceThreshold?: number;
}
export function useInferenceLoop({
  isScanning,
  model,
  labels,
  cameraRef,
  screenWidth,
  screenHeight,
  onDetectionsUpdate,
  onStatsUpdate,
}: UseInferenceLoopProps) {
  const scanLoopActive = useRef(false);
  const lastFrameTime = useRef(Date.now());

  useEffect(() => {
    if (!isScanning || !cameraRef.current || !model) {
      scanLoopActive.current = false;
      return;
    }

    scanLoopActive.current = true;

    const runInferenceLoop = async () => {
      while (scanLoopActive.current) {
        try {
          const snapshot = await cameraRef.current!.takeSnapshot({
            quality: 30, // Kualitas rendah cukup untuk inferensi, lebih cepat
          });

          // Gunakan 'file://' prefix
          const fileUri = snapshot.path.startsWith("file://")
            ? snapshot.path
            : `file://${snapshot.path}`;

          // 1. Decode & Crop (Tetap gunakan kode Anda, sudah bagus)
          const decodeResult = await decodeImageCenterCrop(fileUri, 640);
          const normalized = normalizeImage(decodeResult.pixels);

          const inferenceStart = Date.now();

          // 2. Run Inference
          const output = model!.runSync([normalized]);
          const inferenceOnlyTime = Date.now() - inferenceStart;

          // 3. Post Process (SIMPLIFIED)
          // Kita langsung kirim raw array ke parser baru kita
          const rawOut = output[0]; // Float32Array

          // Debugging log (optional)
          // console.log(`⚡ Inference: ${inferenceOnlyTime}ms`);

          const parsedDetections = parseYOLOOutput(
            rawOut as Float32Array,
            labels, // ["Mentah", "Mengkal/Transisi", ...]
            640, // Input Size
            0.5, // Confidence Threshold
            0.5 // IOU Threshold
          );

          // 4. Filtering Logic (Jarak dari tengah, size, ratio)
          // Kode filter Anda sudah bagus, pertahankan.
          const filteredDetections = parsedDetections.filter((det) => {
            // ... paste logika filter Anda di sini ...
            // Pastikan threshold area disesuaikan dengan pixel 640x640
            // (misal area > 5000)

            // Logika Anda: area > 50000.
            // Pada canvas 640x640, 50.000 itu sekitar 12% layar.
            // Jika buahnya kecil (jauh), mungkin perlu diturunkan ke 10.000
            const area = det.bbox[2] * det.bbox[3];
            return area > 5000 && det.confidence > 0.45;
          });

          // 5. Scaling ke Layar HP
          const scaledDetections = scaleDetectionsCenterCrop(
            filteredDetections,
            640,
            decodeResult,
            screenWidth,
            screenHeight
          );

          // 6. Update Stats
          const totalTime = Date.now() - inferenceStart + inferenceOnlyTime;
          const now = Date.now();
          const timeDiff = now - lastFrameTime.current;
          const currentFps = timeDiff > 0 ? Math.round(1000 / timeDiff) : 0;
          lastFrameTime.current = now;

          onDetectionsUpdate(scaledDetections);
          onStatsUpdate(currentFps, totalTime);

          // Beri jeda sedikit agar tidak memakan 100% CPU
          await new Promise((resolve) => setTimeout(resolve, 10));
        } catch (error: any) {
          console.log("❌ Error Inference Loop:", error.message);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    };

    runInferenceLoop();

    return () => {
      scanLoopActive.current = false;
    };
  }, [isScanning, model, labels]);
}
