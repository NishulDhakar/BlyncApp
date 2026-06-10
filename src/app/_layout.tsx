import { Stack } from "expo-router";
import "../../global.css";
import { AudioProvider } from "../providers/AudioProvider";

export default function RootLayout() {
  return (
    <AudioProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AudioProvider>
  );
}
