import { View, Text, StyleSheet } from "react-native";
import { Detection } from "../utils/yoloPostProcess";
import { getColorForClass } from "../utils/colors";

interface BoundingBoxesProps {
  detections: Detection[];
}

export function BoundingBoxes({ detections }: BoundingBoxesProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {detections.map((det, idx) => (
        <View
          key={idx}
          style={{
            position: "absolute",
            left: det.bbox[0],
            top: det.bbox[1],
            width: det.bbox[2],
            height: det.bbox[3],
            borderWidth: 3,
            borderColor: getColorForClass(det.className, det.confidence),
            borderRadius: 8,
            zIndex: 100,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -30,
              left: 0,
              backgroundColor: getColorForClass(det.className, det.confidence),
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text className="text-white text-xs font-bold">
              {det.className} {Math.round(det.confidence * 100)}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}