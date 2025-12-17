
// DreamCast Procedural Sound Engine
// Generates premium "Glassy" UI sounds on the fly using Web Audio API

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.3; // Global volume
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return { ctx: audioCtx, master: masterGain };
};

export const playClick = () => {
    try {
        const { ctx, master } = initAudio();
        if (!ctx || !master) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(master);

        // Soft "Woody" Click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { console.error(e); }
};

export const playHover = () => {
    try {
        const { ctx, master } = initAudio();
        if (!ctx || !master) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(master);

        // Very subtle high air
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05); // Super short

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { }
};

export const playSuccess = () => {
    try {
        const { ctx, master } = initAudio();
        if (!ctx || !master) return;

        // Major Chord Ripple (C Major 7)
        const notes = [523.25, 659.25, 783.99, 987.77];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(master);

            osc.type = 'triangle'; // Glassy
            osc.frequency.value = freq;

            const start = ctx.currentTime + (i * 0.05);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.2, start + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 1.5);

            osc.start(start);
            osc.stop(start + 2);
        });
    } catch (e) { }
};
