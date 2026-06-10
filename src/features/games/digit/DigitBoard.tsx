import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../../providers/AudioProvider';
import { DigitProblem } from './logic';

interface DigitBoardProps {
    problem: DigitProblem | null;
    userDigits: number[];
    isAnswered: boolean;
    isCorrect: boolean | null;
    handleDigitClick: (d: number) => void;
    handleDelete: () => void;
    handleSubmit: () => void;
}

const OPS_MAP: Record<string, string> = { "*": "×", "/": "÷", "+": "+", "-": "-" };

export default function DigitBoard({
    problem,
    userDigits,
    isAnswered,
    isCorrect,
    handleDigitClick,
    handleDelete,
    handleSubmit
}: DigitBoardProps) {
    const { playClick } = useAudio();

    if (!problem) {
        return (
            <View className="items-center justify-center p-8 w-full bg-surfaceLight rounded-3xl border-[4px] border-borderDark shadow-[8px_8px_0px_#332A24]">
                <Text className="text-borderDark font-bold text-lg">Loading problem...</Text>
            </View>
        );
    }

    // Build the equation view naturally instead of just as a string
    let digitIndex = 0;
    const equationElements = problem.tokens.map((token, idx) => {
        if (token === "_") {
            const hasDigit = digitIndex < userDigits.length;
            const digitValue = hasDigit ? userDigits[digitIndex] : "?";
            digitIndex++;

            let bgColor = "bg-surfaceLight";
            let borderColor = "border-borderDark";
            let textColor = "text-textPrimary";

            if (isAnswered) {
                if (isCorrect) {
                    bgColor = "bg-success";
                    textColor = "text-borderDark";
                } else {
                    bgColor = "bg-danger";
                    textColor = "text-white";
                }
            } else if (hasDigit) {
                bgColor = "bg-surface";
                borderColor = "border-accent";
            } else {
                borderColor = "border-borderDark border-dashed";
                textColor = "text-textSecondary";
            }

            return (
                <View key={idx} className={`w-12 h-14 rounded-xl border-2 ${borderColor} ${bgColor} items-center justify-center`}>
                    <Text className={`font-black text-2xl ${textColor}`}>{digitValue}</Text>
                </View>
            );
        } else {
            // Operator
            return (
                <Text key={idx} className="font-black text-2xl text-borderDark px-1">
                    {OPS_MAP[token] ?? token}
                </Text>
            );
        }
    });

    return (
        <View className="w-full max-w-[400px] items-center">
            {/* Equation Display Box */}
            <View className="bg-white p-6 rounded-3xl border-[4px] border-borderDark shadow-[8px_8px_0px_rgba(51,42,36,0.15)] mb-8 w-full items-center">
                <Text className="text-textSecondary font-bold text-xs uppercase tracking-widest mb-4">Complete Equation</Text>
                <View className="flex-row items-center justify-center flex-wrap gap-y-4">
                    {equationElements}
                    <Text className="font-black text-2xl text-borderDark ml-2 mr-2">=</Text>
                    <View className="bg-accent px-4 py-2 rounded-xl border-2 border-borderDark">
                        <Text className="font-black text-2xl text-borderDark">{problem.target}</Text>
                    </View>
                </View>

                {isAnswered && (
                    <Text className={`text-xl font-black mt-6 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                    </Text>
                )}
            </View>

            {/* Numpad */}
            <View className="bg-surfaceLight p-4 rounded-3xl border-[4px] border-borderDark shadow-[6px_6px_0px_#332A24] w-full">
                <View className="flex-row flex-wrap justify-between gap-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                        const isUsed = userDigits.includes(num);
                        const disabled = isAnswered || isUsed;
                        return (
                            <TouchableOpacity
                                key={num}
                                onPress={() => {
                                    playClick();
                                    handleDigitClick(num);
                                }}
                                disabled={disabled}
                                activeOpacity={0.7}
                                className={`w-[30%] aspect-square rounded-2xl border-[3px] items-center justify-center shadow-[4px_4px_0px_#332A24] ${isUsed ? 'bg-surface border-borderDark/40 opacity-50 shadow-none' : 'bg-white border-borderDark'
                                    }`}
                            >
                                <Text className="text-3xl font-black text-borderDark">{num}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View className="flex-row justify-between mt-4 gap-4">
                    <TouchableOpacity
                        className="flex-1 bg-surface py-4 rounded-2xl border-[3px] border-borderDark shadow-[4px_4px_0px_#332A24] items-center justify-center"
                        onPress={() => {
                            playClick();
                            handleDelete();
                        }}
                        disabled={isAnswered || userDigits.length === 0}
                    >
                        <MaterialCommunityIcons name="backspace-outline" size={28} color="#332A24" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-[2] py-4 rounded-2xl border-[3px] shadow-[4px_4px_0px_#332A24] items-center justify-center ${userDigits.length === problem.blanks && !isAnswered ? 'bg-accent border-borderDark' : 'bg-surface border-borderDark/40 opacity-50 shadow-none'
                            }`}
                        onPress={() => {
                            playClick();
                            handleSubmit();
                        }}
                        disabled={isAnswered || userDigits.length !== problem.blanks}
                    >
                        <Text className="text-xl font-black text-borderDark uppercase tracking-widest">Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
