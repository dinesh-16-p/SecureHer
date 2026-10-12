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
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  async play() {
    try {
      this.initContext();
      if (!this.audioCtx) {
        return { success: false, reason: 'unsupported' };
      }

      if (this.audioCtx.state === 'suspended') {
        try {
          await this.audioCtx.resume();
        } catch (resumeErr) {
          console.warn('AudioContext resume was blocked by browser autoplay policy:', resumeErr);
        }
      }

      // Check if browser blocked audio playback due to autoplay policy
      if (this.audioCtx.state === 'suspended') {
        return { success: false, reason: 'autoplay_blocked', state: 'suspended' };
      }

      if (this.isPlaying) {
        return { success: true, reason: 'already_playing', state: this.audioCtx.state };
      }

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

      // Modulate frequency to create European/Standard Emergency Siren (750Hz <-> 1200Hz)
      let high = false;
      this.intervalId = setInterval(() => {
        if (!this.isPlaying || !this.audioCtx || !this.oscillator) return;
        const now = this.audioCtx.currentTime;
        const targetFreq = high ? 750 : 1200;
        this.oscillator.frequency.setTargetAtTime(targetFreq, now, 0.08);
        high = !high;
      }, 350);

      return { success: true, reason: 'playing', state: this.audioCtx.state };
    } catch (err) {
      console.warn('Unable to play SOS audio synthesizer:', err);
      return { success: false, reason: 'error', error: err.message };
    }
  }

  async resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        console.warn('Manual audio resume failed:', e);
      }
    }
    return this.play();
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
    return {
      isPlaying: this.isPlaying,
      state: this.audioCtx ? this.audioCtx.state : 'uninitialized'
    };
  }
}

export const sosAlarm = new SOSAlarmService();
