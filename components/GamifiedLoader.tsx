import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Circle, Brain, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GamifiedLoaderProps {
    currentStep: number;
    steps: string[];
}

// Game Constants
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER = 1; // Yellow
const AI = 2; // Red

type Board = number[][];

export const GamifiedLoader: React.FC<GamifiedLoaderProps> = ({ currentStep, steps }) => {
    // Game State
    const [board, setBoard] = useState<Board>(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
    const [turn, setTurn] = useState<number>(PLAYER); // PLAYER starts
    const [winner, setWinner] = useState<number | null>(null);
    const [winningCells, setWinningCells] = useState<string[]>([]); // "row-col" strings
    const [aiThinking, setAiThinking] = useState(false);

    // --- GAME LOGIC ---

    const checkWin = (boardState: Board, player: number) => {
        // Horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (boardState[r][c] === player && boardState[r][c + 1] === player && boardState[r][c + 2] === player && boardState[r][c + 3] === player) {
                    return { winner: player, cells: [`${r}-${c}`, `${r}-${c + 1}`, `${r}-${c + 2}`, `${r}-${c + 3}`] };
                }
            }
        }
        // Vertical
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS; c++) {
                if (boardState[r][c] === player && boardState[r + 1][c] === player && boardState[r + 2][c] === player && boardState[r + 3][c] === player) {
                    return { winner: player, cells: [`${r}-${c}`, `${r + 1}-${c}`, `${r + 2}-${c}`, `${r + 3}-${c}`] };
                }
            }
        }
        // Diagonal /
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (boardState[r][c] === player && boardState[r - 1][c + 1] === player && boardState[r - 2][c + 2] === player && boardState[r - 3][c + 3] === player) {
                    return { winner: player, cells: [`${r}-${c}`, `${r - 1}-${c + 1}`, `${r - 2}-${c + 2}`, `${r - 3}-${c + 3}`] };
                }
            }
        }
        // Diagonal \
        for (let r = 3; r < ROWS; r++) {
            for (let c = 3; c < COLS; c++) {
                if (boardState[r][c] === player && boardState[r - 1][c - 1] === player && boardState[r - 2][c - 2] === player && boardState[r - 3][c - 3] === player) {
                    return { winner: player, cells: [`${r}-${c}`, `${r - 1}-${c - 1}`, `${r - 2}-${c - 2}`, `${r - 3}-${c - 3}`] };
                }
            }
        }
        return null;
    };

    const dropPiece = (col: number, player: number, currentBoard: Board): { newBoard: Board, rowFn: number } | null => {
        const newBoard = currentBoard.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
            if (newBoard[r][col] === EMPTY) {
                newBoard[r][col] = player;
                return { newBoard, rowFn: r };
            }
        }
        return null; // Column full
    };

    const handleColumnClick = useCallback(async (col: number) => {
        if (winner || turn !== PLAYER || aiThinking) return;

        const result = dropPiece(col, PLAYER, board);
        if (!result) return; // Invalid move

        setBoard(result.newBoard);

        // Check Player Win
        const win = checkWin(result.newBoard, PLAYER);
        if (win) {
            setWinner(PLAYER);
            setWinningCells(win.cells);
            return;
        }

        // AI Turn
        setTurn(AI);
        setAiThinking(true);
        setTimeout(() => makeAiMove(result.newBoard), 600 + Math.random() * 500); // Fake thinking time
    }, [board, winner, turn, aiThinking]);

    const makeAiMove = (currentBoard: Board) => {
        // Simple AI: 
        // 1. Can to win?
        // 2. Block player win?
        // 3. Random valid

        let selectedCol = -1;

        // Helper to simulate move
        const canWinNext = (boardState: Board, player: number) => {
            for (let c = 0; c < COLS; c++) {
                const res = dropPiece(c, player, boardState);
                if (res && checkWin(res.newBoard, player)) return c;
            }
            return -1;
        };

        // 1. Attack
        selectedCol = canWinNext(currentBoard, AI);

        // 2. Defend
        if (selectedCol === -1) {
            selectedCol = canWinNext(currentBoard, PLAYER);
        }

        // 3. Random Center-biased
        if (selectedCol === -1) {
            const prioritizedCols = [3, 2, 4, 1, 5, 0, 6]; // Center is best
            for (let c of prioritizedCols) {
                if (currentBoard[0][c] === EMPTY) {
                    selectedCol = c;
                    break;
                }
            }
        }

        if (selectedCol !== -1) {
            const result = dropPiece(selectedCol, AI, currentBoard);
            if (result) {
                setBoard(result.newBoard);
                const win = checkWin(result.newBoard, AI);
                if (win) {
                    setWinner(AI);
                    setWinningCells(win.cells);
                } else {
                    setTurn(PLAYER);
                }
            }
        }
        setAiThinking(false);
    };

    const resetGame = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
        setWinner(null);
        setWinningCells([]);
        setTurn(PLAYER);
        setAiThinking(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a] relative overflow-hidden font-sans select-none">
            {/* Header / Stepper - Preserved from previous loader */}
            <div className="relative z-20 pt-10 px-6 pb-4 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-dream-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Status</span>
                        <h2 className="text-white text-lg font-black italic tracking-wide">
                            CREATION EN COURS<span className="animate-pulse">_</span>
                        </h2>
                    </div>
                    {/* Compact Steps */}
                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-1.5 h-6 rounded-full transition-all duration-500 ${i + 1 <= currentStep ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">

                {/* Score / Status */}
                <div className="flex items-center gap-8 mb-6">
                    <div className={`flex flex-col items-center transition-opacity ${turn === PLAYER ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)] mb-2 border-4 border-slate-800">
                            <User className="w-6 h-6 text-yellow-900" />
                        </div>
                        <span className="text-xs font-bold text-yellow-400">TOI</span>
                    </div>

                    <div className="text-white font-black text-2xl tracking-wider">VS</div>

                    <div className={`flex flex-col items-center transition-opacity ${turn === AI ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] mb-2 border-4 border-slate-800 relative">
                            {aiThinking && <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />}
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-red-500">IA</span>
                    </div>
                </div>

                {/* Board */}
                <div className="bg-blue-600 p-2 sm:p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_5px_10px_rgba(255,255,255,0.2)] border-b-8 border-blue-800 relative">
                    {/* Slots */}
                    <div className="grid grid-cols-7 gap-2 sm:gap-3 bg-blue-700/50 p-2 sm:p-3 rounded-[1.5rem]">
                        {board.map((row, r) => (
                            row.map((cell, c) => {
                                const isWinning = winningCells.includes(`${r}-${c}`);
                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        onClick={() => handleColumnClick(c)}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 shadow-inner relative overflow-hidden cursor-pointer hover:brightness-125 transition-all"
                                    >
                                        <AnimatePresence>
                                            {cell !== EMPTY && (
                                                <motion.div
                                                    initial={{ y: -200, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className={`w-full h-full rounded-full shadow-[inset_0_-4px_4px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.2)] ${cell === PLAYER ? 'bg-yellow-400' : 'bg-red-500'}`}
                                                >
                                                    {isWinning && <div className="absolute inset-0 bg-white/50 animate-pulse rounded-full" />}
                                                    {cell === PLAYER && <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full blur-[1px]" />}
                                                    {cell === AI && <div className="absolute top-2 left-2 w-3 h-3 bg-white/20 rounded-full blur-[1px]" />}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {/* Hover Guide (Ghost piece) */}
                                        {turn === PLAYER && cell === EMPTY && !winner && (
                                            <div className="absolute inset-0 bg-yellow-400/10 opacity-0 hover:opacity-100 rounded-full transition-opacity pointer-events-none" />
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* Game Over Modal */}
                <AnimatePresence>
                    {winner && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 rounded-xl"
                        >
                            <div className="bg-night-800 p-6 rounded-3xl border border-white/10 shadow-2xl text-center">
                                <div className="mb-4">
                                    {winner === PLAYER ? (
                                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                    ) : (
                                        <Brain className="w-16 h-16 text-red-500 mx-auto drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-white italic uppercase mb-1">
                                    {winner === PLAYER ? "VICTOIRE !" : "DÉFAITE..."}
                                </h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    {winner === PLAYER ? "Tu es le champion !" : "L'IA a été plus maligne."}
                                </p>
                                <button
                                    onClick={resetGame}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 mx-auto hover:bg-dream-100 hover:scale-105 transition-all shadow-lg"
                                >
                                    <RefreshCw className="w-4 h-4" /> Rejouer
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reset Button (Always visible logic if stuck) */}
                {!winner && (
                    <button onClick={resetGame} className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                        <RefreshCw className="w-3 h-3" /> Recommencer
                    </button>
                )}

            </div>
        </div>
    );
};
