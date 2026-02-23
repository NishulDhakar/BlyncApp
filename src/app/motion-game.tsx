import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { motionLevels } from '../features/games/motion/logic';
import MotionBoard from '../features/games/motion/MotionBoard';
import { useAudio } from '../providers/AudioProvider';
import { BackButton } from '../shared/components/BackButton';
import { useAppStore } from '../store/useAppStore';

const SESSION_TIME = 240;
const TIME_PER_LEVEL = 30;

export default function MotionGameScreen() {
    const router = useRouter();
    const { increaseScore, score } = useAppStore();
    const { playWin, playLose } = useAudio();

    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [sessionTime, setSessionTime] = useState(SESSION_TIME);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_LEVEL);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    // Per-level timer
    useEffect(() => {
        if (isGameOver) return;
        if (timeLeft <= 0) {
            playLose();
            handleSkip();
            return;
        }
        const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, isGameOver, currentLevelIdx]);

    // Session timer
    useEffect(() => {
        if (isGameOver) return;
        if (sessionTime <= 0) {
            handleGameOver();
            return;
        }
        const t = setTimeout(() => setSessionTime(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [sessionTime, isGameOver]);

    const handleGameOver = () => {
        setIsGameOver(true);
    };

    const handleLevelComplete = () => {
        playWin();
        setCorrect(c => c + 1);
        increaseScore(4);
        setTimeLeft(TIME_PER_LEVEL);
        if (currentLevelIdx < motionLevels.length - 1) {
            setCurrentLevelIdx(i => i + 1);
        } else {
            // Loop or end?
            setCurrentLevelIdx(0);
        }
    };

    const handleSkip = () => {
        setWrong(w => w + 1);
        increaseScore(-1);
        setTimeLeft(TIME_PER_LEVEL);
        if (currentLevelIdx < motionLevels.length - 1) {
            setCurrentLevelIdx(i => i + 1);
        } else {
            setCurrentLevelIdx(0);
        }
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const activeLevel = motionLevels[currentLevelIdx];

    if (isGameOver) {
        return (
            <View className="flex-1 bg-background justify-center items-center p-6">
                <View className="bg-surfaceLight p-8 rounded-[32px] w-full max-w-sm items-center border-[4px] border-borderDark shadow-[8px_8px_0px_#332A24]">
                    <Text className="text-borderDark text-3xl font-black mb-2 text-center">Session Complete</Text>
                    <Text className="text-textSecondary font-bold text-lg mb-8 uppercase tracking-widest">Time's Up!</Text>

                    <View className="flex-row gap-6 mb-8 w-full justify-center">
                        <View className="items-center bg-surface p-4 rounded-2xl border-2 border-borderDark">
                            <Text className="text-success font-black text-3xl">{correct}</Text>
                            <Text className="text-borderDark font-bold">Solved</Text>
                        </View>
                        <View className="items-center bg-surface p-4 rounded-2xl border-2 border-borderDark">
                            <Text className="text-danger font-black text-3xl">{wrong}</Text>
                            <Text className="text-borderDark font-bold">Skipped</Text>
                        </View>
                    </View>

                    <View className="mb-8 items-center bg-accent p-6 rounded-2xl w-full border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24]">
                        <Text className="text-borderDark font-bold uppercase tracking-widest text-xs mb-1">Earned</Text>
                        <Text className="text-surfaceLight font-black text-5xl">+{Math.max(0, (correct * 4) - wrong)} <Text className="text-xl">pts</Text></Text>
                    </View>

                    <TouchableOpacity
                        className="bg-surfaceLight border-[3px] border-borderDark px-8 py-4 rounded-2xl w-full items-center shadow-[4px_4px_0px_#332A24]"
                        onPress={() => router.back()}
                    >
                        <Text className="text-borderDark font-black text-lg">Return to Menu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-background">
                <SafeAreaView className="flex-1">
                    {/* Header */}
                    <View className="flex-row justify-between items-center px-6 py-4 mt-12">
                        <BackButton />

                        <View className="items-center bg-surface px-6 py-2 rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24]">
                            <Text className="text-textSecondary font-bold text-xs uppercase tracking-widest">Level {currentLevelIdx + 1}</Text>
                            <Text className="text-borderDark font-black text-xl">Motion</Text>
                        </View>

                        <View className="bg-accent px-4 py-2.5 rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24] flex-row items-center gap-1.5">
                            <MaterialCommunityIcons name="timer-outline" size={16} color="#332A24" />
                            <Text className="text-borderDark font-black">{formatTime(sessionTime)}</Text>
                        </View>
                    </View>

                    {/* Game Area */}
                    <View className="flex-1 justify-center items-center px-4">

                        {/* Time left for the current question bar */}
                        <View className="w-full max-w-[400px] mb-6 flex-row items-center justify-between bg-surfaceLight px-4 py-2 rounded-xl border-2 border-borderDark">
                            <Text className="font-bold text-borderDark uppercase tracking-widest text-xs">Level Timer</Text>
                            <Text className={`font-black text-lg ${timeLeft <= 5 ? 'text-danger' : 'text-borderDark'}`}>{timeLeft}s</Text>
                        </View>

                        {/* The actual Game Board container */}
                        <View className="bg-surfaceLight p-4 rounded-[32px] border-[4px] border-borderDark shadow-[8px_8px_0px_rgba(51,42,36,0.15)] mb-8">
                            <MotionBoard
                                levelDef={activeLevel}
                                onLevelComplete={handleLevelComplete}
                            />
                        </View>

                        {/* Controls */}
                        <View className="mt-4 flex-row gap-6 w-full justify-center">
                            <View className="items-center">
                                <View className="w-16 h-16 rounded-2xl border-[3px] border-borderDark bg-surface items-center justify-center mb-2 shadow-[4px_4px_0px_#332A24]">
                                    <Text className="text-success font-black text-2xl">{correct}</Text>
                                </View>
                                <Text className="text-textSecondary text-xs font-bold uppercase">Solved</Text>
                            </View>

                            <TouchableOpacity
                                className="items-center justify-center"
                                onPress={handleSkip}
                                activeOpacity={0.7}
                            >
                                <View className="w-20 h-20 rounded-2xl border-[3px] border-borderDark bg-[#f4a261] items-center justify-center mb-1 shadow-[4px_4px_0px_#332A24]">
                                    <MaterialCommunityIcons name="skip-next" size={36} color="#332A24" />
                                </View>
                                <Text className="text-borderDark text-xs font-black uppercase tracking-widest">Skip</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-center text-textSecondary font-bold mt-8 px-8 leading-6">
                            Drag the red block to the hole. Blocks can slide, but obstacles don't move.
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
        </GestureHandlerRootView>
    );
}
