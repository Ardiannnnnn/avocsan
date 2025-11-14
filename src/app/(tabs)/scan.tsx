import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useState, useRef, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTFLiteModel } from "../../hooks/useTFLiteModel";
import { useInferenceLoop } from "../../hooks/useInferenceLoop";
import { Detection } from "../../utils/yoloPostProcess";
import { ScanHeader } from "../../components/ScanHeader";
import { BoundingBoxes } from "../../components/BoundingBoxes";
import { ScanControls } from "../../components/ScanControls";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const device = useCameraDevice("back");
  const cameraRef = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();

  const format = useMemo(() => {
    return (
      device?.formats.find(
        (f) => f.videoWidth === 1920 && f.videoHeight === 1080
      ) ?? device?.formats[0]
    );
  }, [device]);

  const {
    model,
    labels,
    isLoading: modelLoading,
    error: modelError,
  } = useTFLiteModel();

  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);

  // ✅ Use custom hook for inference loop
  useInferenceLoop({
    isScanning,
    model,
    labels,
    cameraRef,
    screenWidth: width,
    screenHeight: height,
    onDetectionsUpdate: setDetections,
    onStatsUpdate: (newFps, newInferenceTime) => {
      setFps(newFps);
      setInferenceTime(newInferenceTime);
    },
  });

  const startScanning = async () => {
    console.log("🔍 startScanning called!");

    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        Alert.alert("Error", "Camera permission required!");
        return;
      }
    }

    if (!model) {
      Alert.alert("Error", "Model not loaded yet!");
      return;
    }

    setIsScanning(true);
    setDetections([]);
  };

  const stopScanning = () => {
    console.log("🛑 stopScanning called!");
    setIsScanning(false);
    setDetections([]);
  };

  // ✅ Loading/Error States
  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <Ionicons name="camera-outline" size={80} color="white" />
        <Text className="text-white text-2xl font-bold mt-6 text-center">
          Camera Permission Required
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-600 px-10 py-4 rounded-full mt-8"
        >
          <Text className="text-white font-bold text-lg">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (modelLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Ionicons name="cube-outline" size={80} color="white" />
        <Text className="text-white text-2xl font-bold mt-6">
          Processing...
        </Text>
      </View>
    );
  }

  if (modelError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <Ionicons name="alert-circle-outline" size={80} color="#ef4444" />
        <Text className="text-white text-2xl font-bold mt-6 text-center">
          Model Loading Failed
        </Text>
        <Text className="text-gray-400 text-center mt-3">{modelError}</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-lg">Initializing camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        device={device}
        isActive={true}
        format={format}
        photo={true}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <ScanHeader
          isScanning={isScanning}
          detectionCount={detections.length}
          inferenceTime={inferenceTime}
          fps={fps}
          topInset={insets.top}
        />

        <BoundingBoxes detections={detections} />

        <ScanControls
          isScanning={isScanning}
          onStartScan={startScanning}
          onStopScan={stopScanning}
          bottomInset={insets.bottom}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
