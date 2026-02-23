import { Audio } from 'expo-av';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AudioContextType {
    playClick: () => void;
    playWin: () => void;
    playLose: () => void;
    setBgMuted: (muted: boolean) => void;
    isBgMuted: boolean;
    setSfxMuted: (muted: boolean) => void;
    isSfxMuted: boolean;
}

const AudioContext = createContext<AudioContextType>({
    playClick: () => { },
    playWin: () => { },
    playLose: () => { },
    setBgMuted: () => { },
    isBgMuted: false,
    setSfxMuted: () => { },
    isSfxMuted: false,
});

export function useAudio() {
    return useContext(AudioContext);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [bgMusic, setBgMusic] = useState<Audio.Sound | null>(null);
    const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
    const [winSound, setWinSound] = useState<Audio.Sound | null>(null);
    const [loseSound, setLoseSound] = useState<Audio.Sound | null>(null);
    const [isBgMuted, setIsBgMuted] = useState(false);
    const [isSfxMuted, setIsSfxMuted] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function setupAudio() {
            try {
                console.log("[AudioProvider] Setting audio mode...");
                // Configure audio session for the app
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });

                console.log("[AudioProvider] Loading bg music...");
                // Load Background Music
                const { sound: bgSound } = await Audio.Sound.createAsync(
                    require('../assets/sounds/bg.mp3'),
                    { isLooping: true, volume: 0.3 }
                );

                console.log("[AudioProvider] Loading click sound...");
                // Load Click Sound
                const { sound: click } = await Audio.Sound.createAsync(
                    require('../assets/sounds/click.mp3')
                );

                console.log("[AudioProvider] Loading win sound...");
                const { sound: win } = await Audio.Sound.createAsync(
                    require('../assets/sounds/win.mp3')
                );

                console.log("[AudioProvider] Loading lose sound...");
                const { sound: lose } = await Audio.Sound.createAsync(
                    require('../assets/sounds/lose.mp3')
                );

                console.log("[AudioProvider] Successfully loaded sounds. isMounted:", isMounted);
                if (isMounted) {
                    setBgMusic(bgSound);
                    setClickSound(click);
                    setWinSound(win);
                    setLoseSound(lose);

                    if (!isBgMuted) {
                        console.log("[AudioProvider] Playing bg music...");
                        await bgSound.playAsync();
                    }
                } else {
                    bgSound.unloadAsync();
                    click.unloadAsync();
                    win.unloadAsync();
                    lose.unloadAsync();
                }

            } catch (error) {
                console.error("[AudioProvider] Failed to load audio:", error);
            }
        }

        setupAudio();

        // Cleanup on unmount
        return () => {
            isMounted = false;
            if (bgMusic) bgMusic.unloadAsync();
            if (clickSound) clickSound.unloadAsync();
            if (winSound) winSound.unloadAsync();
            if (loseSound) loseSound.unloadAsync();
        };
    }, []);

    // Handle Bg Music Mute Toggling
    useEffect(() => {
        if (bgMusic) {
            if (isBgMuted) {
                bgMusic.pauseAsync();
            } else {
                bgMusic.playAsync();
            }
        }
    }, [isBgMuted, bgMusic]);

    const playClick = async () => {
        if (!isSfxMuted && clickSound) {
            try {
                await clickSound.replayAsync();
            } catch (error) {
                console.warn("Failed to play click:", error);
            }
        }
    };

    const playWin = async () => {
        if (!isSfxMuted && winSound) {
            try { await winSound.replayAsync(); }
            catch (error) { console.warn("Failed to play win:", error); }
        }
    };

    const playLose = async () => {
        if (!isSfxMuted && loseSound) {
            try { await loseSound.replayAsync(); }
            catch (error) { console.warn("Failed to play lose:", error); }
        }
    };

    return (
        <AudioContext.Provider value={{
            playClick, playWin, playLose,
            setBgMuted: setIsBgMuted,
            isBgMuted,
            setSfxMuted: setIsSfxMuted,
            isSfxMuted
        }}>
            {children}
        </AudioContext.Provider>
    );
}
