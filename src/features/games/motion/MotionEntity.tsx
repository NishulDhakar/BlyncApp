import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Entity } from './logic';

interface MotionEntityProps {
    entity: Entity;
    cellSize: number;
    bounds: { up: number; down: number; left: number; right: number };
    isSelected?: boolean;
    onSelect?: () => void;
    onMoveEnd: (id: string, dx: number, dy: number) => void;
}

function ArrowButton({ direction, onPress }: { direction: string; onPress: () => void }) {
    let style: any = {
        position: 'absolute', width: 32, height: 32, backgroundColor: 'white',
        borderRadius: 16, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#332A24',
        shadowColor: '#332A24', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, zIndex: 100
    };
    switch (direction) {
        case 'up': style.top = -16; style.left = '50%'; style.marginLeft = -16; break;
        case 'down': style.bottom = -16; style.left = '50%'; style.marginLeft = -16; break;
        case 'left': style.left = -16; style.top = '50%'; style.marginTop = -16; break;
        case 'right': style.right = -16; style.top = '50%'; style.marginTop = -16; break;
    }
    const iconName = `arrow-${direction}`;
    return (
        <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.7}>
            <MaterialCommunityIcons name={iconName as any} size={18} color="#332A24" />
        </TouchableOpacity>
    );
}

// Map tailwind classes to hex for reliable inline styling when class interpolation fails
const COLOR_MAP: Record<string, string> = {
    'bg-red-500': '#ef4444',
    'bg-purple-600': '#9333ea',
    'bg-blue-500': '#3b82f6',
    'bg-amber-500': '#f59e0b',
    'bg-blue-800': '#1e40af',
    'bg-indigo-500': '#6366f1',
    'bg-emerald-500': '#10b981',
    'bg-rose-500': '#f43f5e',
    'bg-sky-500': '#0ea5e9',
    'bg-orange-500': '#f97316',
    'bg-fuchsia-500': '#d946ef',
    'bg-teal-500': '#14b8a6',
};

export default function MotionEntity({ entity, cellSize, bounds, isSelected, onSelect, onMoveEnd }: MotionEntityProps) {
    const isObstacle = entity.type === 'obstacle';
    const width = entity.w * cellSize;
    const height = entity.h * cellSize;

    // Base position based on grid
    const baseX = entity.x * cellSize;
    const baseY = entity.y * cellSize;

    // Gesture translation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .enabled(!isObstacle)
        .onStart(() => {
            if (onSelect) runOnJS(onSelect)();
        })
        .onUpdate((e) => {
            // Determine dominant drag axis and strictly clamp via precomputed physical bounds
            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                const maxTx = bounds.right * cellSize;
                const minTx = -bounds.left * cellSize;
                translateX.value = Math.max(minTx, Math.min(maxTx, e.translationX));
                translateY.value = 0;
            } else {
                const maxTy = bounds.down * cellSize;
                const minTy = -bounds.up * cellSize;
                translateX.value = 0;
                translateY.value = Math.max(minTy, Math.min(maxTy, e.translationY));
            }
        })
        .onEnd((e) => {
            let finalDx = 0;
            let finalDy = 0;

            if (Math.abs(translateX.value) > Math.abs(translateY.value)) {
                // Did we drag far enough to move 1 cell?
                finalDx = Math.round(translateX.value / cellSize);
            } else {
                finalDy = Math.round(translateY.value / cellSize);
            }

            // Instead of updating position locally blindly, we report intent to board.
            // Board will decide if valid, then entity will re-render anyway.
            // We animate back to 0 so the new grid coordinates take over base position.
            translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
            translateY.value = withSpring(0, { damping: 15, stiffness: 150 });

            if (finalDx !== 0 || finalDy !== 0) {
                runOnJS(onMoveEnd)(entity.id, finalDx, finalDy);
            }
        });

    const tapGesture = Gesture.Tap()
        .enabled(!isObstacle)
        .onEnd(() => {
            if (onSelect) runOnJS(onSelect)();
        });

    const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
            // Position absolutely on board
            position: 'absolute',
            left: baseX,
            top: baseY,
            width: width,
            height: height,
            padding: 2, // gap between blocks
            zIndex: translateX.value !== 0 || translateY.value !== 0 ? 10 : 1,
        };
    });

    if (isObstacle) {
        return (
            <View style={{
                position: 'absolute',
                left: baseX,
                top: baseY,
                width,
                height,
                padding: 4,
            }}>
                <View className="flex-1 bg-borderDark rounded-xl shadow-[4px_4px_0px_#1a1512]" />
            </View>
        );
    }

    const bgColor = entity.color ? COLOR_MAP[entity.color] || '#cbd5e1' : '#cbd5e1';

    return (
        <GestureDetector gesture={combinedGesture}>
            <Animated.View style={animatedStyle}>
                <View
                    className={`flex-1 rounded-2xl border-[4px] items-center justify-center overflow-hidden ${isSelected ? 'border-surfaceLight' : 'border-borderDark'}`}
                    style={{ backgroundColor: bgColor }}
                >
                    {/* Top highlight to simulate cartoon 3D lighting without gradients */}
                    <View className="absolute top-0 left-0 right-0 h-3 bg-white/20" />

                    {entity.type === 'ball' ? (
                        <View className="w-10 h-10 bg-surfaceLight rounded-full border-[3px] border-borderDark shadow-[2px_2px_0px_#332A24]" />
                    ) : (
                        <MaterialCommunityIcons name="drag-horizontal-variant" size={24} color="#332A24" style={{ opacity: 0.3 }} />
                    )}
                </View>

                {isSelected && !isObstacle && (
                    <>
                        {bounds.up > 0 && <ArrowButton direction="up" onPress={() => onMoveEnd(entity.id, 0, -1)} />}
                        {bounds.down > 0 && <ArrowButton direction="down" onPress={() => onMoveEnd(entity.id, 0, 1)} />}
                        {bounds.left > 0 && <ArrowButton direction="left" onPress={() => onMoveEnd(entity.id, -1, 0)} />}
                        {bounds.right > 0 && <ArrowButton direction="right" onPress={() => onMoveEnd(entity.id, 1, 0)} />}
                    </>
                )}
            </Animated.View>
        </GestureDetector>
    );
}
