import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Detection } from "../utils/yoloPostProcess";
import { getClassInfo } from "../utils/avocadoClassification";
import { getColorForClass } from "../utils/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width, height: screenHeight } = Dimensions.get("window");
const isSmallDevice = width < 375;

// ✅ DEFINE FIXED IMAGE DIMENSIONS
const FIXED_IMAGE_WIDTH = width - 32; // Padding 16 each side
const FIXED_IMAGE_HEIGHT = 400; // Fixed height

interface DetectionResultProps {
  photoUri: string;
  detection: Detection;
  allDetections?: Detection[];
  onClose: () => void;
  onRetake: () => void;
}

export const DetectionResult = ({
  photoUri,
  detection,
  allDetections = [],
  onClose,
  onRetake,
}: DetectionResultProps) => {
  const insets = useSafeAreaInsets();
  const classInfo = getClassInfo(detection.className);

  const handleFinish = () => {
    router.push("/(tabs)");
  }
  // ✅ Track original image dimensions for bbox scaling
  const [originalImageDimensions, setOriginalImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageLoad = (event: any) => {
    const { width: imgWidth, height: imgHeight } = event.nativeEvent.source;

    console.log(`📐 Original image: ${imgWidth}x${imgHeight}`);
    console.log(
      `📐 Display container: ${FIXED_IMAGE_WIDTH}x${FIXED_IMAGE_HEIGHT}`
    );

    setOriginalImageDimensions({
      width: imgWidth,
      height: imgHeight,
    });
  };

  // ✅ Scale detection from screen coords to fixed display coords
  const scaleDetectionToDisplay = (det: Detection) => {
    if (originalImageDimensions.width === 0) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    // Calculate how image is displayed in fixed container
    const imageAspectRatio =
      originalImageDimensions.height / originalImageDimensions.width;
    const containerAspectRatio = FIXED_IMAGE_HEIGHT / FIXED_IMAGE_WIDTH;

    let displayedImageWidth: number;
    let displayedImageHeight: number;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspectRatio > containerAspectRatio) {
      // Image is taller, will be cropped top/bottom (cover height)
      displayedImageHeight = FIXED_IMAGE_HEIGHT;
      displayedImageWidth = FIXED_IMAGE_HEIGHT / imageAspectRatio;
      offsetX = (FIXED_IMAGE_WIDTH - displayedImageWidth) / 2;
    } else {
      // Image is wider, will be cropped left/right (cover width)
      displayedImageWidth = FIXED_IMAGE_WIDTH;
      displayedImageHeight = FIXED_IMAGE_WIDTH * imageAspectRatio;
      offsetY = (FIXED_IMAGE_HEIGHT - displayedImageHeight) / 2;
    }

    // Scale from screen coordinates to displayed image coordinates
    const scaleX = displayedImageWidth / width;
    const scaleY = displayedImageHeight / screenHeight;

    return {
      left: det.bbox[0] * scaleX + offsetX,
      top: det.bbox[1] * scaleY + offsetY,
      width: det.bbox[2] * scaleX,
      height: det.bbox[3] * scaleY,
    };
  };

  const getGradientColors = (): [string, string] => {
    switch (classInfo.label) {
      case "Mentah":
        return ["#22c55e", "#16a34a"];
      case "Mengkal":
        return ["#eab308", "#ca8a04"];
      case "Matang":
        return ["#f59e0b", "#d97706"];
      case "Sangat Matang":
        return ["#f97316", "#ea580c"];
      case "Busuk":
        return ["#ef4444", "#dc2626"];
      default:
        return ["#10b981", "#059669"];
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 24,
            paddingBottom: 32,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          {/* ✅ IMPROVED: More engaging main result */}
          <View className="items-center">
            {/* Emoji with subtle animation feel */}
            <Text
              style={{
                fontSize: 80,
                marginBottom: 12,
                textShadowColor: "rgba(0,0,0,0.1)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {classInfo.emoji}
            </Text>

            {/* ✅ NEW: Contextual headline */}
            <Text className="text-white/90 text-sm font-medium text-center mb-1 tracking-wide uppercase">
              Hasil Deteksi AI
            </Text>

            {/* Main classification */}
            <Text
              className="text-white text-4xl font-black text-center mb-3"
              style={{ letterSpacing: 0.5 }}
            >
              {classInfo.stage}
            </Text>

            {/* ✅ IMPROVED: More descriptive confidence display */}
            <View className="bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-full flex-row items-center">
              <View className="bg-white/30 rounded-full p-1 mr-2">
                <Ionicons name="checkmark-circle" size={16} color="white" />
              </View>
              <Text className="text-white font-bold text-base">
                Akurasi {Math.round(detection.confidence * 100)}%
              </Text>
            </View>
          </View>

          {/* ✅ IMPROVED: Enhanced info pills with better copy */}
          <View className="flex-row justify-center mt-6 gap-2 flex-wrap">
            <View className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text className="text-white font-semibold ml-2 text-sm">
                Tahan {classInfo.shelfLife}
              </Text>
            </View>

            {allDetections.length > 1 && (
              <View className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex-row items-center">
                <Ionicons name="scan-outline" size={16} color="white" />
                <Text className="text-white font-semibold ml-2 text-sm">
                  {allDetections.length} Alpukat Terdeteksi
                </Text>
              </View>
            )}

            {/* ✅ NEW: Add quality indicator */}
            {detection.confidence >= 0.8 && (
              <View className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex-row items-center">
                <Ionicons name="star" size={16} color="white" />
                <Text className="text-white font-semibold ml-2 text-sm">
                  Deteksi Akurat
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ✅ IMPROVED: More engaging info cards */}
        <View className="px-4 py-6 bg-white mt-4 mx-4 rounded-3xl shadow-sm border border-gray-100">
          {/* What to do section */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-gradient-to-br from-green-400 to-green-600 p-2.5 rounded-xl shadow-sm">
                <Ionicons name="leaf" size={22} color="white" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-bold text-lg">
                  Cara Terbaik Menikmati
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  Rekomendasi untuk Anda
                </Text>
              </View>
            </View>
            <View className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-500">
              <Text className="text-gray-700 text-base leading-6 font-medium">
                {classInfo.recommendation}
              </Text>
            </View>
          </View>

          {/* Divider with icon */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-gray-200" />
            <View className="mx-3 bg-gray-100 rounded-full p-1.5">
              <Ionicons name="ellipsis-horizontal" size={16} color="#9ca3af" />
            </View>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Understanding section */}
          <View>
            <View className="flex-row items-center mb-3">
              <View className="bg-gradient-to-br from-blue-400 to-blue-600 p-2.5 rounded-xl shadow-sm">
                <Ionicons name="book" size={22} color="white" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-bold text-lg">
                  Tentang Tingkat Kematangan
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  Penjelasan Detail
                </Text>
              </View>
            </View>
            <View className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-500">
              <Text className="text-gray-700 text-base leading-6 font-medium">
                {classInfo.description}
              </Text>
            </View>
          </View>
        </View>

        {/* ✅ FIXED-SIZE IMAGE VIEW */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-800 font-bold text-lg">Hasil Foto</Text>
            {allDetections.length > 1 && (
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                <Text className="text-gray-500 text-sm">= Objek terpilih</Text>
              </View>
            )}
          </View>

          {/* ✅ FIXED CONTAINER with specified dimensions */}
          <View
            className="bg-white rounded-3xl overflow-hidden shadow-lg"
            style={{
              width: FIXED_IMAGE_WIDTH,
              height: FIXED_IMAGE_HEIGHT,
              position: "relative",
            }}
          >
            {/* ✅ Image with cover mode to fill container */}
            <Image
              source={{ uri: photoUri }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover" // ✅ This will crop to fill the container
              onLoad={handleImageLoad}
            />

            {/* Bounding Boxes Overlay */}
            {allDetections.length > 0 &&
              originalImageDimensions.width > 0 &&
              allDetections.map((det, idx) => {
                const isSelected =
                  det.className === detection.className &&
                  det.confidence === detection.confidence;
                const boxColor = getColorForClass(
                  det.className,
                  det.confidence
                );
                const scaledBox = scaleDetectionToDisplay(det);

                // ✅ Only render if box is visible in container
                if (scaledBox.width === 0 || scaledBox.height === 0)
                  return null;

                return (
                  <View
                    key={idx}
                    style={{
                      position: "absolute",
                      left: scaledBox.left,
                      top: scaledBox.top,
                      width: scaledBox.width,
                      height: scaledBox.height,
                      borderWidth: isSelected ? 4 : 2,
                      borderColor: isSelected ? "#10b981" : boxColor,
                      borderRadius: 12,
                      backgroundColor: isSelected
                        ? "rgba(16, 185, 129, 0.15)"
                        : "transparent",
                    }}
                  >
                    {/* Label */}
                    <View
                      style={{
                        position: "absolute",
                        top: -32,
                        left: 0,
                        backgroundColor: isSelected ? "#10b981" : boxColor,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="white"
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <Text className="text-white text-xs font-bold">
                        {det.className} {Math.round(det.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>

          {/* Image Info */}
          <View className="flex-row items-center justify-center mt-3 gap-4">
            <View className="flex-row items-center">
              <Ionicons name="camera-outline" size={16} color="#9ca3af" />
              <Text className="text-gray-500 text-xs ml-1">High Quality</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="scan-outline" size={16} color="#9ca3af" />
              <Text className="text-gray-500 text-xs ml-1">AI Analyzed</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="resize-outline" size={16} color="#9ca3af" />
              <Text className="text-gray-500 text-xs ml-1">
                {FIXED_IMAGE_WIDTH}×{FIXED_IMAGE_HEIGHT}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        {allDetections.length > 1 && (
          <View className="px-4 mt-6">
            <View className="bg-blue-50 rounded-2xl p-4">
              <Text className="text-blue-800 font-bold text-base mb-3">
                📊 Detail Deteksi
              </Text>
              {allDetections.map((det, idx) => {
                const isSelected =
                  det.className === detection.className &&
                  det.confidence === detection.confidence;
                return (
                  <View
                    key={idx}
                    className={`flex-row justify-between items-center py-2 ${
                      idx < allDetections.length - 1
                        ? "border-b border-blue-100"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center">
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#10b981"
                          style={{ marginRight: 6 }}
                        />
                      )}
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? "font-bold text-blue-800"
                            : "text-blue-600"
                        }`}
                      >
                        {det.className}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm ${
                        isSelected ? "font-bold text-blue-800" : "text-blue-600"
                      }`}
                    >
                      {Math.round(det.confidence * 100)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Spacer for bottom buttons */}
        <View className="h-6" />
      </ScrollView>

      {/* ✅ FLOATING ACTION BUTTONS */}
      <View
        style={{
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
        className="absolute bottom-0 left-0 right-0 bg-white"
      >
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onRetake}
            className="flex-1 bg-gray-100 py-4 rounded-2xl border-2 border-gray-300"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="camera" size={22} color="#374151" />
              <Text className="text-gray-800 font-bold text-center text-base ml-2">
                Scan Ulang
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: getGradientColors()[0],
            }}
            className="flex-1 py-4 rounded-2xl shadow-lg"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text onPress={handleFinish} className="text-white font-bold text-center text-base ml-2">
                Selesai
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
