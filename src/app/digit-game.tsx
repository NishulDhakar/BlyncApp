import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import DigitBoard from '../features/games/digit/DigitBoard';
import { DigitProblem, checkAnswer, generateDigitProblem } from '../features/games/digit/logic';
import { useAudio } from '../providers/AudioProvider';
import { BackButton } from '../shared/components/BackButton';
import { useAppStore } from '../store/useAppStore';

const TIME_PER_QUESTION = 30; // seconds
const SESSION_TIME = 180; // total session seconds
const MAX_WRONG = 3; // lives

export default function DigitGameScreen() {
    const router = useRouter();
    const { increaseScore } = useAppStore();
    const { playWin, playLose } = useAudio();

    const [level, setLevel] = useState(1);
    const [problem, setProblem] = useState<DigitProblem | null>(null);

    const [userDigits, setUserDigits] = useState<number[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [sessionTime, setSessionTime] = useState(SESSION_TIME);
    const [isGameOver, setIsGameOver] = useState(false);

    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    // Initial load
    useEffect(() => {
        if (!isGameOver) {
            const p = generateDigitProblem(level);
            setProblem(p);
            setUserDigits([]);
            setIsAnswered(false);
            setIsCorrect(null);
            setTimeLeft(TIME_PER_QUESTION);
        }
    }, [level, isGameOver]);

    // Timer per question
    useEffect(() => {
        if (isGameOver || isAnswered) return;

        if (timeLeft <= 0) {
            playLose();
            markWrongAndNext();
            return;
        }

        const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, isAnswered, isGameOver]);

    // Session Timer
    useEffect(() => {
        if (isGameOver) return;

        if (sessionTime <= 0) {
            handleGameOver();
            return;
        }

        const t = setTimeout(() => setSessionTime((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [sessionTime, isGameOver]);

    const markWrongAndNext = () => {
        setIsAnswered(true);
        setIsCorrect(false);
        const newWrong = wrongCount + 1;
        setWrongCount(newWrong);

        if (newWrong >= MAX_WRONG) {
            setTimeout(handleGameOver, 900);
        } else {
            setTimeout(() => setLevel((l) => l + 1), 900);
        }
    };

    const handleDigitClick = (d: number) => {
        if (!problem || isAnswered) return;
        if (userDigits.length >= problem.blanks) return;
        if (userDigits.includes(d)) return; // unique only
        setUserDigits((u) => [...u, d]);
    };

    const handleDelete = () => {
        if (isAnswered) return;
        setUserDigits((u) => u.slice(0, -1));
    };

    const handleSubmit = () => {
        if (!problem || isAnswered) return;
        if (userDigits.length !== problem.blanks) return;

        const { ok } = checkAnswer(problem, userDigits);
        setIsAnswered(true);
        setIsCorrect(ok);

        if (ok) {
            playWin();
            setCorrectCount((c) => c + 1);
            increaseScore(15);
            setTimeout(() => {
                setLevel((l) => l + 1);
            }, 900);
        } else {
            playLose();
            const newWrong = wrongCount + 1;
            setWrongCount(newWrong);
            increaseScore(-5);
            if (newWrong >= MAX_WRONG) {
                setTimeout(handleGameOver, 900);
            } else {
                setTimeout(() => setLevel((l) => l + 1), 900);
            }
        }
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
        const pointsEarned = Math.max(0, (correctCount * 15) - (wrongCount * 5));

        return (
            <View className="flex-1 bg-background justify-center items-center p-6">
                <View className="bg-surfaceLight p-8 rounded-[32px] w-full max-w-sm items-center border-[4px] border-borderDark shadow-[8px_8px_0px_#332A24]">
                    {wrongCount >= MAX_WRONG ? (
                        <Text className="text-danger text-3xl font-black mb-2 text-center">Out of Lives!</Text>
                    ) : (
                        <Text className="text-borderDark text-3xl font-black mb-2 text-center">Session Complete</Text>
                    )}
                    <Text className="text-textSecondary font-bold text-lg mb-8 uppercase tracking-widest">Well Done</Text>

                    <View className="flex-row gap-6 mb-8 w-full justify-center">
                        <View className="items-center bg-surface p-4 rounded-2xl border-2 border-borderDark min-w-[90px]">
                            <Text className="text-success font-black text-3xl">{correctCount}</Text>
                            <Text className="text-borderDark font-bold">Solved</Text>
                        </View>
                        <View className="items-center bg-surface p-4 rounded-2xl border-2 border-borderDark min-w-[90px]">
                            <Text className="text-danger font-black text-3xl">{wrongCount}</Text>
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
                        <Text className="text-borderDark font-black text-xl">Digit</Text>
                    </View>

                    <View className="bg-accent px-4 py-2.5 rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24] items-center">
                        <Text className="text-borderDark font-black">{formatTime(sessionTime)}</Text>
                    </View>
                </View>

                {/* Game Area */}
                <View className="flex-1 justify-center items-center px-4">
                    {/* Time & Lives */}
                    <View className="w-full max-w-[400px] mb-6 flex-row items-center justify-between bg-surfaceLight px-4 py-2 rounded-xl border-2 border-borderDark">
                        <Text className="font-bold text-borderDark uppercase tracking-widest text-xs">Lives: {MAX_WRONG - wrongCount}</Text>
                        <Text className={`font-black text-lg ${timeLeft <= 5 ? 'text-danger' : 'text-borderDark'}`}>{timeLeft}s</Text>
                    </View>

                    <DigitBoard
                        problem={problem}
                        userDigits={userDigits}
                        isAnswered={isAnswered}
                        isCorrect={isCorrect}
                        handleDigitClick={handleDigitClick}
                        handleDelete={handleDelete}
                        handleSubmit={handleSubmit}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
