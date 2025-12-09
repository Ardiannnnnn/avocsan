import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import tipsData from "../data/tips.json";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isTablet = width >= 768;
const isShortDevice = height < 700;

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
    <LinearGradient
      colors={["#10b981", "#059669", "#047857"]}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              paddingTop:
                insets.top + (isSmallDevice ? 30 : isShortDevice ? 40 : 60),
              paddingBottom: insets.bottom + (isShortDevice ? 20 : 40),
              paddingHorizontal: isTablet ? 80 : isSmallDevice ? 24 : 32,
              minHeight: height - insets.top - insets.bottom,
            }}
          >
            <View className="flex-1 items-center justify-center">
              <View
                className="bg-white rounded-3xl items-center justify-center mb-6 shadow-2xl"
                style={{
                  width: isSmallDevice
                    ? 100
                    : isMediumDevice
                    ? 130
                    : isTablet
                    ? 200
                    : 150,
                  height: isSmallDevice
                    ? 100
                    : isMediumDevice
                    ? 130
                    : isTablet
                    ? 200
                    : 150,
                  padding: isSmallDevice ? 16 : isTablet ? 30 : 24,
                }}
              >
                <Image
                  source={require("../assets/logosuk.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              </View>

              <Text
                className="text-white font-bold text-center mb-2"
                style={{
                  fontSize: isSmallDevice
                    ? 24
                    : isMediumDevice
                    ? 32
                    : isTablet
                    ? 44
                    : 36,
                  lineHeight: isSmallDevice
                    ? 30
                    : isMediumDevice
                    ? 38
                    : isTablet
                    ? 52
                    : 42,
                }}
              >
                Avocado Scanner
              </Text>
              <View
                style={{
                  maxWidth: isTablet ? 600 : undefined,
                  alignSelf: "center",
                  width: "100%",
                  paddingVertical: isShortDevice ? 8 : 12,
                  marginBottom: isShortDevice ? 16 : 30,
                }}
              >
                <View className="flex-row items-center justify-center mt-4 mb-3">
                  <Ionicons
                    name="bulb"
                    size={isSmallDevice ? 18 : 20}
                    color="white"
                  />
                  <Text
                    className="text-white font-semibold ml-2"
                    style={{
                      fontSize: isSmallDevice ? 13 : isMediumDevice ? 14 : 16,
                    }}
                  >
                    Tips Hari Ini
                  </Text>
                </View>

                {displayedTips.map((tip, index) => (
                  <View key={index} className="flex-row items-start mb-3">
                    <View className="bg-white/30 rounded-full p-2 mr-3 mt-1">
                      <Ionicons
                        name={tip.icon as any}
                        size={isSmallDevice ? 18 : isTablet ? 24 : 20}
                        color="white"
                      />
                    </View>
                    <Text
                      className="text-white flex-1"
                      style={{
                        fontSize: isSmallDevice ? 12 : isMediumDevice ? 13 : 15,
                        lineHeight: isSmallDevice
                          ? 18
                          : isMediumDevice
                          ? 20
                          : 22,
                      }}
                    >
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
                    <Ionicons
                      name="refresh"
                      size={isSmallDevice ? 14 : 16}
                      color="white"
                    />
                    <Text
                      className="text-white font-semibold ml-2"
                      style={{
                        fontSize: isSmallDevice ? 11 : isMediumDevice ? 12 : 13,
                      }}
                    >
                      Tips Lainnya
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="bg-white rounded-full shadow-2xl mt-4"
                style={{
                  paddingVertical: isSmallDevice ? 14 : isTablet ? 20 : 18,
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
                    style={{
                      fontSize: isSmallDevice
                        ? 15
                        : isMediumDevice
                        ? 16
                        : isTablet
                        ? 22
                        : 18,
                    }}
                  >
                    Mulai Sekarang
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={isSmallDevice ? 18 : isTablet ? 24 : 20}
                    color="#047857"
                  />
                </View>
              </TouchableOpacity>
              <View className="items-center mt-4">
                <Text
                  className="text-white/70 text-center"
                  style={{ fontSize: isSmallDevice ? 10 : 12 }}
                >
                  Universitas Syiah Kuala
                </Text>
                <Text
                  className="text-white/70 text-center mt-1"
                  style={{ fontSize: isSmallDevice ? 10 : 12 }}
                >
                  Fakultas MIPA • Informatika
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}
