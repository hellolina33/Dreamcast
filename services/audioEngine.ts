export class AudioPulse {
    ctx: AudioContext | null = null;
    masterGain: GainNode | null = null;
    activeNodes: Map<string, AudioNode[]> = new Map();
    volumes: Map<string, GainNode> = new Map();

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
            }
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- Core Noise Generators ---

    createNoiseBuffer() {
        if (!this.ctx) return null;
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02; // Pink-ish noise approx
            lastOut = output[i];
            output[i] *= 3.5;
        }
        return buffer;
    }

    createWhiteNoise() {
        if (!this.ctx) return null;
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    // --- Soundscapes ---

    playRain(volume: number = 0.5) {
        if (!this.ctx || !this.masterGain) return;
        this.stop('rain');

        // Rain is filtered Pink Noise
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        // Paul Kellett's refined Pink Noise Algorithm
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        // Lowpass to muffle it like rain
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();

        this.activeNodes.set('rain', [noise, gain, filter]);
        this.volumes.set('rain', gain);
    }

    playFire(volume: number = 0.5) {
        if (!this.ctx || !this.masterGain) return;
        this.stop('fire');

        // Brown noise for rumble
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.value = volume * 1.2;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150; // Deep rumble

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start();

        // Crackles (Random impulses) - Separate interval loop logic managed here? 
        // For simplicity in AudioNode structure, we'll skip complex crackles for MVP 10x or stick to simple noise.
        // Actually, we can add a highpass filtered white noise burst logic on an Interval, 
        // but let's keep it pure AudioNode for performance if possible.

        this.activeNodes.set('fire', [noise, gain, filter]);
        this.volumes.set('fire', gain);
    }

    playWaves(volume: number = 0.5) {
        if (!this.ctx || !this.masterGain) return;
        this.stop('waves');

        // White noise
        const buffer = this.createWhiteNoise();
        if (!buffer) return;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        // Modulate gain to simulate wave crashing (LFO)
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow wave (10s)

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.3; // Depth of modulation

        // We want Volume to oscillate between Vol*0.5 and Vol
        // This is complex to wire perfectly without detailed nodes, simplifying:
        // Use a filter sweep instead of volume sweep for better wave effect

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        // Connect LFO to Filter Frequency to "open" and "close" the wave sound
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
        lfo.start();

        this.activeNodes.set('waves', [noise, gain, filter, lfo, lfoGain]);
        this.volumes.set('waves', gain);
    }

    playForest(volume: number = 0.5) {
        if (!this.ctx || !this.masterGain) return;
        this.stop('forest');

        // Wind (Pink Noise Highpassed)
        const buffer = this.createWhiteNoise(); // actually reusing white, filtering makes it wind
        if (!buffer) return;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 1;

        // Varying wind pitch
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.1;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 200;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.6; // Wind is background

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
        lfo.start();

        this.activeNodes.set('forest', [noise, gain, filter, lfo, lfoGain]);
        this.volumes.set('forest', gain);
    }

    setVolume(type: string, val: number) {
        const gain = this.volumes.get(type);
        if (gain) {
            // Smooth transition
            gain.gain.setTargetAtTime(val, this.ctx?.currentTime || 0, 0.1);
        } else if (val > 0) {
            // Lazy start if not playing
            if (type === 'rain') this.playRain(val);
            if (type === 'fire') this.playFire(val);
            if (type === 'waves') this.playWaves(val);
            if (type === 'forest') this.playForest(val);
        }
    }

    stop(type: string) {
        const nodes = this.activeNodes.get(type);
        if (nodes) {
            nodes.forEach(n => {
                try {
                    if (n instanceof AudioBufferSourceNode || n instanceof OscillatorNode) n.stop();
                    n.disconnect();
                } catch (e) { }
            });
            this.activeNodes.delete(type);
            this.volumes.delete(type);
        }
    }

    stopAll() {
        ['rain', 'fire', 'waves', 'forest'].forEach(t => this.stop(t));
    }
}

// Global instance for persistence across renders
export const sharedAudio = new AudioPulse();
let lastOut = 0;
