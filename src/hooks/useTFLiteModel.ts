import { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { loadTensorflowModel, type TensorflowModel, type TensorflowModelDelegate } from "react-native-fast-tflite";

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

      // 1. Definisikan Asset
      const modelModule = require("../../assets/models/model2.tflite");
      const labelsModule = require("../../assets/models/labels.txt");

      // 2. Buat objek Asset dari module
      const modelAsset = Asset.fromModule(modelModule);
      const labelsAsset = Asset.fromModule(labelsModule);

      // 3. FORCE DOWNLOAD (Kunci agar jalan di APK)
      // Ini memaksa Expo menyalin file dari dalam APK ke folder Cache HP
      await Promise.all([
        modelAsset.downloadAsync(),
        labelsAsset.downloadAsync()
      ]);

      // 4. Validasi apakah file benar-benar ada di cache
      if (!modelAsset.localUri || !labelsAsset.localUri) {
        throw new Error("Gagal menyalin aset ke penyimpanan lokal (URI null).");
      }

      console.log("📂 Model Cache Path:", modelAsset.localUri);

      // 5. Load Labels
      const labelsContent = await FileSystem.readAsStringAsync(labelsAsset.localUri);
      const loadedLabels = labelsContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      setLabels(loadedLabels);
      console.log(`✅ ${loadedLabels.length} Labels loaded`);

      // 6. Load TFLite Model
      // Gunakan 'default' (CPU) untuk Android agar paling aman/stabil
      // Gunakan 'core-ml' (NPU) untuk iOS agar ngebut
      const delegate: TensorflowModelDelegate = (Platform.OS === 'ios' ? 'core-ml' : 'default') as TensorflowModelDelegate;
      
      // ✅ FIX: Delegate dipisah menjadi argumen kedua
      const tfliteModel = await loadTensorflowModel(
        { url: modelAsset.localUri },
        delegate 
      );

      setModel(tfliteModel);
      console.log(`✅ Model loaded successfully using ${delegate} delegate!`);
      
      setIsLoading(false);
    } catch (err: any) {
      console.error("❌ Model loading error:", err);
      setError(err.message || "Failed to load model");
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