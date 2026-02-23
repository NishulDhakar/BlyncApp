import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAudio } from "../providers/AudioProvider";
import { GameId, useAppStore } from "../store/useAppStore";

const { width } = Dimensions.get("window");

const GAMES = [
  // { id: "memory", title: "Memory", icon: "brain", desc: "Test recall" },
  { id: "switch", title: "Switch", icon: "swap-horizontal", desc: "Task switching" },
  { id: "digit", title: "Digit", icon: "numeric", desc: "Working memory" },
  { id: "deductive", title: "Deductive", icon: "magnify", desc: "Logic reasoning" },
  { id: "motion", title: "Motion", icon: "fast-forward", desc: "Reaction time" },
  { id: "grid", title: "Grid", icon: "grid", desc: "Spatial memory", comingSoon: true },
  { id: "inductive", title: "Inductive", icon: "puzzle", desc: "Pattern logic", comingSoon: true },
  { id: "mental-rotation", title: "Mental rotation", icon: "rotate-3d", desc: "Mental rotation", comingSoon: true },
  { id: "inhibitory-control", title: "Inhibitory control", icon: "stopwatch", desc: "Inhibitory control", comingSoon: true },
  { id: "pattern-tracking", title: "Pattern tracking", icon: "target", desc: "Pattern tracking", comingSoon: true },
  { id: "reference-stability", title: "Reference stability", icon: "anchor", desc: "Reference stability", comingSoon: true },
];

export default function HomeScreen() {
  const router = useRouter();
  const { startGame, score, level, theme } = useAppStore();
  const { playClick, isBgMuted, setBgMuted, isSfxMuted, setSfxMuted } = useAudio();

  const handleStartGame = (gameId: GameId) => {
    playClick();
    startGame(gameId);
    router.push(`/${gameId}-game` as any);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6 pt-8 pb-12" showsVerticalScrollIndicator={false}>

          <View className="flex-row justify-between items-center mb-8 mt-8">
            <View>
              <Text className="text-textSecondary font-bold text-sm tracking-widest uppercase mb-1">
                Welcome back
              </Text>
              <Text className="text-3xl font-black text-textPrimary">
                Cognitive<Text className="text-accent">Games</Text>
              </Text>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="bg-surfaceLight rounded-2xl border-[3px] border-borderDark p-3 shadow-[4px_4px_0px_#332A24]"
                onPress={() => {
                  playClick();
                  setBgMuted(!isBgMuted);
                }}
              >
                <MaterialCommunityIcons name={isBgMuted ? "music-off" : "music"} size={26} color="#332A24" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-surfaceLight rounded-2xl border-[3px] border-borderDark p-3 shadow-[4px_4px_0px_#332A24]"
                onPress={() => {
                  playClick();
                  setSfxMuted(!isSfxMuted);
                }}
              >
                <MaterialCommunityIcons name={isSfxMuted ? "volume-off" : "volume-high"} size={26} color="#332A24" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-accent rounded-[32px] border-[4px] border-borderDark px-6 py-8 mb-10 shadow-[6px_6px_0px_#332A24]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-borderDark font-bold text-xl">Overall Progress</Text>
              <View className="bg-surfaceLight p-2 rounded-xl border-[2px] border-borderDark shadow-[2px_2px_0px_#332A24]">
                <MaterialCommunityIcons name="star-face" size={24} color="#332A24" />
              </View>
            </View>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-borderDark text-6xl font-black tracking-tighter">{score}</Text>
              <Text className="text-borderDark font-bold text-xl">pts</Text>
            </View>
            <View className="mt-8 pt-6 border-t-[3px] border-borderDark/20 flex-row justify-between items-center bg-surfaceLight/30 -mx-2 px-4 py-3 rounded-2xl">
              <Text className="text-borderDark font-black text-lg">Rules</Text>
              <TouchableOpacity
                className="bg-surfaceLight rounded-2xl border-[3px] border-borderDark p-3 shadow-[4px_4px_0px_#332A24]"
                onPress={() => {
                  playClick();
                  router.push("/rules" as any);
                }}
              >
                <MaterialCommunityIcons name="chevron-right" size={26} color="#332A24" />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View className="items-center mb-6 mt-4">
            <Image
              source={require("../assets/images/hero.jpeg")}
              style={{ width: 400, height: 200, borderRadius: 24, borderWidth: 4, borderColor: '#332A24' }}
            />
          </View> */}

          {/* <View className="flex-row justify-between items-end mb-6 bg-surface p-4 rounded-2xl border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24]">
            <Text className="text-xl font-black text-borderDark">Today's Challenges</Text>
          </View> */}

          <View className="flex-row flex-wrap justify-between">
            {GAMES.map((game, index) => (
              <TouchableOpacity
                key={game.id}
                className={`w-[48%] rounded-3xl border-[3px] border-borderDark p-5 mb-5 ${game.comingSoon ? 'bg-surfaceLight/60 opacity-90' : 'bg-surfaceLight shadow-[4px_4px_0px_#332A24]'}`}
                activeOpacity={game.comingSoon ? 1 : 0.8}
                onPress={() => {
                  if (!game.comingSoon) {
                    handleStartGame(game.id as GameId);
                  }
                }}
              >
                <View className="relative">
                  <View className={`w-14 h-14 rounded-2xl bg-surface items-center justify-center mb-4 border-2 border-borderDark ${game.comingSoon ? 'opacity-50' : ''}`}>
                    <MaterialCommunityIcons name={game.icon as any} size={28} color="#332A24" />
                  </View>
                  {game.comingSoon && (
                    <View className="absolute top-0 -right-2 bg-accent px-2 py-1 rounded-lg border-2 border-borderDark rotate-[12deg]">
                      <Text className="text-borderDark font-black text-[9px] uppercase tracking-wider">Soon</Text>
                    </View>
                  )}
                </View>
                <Text className="text-borderDark font-black text-lg mb-1">{game.title}</Text>
                <Text className="text-textSecondary font-bold text-xs">{game.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}