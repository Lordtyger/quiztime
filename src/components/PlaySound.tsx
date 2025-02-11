import { useEffect, useRef } from "react";
import { FaVolumeHigh } from "react-icons/fa6";

const PlaySound = ({ soundUrl }: { soundUrl: string }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (soundUrl) {
            audioRef.current = new Audio(soundUrl);
            audioRef.current.preload = "auto"; // Ensure it's preloaded
        }
    }, [soundUrl]);

    const playSound = async () => {
        if (audioRef.current) {
            const audioContext = new (window.AudioContext || window.AudioContext)();
            if (audioContext.state === "suspended") {
                await audioContext.resume(); // Wakes up the audio engine
            }

            audioRef.current.currentTime = 0.05; // Prevent crackle at 0s
            audioRef.current.play().catch(err => console.error("Audio play error:", err));
        }
    };

    return (
        <button onClick={playSound} className="speaker-icon">
            <FaVolumeHigh size={30} />
        </button>
    );
};

export default PlaySound;
