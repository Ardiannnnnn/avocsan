import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const menuItems = [
    {
      id: 1,
      icon: "notifications-outline",
      title: "Notifikasi",
      subtitle: "Pengaturan pemberitahuan",
      color: "#f59e0b",
    },
    {
      id: 2,
      icon: "help-circle-outline",
      title: "Bantuan",
      subtitle: "FAQ dan panduan aplikasi",
      color: "#3b82f6",
    },
    {
      id: 3,
      icon: "information-circle-outline",
      title: "Tentang Aplikasi",
      subtitle: "Versi 1.0.0",
      color: "#10b981",
    },
  ];

  const stats = [
    { label: "Total Scan", value: "24", icon: "scan" },
    { label: "Tersimpan", value: "12", icon: "bookmark" },
    { label: "Akurasi", value: "95%", icon: "checkmark-circle" },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 30,
      }}
    >
      {/* Header Profile */}
      <View 
        className="bg-green-600 rounded-b-[40px]"
        style={{
          paddingTop: insets.top + (isSmallDevice ? 48 : 64),
          paddingBottom: isSmallDevice ? 48 : 60,
          paddingHorizontal: isTablet ? 48 : 24,
        }}
      >
        <View className="items-center">
          {/* Avatar */}
          <View 
            className="bg-white rounded-full items-center justify-center mb-4 shadow-lg"
            style={{
              width: isSmallDevice ? 80 : isTablet ? 120 : 96,
              height: isSmallDevice ? 80 : isTablet ? 120 : 96,
            }}
          >
            <Text style={{ fontSize: isSmallDevice ? 40 : isTablet ? 60 : 50 }}>👤</Text>
          </View>

          <Text 
            className="text-white font-bold mb-1"
            style={{ fontSize: isSmallDevice ? 20 : isTablet ? 28 : 24 }}
          >
            Pengguna Avocado
          </Text>
          <Text 
            className="text-green-100"
            style={{ fontSize: isSmallDevice ? 12 : 14 }}
          >
            avocado.scanner@email.com
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View 
        style={{
          paddingHorizontal: isTablet ? 48 : 24,
          marginTop: isSmallDevice ? -32 : -40,
          marginBottom: 24,
        }}
      >
        <View 
          className="bg-white rounded-3xl shadow-lg flex-row justify-between"
          style={{
            padding: isSmallDevice ? 16 : 20,
            maxWidth: isTablet ? 600 : undefined,
            alignSelf: isTablet ? 'center' : 'auto',
            width: isTablet ? '100%' : 'auto',
          }}
        >
          {stats.map((stat, index) => (
            <View key={index} className="items-center flex-1">
              <View 
                className="bg-green-100 rounded-full items-center justify-center mb-2"
                style={{
                  width: isSmallDevice ? 40 : isTablet ? 56 : 48,
                  height: isSmallDevice ? 40 : isTablet ? 56 : 48,
                }}
              >
                <Ionicons 
                  name={stat.icon as any} 
                  size={isSmallDevice ? 20 : isTablet ? 28 : 24} 
                  color="#16a34a" 
                />
              </View>
              <Text 
                className="font-bold text-gray-800"
                style={{ fontSize: isSmallDevice ? 18 : isTablet ? 28 : 24 }}
              >
                {stat.value}
              </Text>
              <Text 
                className="text-gray-500 mt-1"
                style={{ fontSize: isSmallDevice ? 10 : 12 }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View 
        style={{
          paddingHorizontal: isTablet ? 48 : 24,
          maxWidth: isTablet ? 600 : undefined,
          alignSelf: isTablet ? 'center' : 'auto',
          width: isTablet ? '100%' : 'auto',
        }}
      >
        <Text 
          className="font-bold text-gray-800 mb-4"
          style={{ fontSize: isSmallDevice ? 16 : isTablet ? 22 : 18 }}
        >
          Pengaturan
        </Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white rounded-2xl mb-3 flex-row items-center shadow-sm"
            style={{ padding: isSmallDevice ? 14 : 16 }}
            activeOpacity={0.7}
          >
            <View
              className="rounded-xl items-center justify-center mr-4"
              style={{ 
                backgroundColor: item.color + "20",
                width: isSmallDevice ? 44 : isTablet ? 56 : 48,
                height: isSmallDevice ? 44 : isTablet ? 56 : 48,
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={isSmallDevice ? 20 : isTablet ? 28 : 24}
                color={item.color}
              />
            </View>
            <View className="flex-1">
              <Text 
                className="font-semibold text-gray-800 mb-1"
                style={{ fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16 }}
              >
                {item.title}
              </Text>
              <Text 
                className="text-gray-500"
                style={{ fontSize: isSmallDevice ? 11 : 12 }}
              >
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info Card */}
      <View 
        className="mt-4 mb-6"
        style={{
          paddingHorizontal: isTablet ? 48 : 24,
          maxWidth: isTablet ? 600 : undefined,
          alignSelf: isTablet ? 'center' : 'auto',
          width: isTablet ? '100%' : 'auto',
        }}
      >
        <View className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200"
          style={{ padding: isSmallDevice ? 20 : 24 }}
        >
          <View className="flex-row items-center mb-3">
            <Text style={{ fontSize: isSmallDevice ? 32 : isTablet ? 48 : 40, marginRight: 12 }}>🥑</Text>
            <View className="flex-1">
              <Text 
                className="font-bold text-gray-800"
                style={{ fontSize: isSmallDevice ? 16 : isTablet ? 22 : 18 }}
              >
                Avocado Scanner
              </Text>
              <Text 
                className="text-gray-600"
                style={{ fontSize: isSmallDevice ? 12 : 14 }}
              >
                AI-Powered Ripeness Detection
              </Text>
            </View>
          </View>
          <Text 
            className="text-gray-500 leading-5"
            style={{ fontSize: isSmallDevice ? 11 : 12 }}
          >
            Aplikasi untuk mendeteksi tingkat kematangan alpukat menggunakan teknologi AI dan computer vision.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <View 
        className="mb-20"
        style={{
          paddingHorizontal: isTablet ? 48 : 24,
          maxWidth: isTablet ? 600 : undefined,
          alignSelf: isTablet ? 'center' : 'auto',
          width: isTablet ? '100%' : 'auto',
        }}
      >
        <TouchableOpacity
          className="bg-red-50 border-2 border-red-200 rounded-2xl flex-row items-center justify-center"
          style={{ paddingVertical: isSmallDevice ? 14 : 16 }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={isSmallDevice ? 20 : 24} color="#dc2626" />
          <Text 
            className="text-red-600 font-bold ml-2"
            style={{ fontSize: isSmallDevice ? 14 : 16 }}
          >
            Keluar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}