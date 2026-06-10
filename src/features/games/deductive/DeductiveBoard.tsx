import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GameSymbol, Puzzle } from './logic';

interface DeductiveBoardProps {
    puzzle: Puzzle | null;
    isAnswered: boolean;
    isCorrect: boolean | null;
    selected: GameSymbol | null;
    handleSelect: (symbol: GameSymbol) => void;
}

export default function DeductiveBoard({
    puzzle,
    isAnswered,
    isCorrect,
    selected,
    handleSelect,
}: DeductiveBoardProps) {
    if (!puzzle) {
        return (
            <View className="items-center justify-center p-10 w-full aspect-square bg-white rounded-3xl border-4 border-borderDark shadow-[10px_10px_0px_#332A24]">
                <Text className="text-borderDark font-bold text-lg tracking-wide">
                    Generating Puzzle...
                </Text>
            </View>
        );
    }

    const { grid, targetCell, answer, options } = puzzle;
    const size = grid.length;

    const gridSizeMap: Record<number, string> = {
        3: 'w-20 h-20',
        4: 'w-16 h-16',
        5: 'w-14 h-14',
        6: 'w-12 h-12',
        7: 'w-10 h-10',
        8: 'w-9 h-9',
    };

    const textSizeMap: Record<number, string> = {
        3: 'text-4xl',
        4: 'text-3xl',
        5: 'text-2xl',
        6: 'text-xl',
        7: 'text-lg',
        8: 'text-base',
    };

    const cellSize = gridSizeMap[size] || 'w-12 h-12';
    const symbolSize = textSizeMap[size] || 'text-xl';

    return (
        <View className="w-full max-w-[420px]">

            {/* GRID CONTAINER */}
            <View className="bg-white p-5 rounded-3xl border-4 border-borderDark shadow-[10px_10px_0px_rgba(51,42,36,0.2)] mb-10 items-center">
                <View className="flex-col gap-2">
                    {grid.map((row, rowIndex) => (
                        <View key={rowIndex} className="flex-row gap-2">
                            {row.map((cellValue, colIndex) => {
                                const isTarget =
                                    targetCell.row === rowIndex &&
                                    targetCell.col === colIndex;

                                const isTargetCorrect =
                                    isTarget && isAnswered && isCorrect;

                                const isTargetWrong =
                                    isTarget && isAnswered && !isCorrect;

                                let content = cellValue;
                                let bgColor = 'bg-surfaceLight';
                                let borderStyle = 'border-borderDark';
                                let extraStyle = '';

                                if (isTarget) {
                                    content = '?';
                                    bgColor = 'bg-yellow-100';
                                    borderStyle = 'border-yellow-500 border-dashed';
                                    extraStyle = '';

                                    if (isTargetCorrect) {
                                        content = answer;
                                        bgColor = 'bg-success';
                                        borderStyle = 'border-borderDark border-solid';
                                    }

                                    if (isTargetWrong) {
                                        content = '✕';
                                        bgColor = 'bg-danger';
                                        borderStyle = 'border-borderDark border-solid';
                                    }
                                }

                                return (
                                    <View
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`${cellSize} rounded-2xl border-2 ${borderStyle} ${bgColor} ${extraStyle} items-center justify-center`}
                                    >
                                        <Text
                                            className={`${symbolSize} font-extrabold text-borderDark`}
                                        >
                                            {content || ''}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </View>

            {/* OPTIONS */}
            <View className="flex-row flex-wrap justify-center gap-5">
                {options.map((option, idx) => {
                    const isSelected = selected === option;
                    const disabled = isAnswered;

                    let bgColor = 'bg-white';
                    let border = 'border-borderDark';

                    if (isSelected && !isAnswered) {
                        bgColor = 'bg-blue-100';
                        border = 'border-blue-500';
                    }

                    if (isAnswered) {
                        if (option === answer) {
                            bgColor = 'bg-success';
                        } else if (isSelected) {
                            bgColor = 'bg-danger';
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={idx}
                            disabled={disabled}
                            onPress={() => handleSelect(option)}
                            activeOpacity={0.8}
                            className={`w-[72px] h-[72px] rounded-3xl border-4 ${border} ${bgColor} items-center justify-center shadow-[6px_6px_0px_#332A24]`}
                        >
                            <Text className="text-3xl font-bold text-borderDark">
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* FEEDBACK */}
            {isAnswered && (
                <View className="mt-10 items-center">
                    <Text
                        className={`text-3xl font-black tracking-wide ${isCorrect ? 'text-success' : 'text-danger'
                            }`}
                    >
                        {isCorrect ? 'Correct!' : 'Try Again!'}
                    </Text>
                </View>
            )}
        </View>
    );
}