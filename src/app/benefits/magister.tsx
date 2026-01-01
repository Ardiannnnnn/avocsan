import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function MagisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openWebsite = () => {
    Linking.openURL("https://informatika.usk.ac.id/webinf/?p=4086");
  };

  const programs = [
    {
      icon: "🎓",
      title: "Magister Kecerdasan Buatan",
      desc: "Program pendidikan pascasarjana yang menghasilkan talenta unggul dalam menganalisis dan memecahkan masalah menggunakan teknologi AI",
    },
    {
      icon: "🔬",
      title: "Riset & Inovasi",
      desc: "Penelitian dalam berbagai bidang diantaranya dengan NLP, Machine Learning, Deep Learning, dan Computer Vision",
    },
  ];

  const achievements = [
    "🌟 Lulusan yang berkualitas dan berdaya saing tinggi",
    "🌟 Dosen berkualifikasi Doktor dan Profesor",
    "🌟 Fasilitas laboratorium modern dan lengkap",
    "🌟 Kerjasama dengan industri dan universitas luar negeri",
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-green-700"
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
            Magister USK
          </Text>
        </View>

        <View className="items-center">
          <View className="bg-white rounded-3xl p-6 mb-4">
            <Image
              source={require("../../assets/logosuk.png")}
              style={{
                width: isSmallDevice ? 80 : isTablet ? 120 : 100,
                height: isSmallDevice ? 80 : isTablet ? 120 : 100,
                resizeMode: "contain",
              }}
            />
          </View>
          <Text
            className="text-white font-bold text-center mb-2"
            style={{ fontSize: isSmallDevice ? 20 : isTablet ? 28 : 24 }}
          >
            Universitas Syiah Kuala
          </Text>
          <Text
            className="text-green-100 text-center"
            style={{ fontSize: isSmallDevice ? 13 : 15 }}
          >
            FMIPA • Program Magister Kecerdasan Buatan
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 48 : 24,
          paddingVertical: 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* About */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <Text
            className="font-bold text-gray-800 mb-3"
            style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
          >
            Tentang Program Magister
          </Text>
          <Text
            className="text-gray-600 leading-6"
            style={{ fontSize: isSmallDevice ? 14 : 16, textAlign: "justify" }}
          >
            Program Magister Kecerdasan Buatan (AI) FMIPA USK adalah program
            pendidikan pascasarjana yang menghasilkan lulusan unggul dan berdaya
            saing yang mampu menganalisis serta memecahkan masalah dengan
            memanfaatkan teknologi AI dan mempersiapkan talenta AI terampil
            untuk masa depan.
          </Text>
        </View>

        {/* Programs */}
        <Text
          className="font-bold text-gray-800 mb-4"
          style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
        >
          Keunggulan Program
        </Text>

        <View
          style={{
            maxWidth: isTablet ? 800 : undefined,
            alignSelf: isTablet ? "center" : "auto",
            width: "100%",
          }}
        >
          {programs.map((program, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-5 mb-3 shadow-sm"
            >
              <View className="flex-row items-start">
                <Text style={{ fontSize: 40, marginRight: 16 }}>
                  {program.icon}
                </Text>
                <View className="flex-1">
                  <Text
                    className="font-bold text-gray-800 mb-2"
                    style={{ fontSize: isSmallDevice ? 15 : 17 }}
                  >
                    {program.title}
                  </Text>
                  <Text
                    className="text-gray-600"
                    style={{
                      fontSize: isSmallDevice ? 13 : 15,
                      textAlign: "left",
                      lineHeight: isSmallDevice ? 20 : 22,
                    }}
                  >
                    {program.desc}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View className="bg-green-50 rounded-3xl mt-4 p-6 mb-6 border-2 border-green-200">
          <Text
            className="font-bold text-gray-800 mb-4"
            style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
          >
            Prestasi dan Capaian
          </Text>
          {achievements.map((achievement, index) => (
            <View key={index} className="flex-row items-start mb-3">
              <Text
                className="text-gray-700 flex-1"
                style={{ fontSize: isSmallDevice ? 13 : 15 }}
              >
                {achievement}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <TouchableOpacity
          className="bg-green-600 rounded-3xl shadow-lg"
          activeOpacity={0.8}
          onPress={openWebsite}
        >
          <View
            className="flex-row items-center justify-center"
            style={{ padding: isSmallDevice ? 18 : 22 }}
          >
            <Ionicons name="globe" size={24} color="white" />
            <Text
              className="text-white font-bold ml-3"
              style={{ fontSize: isSmallDevice ? 16 : 18 }}
            >
              Kunjungi Website Resmi
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
