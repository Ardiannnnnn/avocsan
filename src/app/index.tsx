import { View, Text, TouchableOpacity, Dimensions, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import tipsData from "../data/tips.json";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

type Tip = {
  icon: string;
  text: string;
};

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [displayedTips, setDisplayedTips] = useState<Tip[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const getRandomTips = () => {
    const allTips = [...tipsData.avocadoTips, ...tipsData.mlTips];
    const shuffled = allTips.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setDisplayedTips(getRandomTips());
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/(tabs)");
    });
  };

  return (
    <LinearGradient colors={["#10b981", "#059669", "#047857"]} style={{ flex: 1 }}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* ...rest of your splash content... */}
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + (isSmallDevice ? 40 : 60),
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: isTablet ? 80 : 32,
          }}
        >
          <View className="flex-1 items-center justify-center">
            <View
              className="bg-white rounded-3xl items-center justify-center mb-8 shadow-2xl"
              style={{
                width: isSmallDevice ? 120 : isTablet ? 200 : 150,
                height: isSmallDevice ? 120 : isTablet ? 200 : 150,
                padding: isSmallDevice ? 20 : 30,
              }}
            >
              <Image
                source={require("../assets/logosuk.png")}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </View>

            <Text
              className="text-white font-bold text-center mb-3"
              style={{ fontSize: isSmallDevice ? 28 : isTablet ? 44 : 36 }}
            >
              Avocado Scanner
            </Text>

            <View className="bg-white/20 px-6 py-3 rounded-full mb-2">
              <Text
                className="text-white font-semibold text-center"
                style={{ fontSize: isSmallDevice ? 14 : isTablet ? 20 : 16 }}
              >
                Magister Kecerdasan Buatan
              </Text>
            </View>
          </View>

          <View className="mb-8" style={{ maxWidth: isTablet ? 600 : undefined, alignSelf: "center", width: "100%" }}>
            <View className="flex-row items-center justify-center mb-4">
              <Ionicons name="bulb" size={20} color="white" />
              <Text className="text-white font-semibold ml-2" style={{ fontSize: isSmallDevice ? 14 : 16 }}>
                Tips Hari Ini
              </Text>
            </View>

            {displayedTips.map((tip, index) => (
              <View key={index} className="flex-row items-center mb-4">
                <View className="bg-white/30 rounded-full p-2 mr-3">
                  <Ionicons name={tip.icon as any} size={isSmallDevice ? 20 : 24} color="white" />
                </View>
                <Text className="text-white flex-1" style={{ fontSize: isSmallDevice ? 13 : 15 }}>
                  {tip.text}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              className="bg-white/20 rounded-full py-2 px-4 mt-2 self-center"
              activeOpacity={0.7}
              onPress={() => setDisplayedTips(getRandomTips())}
            >
              <View className="flex-row items-center">
                <Ionicons name="refresh" size={16} color="white" />
                <Text className="text-white font-semibold ml-2" style={{ fontSize: isSmallDevice ? 11 : 13 }}>
                  Tips Lainnya
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-white rounded-full shadow-2xl"
            style={{
              paddingVertical: isSmallDevice ? 16 : 20,
              maxWidth: isTablet ? 500 : undefined,
              alignSelf: "center",
              width: "100%",
            }}
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className="text-green-700 font-bold mr-2"
                style={{ fontSize: isSmallDevice ? 16 : isTablet ? 22 : 18 }}
              >
                Mulai Sekarang
              </Text>
              <Ionicons name="arrow-forward" size={isSmallDevice ? 20 : 24} color="#047857" />
            </View>
          </TouchableOpacity>

          <View className="items-center mt-6">
            <Text className="text-white/70 text-center" style={{ fontSize: isSmallDevice ? 10 : 12 }}>
              Universitas Syiah Kuala
            </Text>
            <Text className="text-white/70 text-center mt-1" style={{ fontSize: isSmallDevice ? 10 : 12 }}>
              Fakultas MIPA • Informatika
            </Text>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}