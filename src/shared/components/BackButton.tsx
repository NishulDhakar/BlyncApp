import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAudio } from '../../providers/AudioProvider';

interface BackButtonProps {
    className?: string;
    onPress?: () => void;
}

export function BackButton({ className = "", onPress }: BackButtonProps) {
    const router = useRouter();
    const { playClick } = useAudio();

    return (
        <TouchableOpacity
            className={`w-12 h-12 bg-surfaceLight items-center justify-center rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24] ${className}`}
            activeOpacity={0.7}
            onPress={() => {
                playClick();
                if (onPress) {
                    onPress();
                } else {
                    router.back();
                }
            }}
        >
            <MaterialCommunityIcons name="chevron-left" size={28} color="#332A24" />
        </TouchableOpacity>
    );
}
