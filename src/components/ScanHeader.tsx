import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

interface ScanHeaderProps {
  isScanning: boolean;
  detectionCount: number;
  inferenceTime: number;
  fps: number;
  topInset: number;
}

export function ScanHeader({
  isScanning,
  detectionCount,
  inferenceTime,
  fps,
  topInset,
}: ScanHeaderProps) {
  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: topInset + (isSmallDevice ? 12 : 16),
          paddingHorizontal: isTablet ? 40 : 24,
        },
      ]}
    >
      <Text
        className="text-white font-bold text-center"
        style={{ fontSize: isSmallDevice ? 20 : isTablet ? 32 : 24 }}
      >
        🥑 Avocado Scanner
      </Text>
      <Text
        className="text-green-200 text-center mt-1"
        style={{ fontSize: isSmallDevice ? 11 : isTablet ? 16 : 14 }}
      >
        On-Device AI Detection
      </Text>

      {isScanning && (
        <View
          className="bg-black/50 rounded-full mt-2"
          style={{
            paddingHorizontal: isSmallDevice ? 10 : 12,
            paddingVertical: isSmallDevice ? 6 : 8,
          }}
        >
          <Text
            className="text-white text-center"
            style={{ fontSize: isSmallDevice ? 10 : isTablet ? 14 : 12 }}
          >
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
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
});