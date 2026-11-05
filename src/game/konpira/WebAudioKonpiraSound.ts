import type { KonpiraSound } from "./KonpiraView";

const CUES = {
  palm: { frequency: 520, type: "triangle", seconds: 0.09 },
  fist: { frequency: 170, type: "sine", seconds: 0.14 },
  cup: { frequency: 880, type: "triangle", seconds: 0.12 },
  fail: { frequency: 110, type: "sawtooth", seconds: 0.45 },
} as const;

/** Wood-block style hits synthesised on the fly, so no audio files are needed. */
export class WebAudioKonpiraSound implements KonpiraSound {
  private context?: AudioContext;

  /** @param volume current game volume (0-1), read on every hit to honour the settings. */
  constructor(private readonly volume: () => number) {}

  play(cue: keyof typeof CUES): void {
    this.context ??= new AudioContext();
    const { frequency, type, seconds } = CUES[cue];
    const now = this.context.currentTime;

    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(Math.max(0.0001, 0.4 * this.volume()), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);

    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + seconds);
  }
}
