import { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { loadTensorflowModel } from "react-native-fast-tflite";
import type { TensorflowModel } from "react-native-fast-tflite";

export const useTFLiteModel = () => {
  const [model, setModel] = useState<TensorflowModel | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      console.log("📦 Loading TFLite model...");
      setIsLoading(true);
      setError(null);

      // ✅ Use Asset.fromModule (works better for .tflite)
      const [modelAsset, labelsAsset] = await Asset.loadAsync([
        require("../../assets/models/avocado_model.tflite"),
        require("../../assets/models/labels.txt"),
      ]);

      console.log("✅ Assets loaded");
      console.log("📂 Model URI:", modelAsset.localUri);
      console.log("📂 Labels URI:", labelsAsset.localUri);

      if (!modelAsset.localUri || !labelsAsset.localUri) {
        throw new Error("Asset URIs not available");
      }

      // ✅ Load labels
      const labelsContent = await FileSystem.readAsStringAsync(
        labelsAsset.localUri
      );
      const loadedLabels = labelsContent
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      setLabels(loadedLabels);
      console.log("✅ Labels loaded:", loadedLabels);

      // ✅ Load TFLite model
      const tfliteModel = await loadTensorflowModel({
        url: modelAsset.localUri,
      });
      setModel(tfliteModel);

      console.log("✅ TFLite model loaded successfully");
      console.log("✅ TFLite model loaded successfully");
      console.log("📊 Model info:", {
        inputShape: tfliteModel.inputs[0]?.shape,
        outputShape: tfliteModel.outputs[0]?.shape,
      });
      setIsLoading(false);
    } catch (err) {
      console.error("❌ Model loading error:", err);
      setError(err instanceof Error ? err.message : "Failed to load model");
      setIsLoading(false);
    }
  };

  return {
    model,
    labels,
    isLoading,
    error,
    reload: loadModel,
  };
};