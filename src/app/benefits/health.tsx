import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react"; // ✅ ADD
import healthData from "../../data/healthBenefits.json"; // ✅ ADD

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

// ✅ ADD: Type
type HealthBenefit = {
  id: number;
  icon: string;
  title: string;
  desc: string;
  color: string;
};

export default function HealthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ ADD: State
  const [displayedBenefits, setDisplayedBenefits] = useState<HealthBenefit[]>([]);

  // ✅ ADD: Random function
  const getRandomBenefits = () => {
    const shuffled = [...healthData.benefits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Ambil 3 benefits random
  };

  // ✅ ADD: Load on mount
  useEffect(() => {
    setDisplayedBenefits(getRandomBenefits());
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-red-600"
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
            Avocado untuk Kesehatan
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text style={{ fontSize: 48, marginRight: 12 }}>🥑</Text>
          <View className="flex-1">
            <Text
              className="text-red-100"
              style={{ fontSize: isSmallDevice ? 14 : 16 }}
            >
              Manfaat luar biasa alpukat untuk tubuh Anda
            </Text>
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
        {/* Intro Card */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <Text
            className="font-bold text-gray-800 mb-3"
            style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
          >
            Superfood Bergizi Tinggi
          </Text>
          <Text
            className="text-gray-600 leading-6"
            style={{ fontSize: isSmallDevice ? 14 : 16 }}
          >
            Alpukat dikenal sebagai salah satu buah paling bergizi di dunia. 
            Mengandung lebih dari 20 vitamin dan mineral penting yang dibutuhkan tubuh setiap hari.
          </Text>
        </View>

        {/* ✅ UPDATED: Benefits Header with Refresh */}
        <View className="flex-row items-center justify-between mb-4">
          <Text
            className="font-bold text-gray-800"
            style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
          >
            Manfaat Kesehatan
          </Text>
          <TouchableOpacity
            className="bg-red-200 rounded-full p-2"
            activeOpacity={0.7}
            onPress={() => setDisplayedBenefits(getRandomBenefits())}
          >
            <Ionicons name="refresh" size={18} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* ✅ UPDATED: Dynamic Benefits Grid from State */}
        <View
          style={{
            maxWidth: isTablet ? 800 : undefined,
            alignSelf: isTablet ? 'center' : 'auto',
            width: '100%',
          }}
        >
          {displayedBenefits.map((benefit, index) => (
            <View
              key={benefit.id}
              className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm"
            >
              <View
                style={{
                  backgroundColor: benefit.color,
                  padding: isSmallDevice ? 16 : 20,
                }}
              >
                <View className="flex-row items-center">
                  <Text style={{ fontSize: isSmallDevice ? 36 : 44, marginRight: 12 }}>
                    {benefit.icon}
                  </Text>
                  <Text
                    className="text-white font-bold flex-1"
                    style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
                  >
                    {benefit.title}
                  </Text>
                </View>
              </View>
              <View style={{ padding: isSmallDevice ? 16 : 20 }}>
                <Text
                  className="text-gray-700 leading-6"
                  style={{ fontSize: isSmallDevice ? 13 : 15 }}
                >
                  {benefit.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Nutrition Facts */}
        <View className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-6 mt-2">
          <Text
            className="font-bold text-gray-800 mb-4 text-center"
            style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
          >
            Fakta Nutrisi (per 100g)
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between bg-white rounded-xl p-3 mb-2">
              <Text className="text-gray-700 font-semibold">Kalori</Text>
              <Text className="text-green-700 font-bold">160 kcal</Text>
            </View>
            <View className="flex-row justify-between bg-white rounded-xl p-3 mb-2">
              <Text className="text-gray-700 font-semibold">Lemak Sehat</Text>
              <Text className="text-green-700 font-bold">15g</Text>
            </View>
            <View className="flex-row justify-between bg-white rounded-xl p-3 mb-2">
              <Text className="text-gray-700 font-semibold">Serat</Text>
              <Text className="text-green-700 font-bold">7g</Text>
            </View>
            <View className="flex-row justify-between bg-white rounded-xl p-3 mb-2">
              <Text className="text-gray-700 font-semibold">Vitamin K</Text>
              <Text className="text-green-700 font-bold">26% DV</Text>
            </View>
            <View className="flex-row justify-between bg-white rounded-xl p-3 mb-2">
              <Text className="text-gray-700 font-semibold">Folat</Text>
              <Text className="text-green-700 font-bold">20% DV</Text>
            </View>
            <View className="flex-row justify-between bg-white rounded-xl p-3">
              <Text className="text-gray-700 font-semibold">Vitamin C</Text>
              <Text className="text-green-700 font-bold">17% DV</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}