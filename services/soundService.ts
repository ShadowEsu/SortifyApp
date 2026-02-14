
class TacticalSoundEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: number = 0.8;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createGain(val: number = 0.1) {
    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(val * this.masterVolume, this.ctx!.currentTime);
    gain.connect(this.ctx!.destination);
    return gain;
  }

  playClick() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.createGain(0.6);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx!.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.05);
    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.05);
  }

  playShutter() {
    this.init();
    const bufferSize = this.ctx!.sampleRate * 0.1;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, this.ctx!.currentTime);
    const gain = this.createGain(1.2);
    noise.connect(filter);
    filter.connect(gain);
    noise.start();
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.1);
  }

  playEnterGrid() {
    this.init();
    [200, 400, 600].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.createGain(0.4);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.4);
      osc.connect(gain);
      osc.start();
      osc.stop(this.ctx!.currentTime + 0.4);
    });
  }

  playSuccess() {
    this.init();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.createGain(0.3);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.3);
      osc.connect(gain);
      osc.start();
      osc.stop(this.ctx!.currentTime + 0.3);
    });
  }

  // Navigation Blip - Lighter tone (higher frequency, sine wave)
  playNav() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.createGain(1.2); // Balanced volume for higher pitch
    osc.type = 'sine';
    // Shifted from 140Hz->30Hz (thud) to 880Hz->440Hz (tactical blip)
    osc.frequency.setValueAtTime(880, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx!.currentTime + 0.1);
    gain.gain.setValueAtTime(1.2, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.1);
    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.1);
  }
}

export const soundService = new TacticalSoundEngine();
