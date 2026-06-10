import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SwitchPuzzle } from './logic';

interface SwitchBoardProps {
    puzzle: SwitchPuzzle | null;
    isAnswered: boolean;
    isCorrect: boolean | null;
    selected: string | null;
    handleSelect: (op: string) => void;
}

export default function SwitchBoard({ puzzle, isAnswered, isCorrect, selected, handleSelect }: SwitchBoardProps) {
    if (!puzzle) {
        return (
            <View className="items-center justify-center p-8 w-full bg-surfaceLight rounded-3xl border-[4px] border-borderDark shadow-[8px_8px_0px_#332A24]">
                <Text className="text-borderDark font-bold text-lg">Loading puzzle...</Text>
            </View>
        );
    }

    const { input, output, operators, layers, switchOptions, answer } = puzzle;

    // Helper to render a group of symbols
    const renderSymbolGroup = (symbols: string[], bgColorClass: string, label: string) => (
        <View className="items-center">
            <Text className="text-textSecondary font-bold text-xs uppercase tracking-widest mb-2">{label}</Text>
            <View className={`flex-row p-3 rounded-2xl border-[3px] border-borderDark ${bgColorClass}`}>
                {symbols.map((symbol, idx) => (
                    <View key={idx} className="w-10 h-10 bg-white rounded-lg border-2 border-borderDark items-center justify-center mx-1 shadow-[2px_2px_0px_rgba(51,42,36,0.15)]">
                        <Text className="font-black text-xl text-borderDark">{symbol}</Text>
                        <Text className="absolute bottom-1 right-1 text-[8px] text-textSecondary font-bold">{idx + 1}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View className="w-full max-w-[400px]">
            {/* The Transformer Pipeline */}
            <View className="bg-white p-6 rounded-3xl border-[4px] border-borderDark shadow-[8px_8px_0px_rgba(51,42,36,0.15)] mb-8 w-full items-center">

                {renderSymbolGroup(input, 'bg-accent', 'Input Vector')}

                <View className="h-6 w-1 bg-borderDark my-2" />

                {layers === 2 && operators.length > 0 && (
                    <>
                        {/* Hidden Intermediate State representation - Known Operator 1 */}
                        <View className="bg-surfaceLight px-4 py-2 rounded-xl border-2 border-borderDark border-dashed">
                            <Text className="font-bold text-borderDark">Apply: {operators[0].join(' → ')}</Text>
                        </View>
                        <View className="h-6 w-1 bg-borderDark my-2" />
                    </>
                )}

                {/* Target Unknown Operator Indicator */}
                <View className="bg-surface px-6 py-4 rounded-xl border-[3px] border-borderDark shadow-[4px_4px_0px_rgba(51,42,36,0.15)] border-dashed items-center justify-center min-w-[120px]">
                    <Text className="font-black text-2xl text-borderDark">?</Text>
                </View>

                <View className="h-6 w-1 bg-borderDark my-2" />

                {renderSymbolGroup(output, 'bg-surfaceLight', 'Output Vector')}

            </View>

            {/* Answer Options */}
            <View className="flex-row flex-wrap justify-between gap-y-4">
                {switchOptions.map((option, idx) => {
                    const isSelected = selected === option;
                    let optionBg = "bg-white";
                    let disabled = isAnswered;

                    if (isAnswered) {
                        if (option === answer) optionBg = "bg-success";
                        else if (isSelected) optionBg = "bg-danger";
                    } else if (isSelected) {
                        optionBg = "bg-surface";
                    }

                    // Format option string "1 2 3 4" to "1→2→3→4"
                    const formattedOption = option.split(' ').join(' → ');

                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => handleSelect(option)}
                            disabled={disabled}
                            activeOpacity={0.7}
                            className={`w-[48%] py-4 rounded-2xl border-[3px] border-borderDark ${optionBg} items-center justify-center shadow-[4px_4px_0px_#332A24]`}
                        >
                            <Text className={`font-black text-borderDark ${option.length > 5 ? 'text-sm' : 'text-lg'}`}>
                                {formattedOption}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Feedback Message */}
            {isAnswered && (
                <View className="mt-8 items-center bg-surfaceLight p-4 rounded-2xl border-2 border-borderDark">
                    <Text className={`text-xl font-black ${isCorrect ? 'text-success' : 'text-danger'}`}>
                        {isCorrect ? 'Correct Routing!' : 'Incorrect Route'}
                    </Text>
                    {isCorrect && (
                        <Text className="text-textSecondary font-bold text-sm mt-1 uppercase tracking-widest text-center">
                            Indices mapped perfectly!
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}
