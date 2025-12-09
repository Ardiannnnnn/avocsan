import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react"; // ✅ ADD
import proTipsData from "../../data/proTips.json"; // ✅ ADD

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

// ✅ ADD: Type
type ProTip = {
  text: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ ADD: State
  const [displayedProTips, setDisplayedProTips] = useState<ProTip[]>([]);

  // ✅ ADD: Random function
  const getRandomProTips = () => {
    const shuffled = [...proTipsData.tips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // ✅ ADD: Load on mount
  useEffect(() => {
    setDisplayedProTips(getRandomProTips());
  }, []);

  const openScanner = () => {
    // Navigate ke tab scan
    router.push("/(tabs)/scan");
  };

  const ripenessStages = [
    {
      id: 1,
      stage: "Mentah",
      emoji: "🟢",
      bgColor: "#10b981",
      lightBg: "#d1fae5",
      days: "5-7 hari",
      texture: "Keras",
      nutrisi: {
        lemak: "Rendah",
        serat: "Tinggi",
        kalori: "120",
      },
      tips: "Simpan pada suhu ruangan",
    },
    {
      id: 2,
      stage: "Setengah Matang",
      emoji: "🟡",
      bgColor: "#84cc16",
      lightBg: "#ecfccb",
      days: "2-3 hari",
      texture: "Agak Lunak",
      nutrisi: {
        lemak: "Sedang",
        serat: "Tinggi",
        kalori: "140",
      },
      tips: "Cocok untuk salad",
    },
    {
      id: 3,
      stage: "Matang Sempurna",
      emoji: "🟠",
      bgColor: "#f59e0b",
      lightBg: "#fef3c7",
      days: "Siap santap",
      texture: "Lembut",
      nutrisi: {
        lemak: "Tinggi",
        serat: "Maksimal",
        kalori: "160",
      },
      tips: "Terbaik untuk smoothie",
    },
    {
      id: 4,
      stage: "Terlalu Matang",
      emoji: "🟤",
      bgColor: "#78716c",
      lightBg: "#e7e5e4",
      days: "Segera habiskan",
      texture: "Sangat Lembek",
      nutrisi: {
        lemak: "Tinggi",
        serat: "Berkurang",
        kalori: "150",
      },
      tips: "Pakai untuk masker",
    },
  ];

  const benefits = [
    {
      icon: "❤️",
      title: "Avocado Untuk kesehatan",
      color: "#ef4444",
      route: "/benefits/health" as const  // ✅ ADD
    },
    {
      icon: "💡",
      title: "Sejarah Avocado",
      color: "#f59e0b",
      route: "/benefits/history" as const // ✅ ADD
    },
    {
      icon: "🔍",
      title: "About",
      color: "#3b82f6",
      route: "/benefits/about" as const // ✅ ADD
    },
    {
      icon: "🤖",
      title: "S2 AI FMIPA USK",
      color: "#10b981",
      route: "/benefits/magister" as const // ✅ ADD
    },  
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
         <View
          className="bg-green-700 rounded-b-[40px]"
          style={{
            paddingHorizontal: isTablet ? 48 : 24,
            paddingTop: insets.top + (isSmallDevice ? 48 : 64),
            paddingBottom: isSmallDevice ? 80 : 96,
          }}
        >
          <View className="items-center">
            {/* ✅ GANTI emoji dengan logo */}
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
              className="text-white text-center font-bold"
              style={{ fontSize: isSmallDevice ? 24 : isTablet ? 36 : 30 }}
            >
              Avocado Scanner
            </Text>
            <Text
              className="text-green-100 text-center mt-2"
              style={{ fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16 }}
            >
              Deteksi kematangan alpukat dengan AI
            </Text>
          </View>
        </View>

        {/* ✅ BUTTON BESAR DI TENGAH (TETAP ADA) */}
        <View
          style={{
            paddingHorizontal: isTablet ? 48 : 24,
            marginTop: isSmallDevice ? -28 : -32,
            marginBottom: 24,
            maxWidth: isTablet ? 600 : undefined,
            alignSelf: isTablet ? "center" : "auto",
            width: isTablet ? "100%" : "auto",
          }}
        >
          <TouchableOpacity
            className="bg-green-600 rounded-3xl shadow-lg"
            activeOpacity={0.8}
            onPress={openScanner}
          >
            <View
              className="flex-row items-center justify-center"
              style={{ padding: isSmallDevice ? 20 : 24 }}
            >
              <Ionicons
                name="scan"
                size={isSmallDevice ? 28 : isTablet ? 40 : 32}
                color="white"
              />
              <View className="ml-4">
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
                >
                  Scan Sekarang
                </Text>
                <Text
                  className="text-green-100"
                  style={{ fontSize: isSmallDevice ? 12 : 14 }}
                >
                  Tekan untuk memulai
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: isTablet ? 48 : 24 }}>
          {/* Quick Benefits */}
          <View
            className="flex-row flex-wrap mb-6"
            style={{
              justifyContent: "space-between",
              maxWidth: isTablet ? 600 : undefined,
              alignSelf: isTablet ? "center" : "auto",
              width: "100%",
            }}
          >
            {benefits.map((benefit, index) => (
              <TouchableOpacity // ✅ CHANGE: View → TouchableOpacity
                key={index}
                className="bg-white rounded-2xl mb-3 shadow-sm"
                style={{
                  width: isTablet ? "48%" : isSmallDevice ? "47%" : "48%",
                  padding: isSmallDevice ? 12 : 16,
                }}
                activeOpacity={0.7} // ✅ ADD
                onPress={() => router.push(benefit.route)} // ✅ ADD
              >
                <Text
                  style={{
                    fontSize: isSmallDevice ? 32 : isTablet ? 48 : 36,
                    marginBottom: 8,
                  }}
                >
                  {benefit.icon}
                </Text>
                <Text
                  className="font-bold text-gray-800"
                  style={{ fontSize: isSmallDevice ? 12 : isTablet ? 16 : 14 }}
                >
                  {benefit.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ripeness Guide Header */}
          <View
            className="flex-row items-center justify-between mb-4 mt-4"
            style={{
              maxWidth: isTablet ? 600 : undefined,
              alignSelf: isTablet ? "center" : "auto",
              width: "100%",
            }}
          >
            <Text
              className="font-bold text-gray-800"
              style={{ fontSize: isSmallDevice ? 20 : isTablet ? 28 : 24 }}
            >
              Panduan Kematangan
            </Text>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text
                className="text-green-700 font-semibold"
                style={{ fontSize: isSmallDevice ? 10 : 12 }}
              >
                4 Level
              </Text>
            </View>
          </View>

          {/* Ripeness Cards - Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{
              paddingRight: isTablet ? 48 : 24,
              paddingLeft: isTablet ? (width - 600) / 2 : 0,
            }}
          >
            {ripenessStages.map((stage) => (
              <View
                key={stage.id}
                className="bg-white rounded-3xl mr-4 overflow-hidden"
                style={{
                  width: isTablet
                    ? 400
                    : isSmallDevice
                    ? width * 0.8
                    : width * 0.75,
                }}
              >
                {/* Header */}
                <View
                  className="items-center"
                  style={{
                    backgroundColor: stage.bgColor,
                    padding: isSmallDevice ? 20 : 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: isSmallDevice ? 48 : isTablet ? 72 : 60,
                      marginBottom: 12,
                      padding: 8,
                    }}
                  >
                    {stage.emoji}
                  </Text>
                  <Text
                    className="text-white font-bold mb-1"
                    style={{
                      fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20,
                    }}
                  >
                    {stage.stage}
                  </Text>
                  <View className="bg-white/30 px-4 py-1 rounded-full">
                    <Text
                      className="text-white font-semibold"
                      style={{ fontSize: isSmallDevice ? 12 : 14 }}
                    >
                      {stage.days}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <View style={{ padding: isSmallDevice ? 16 : 20 }}>
                  {/* Tekstur */}
                  <View className="bg-gray-100 px-3 py-3 rounded-xl mb-4">
                    <Text
                      className="text-gray-500 mb-1"
                      style={{ fontSize: isSmallDevice ? 10 : 12 }}
                    >
                      Tekstur
                    </Text>
                    <Text
                      className="text-gray-800 font-bold"
                      style={{
                        fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16,
                      }}
                    >
                      {stage.texture}
                    </Text>
                  </View>

                  {/* Nutrisi Grid */}
                  <View className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-200">
                    <Text
                      className="font-bold text-gray-600 mb-3"
                      style={{ fontSize: isSmallDevice ? 10 : 12 }}
                    >
                      INFORMASI NUTRISI
                    </Text>

                    <View className="flex-row justify-between items-center mb-2">
                      <Text
                        className="text-gray-700"
                        style={{ fontSize: isSmallDevice ? 12 : 14 }}
                      >
                        🥑 Lemak
                      </Text>
                      <Text
                        className="font-semibold text-gray-800"
                        style={{ fontSize: isSmallDevice ? 12 : 14 }}
                      >
                        {stage.nutrisi.lemak}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-2">
                      <Text
                        className="text-gray-700"
                        style={{ fontSize: isSmallDevice ? 12 : 14 }}
                      >
                        🌾 Serat
                      </Text>
                      <Text
                        className="font-semibold text-gray-800"
                        style={{ fontSize: isSmallDevice ? 12 : 14 }}
                      >
                        {stage.nutrisi.serat}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <Text
                        className="text-gray-700"
                        style={{ fontSize: isSmallDevice ? 12 : 14 }}
                      >
                        🔥 Kalori
                      </Text>
                      <Text
                        className="font-semibold text-gray-800"
                        style={{ fontSize: isSmallDevice ? 12 : 14 }}
                      >
                        {stage.nutrisi.kalori} kal
                      </Text>
                    </View>
                  </View>

                  {/* Tips */}
                  <View
                    className="rounded-xl p-3"
                    style={{ backgroundColor: stage.lightBg }}
                  >
                    <View className="flex-row items-start">
                      <Text
                        style={{
                          fontSize: isSmallDevice ? 16 : 18,
                          marginRight: 8,
                        }}
                      >
                        💡
                      </Text>
                      <View className="flex-1">
                        <Text
                          className="font-semibold mb-1"
                          style={{
                            color: stage.bgColor,
                            fontSize: isSmallDevice ? 10 : 12,
                          }}
                        >
                          TIPS PENGGUNAAN
                        </Text>
                        <Text
                          className="text-gray-700"
                          style={{ fontSize: isSmallDevice ? 12 : 14 }}
                        >
                          {stage.tips}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* ✅ UPDATED: Pro Tips Card */}
          <View
            className="bg-amber-50 rounded-3xl border-2 border-amber-200"
            style={{
              padding: isSmallDevice ? 20 : 24,
              marginBottom: isSmallDevice ? 100 : 112,
              maxWidth: isTablet ? 600 : undefined,
              alignSelf: isTablet ? "center" : "auto",
              width: "100%",
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <View
                  className="bg-amber-500 rounded-2xl items-center justify-center"
                  style={{
                    width: isSmallDevice ? 40 : 48,
                    height: isSmallDevice ? 40 : 48,
                  }}
                >
                  <Ionicons
                    name="bulb"
                    size={isSmallDevice ? 20 : 24}
                    color="white"
                  />
                </View>
                <Text
                  className="font-bold text-gray-800 ml-3"
                  style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
                >
                  Pro Tips
                </Text>
              </View>

              {/* ✅ Refresh Button */}
              <TouchableOpacity
                className="bg-amber-200 rounded-full p-2"
                activeOpacity={0.7}
                onPress={() => setDisplayedProTips(getRandomProTips())}
              >
                <Ionicons name="refresh" size={18} color="#d97706" />
              </TouchableOpacity>
            </View>

            {/* ✅ Dynamic Tips */}
            <View>
              {displayedProTips.map((tip, index) => (
                <View
                  key={index}
                  className="flex-row items-start"
                  style={{
                    marginBottom:
                      index < displayedProTips.length - 1 ? 12 : 0,
                  }}
                >
                  <Text className="text-amber-600 mr-2 mt-1">▸</Text>
                  <Text
                    className="text-gray-700 flex-1"
                    style={{ fontSize: isSmallDevice ? 12 : 14 }}
                  >
                    {tip.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Scan Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: insets.bottom + 80,
          right: 24,
          width: isSmallDevice ? 64 : 72,
          height: isSmallDevice ? 64 : 72,
          borderRadius: isSmallDevice ? 32 : 36,
          backgroundColor: "#10b981",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
        onPress={openScanner}
      >
        <Ionicons name="scan" size={isSmallDevice ? 28 : 32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
