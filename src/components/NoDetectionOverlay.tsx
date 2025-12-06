import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const NoDetectionOverlay = () => {
  return (
    <View className="absolute inset-0 justify-center items-center" pointerEvents="none">
      <View className="bg-black/60 px-8 py-4 rounded-3xl">
        <View className="flex-row items-center">
          <Ionicons name="search" size={24} color="white" />
          <Text className="text-white text-lg font-semibold ml-3">
            No Object Detected
          </Text>
        </View>
        <Text className="text-white/80 text-sm mt-2 text-center">
          Arahkan kamera ke alpukat
        </Text>
      </View>
    </View>
  );
};