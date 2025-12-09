import { View, Text, ActivityIndicator, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export const ProcessingOverlay = () => {
  return (
    <View className="absolute inset-0 bg-black/80 justify-center items-center">
      <ActivityIndicator
        size={isSmallDevice ? "large" : "large"}
        color="#10b981"
      />
      <Text
        className="text-white font-bold mt-4"
        style={{ fontSize: isSmallDevice ? 18 : isTablet ? 28 : 20 }}
      >
        Processing...
      </Text>
      <Text
        className="text-white/70 mt-2"
        style={{ fontSize: isSmallDevice ? 12 : isTablet ? 16 : 14 }}
      >
        Menganalisis hasil deteksi
      </Text>
    </View>
  );
};