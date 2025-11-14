import { Skia, ColorType, AlphaType } from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system/legacy";

export interface DecodeResult {
  pixels: Uint8Array;
  cropOffsetX: number;
  cropOffsetY: number;
  cropSize: number;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Decode image with center crop to square
 */
export async function decodeImageCenterCrop(
  fileUri: string,
  targetSize: number
): Promise<DecodeResult> {
  try {
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imageData = Skia.Data.fromBase64(base64);
    const image = Skia.Image.MakeImageFromEncoded(imageData);

    if (!image) {
      throw new Error("Failed to decode image");
    }

    const srcWidth = image.width();
    const srcHeight = image.height();

    const cropSize = Math.min(srcWidth, srcHeight);
    const cropOffsetX = Math.round((srcWidth - cropSize) / 2);
    const cropOffsetY = Math.round((srcHeight - cropSize) / 2);

    console.log(
      `📐 Center crop: ${srcWidth}x${srcHeight} → crop[${cropOffsetX},${cropOffsetY},${cropSize}x${cropSize}] → resize ${targetSize}x${targetSize}`
    );

    const surface = Skia.Surface.Make(targetSize, targetSize);
    if (!surface) {
      throw new Error("Failed to create surface");
    }

    const canvas = surface.getCanvas();
    const paint = Skia.Paint();

    canvas.drawImageRect(
      image,
      Skia.XYWHRect(cropOffsetX, cropOffsetY, cropSize, cropSize),
      Skia.XYWHRect(0, 0, targetSize, targetSize),
      paint
    );

    const snapshot = surface.makeImageSnapshot();
    const pixels = snapshot.readPixels(0, 0, {
      width: targetSize,
      height: targetSize,
      colorType: ColorType.RGBA_8888,
      alphaType: AlphaType.Unpremul,
    });

    if (!pixels) {
      throw new Error("Failed to read pixels");
    }

    const rgbPixels = new Uint8Array(targetSize * targetSize * 3);
    for (let i = 0; i < targetSize * targetSize; i++) {
      rgbPixels[i * 3] = pixels[i * 4];
      rgbPixels[i * 3 + 1] = pixels[i * 4 + 1];
      rgbPixels[i * 3 + 2] = pixels[i * 4 + 2];
    }

    return {
      pixels: rgbPixels,
      cropOffsetX,
      cropOffsetY,
      cropSize,
      originalWidth: srcWidth,
      originalHeight: srcHeight,
    };
  } catch (error) {
    console.log("❌ Skia decode error:", error);
    return {
      pixels: new Uint8Array(targetSize * targetSize * 3).fill(128),
      cropOffsetX: 0,
      cropOffsetY: 0,
      cropSize: targetSize,
      originalWidth: targetSize,
      originalHeight: targetSize,
    };
  }
}

/**
 * Normalize uint8 array to float32 [0-1]
 */
export function normalizeImage(uint8Array: Uint8Array): Float32Array {
  const normalized = new Float32Array(uint8Array.length);
  for (let i = 0; i < uint8Array.length; i++) {
    normalized[i] = uint8Array[i] / 255.0;
  }
  return normalized;
}

/**
 * Scale detections from model coords to screen coords (center crop)
 */
export function scaleDetectionsCenterCrop(
  detections: any[],
  modelSize: number,
  decodeResult: DecodeResult,
  screenWidth: number,
  screenHeight: number
): any[] {
  const {
    cropOffsetX,
    cropOffsetY,
    cropSize,
    originalWidth,
    originalHeight,
  } = decodeResult;

  return detections.map((det) => {
    const scaleFromModel = cropSize / modelSize;
    const cropX = det.bbox[0] * scaleFromModel;
    const cropY = det.bbox[1] * scaleFromModel;
    const cropW = det.bbox[2] * scaleFromModel;
    const cropH = det.bbox[3] * scaleFromModel;

    const origX = cropX + cropOffsetX;
    const origY = cropY + cropOffsetY;

    const scaleToScreenX = screenWidth / originalWidth;
    const scaleToScreenY = screenHeight / originalHeight;

    const screenX = origX * scaleToScreenX;
    const screenY = origY * scaleToScreenY;
    const screenW = cropW * scaleToScreenX;
    const screenH = cropH * scaleToScreenY;

    console.log(
      `🎯 Scaling: model[${det.bbox[0].toFixed(0)},${det.bbox[1].toFixed(
        0
      )}] → crop[${cropX.toFixed(0)},${cropY.toFixed(
        0
      )}] → screen[${screenX.toFixed(0)},${screenY.toFixed(0)}]`
    );

    return {
      ...det,
      bbox: [screenX, screenY, screenW, screenH],
    };
  });
}