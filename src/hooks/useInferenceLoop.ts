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
  confidenceThreshold?: number; // Prop optional
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
  // ✅ PERBAIKAN 4: Default Threshold Tinggi (0.75) agar AI tidak halusinasi
  confidenceThreshold = 0.6, 
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
            quality: 30, 
          });

          const fileUri = snapshot.path.startsWith("file://")
            ? snapshot.path
            : `file://${snapshot.path}`;

          const decodeResult = await decodeImageCenterCrop(fileUri, 640);
          const normalized = normalizeImage(decodeResult.pixels);

          const inferenceStart = Date.now();

          // Run Inference
          const output = model!.runSync([normalized]);
          const inferenceOnlyTime = Date.now() - inferenceStart;

          // Post Process
          const rawOut = output[0]; // Float32Array

          const parsedDetections = parseYOLOOutput(
            rawOut as Float32Array,
            labels,
            640,
            // ✅ PERBAIKAN 5: Gunakan threshold variable (0.75), bukan hardcode 0.5
            confidenceThreshold, 
            0.5 // IOU Threshold
          );

          // Filtering Logic
          const filteredDetections = parsedDetections.filter((det) => {
             // Luas area bounding box (pixel kuadrat)
             const area = det.bbox[2] * det.bbox[3];
             
             // ✅ PERBAIKAN 6: Hapus filter confidence manual, 
             // karena sudah difilter di parseYOLOOutput. 
             // Fokus filter area saja (buang objek kecil/jauh).
             return area > 6000; 
          });

          // Scaling ke Layar HP
          const scaledDetections = scaleDetectionsCenterCrop(
            filteredDetections,
            640,
            decodeResult,
            screenWidth,
            screenHeight
          );

          // Update Stats
          const totalTime = Date.now() - inferenceStart + inferenceOnlyTime;
          const now = Date.now();
          const timeDiff = now - lastFrameTime.current;
          const currentFps = timeDiff > 0 ? Math.round(1000 / timeDiff) : 0;
          lastFrameTime.current = now;

          onDetectionsUpdate(scaledDetections);
          onStatsUpdate(currentFps, totalTime);

          // Jeda sedikit agar CPU napas
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
  }, [isScanning, model, labels, confidenceThreshold]); // Tambahkan dependency
}