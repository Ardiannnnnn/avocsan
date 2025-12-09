import { View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export const NoDetectionOverlay = () => {
  return (
    <View className="absolute inset-0 justify-center items-center" pointerEvents="none">
      <View
        className="bg-black/60 rounded-3xl"
        style={{
          paddingHorizontal: isSmallDevice ? 20 : isTablet ? 40 : 32,
          paddingVertical: isSmallDevice ? 12 : isTablet ? 20 : 16,
        }}
      >
        <View className="flex-row items-center">
          <Ionicons
            name="search"
            size={isSmallDevice ? 20 : isTablet ? 32 : 24}
            color="white"
          />
          <Text
            className="text-white font-semibold ml-3"
            style={{ fontSize: isSmallDevice ? 16 : isTablet ? 24 : 18 }}
          >
            No Object Detected
          </Text>
        </View>
        <Text
          className="text-white/80 text-center mt-2"
          style={{ fontSize: isSmallDevice ? 12 : isTablet ? 16 : 14 }}
        >
          Arahkan kamera ke alpukat
        </Text>
      </View>
    </View>
  );
};