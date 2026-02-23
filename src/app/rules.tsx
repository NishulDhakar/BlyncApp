import Head from "expo-router/head";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { BackButton } from "../shared/components/BackButton";

export default function RulesScreen() {
    return (
        <View className="flex-1 bg-background">
            <Head>
                <title>Rules - CognitiveGames</title>
                <meta name="description" content="Learn how to play our cognitive games and understand how points and logic work." />
            </Head>
            <SafeAreaView className="flex-1">
                <View className="flex-row items-center px-6 py-4 mt-8">
                    <BackButton />
                    <Text className="text-3xl font-black text-borderDark ml-6">How to Play</Text>
                </View>

                <ScrollView className="flex-1 px-6 pb-12" showsVerticalScrollIndicator={false}>

                    {/* General Rules */}
                    <View className="bg-surfaceLight p-6 rounded-[24px] border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24] mb-8 mt-2">
                        <Text className="text-xl font-black text-borderDark mb-2">Scoring System</Text>
                        <Text className="text-textSecondary mb-4 leading-6 font-medium">
                            Every time you play a game, you earn points based on your accuracy and speed. We use an <Text className="font-bold text-success">incremental instant scoring</Text> system which means your points are saved to your device immediately every time you guess correctly!
                        </Text>

                        <View className="bg-surface p-4 rounded-xl border-2 border-borderDark flex-col gap-2">
                            <Text className="text-borderDark font-bold mb-1 border-b-2 border-borderDark/10 pb-1">Points Breakdown:</Text>
                            <Text className="text-borderDark font-medium">• <Text className="font-black">Switch</Text>: +10 pts (Right) | -2 pts (Wrong)</Text>
                            <Text className="text-borderDark font-medium">• <Text className="font-black">Digit</Text>: +15 pts (Right) | -5 pts (Wrong)</Text>
                            <Text className="text-borderDark font-medium">• <Text className="font-black">Deductive</Text>: +10 pts (Right) | -2 pts (Wrong)</Text>
                            <Text className="text-borderDark font-medium">• <Text className="font-black">Motion</Text>: +4 pts (Right) | -1 pt (Skip)</Text>
                            <Text className="text-textSecondary font-medium text-xs mt-2 italic">*Your total score cannot drop below zero.</Text>
                        </View>
                    </View>

                    <Text className="text-2xl font-black text-borderDark mb-6 uppercase tracking-wider">Game Modes</Text>

                    {/* Switch */}
                    <View className="bg-surfaceLight p-5 rounded-[24px] border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24] mb-6">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 rounded-xl bg-accent items-center justify-center border-2 border-borderDark mr-3">
                                <Text className="font-black text-borderDark text-xl">S</Text>
                            </View>
                            <Text className="text-xl font-black text-borderDark">Switch (Task Switching)</Text>
                        </View>
                        <Text className="text-textSecondary leading-5 font-medium">
                            You will be presented with an equation where the operator is hidden. Based on the two numbers and the final target result, deduce whether the missing operation was Addition (+), Subtraction (-), Multiplication (×), or Division (÷).
                        </Text>
                    </View>

                    {/* Digit */}
                    <View className="bg-surfaceLight p-5 rounded-[24px] border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24] mb-6">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 rounded-xl bg-success items-center justify-center border-2 border-borderDark mr-3">
                                <Text className="font-black text-borderDark text-xl">D</Text>
                            </View>
                            <Text className="text-xl font-black text-borderDark">Digit (Working Memory)</Text>
                        </View>
                        <Text className="text-textSecondary leading-5 font-medium">
                            Find the unknown variables. You will be given an interactive Numpad. The goal is to fill in the missing digits to make the mathematical equation valid. Each level dynamically increases in complexity and number of blanks.
                        </Text>
                    </View>

                    {/* Deductive */}
                    <View className="bg-surfaceLight p-5 rounded-[24px] border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24] mb-6">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 rounded-xl bg-[#9b5de5] items-center justify-center border-2 border-borderDark mr-3">
                                <Text className="font-black text-white text-xl">L</Text>
                            </View>
                            <Text className="text-xl font-black text-borderDark">Deductive (Logic Reasoning)</Text>
                        </View>
                        <Text className="text-textSecondary leading-5 font-medium">
                            A Latin Square puzzle! You are given a grid with various symbols. Your objective is to fill in the missing "?" tile such that no symbol repeats in the same row or column. Deduce the logic by eliminating invalid choices.
                        </Text>
                    </View>

                    {/* Motion */}
                    <View className="bg-surfaceLight p-5 rounded-[24px] border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24] mb-6">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 rounded-xl bg-[#f15bb5] items-center justify-center border-2 border-borderDark mr-3">
                                <Text className="font-black text-white text-xl">M</Text>
                            </View>
                            <Text className="text-xl font-black text-borderDark">Motion (Reaction Time)</Text>
                        </View>
                        <Text className="text-textSecondary leading-5 font-medium">
                            Navigate the red block to the destination hole. You can swipe up, down, left, or right to slide the tiles. Be careful—most obstacles are completely locked in place. If you get stuck, you can always hit the skip button!
                        </Text>
                    </View>

                    <View className="h-10" />

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
