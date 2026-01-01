import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  AppState,
  ActivityIndicator,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useState, useRef, useMemo, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTFLiteModel } from "../../hooks/useTFLiteModel";
import { useInferenceLoop } from "../../hooks/useInferenceLoop";
import { Detection } from "../../utils/yoloPostProcess";
import { ScanHeader } from "../../components/ScanHeader";
import { BoundingBoxes } from "../../components/BoundingBoxes";
import { DetectionResult } from "../../components/DetectionResult";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as KeepAwake from "expo-keep-awake";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isTablet = width >= 768;

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const device = useCameraDevice("back");
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused(); //
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

  const [isDetecting, setIsDetecting] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [bestDetection, setBestDetection] = useState<Detection | null>(null);
  const [allDetections, setAllDetections] = useState<Detection[]>([]);

  // ✅ NEW: Loading state
  const [isCapturing, setIsCapturing] = useState(false);
  const isCameraActive =
    !!device && isFocused && appState === "active" && !capturedPhoto;

  // Keep Awake Handler
  useEffect(() => {
    let keepAwakeTag: string | undefined;
    let mounted = true;

    const activateKeepAwake = async () => {
      if (!isDetecting || appState !== "active" || !mounted) {
        return;
      }

      try {
        await KeepAwake.activateKeepAwakeAsync("scan-screen");
        keepAwakeTag = "scan-screen";
        console.log("✅ Keep awake activated");
      } catch (error: any) {
        console.warn("⚠️ Keep awake failed (non-critical):", error.message);
      }
    };

    activateKeepAwake();

    return () => {
      mounted = false;
      if (keepAwakeTag) {
        KeepAwake.deactivateKeepAwake(keepAwakeTag).catch(() => {});
        console.log("✅ Keep awake deactivated");
      }
    };
  }, [isDetecting, appState]);

  // Monitor App State
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("📱 App state:", appState, "→", nextAppState);
      setAppState(nextAppState);

      if (nextAppState !== "active" && isDetecting) {
        console.log("⏸️ App backgrounded, stopping detection");
        setIsDetecting(false);
      } else if (nextAppState === "active" && !isDetecting && !capturedPhoto) {
        console.log("▶️ App resumed, starting detection");
        setIsDetecting(true);
      }
    });

    return () => subscription.remove();
  }, [appState, isDetecting, capturedPhoto]);

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (isDetecting) setIsDetecting(false);
      KeepAwake.deactivateKeepAwake("scan-screen").catch(() => {});
    };
  }, []);

  // Real-time detection
  useInferenceLoop({
    isScanning: isDetecting,
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
    confidenceThreshold: 0.6,
  });

  // ✅ UPDATED: Manual capture with loading state
  const handleStartAIScan = async () => {
    console.log("🎯 User pressed Start AI Scan");

    if (detections.length === 0) {
      Alert.alert(
        "Tidak Ada Deteksi",
        "Arahkan kamera ke alpukat terlebih dahulu",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      // ✅ Show loading
      setIsCapturing(true);
      console.log("⏳ Starting capture process...");

      // Stop detection
      setIsDetecting(false);

      // Small delay to ensure UI updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Take snapshot
      console.log("📸 Taking snapshot...");
      const snapshotStart = Date.now();

      const snapshot = await cameraRef.current!.takeSnapshot({
        quality: 85,
      });

      const snapshotTime = Date.now() - snapshotStart;
      console.log(`✅ Snapshot done in ${snapshotTime}ms`);

      const photoUri = snapshot.path.startsWith("file://")
        ? snapshot.path
        : `file://${snapshot.path}`;

      console.log("📊 Processing detections...");

      // Find best detection
      const bestDet = detections.reduce((prev, current) =>
        current.confidence > prev.confidence ? current : prev
      );

      // Show result
      setCapturedPhoto(photoUri);
      setBestDetection(bestDet);
      setAllDetections([...detections]);
      setDetections([]);

      console.log("✅ Ready to show result");

      // ✅ Hide loading
      setIsCapturing(false);
    } catch (error: any) {
      console.error("❌ Snapshot error:", error);

      // ✅ Hide loading on error
      setIsCapturing(false);

      Alert.alert("Error", "Gagal mengambil foto. Coba lagi.");
      setIsDetecting(true);
    }
  };

  const handleCloseResult = () => {
    console.log("✅ Closing result, resuming detection");
    setCapturedPhoto(null);
    setBestDetection(null);
    setAllDetections([]);
    setIsDetecting(true);
  };

  const handleRetake = () => {
    console.log("🔄 Retake, resuming detection");
    setCapturedPhoto(null);
    setBestDetection(null);
    setAllDetections([]);
    setIsDetecting(true);
  };

  // Permission Check
  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <Ionicons name="camera-outline" size={80} color="white" />
        <Text className="text-white text-2xl font-bold mt-6 text-center">
          Izin Kamera Diperlukan
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-600 px-10 py-4 rounded-full mt-8"
        >
          <Text className="text-white font-bold text-lg">Izinkan Akses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Model Loading
  if (modelLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Ionicons name="cube-outline" size={80} color="white" />
        <Text className="text-white text-2xl font-bold mt-6">Loading...</Text>
      </View>
    );
  }

  // Model Error
  if (modelError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <Ionicons name="alert-circle-outline" size={80} color="#ef4444" />
        <Text className="text-white text-2xl font-bold mt-6 text-center">
          Loading Gagal
        </Text>
        <Text className="text-gray-400 text-center mt-3">{modelError}</Text>
      </View>
    );
  }

  // Device Check
  if (!device) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-lg">Menginisialisasi kamera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        device={device}
        isActive={isCameraActive}
        format={format}
        photo={true}
        style={StyleSheet.absoluteFill}
      />

      {!capturedPhoto && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <ScanHeader
            isScanning={isDetecting}
            detectionCount={detections.length}
            inferenceTime={inferenceTime}
            fps={fps}
            topInset={insets.top}
          />

          <BoundingBoxes detections={detections} />

          {/* ✅ RESPONSIVE Manual Scan Controls */}
          <View
            style={{
              position: "absolute",
              bottom: insets.bottom + (isSmallDevice ? 16 : 24),
              left: 0,
              right: 0,
              paddingHorizontal: isTablet ? 60 : isSmallDevice ? 24 : 40,
            }}
          >
            <View className="items-center">
              {detections.length > 0 ? (
                <View
                  className="bg-green-500/80 backdrop-blur-sm rounded-2xl mb-4"
                  style={{
                    paddingHorizontal: isSmallDevice ? 16 : 24,
                    paddingVertical: isSmallDevice ? 10 : 12,
                  }}
                >
                  <Text
                    className="text-white font-bold text-center"
                    style={{ fontSize: isSmallDevice ? 13 : 15 }}
                  >
                    ✓ {detections.length} alpukat terdeteksi
                  </Text>
                  <Text
                    className="text-white/90 text-center mt-1"
                    style={{ fontSize: isSmallDevice ? 10 : 12 }}
                  >
                    Tekan tombol untuk melihat hasil
                  </Text>
                </View>
              ) : (
                <Text
                  className="text-white/80 mb-4 text-center"
                  style={{ fontSize: isSmallDevice ? 12 : 14 }}
                >
                  Arahkan kamera ke buah alpukat
                </Text>
              )}

              {/* ✅ RESPONSIVE Button */}
              <TouchableOpacity
                onPress={handleStartAIScan}
                disabled={detections.length === 0 || isCapturing}
                className={`rounded-full shadow-2xl ${
                  isCapturing
                    ? "bg-yellow-600"
                    : detections.length > 0
                    ? "bg-green-600"
                    : "bg-gray-600"
                }`}
                style={{
                  padding: isSmallDevice ? 18 : isTablet ? 28 : 24,
                }}
                activeOpacity={0.8}
              >
                {isCapturing ? (
                  <ActivityIndicator
                    size={isSmallDevice ? 32 : isTablet ? 48 : 40}
                    color="white"
                  />
                ) : (
                  <Ionicons
                    name="scan-circle"
                    size={isSmallDevice ? 32 : isTablet ? 48 : 40}
                    color="white"
                  />
                )}
              </TouchableOpacity>

              {/* ✅ RESPONSIVE Label */}
              <Text
                className="text-white font-bold mt-4"
                style={{ fontSize: isSmallDevice ? 14 : isTablet ? 20 : 16 }}
              >
                {isCapturing
                  ? "Memproses..."
                  : detections.length > 0
                  ? "Start Scanning"
                  : "Mencari Buah Alpukat..."}
              </Text>
            </View>
          </View>

          {/* ✅ RESPONSIVE Loading Overlay */}
          {isCapturing && (
            <View
              style={StyleSheet.absoluteFill}
              className="bg-black/70 items-center justify-center"
            >
              <View
                className="bg-gray-800/90 backdrop-blur-lg rounded-3xl items-center"
                style={{
                  paddingHorizontal: isSmallDevice ? 24 : isTablet ? 48 : 32,
                  paddingVertical: isSmallDevice ? 20 : isTablet ? 32 : 24,
                }}
              >
                <ActivityIndicator size="large" color="#10b981" />
                <Text
                  className="text-white font-bold mt-4"
                  style={{ fontSize: isSmallDevice ? 16 : isTablet ? 22 : 18 }}
                >
                  Mengambil Foto...
                </Text>
                <Text
                  className="text-gray-400 mt-2"
                  style={{ fontSize: isSmallDevice ? 12 : isTablet ? 16 : 14 }}
                >
                  Mohon tunggu sebentar
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {capturedPhoto && bestDetection && (
        <DetectionResult
          photoUri={capturedPhoto}
          detection={bestDetection}
          allDetections={allDetections}
          onClose={handleCloseResult}
          onRetake={handleRetake}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});