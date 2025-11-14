import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ScanControlsProps {
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  bottomInset: number;
}

export function ScanControls({
  isScanning,
  onStartScan,
  onStopScan,
  bottomInset,
}: ScanControlsProps) {
  return (
    <View style={[styles.controls, { paddingBottom: bottomInset + 48 }]}>
      {!isScanning ? (
        <TouchableOpacity
          className="bg-green-600 py-5 rounded-full shadow-2xl mb-20"
          onPress={onStartScan}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="scan" size={28} color="white" />
            <Text className="text-white text-lg font-bold ml-3">
              Start AI Scan
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-red-600 py-5 rounded-full shadow-2xl mb-20"
          onPress={onStopScan}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="stop-circle" size={28} color="white" />
            <Text className="text-white text-lg font-bold ml-3">
              Stop Scanning
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 30,
  },
});
