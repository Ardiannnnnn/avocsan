import { Detection, parseYOLOOutput, scaleDetections } from './yoloPostProcess';

/**
 * Run inference on a frame using TFLite model
 */
export async function runInference(
  model: any,
  frame: any, // Frame from react-native-vision-camera
  labels: string[],
  screenWidth: number,
  screenHeight: number
): Promise<{ detections: Detection[]; inferenceTime: number }> {
  
  const startTime = Date.now();

  try {
    // ✅ Run TFLite inference
    // model.runSync() expects preprocessed input
    const output = model.runSync([frame]);
    const outputTensor = output[0]; // Float32Array

    const inferenceTime = Date.now() - startTime;

    console.log('⚡ Inference completed in', inferenceTime, 'ms');

    // ✅ Parse YOLO output
    const rawDetections = parseYOLOOutput(
      outputTensor,
      labels,
      320, // Model input size
      0.5, // Confidence threshold
      0.45 // IoU threshold for NMS
    );

    // ✅ Scale to screen coordinates
    const scaledDetections = scaleDetections(
      rawDetections,
      320, // Model size
      screenWidth,
      screenHeight
    );

    return {
      detections: scaledDetections,
      inferenceTime,
    };

  } catch (error) {
    console.error('❌ Inference error:', error);
    throw error;
  }
}