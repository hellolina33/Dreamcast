import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
    analyser: AnalyserNode | null;
    isPlaying: boolean;
    color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isPlaying, color = '#8b5cf6' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !analyser) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;

                // Create a gradient for a premium look
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, '#ec4899'); // Neon pink secondary

                ctx.fillStyle = gradient;

                // Rounded bar effect
                const radius = 2;
                const barX = x;
                const barY = canvas.height - barHeight;

                if (barHeight > 0) {
                    ctx.beginPath();
                    ctx.roundRect(barX, barY, barWidth - 1, barHeight, radius);
                    ctx.fill();
                }

                x += barWidth + 1;
            }
        };

        if (isPlaying) {
            draw();
        } else {
            // Draw initial flat bars
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color + '44'; // Transparent version
            const barWidth = (canvas.width / bufferLength) * 2.5;
            for (let i = 0; i < bufferLength; i++) {
                ctx.fillRect(i * (barWidth + 1), canvas.height - 2, barWidth - 1, 2);
            }
        }

        return () => cancelAnimationFrame(animationId);
    }, [analyser, isPlaying, color]);

    return (
        <canvas
            ref={canvasRef}
            width={120}
            height={40}
            className="opacity-80 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-opacity duration-500"
        />
    );
};
