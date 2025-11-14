import "../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: { backgroundColor: "#f9fafb" },
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen
          name="index"
          options={{
            animation: "fade",
            animationDuration: 400,
          }}
        />

        {/* Main Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade",
            animationDuration: 300,
          }}
        />

        {/* Benefits Pages */}
        <Stack.Screen
          name="benefits/health"
          options={{
            animation: "slide_from_right",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="benefits/history"
          options={{
            animation: "slide_from_right",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="benefits/about"
          options={{
            animation: "slide_from_right",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="benefits/magister"
          options={{
            animation: "slide_from_right",
            presentation: "card",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}