import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { BackButton } from '../shared/components/BackButton';
import { useAppStore } from '../store/useAppStore';

const LEADERBOARD_DATA = [
    { id: '1', name: 'AlexTheBrain', score: 14250, avatar: 'cat', color: '#F09A59', rank: 1 },
    { id: '2', name: 'PuzzleMaster', score: 13800, avatar: 'dog', color: '#FCF6D7', rank: 2 },
    { id: '3', name: 'LogicQueen', score: 12450, avatar: 'rabbit', color: '#9bb988', rank: 3 },
    { id: '4', name: 'Speedster09', score: 9800, avatar: 'turtle', color: '#FDF6E3', rank: 4 },
];

export default function LeaderboardScreen() {
    const router = useRouter();
    const { score, fetchLeaderboard } = useAppStore();
    const [leaderboardData, setLeaderboardData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        fetchLeaderboard().then(data => {
            if (mounted) {
                // Ensure data maps exactly to what we expect
                const formatted = data.map((d: any, index: number) => ({
                    id: d.userId,
                    name: d.name || "Anonymous",
                    score: d.score || 0,
                    rank: d.rank || index + 1,
                    avatar: d.image || 'cat',
                }));
                // Fallback to top 3 if too few
                setLeaderboardData(formatted.length >= 3 ? formatted : [...formatted, ...LEADERBOARD_DATA]);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, []);

    return (
        <View className="flex-1 bg-background">
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1">
                <View className="flex-row justify-between items-center px-6 py-4 border-b-[3px] border-borderDark/10 pb-6 mb-2">
                    <BackButton />
                    <View className="items-center">
                        <Text className="text-textSecondary font-bold text-xs uppercase tracking-widest">Global</Text>
                        <Text className="text-borderDark font-black text-2xl">Leaderboard</Text>
                    </View>
                    <View className="w-12 h-12" />
                </View>
                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <View className="flex-1 py-10 items-center justify-center">
                            <Text className="text-borderDark font-bold text-lg">Loading ranks...</Text>
                        </View>
                    ) : (
                        <View className="flex-row justify-between items-end mb-10 mt-6 px-2">

                            <View className="items-center w-[30%]">
                                <View className="w-16 h-16 bg-surface rounded-full border-[3px] border-borderDark items-center justify-center mb-[-10px] z-10 shadow-[2px_2px_0px_#332A24]">
                                    <MaterialCommunityIcons name={leaderboardData[1]?.avatar as any || 'robot'} size={28} color="#332A24" />
                                </View>
                                <View className="bg-surface w-full h-24 rounded-t-2xl border-[3px] border-borderDark items-center justify-end pb-3 shadow-[4px_4px_0px_#332A24]">
                                    <Text className="text-borderDark font-black text-2xl">2</Text>
                                </View>
                                <Text className="text-borderDark font-bold text-xs mt-3 text-center" numberOfLines={1}>{leaderboardData[1]?.name || '-'}</Text>
                            </View>

                            <View className="items-center w-[35%]">
                                <View className="absolute -top-10 z-20">
                                    <MaterialCommunityIcons name="crown" size={36} color="#F09A59" />
                                </View>
                                <View className="w-20 h-20 bg-accent rounded-full border-[4px] border-borderDark items-center justify-center mb-[-12px] z-10 shadow-[4px_4px_0px_#332A24]">
                                    <MaterialCommunityIcons name={leaderboardData[0]?.avatar as any || 'robot'} size={36} color="#332A24" />
                                </View>
                                <View className="bg-accent w-full h-32 rounded-t-2xl border-[3px] border-borderDark items-center justify-end pb-4 shadow-[4px_4px_0px_#332A24]">
                                    <Text className="text-borderDark font-black text-3xl">1</Text>
                                </View>
                                <Text className="text-borderDark font-black text-sm mt-3 text-center" numberOfLines={1}>{leaderboardData[0]?.name || '-'}</Text>
                            </View>

                            <View className="items-center w-[30%]">
                                <View className="w-14 h-14 bg-success rounded-full border-[3px] border-borderDark items-center justify-center mb-[-8px] z-10 shadow-[2px_2px_0px_#332A24]">
                                    <MaterialCommunityIcons name={leaderboardData[2]?.avatar as any || 'robot'} size={24} color="#332A24" />
                                </View>
                                <View className="bg-success w-full h-20 rounded-t-2xl border-[3px] border-borderDark items-center justify-end pb-2 shadow-[4px_4px_0px_#332A24]">
                                    <Text className="text-borderDark font-black text-xl">3</Text>
                                </View>
                                <Text className="text-borderDark font-bold text-xs mt-3 text-center" numberOfLines={1}>{leaderboardData[2]?.name || '-'}</Text>
                            </View>
                        </View>
                    )}
                    {leaderboardData.slice(3, 10).map((user) => (
                        <View key={user.id || user.name} className="bg-surfaceLight mb-4 flex-row items-center p-4 rounded-2xl border-[3px] border-borderDark shadow-[3px_3px_0px_#332A24]">
                            <Text className="text-textSecondary font-black text-lg w-8">{user.rank}</Text>
                            <View className="w-10 h-10 bg-background rounded-xl border-2 border-borderDark items-center justify-center mr-4">
                                <MaterialCommunityIcons name={user.avatar as any} size={20} color="#332A24" />
                            </View>
                            <Text className="text-borderDark font-bold text-base flex-1">{user.name}</Text>
                            <Text className="text-borderDark font-black text-lg">{user.score.toLocaleString()}</Text>
                        </View>
                    ))}
                    <View className="h-24" />
                </ScrollView>


            </SafeAreaView>
        </View>
    );
}
