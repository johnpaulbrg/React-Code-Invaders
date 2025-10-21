/**
 * Game.tsx
 * 
 * Author: John Paul Brogan
 * Date: 2025-10-21
 * Copyright © 2025 John Paul Brogan. All rights reserved.
 *
 * Description:
 * Main game component for React Code Invaders. Renders the canvas,
 * spawns falling "alien" keywords, handles user input, and updates
 * the browser tab title with the selected language.
 */

import React, { useEffect, useRef } from 'react';

interface Alien {
    code: string;
    x: number;
    y: number;
    speed: number;
    angle: number;          // current rotation angle
    rotationSpeed: number;  // how fast it spins
    flashUntil?: number;
}

interface GameProps {
    words: { keywords: string[]; primitives: string[] };
    language: string;
}

const Game: React.FC<GameProps> = ({ words, language }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- Sound helpers ---
    function playBeep() {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 440 + Math.random() * 200; // randomize pitch
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.2);
    }

    function playThud() {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 120; // low pitch
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        osc.stop(ctx.currentTime + 0.4);
    }

    // Update browser tab title when language changes
    useEffect(() => {
        document.title = `React-Code-Invaders ${language}`;
    }, [language]);

    // Game state stored in refs (no re-renders per frame)
    const aliensRef = useRef<Alien[]>([]);
    const inputRef = useRef<string>('');
    const lastSpawnRef = useRef<number>(0);

    // Score tracking
    const matchedCountRef = useRef<number>(0);
    const totalSpawnedRef = useRef<number>(0);

    const codes = [...new Set([...words.keywords, ...words.primitives])];

    // Utility: pick N random keywords and assign them very fast speeds
    const pickFastKeywords = (codes: string[], count: number): Record<string, number> => {
        const shuffled = [...codes].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);
        const speeds: Record<string, number> = {};
        selected.forEach((word) => {
            speeds[word] = 4.0 + Math.random() * 2.0;
        });
        return speeds;
    };

    const keywordSpeeds: Record<string, number> = pickFastKeywords(codes, 10);

    const spawnAlien = (canvasWidth: number): Alien => {
        const code = codes[Math.floor(Math.random() * codes.length)];
        const x = Math.random() * (canvasWidth - 40);
        const speed = keywordSpeeds[code] ?? 1.5;
        const rotationSpeed = (Math.random() - 0.5) * 0.1;
        return { code, x, y: 0, speed, angle: 0, rotationSpeed };
    };

    const languageColors: Record<string, string> = {
        "C++": "#3399FF",
        "C#": "violet",
        "Java": "limegreen",
        "Python": "#4B8BBE",
        "Javascript": "#F7DF1E",
        "default": "red"
    };

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let animationFrameId: number;

        const loop = (time: number) => {
            const width = canvas.width;
            const height = canvas.height;

            if (time - lastSpawnRef.current > 2000) {
                aliensRef.current.push(spawnAlien(width));
                totalSpawnedRef.current += 1; // increment total
                lastSpawnRef.current = time;
            }

            aliensRef.current = aliensRef.current.reduce<Alien[]>((acc, a) => {
                const newY = a.y + a.speed;
                const newAngle = a.angle + a.rotationSpeed;

                if (a.flashUntil && performance.now() > a.flashUntil) {
                    return acc; // remove after flash
                }

                if (newY < height - 20) {
                    acc.push({ ...a, y: newY, angle: newAngle });
                } else {
                    inputRef.current = '';
                    playThud(); // 🔊 play miss sound
                }
                return acc;
            }, []);

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);

            ctx.font = '18px Consolas';
            aliensRef.current.forEach((a) => {
                ctx.save();
                ctx.translate(a.x, a.y);
                if (a.flashUntil && performance.now() < a.flashUntil) {
                    ctx.fillStyle = 'white';
                } else {
                    ctx.fillStyle = languageColors[language] ?? languageColors["default"];
                }
                ctx.fillText(a.code, 0, 0);
                ctx.restore();
            });

            // Draw typed input
            ctx.fillStyle = 'white';
            ctx.font = '20px Consolas';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`Typed: ${inputRef.current}`, width / 2, height - 20);

             // Draw score (top right)
            ctx.fillStyle = 'white';
            ctx.font = '20px Consolas';
            ctx.textAlign = 'right'; 
            ctx.textBaseline = 'top'; 
            ctx.fillText(
                `Score: ${matchedCountRef.current}/${totalSpawnedRef.current}`,
                width - 10,
                10
            );

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [language]);

    // Input handling
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                inputRef.current += e.key;
                const match = aliensRef.current.find((a) => a.code === inputRef.current);
                if (match) {
                    match.flashUntil = performance.now() + 150;
                    playBeep(); // 🔊 play match sound
                    matchedCountRef.current += 1; // increment matched
                    inputRef.current = '';
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default Game;
