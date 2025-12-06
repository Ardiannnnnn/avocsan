import { View, Text, StyleSheet } from "react-native";

interface ScanHeaderProps {
  isScanning: boolean;
  detectionCount: number;
  inferenceTime: number;
  fps: number;
  topInset:number;
}

export function ScanHeader({
  isScanning,
  detectionCount,
  inferenceTime,
  fps,
  topInset,
}: ScanHeaderProps) {
  return (
    <View style={[styles.header,  { paddingTop: topInset + 16 }]}>
      <Text className="text-white text-2xl font-bold text-center">
        🥑 Avocado Scanner
      </Text>
      <Text className="text-green-200 text-sm text-center mt-1">
        On-Device AI Detection 
      </Text>

      {isScanning && (
        <View className="bg-black/50 px-3 py-2 rounded-full mt-2">
          {/* <Text className="text-white text-xs text-center">
            🎯 Objects: {detectionCount} | ⚡ {inferenceTime}ms | 📹 {fps} FPS
          </Text> */}
           <Text className="text-white text-xs text-center">
            🎯 Objects: {detectionCount} 
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
});