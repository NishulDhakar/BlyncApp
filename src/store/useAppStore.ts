import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export type GameId = "memory" | "motion" | "switch" | "grid" | "digit" | "deductive" | "inductive" | null;

interface AppState {
    // Theme State
    theme: Theme;
    setTheme: (theme: Theme) => void;

    // Game State
    activeGame: GameId;
    isGameActive: boolean;
    score: number;
    level: number;

    startGame: (game: GameId) => void;
    endGame: () => void;
    increaseScore: (points: number) => void;
    nextLevel: () => void;
    fetchLeaderboard: () => Promise<any[]>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Theme State
            theme: "system",
            setTheme: (theme) => set({ theme }),

            // Game State
            activeGame: null,
            isGameActive: false,
            score: 0,
            level: 1,

            startGame: (game) =>
                set({
                    activeGame: game,
                    isGameActive: true,
                }),

            endGame: () => set({ isGameActive: false, activeGame: null }),

            increaseScore: async (points: number) => {
                // Optimistic UI update
                set((state) => ({ score: Math.max(0, state.score + points) }));

                let state = get();
                if (!state.activeGame) return;

                // Post score to the deployed backend
                try {
                    const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://www.cognitivegames.me";
                    await fetch(`${API_URL}/api/score`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            gameId: state.activeGame,
                            score: points
                        })
                    });
                } catch (error) {
                    console.error("Failed to post score", error);
                }
            },

            nextLevel: () => set((state) => ({ level: state.level + 1 })),

            fetchLeaderboard: async () => {
                try {
                    const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://www.cognitivegames.me";
                    const response = await fetch(`${API_URL}/api/leaderboard`);
                    if (!response.ok) throw new Error("Leaderboard fetch failed");
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error(error);
                    return [];
                }
            }
        }),
        {
            name: "cognitive-games-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                score: state.score,
                level: state.level,
                theme: state.theme,
            }),
        }
    )
);