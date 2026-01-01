import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import faqData from "../../data/avocadoFAQ.json";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

// ✅ ADD: Type for Fun Fact
type FunFact = {
  id: number;
  icon: string;
  text: string;
};

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [displayedFAQs, setDisplayedFAQs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [funFact, setFunFact] = useState<FunFact | null>(null); // ✅ ADD

  const getRandomFAQs = () => {
    const shuffled = [...faqData.faqs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // ✅ ADD: Random Fun Fact function
  const getRandomFunFact = () => {
    const randomIndex = Math.floor(Math.random() * faqData.funFacts.length);
    return faqData.funFacts[randomIndex];
  };

  useEffect(() => {
    setDisplayedFAQs(getRandomFAQs());
    setFunFact(getRandomFunFact()); // ✅ ADD
  }, []);

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const timeline = [
    {
      year: "5000 SM",
      title: "Asal Usul",
      desc: "Alpukat pertama kali ditemukan di Meksiko dan Amerika Tengah",
      icon: "🌱",
    },
    {
      year: "1500-an",
      title: "Penaklukan Spanyol",
      desc: "Spanyol membawa alpukat ke Eropa dan memperkenalkannya ke dunia",
      icon: "⛵",
    },
    {
      year: "1800-an",
      title: "Ekspansi Global",
      desc: "Alpukat mulai ditanam di berbagai belahan dunia termasuk Asia",
      icon: "🌍",
    },
    {
      year: "1900-an",
      title: "Budidaya Komersial",
      desc: "California memulai produksi alpukat komersial secara massal",
      icon: "🏭",
    },
    {
      year: "2000-an",
      title: "Era Modern",
      desc: "Alpukat menjadi superfood populer di seluruh dunia",
      icon: "🚀",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-amber-600"
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
            Sejarah Avocado
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text style={{ fontSize: 48, marginRight: 12 }}>📜</Text>
          <View className="flex-1">
            <Text
              className="text-amber-100"
              style={{ fontSize: isSmallDevice ? 14 : 16 }}
            >
              Perjalanan panjang alpukat dari hutan hingga meja makan
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
        {/* Intro */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <Text
            className="font-bold text-gray-800 mb-3"
            style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
          >
            "Ahuacatl" - Buah dari Aztec
          </Text>
          <Text
            className="text-gray-600 leading-6 mb-3"
            style={{ fontSize: isSmallDevice ? 14 : 16,  textAlign: 'justify' }}
          >
            Nama "avocado" berasal dari kata Aztec "ahuacatl" yang berarti "testis" karena 
            bentuknya yang unik. Buah ini telah menjadi makanan pokok suku Aztec dan Maya 
            selama ribuan tahun.
          </Text>
          <Text
            className="text-gray-600 leading-6"
            style={{ fontSize: isSmallDevice ? 14 : 16,  textAlign: 'justify' }}
          >
            Alpukat tidak hanya dihargai karena rasanya yang lezat, tetapi juga karena 
            nilai gizinya yang tinggi dan kemampuannya untuk tumbuh di berbagai iklim.
          </Text>
        </View>

        {/* Random FAQ Accordion Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="font-bold text-gray-800"
              style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
            >
              Fakta Menarik
            </Text>
            <TouchableOpacity
              className="bg-amber-200 rounded-full p-2"
              activeOpacity={0.7}
              onPress={() => {
                setDisplayedFAQs(getRandomFAQs());
                setExpandedId(null);
              }}
            >
              <Ionicons name="refresh" size={18} color="#d97706" />
            </TouchableOpacity>
          </View>

          {displayedFAQs.map((faq, index) => (
            <View
              key={faq.id}
              className="bg-white rounded-2xl mb-3 overflow-hidden shadow-sm"
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleAccordion(faq.id)}
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View
                    className="bg-amber-100 rounded-full items-center justify-center mr-3"
                    style={{
                      width: isSmallDevice ? 32 : 36,
                      height: isSmallDevice ? 32 : 36,
                    }}
                  >
                    <Text
                      className="text-amber-700 font-bold"
                      style={{ fontSize: isSmallDevice ? 14 : 16 }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    className="text-gray-800 font-semibold flex-1"
                    style={{ fontSize: isSmallDevice ? 14 : 16 }}
                  >
                    {faq.question}
                  </Text>
                </View>

                <Ionicons
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#f59e0b"
                />
              </TouchableOpacity>

              {expandedId === faq.id && (
                <View className="px-4 pb-4 pt-2 bg-amber-50 border-t border-amber-100">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#f59e0b"
                      style={{ marginTop: 2, marginRight: 8 }}
                    />
                    <Text
                      className="text-gray-700 flex-1 leading-6"
                      style={{ fontSize: isSmallDevice ? 13 : 15 }}
                    >
                      {faq.answer}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Timeline Section */}
        <Text
          className="font-bold text-gray-800 mb-4"
          style={{ fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20 }}
        >
          Perjalanan Sejarah
        </Text>

        <View
          style={{
            maxWidth: isTablet ? 800 : undefined,
            alignSelf: isTablet ? 'center' : 'auto',
            width: '100%',
          }}
        >
          {timeline.map((item, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row">
                <View className="items-center mr-4">
                  <View
                    className="bg-amber-500 rounded-full items-center justify-center"
                    style={{
                      width: isSmallDevice ? 48 : 56,
                      height: isSmallDevice ? 48 : 56,
                    }}
                  >
                    <Text style={{ fontSize: isSmallDevice ? 24 : 28 }}>
                      {item.icon}
                    </Text>
                  </View>
                  {index < timeline.length - 1 && (
                    <View
                      className="bg-amber-200"
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 60,
                      }}
                    />
                  )}
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                  <View className="bg-amber-100 px-3 py-1 rounded-full self-start mb-2">
                    <Text
                      className="text-amber-700 font-bold"
                      style={{ fontSize: isSmallDevice ? 11 : 13 }}
                    >
                      {item.year}
                    </Text>
                  </View>
                  <Text
                    className="font-bold text-gray-800 mb-2"
                    style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-gray-600 leading-5"
                    style={{ fontSize: isSmallDevice ? 13 : 15 }}
                  >
                    {item.desc}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ✅ UPDATED: Random Fun Fact with Refresh */}
        {funFact && (
          <View className="bg-amber-50 rounded-3xl p-6 mt-2 border-2 border-amber-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <Text style={{ fontSize: 32, marginRight: 12 }}>
                  {funFact.icon}
                </Text>
                <Text
                  className="font-bold text-gray-800"
                  style={{ fontSize: isSmallDevice ? 16 : isTablet ? 20 : 18 }}
                >
                  Tahukah Kamu?
                </Text>
              </View>
              
              {/* ✅ ADD: Refresh Button */}
              <TouchableOpacity
                className="bg-amber-200 rounded-full p-2"
                activeOpacity={0.7}
                onPress={() => setFunFact(getRandomFunFact())}
              >
                <Ionicons name="refresh" size={16} color="#d97706" />
              </TouchableOpacity>
            </View>
            
            {/* ✅ UPDATED: Dynamic Text */}
            <Text
              className="text-gray-700 leading-6"
              style={{ fontSize: isSmallDevice ? 13 : 15 }}
            >
              {funFact.text}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}