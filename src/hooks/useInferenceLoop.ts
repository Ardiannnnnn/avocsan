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
            quality: 30,
          });

          const fileUri = snapshot.path.startsWith("file://")
            ? snapshot.path
            : `file://${snapshot.path}`;

          const decodeResult = await decodeImageCenterCrop(fileUri, 640);
          const normalized = normalizeImage(decodeResult.pixels);

          const inferenceStart = Date.now();
          const output = model!.runSync([normalized]);
          const inferenceOnlyTime = Date.now() - inferenceStart;

          console.log(`⚡ Pure inference time: ${inferenceOnlyTime}ms`);

          const rawOut = output[0] as ArrayLike<number>;
          const raw = Float32Array.from(rawOut);

          console.log(
            `📈 Raw output shape: [${raw.length}] (${
              raw.length / 9
            } boxes × 9 channels)`
          );

          if (raw.length >= 9) {
            console.log(
              `🔍 First detection raw values: [${Array.from(raw.slice(0, 9))
                .map((v) => v.toFixed(3))
                .join(", ")}]`
            );
          }

          // Transpose if needed
          const channels = 9;
          const numBoxes = raw.length / channels;
          let outputArray: Float32Array;

          if (raw.length === channels * numBoxes) {
            if (raw[4] !== undefined && Math.abs(raw[4]) < 1e-4) {
              outputArray = raw;
            } else {
              outputArray = new Float32Array(raw.length);
              for (let i = 0; i < numBoxes; i++) {
                for (let c = 0; c < channels; c++) {
                  outputArray[i * channels + c] = raw[c * numBoxes + i];
                }
              }
            }
          } else {
            outputArray = raw;
          }

          const parsedDetections = parseYOLOOutput(
            outputArray,
            labels,
            640,
            0.45,
            0.45
          );

          const filteredDetections = parsedDetections.filter((det) => {
            const area = det.bbox[2] * det.bbox[3];
            const aspectRatio = det.bbox[2] / det.bbox[3];
            return (
              area > 10000 &&
              area < 450000 &&
              aspectRatio > 0.5 &&
              aspectRatio < 2.0
            );
          });

          console.log(
            `🔍 Filtered: ${parsedDetections.length} → ${filteredDetections.length} detections`
          );

          // Log summary
          const classCounts: Record<string, number> = {};
          const classConfidences: Record<string, number[]> = {};

          filteredDetections.forEach((det) => {
            classCounts[det.className] = (classCounts[det.className] || 0) + 1;
            if (!classConfidences[det.className]) {
              classConfidences[det.className] = [];
            }
            classConfidences[det.className].push(det.confidence);
          });

          console.log(`📊 Detection summary:`);
          Object.entries(classCounts).forEach(([className, count]) => {
            const confidences = classConfidences[className];
            const avgConf =
              confidences.reduce((a, b) => a + b, 0) / confidences.length;
            const maxConf = Math.max(...confidences);
            const minConf = Math.min(...confidences);
            console.log(
              `   ${className}: ${count}x (conf: ${minConf.toFixed(
                2
              )}-${maxConf.toFixed(2)}, avg: ${avgConf.toFixed(2)})`
            );
          });

          filteredDetections.forEach((det, idx) => {
            const area = det.bbox[2] * det.bbox[3];
            const aspectRatio = det.bbox[2] / det.bbox[3];
            console.log(
              `📦 Box ${idx}: ${det.className} | size=${area.toFixed(
                0
              )}px² | aspect=${aspectRatio.toFixed(
                2
              )} | conf=${det.confidence.toFixed(3)}`
            );
          });

          const scaledDetections = scaleDetectionsCenterCrop(
            filteredDetections,
            640,
            decodeResult,
            screenWidth,
            screenHeight
          );

          const totalTime = Date.now() - inferenceStart + inferenceOnlyTime;

          const now = Date.now();
          const timeDiff = now - lastFrameTime.current;
          const currentFps = timeDiff > 0 ? Math.round(1000 / timeDiff) : 0;
          lastFrameTime.current = now;

          onDetectionsUpdate(scaledDetections);
          onStatsUpdate(currentFps, totalTime);

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: any) {
          console.log("❌ Error:", error.message);
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