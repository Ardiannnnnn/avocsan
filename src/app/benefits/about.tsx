import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const features = [
    {
      icon: "scan",
      title: "Deteksi AI Real-time",
      desc: "Teknologi YOLOv8 untuk deteksi kematangan instan",
    },
    {
      icon: "flash",
      title: "Akurasi Tinggi",
      desc: "Model terlatih dengan ribuan gambar alpukat",
    },
    {
      icon: "leaf",
      title: "Panduan Lengkap",
      desc: "Tips nutrisi dan penyimpanan untuk setiap level",
    },
    {
      icon: "phone-portrait",
      title: "User Friendly",
      desc: "Interface sederhana dan mudah digunakan",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-blue-600"
        style={{
          paddingHorizontal: isTablet ? 48 : 24,
          paddingTop: insets.top + 16,
          paddingBottom: 24,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text
            className="text-white font-bold flex-1"
            style={{ fontSize: isSmallDevice ? 20 : isTablet ? 28 : 24 }}
          >
            Tentang Aplikasi
          </Text>
        </View>

        <View className="items-center">
          <View
            className=" rounded-3xl items-center justify-center"
            style={{
              width: isSmallDevice ? 164 : isTablet ? 196 : 80,
              height: isSmallDevice ? 164 : isTablet ? 196 : 80,
              padding: isSmallDevice ? 12 : isTablet ? 20 : 16,
            }}
          >
            <Image
              source={require("../../assets/logoapp.png")}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
          <Text
            className="text-white font-bold mb-2"
            style={{ fontSize: isSmallDevice ? 24 : isTablet ? 32 : 28 }}
          >
            Avocado Scanner
          </Text>
          <View className="bg-blue-500 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">Version 1.0.0</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 48 : 24,
          paddingVertical: 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Description */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <Text
            className="font-bold text-gray-800 mb-3"
            style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
          >
            Apa itu Avocado Scanner?
          </Text>
          <Text
            className="text-gray-600 leading-6 mb-3"
            style={{ fontSize: isSmallDevice ? 14 : 16, textAlign: "justify" }}
          >
            Avocado Scanner adalah aplikasi mobile berbasis kecerdasan buatan
            yang membantu Anda mendeteksi tingkat kematangan alpukat secara
            otomatis dan akurat.
          </Text>
          <Text
            className="text-gray-600 leading-6"
            style={{ fontSize: isSmallDevice ? 14 : 16, textAlign: "justify" }}
          >
            Dikembangkan menggunakan teknologi YOLOv8 dan TensorFlow Lite,
            aplikasi ini memberikan hasil deteksi real-time langsung dari kamera
            smartphone Anda.
          </Text>
        </View>

        {/* Features */}
        <Text
          className="font-bold text-gray-800 mb-4"
          style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
        >
          Fitur Unggulan
        </Text>

        <View
          style={{
            maxWidth: isTablet ? 800 : undefined,
            alignSelf: isTablet ? "center" : "auto",
            width: "100%",
          }}
        >
          {features.map((feature, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-start">
                <View className="bg-blue-100 rounded-full p-3 mr-4">
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color="#2563eb"
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-bold text-gray-800 mb-1"
                    style={{ fontSize: isSmallDevice ? 15 : 17 }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    className="text-gray-600"
                    style={{ fontSize: isSmallDevice ? 13 : 15 }}
                  >
                    {feature.desc}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 mt-4 mb-6">
          <Text
            className="font-bold text-gray-800 mb-4"
            style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
          >
            Teknologi yang Digunakan
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center mb-2">
              <Text className="text-blue-600 mr-2">▸</Text>
              <Text className="text-gray-700">YOLOv8 Object Detection</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-blue-600 mr-2">▸</Text>
              <Text className="text-gray-700">TensorFlow Lite</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
