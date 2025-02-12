import { useEffect, useRef, useState } from "react";
import { FaVolumeHigh } from "react-icons/fa6";

const PlaySound = ({ soundUrl }: { soundUrl: string }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.preload = "auto";
            audio.oncanplaythrough = () => setIsLoaded(true); // Ensure it's fully loaded
            audioRef.current = audio;
        }

        // Create AudioContext once (Safari Fix)
        if (!audioContext) {
            {/* @ts-expect-error ertet */}
            setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
        }
    }, [soundUrl]);

    const playSound = () => {
        if (!audioRef.current || !isLoaded) return;

        if (audioContext && audioContext.state === "suspended") {
            audioContext.resume(); // Wake up AudioContext
        }

        audioRef.current.currentTime = 0.05; // Prevent crackle at start
        audioRef.current.play().catch(err => console.error("Audio play error:", err));
    };

    return (
        <button onClick={playSound} className="speaker-icon">
            <FaVolumeHigh size={30} />
        </button>
    );
};

export default PlaySound;
