import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import SwitchBoard from '../features/games/switch/SwitchBoard';
import { SwitchPuzzle, checkSwitchAnswer, generateSwitchPuzzle } from '../features/games/switch/logic';
import { useAudio } from '../providers/AudioProvider';
import { BackButton } from '../shared/components/BackButton';
import { useAppStore } from '../store/useAppStore';

const TIME_PER_QUESTION = 20;
const SESSION_TIME = 180;

export default function SwitchGameScreen() {
    const router = useRouter();
    const { increaseScore } = useAppStore();
    const { playWin, playLose } = useAudio();

    const [level, setLevel] = useState(1);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);

    const [puzzle, setPuzzle] = useState<SwitchPuzzle | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [sessionTime, setSessionTime] = useState(SESSION_TIME);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    // Initial Puzzle Load
    useEffect(() => {
        if (!isGameOver) {
            setPuzzle(generateSwitchPuzzle(level));
            setSelected(null);
            setIsAnswered(false);
            setIsCorrect(null);
            setTimeLeft(TIME_PER_QUESTION);
        }
    }, [level, isGameOver]);

    // Question Timer
    useEffect(() => {
        if (isGameOver || isAnswered) return;

        if (timeLeft <= 0) {
            playLose();
            setIsAnswered(true);
            setIsCorrect(false);
            setWrong(w => w + 1);
            setTimeout(() => {
                setLevel(l => l + 1);
            }, 1200);
            return;
        }

        const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, isAnswered, isGameOver]);

    // Session Timer
    useEffect(() => {
        if (isGameOver) return;

        if (sessionTime <= 0) {
            handleGameOver();
            return;
        }

        const t = setTimeout(() => setSessionTime(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [sessionTime, isGameOver]);

    const handleSelect = (op: string) => {
        if (isAnswered || !puzzle) return;

        setSelected(op);
        const correctAns = checkSwitchAnswer(puzzle, op);
        setIsCorrect(correctAns);
        setIsAnswered(true);

        if (correctAns) {
            playWin();
            setCorrect(c => c + 1);
            increaseScore(10);
        } else {
            playLose();
            setWrong(w => w + 1);
            increaseScore(-2);
        }

        setTimeout(() => {
            setLevel(l => l + 1);
        }, 1200);
    };

    const handleGameOver = () => {
        setIsGameOver(true);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (isGameOver) {
        const pointsEarned = Math.max(0, (correct * 10) - (wrong * 2));

        return (
            <View className="flex-1 bg-background justify-center items-center p-6">
                <View className="bg-surfaceLight p-8 rounded-[32px] w-full max-w-sm items-center border-[4px] border-borderDark shadow-[8px_8px_0px_#332A24]">
                    <Text className="text-borderDark text-3xl font-black mb-2 text-center">Session Complete</Text>
                    <Text className="text-textSecondary font-bold text-lg mb-8 uppercase tracking-widest">Time's Up!</Text>

                    <View className="flex-row gap-6 mb-8 w-full justify-center">
                        <View className="items-center bg-surface p-4 rounded-2xl border-2 border-borderDark min-w-[90px]">
                            <Text className="text-success font-black text-3xl">{correct}</Text>
                            <Text className="text-borderDark font-bold">Solved</Text>
                        </View>
                        <View className="items-center bg-surface p-4 rounded-2xl border-2 border-borderDark min-w-[90px]">
                            <Text className="text-danger font-black text-3xl">{wrong}</Text>
                            <Text className="text-borderDark font-bold">Missed</Text>
                        </View>
                    </View>

                    <View className="mb-8 items-center bg-accent p-6 rounded-2xl w-full border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24]">
                        <Text className="text-borderDark font-bold uppercase tracking-widest text-xs mb-1">Earned</Text>
                        <Text className="text-surfaceLight font-black text-5xl">+{pointsEarned} <Text className="text-xl">pts</Text></Text>
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
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4 mt-12">
                    <BackButton />

                    <View className="items-center bg-surface px-6 py-2 rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24]">
                        <Text className="text-textSecondary font-bold text-xs uppercase tracking-widest">Level {level}</Text>
                        <Text className="text-borderDark font-black text-xl">Switch</Text>
                    </View>

                    <View className="bg-accent px-4 py-2.5 rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24] items-center">
                        <Text className="text-borderDark font-black">{formatTime(sessionTime)}</Text>
                    </View>
                </View>

                {/* Game Area */}
                <View className="flex-1 justify-center items-center px-4">
                    {/* Time left for the current question bar */}
                    <View className="w-full max-w-[400px] mb-6 flex-row items-center justify-between bg-surfaceLight px-4 py-2 rounded-xl border-2 border-borderDark">
                        <Text className="font-bold text-borderDark uppercase tracking-widest text-xs">Operator Selection</Text>
                        <Text className={`font-black text-lg ${timeLeft <= 5 ? 'text-danger' : 'text-borderDark'}`}>{timeLeft}s</Text>
                    </View>

                    <SwitchBoard
                        puzzle={puzzle}
                        isAnswered={isAnswered}
                        isCorrect={isCorrect}
                        selected={selected}
                        handleSelect={handleSelect}
                    />

                </View>
            </SafeAreaView>
        </View>
    );
}
