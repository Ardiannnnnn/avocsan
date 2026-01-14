import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Detection } from "../utils/yoloPostProcess";
import { getClassInfo } from "../utils/avocadoClassification";
import { getColorForClass } from "../utils/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width, height: screenHeight } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isTablet = width >= 768;

// ✅ RESPONSIVE IMAGE DIMENSIONS
const FIXED_IMAGE_WIDTH = width - 32;
const FIXED_IMAGE_HEIGHT = isSmallDevice ? 300 : isMediumDevice ? 350 : isTablet ? 500 : 400;

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
  
  // ✅ CHANGE: Slide animation instead of fade
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleFinish = () => {
    // ✅ FIX: Navigate to home tab
    router.push("/(tabs)");
  };
  
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

    // Original image aspect ratio
    const imageAspectRatio =
      originalImageDimensions.width / originalImageDimensions.height;
    const containerAspectRatio = FIXED_IMAGE_WIDTH / FIXED_IMAGE_HEIGHT;

    let displayedImageWidth: number;
    let displayedImageHeight: number;
    let cropOffsetX = 0;
    let cropOffsetY = 0;

    // resizeMode="cover" behavior: image fills container, may be cropped
    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider than container - height fills, sides cropped
      displayedImageHeight = FIXED_IMAGE_HEIGHT;
      displayedImageWidth = FIXED_IMAGE_HEIGHT * imageAspectRatio;
      cropOffsetX = (displayedImageWidth - FIXED_IMAGE_WIDTH) / 2;
    } else {
      // Image is taller than container - width fills, top/bottom cropped
      displayedImageWidth = FIXED_IMAGE_WIDTH;
      displayedImageHeight = FIXED_IMAGE_WIDTH / imageAspectRatio;
      cropOffsetY = (displayedImageHeight - FIXED_IMAGE_HEIGHT) / 2;
    }

    // Detection bbox is in SCREEN coordinates (from camera preview)
    // We need to map: screen coords → original image coords → display coords
    
    // Step 1: Scale from screen to original image coordinates
    const scaleScreenToImageX = originalImageDimensions.width / width;
    const scaleScreenToImageY = originalImageDimensions.height / screenHeight;
    
    const imageX = det.bbox[0] * scaleScreenToImageX;
    const imageY = det.bbox[1] * scaleScreenToImageY;
    const imageW = det.bbox[2] * scaleScreenToImageX;
    const imageH = det.bbox[3] * scaleScreenToImageY;
    
    // Step 2: Scale from original image to displayed size (before crop)
    const scaleImageToDisplayX = displayedImageWidth / originalImageDimensions.width;
    const scaleImageToDisplayY = displayedImageHeight / originalImageDimensions.height;
    
    const displayX = imageX * scaleImageToDisplayX;
    const displayY = imageY * scaleImageToDisplayY;
    const displayW = imageW * scaleImageToDisplayX;
    const displayH = imageH * scaleImageToDisplayY;
    
    // Step 3: Apply crop offset (because of resizeMode="cover")
    const finalX = displayX - cropOffsetX;
    const finalY = displayY - cropOffsetY;

    return {
      left: finalX,
      top: finalY,
      width: displayW,
      height: displayH,
    };
  };

  const getGradientColors = (): [string, string] => {
    switch (classInfo.label) {
      case "Belum Matang":
        return ["#22c55e", "#16a34a"];
      case "Mulai Matang":
        return ["#eab308", "#ca8a04"];
      case "Matang":
        return ["#f59e0b", "#d97706"];
      case "Matang Sempurna":
        return ["#f97316", "#ea580c"];
      case "Terlalu Matang":
        return ["#ef4444", "#dc2626"];
      default:
        return ["#10b981", "#059669"];
    }
  };

  return (
    <Animated.View 
      className="flex-1 bg-gray-50"
      style={{ 
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }] // ✅ ADD: Slide effect
      }}
    >
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
            paddingHorizontal: isTablet ? 40 : 24,
            paddingBottom: 32,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View className="items-center">
            {/* Responsive Emoji */}
            <Text
              style={{
                fontSize: isSmallDevice ? 60 : isMediumDevice ? 70 : isTablet ? 100 : 80,
                marginBottom: 12,
                textShadowColor: "rgba(0,0,0,0.1)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {classInfo.emoji}
            </Text>

            {/* Responsive headline */}
            <Text 
              className="text-white/90 font-medium text-center mb-1 tracking-wide uppercase"
              style={{ fontSize: isSmallDevice ? 11 : 12 }}
            >
              Hasil Deteksi Avoscan Model
            </Text>

            {/* Responsive main classification */}
            <Text
              className="text-white font-black text-center mb-3"
              style={{ 
                fontSize: isSmallDevice ? 28 : isMediumDevice ? 32 : isTablet ? 44 : 36,
                letterSpacing: 0.5 
              }}
            >
              {classInfo.stage}
            </Text>

            {/* Responsive confidence display */}
            <View className="bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-full flex-row items-center">
              <View className="bg-white/30 rounded-full p-1 mr-2">
                <Ionicons 
                  name="checkmark-circle" 
                  size={isSmallDevice ? 14 : 16} 
                  color="white" 
                />
              </View>
              <Text 
                className="text-white font-bold"
                style={{ fontSize: isSmallDevice ? 14 : 16 }}
              >
                Akurasi {Math.round(detection.confidence * 100)}%
              </Text>
            </View>
          </View>

          {/* Responsive info pills */}
          <View className="flex-row justify-center mt-6 gap-2 flex-wrap">
            <View className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex-row items-center">
              <Ionicons 
                name="calendar-outline" 
                size={isSmallDevice ? 14 : 16} 
                color="white" 
              />
              <Text 
                className="text-white font-semibold ml-2"
                style={{ fontSize: isSmallDevice ? 12 : 14 }}
              >
                Tahan {classInfo.shelfLife}
              </Text>
            </View>

            {allDetections.length > 1 && (
              <View className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex-row items-center">
                <Ionicons 
                  name="scan-outline" 
                  size={isSmallDevice ? 14 : 16} 
                  color="white" 
                />
                <Text 
                  className="text-white font-semibold ml-2"
                  style={{ fontSize: isSmallDevice ? 12 : 14 }}
                >
                  {allDetections.length} Alpukat Terdeteksi
                </Text>
              </View>
            )}

            {detection.confidence >= 0.8 && (
              <View className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex-row items-center">
                <Ionicons 
                  name="star" 
                  size={isSmallDevice ? 14 : 16} 
                  color="white" 
                />
                <Text 
                  className="text-white font-semibold ml-2"
                  style={{ fontSize: isSmallDevice ? 12 : 14 }}
                >
                  Deteksi Akurat
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Responsive info cards */}
        <View 
          className="py-6 bg-white mt-4 rounded-3xl shadow-sm border border-gray-100"
          style={{
            marginHorizontal: isTablet ? 40 : 16,
            paddingHorizontal: isTablet ? 32 : 16,
          }}
        >
          {/* What to do section */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-gradient-to-br from-green-400 to-green-600 p-2.5 rounded-xl shadow-sm">
                <Ionicons 
                  name="leaf" 
                  size={isSmallDevice ? 18 : isTablet ? 26 : 22} 
                  color="white" 
                />
              </View>
              <View className="ml-3 flex-1">
                <Text 
                  className="text-gray-800 font-bold"
                  style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
                >
                  Cara Terbaik Menikmati
                </Text>
                <Text 
                  className="text-gray-500 mt-0.5"
                  style={{ fontSize: isSmallDevice ? 10 : 12 }}
                >
                  Rekomendasi:
                </Text>
              </View>
            </View>
            <View className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-500">
              <Text 
                className="text-gray-700 leading-6 font-medium"
                style={{ fontSize: isSmallDevice ? 14 : 15 }}
              >
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
                <Ionicons 
                  name="book" 
                  size={isSmallDevice ? 18 : isTablet ? 26 : 22} 
                  color="white" 
                />
              </View>
              <View className="ml-3 flex-1">
                <Text 
                  className="text-gray-800 font-bold"
                  style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
                >
                  Tentang Tingkat Kematangan
                </Text>
                <Text 
                  className="text-gray-500 mt-0.5"
                  style={{ fontSize: isSmallDevice ? 10 : 12 }}
                >
                  Penjelasan Detail
                </Text>
              </View>
            </View>
            <View className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-500">
              <Text 
                className="text-gray-700 leading-6 font-medium"
                style={{ fontSize: isSmallDevice ? 14 : 15 }}
              >
                {classInfo.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Image section */}
        <View 
          className="mt-6"
          style={{ paddingHorizontal: isTablet ? 40 : 16 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text 
              className="text-gray-800 font-bold"
              style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
            >
              Hasil Foto
            </Text>
            {allDetections.length > 1 && (
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                <Text 
                  className="text-gray-500"
                  style={{ fontSize: isSmallDevice ? 12 : 13 }}
                >
                  = Objek terpilih
                </Text>
              </View>
            )}
          </View>

          {/* RESPONSIVE IMAGE CONTAINER */}
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

          {/* Responsive Image Info */}
          <View className="flex-row items-center justify-center mt-3 gap-4 flex-wrap">
            <View className="flex-row items-center">
              <Ionicons name="camera-outline" size={14} color="#9ca3af" />
              <Text 
                className="text-gray-500 ml-1"
                style={{ fontSize: isSmallDevice ? 10 : 12 }}
              >
                High Quality
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="scan-outline" size={14} color="#9ca3af" />
              <Text 
                className="text-gray-500 ml-1"
                style={{ fontSize: isSmallDevice ? 10 : 12 }}
              >
                AI Analyzed
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

      {/* RESPONSIVE FLOATING BUTTONS */}
      <View
        style={{
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
          paddingHorizontal: isTablet ? 40 : 20,
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
            className="flex-1 bg-gray-100 rounded-2xl border-2 border-gray-300"
            style={{ paddingVertical: isSmallDevice ? 14 : 16 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name="camera" 
                size={isSmallDevice ? 18 : isTablet ? 24 : 22} 
                color="#374151" 
              />
              <Text 
                className="text-gray-800 font-bold text-center ml-2"
                style={{ fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16 }}
              >
                Scan Ulang
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFinish}
            style={{
              backgroundColor: getGradientColors()[0],
              paddingVertical: isSmallDevice ? 14 : 16,
            }}
            className="flex-1 rounded-2xl shadow-lg"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name="checkmark-circle" 
                size={isSmallDevice ? 18 : isTablet ? 24 : 22} 
                color="white" 
              />
              <Text 
                className="text-white font-bold text-center ml-2"
                style={{ fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16 }}
              >
                Selesai
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};