import { View, Text, ActivityIndicator } from "react-native";

export const ProcessingOverlay = () => {
  return (
    <View className="absolute inset-0 bg-black/80 justify-center items-center">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="text-white text-xl font-bold mt-4">
        Processing...
      </Text>
      <Text className="text-white/70 text-sm mt-2">
        Menganalisis hasil deteksi
      </Text>
    </View>
  );
};