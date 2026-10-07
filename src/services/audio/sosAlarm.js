/**
 * SOS Emergency Alarm Audio Service
 * Uses Web Audio API dual-tone synthesis for guaranteed browser playback on user action,
 * with zero dependency on network/asset file availability.
 */

class SOSAlarmService {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.intervalId = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  play() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.isPlaying) return;

      this.isPlaying = true;

      // Master gain node
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      // Oscillator for alert tone
      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();

      // Modulate frequency to create European/Standard Emergency Siren (800Hz <-> 1200Hz)
      let high = false;
      this.intervalId = setInterval(() => {
        if (!this.isPlaying || !this.audioCtx || !this.oscillator) return;
        const now = this.audioCtx.currentTime;
        const targetFreq = high ? 750 : 1200;
        this.oscillator.frequency.setTargetAtTime(targetFreq, now, 0.08);
        high = !high;
      }, 350);

    } catch (err) {
      console.warn('Unable to play SOS audio synthesizer:', err);
    }
  }

  stop() {
    try {
      this.isPlaying = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch (err) {
      console.warn('Error stopping SOS audio:', err);
    }
  }

  getStatus() {
    return this.isPlaying;
  }
}

export const sosAlarm = new SOSAlarmService();
