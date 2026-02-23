import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ShamisenAudio.types';

type ShamisenAudioModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

/**
 * Web Audio API を使用した音声再生モジュール
 * ネイティブモジュール(Swift)と同じインターフェースを提供
 */
class ShamisenAudioModule extends NativeModule<ShamisenAudioModuleEvents> {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private currentFrequency: number = 0;
  private isPlaying: boolean = false;

  // フェード時間（秒）
  private readonly FADE_IN_TIME = 0.01;
  private readonly FADE_OUT_TIME = 0.01;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  /**
   * 指定周波数の正弦波を再生
   */
  playTone(frequency: number): void {
    // 同じ周波数を再生中なら何もしない
    if (this.isPlaying && this.currentFrequency === frequency) {
      return;
    }

    // 既に再生中なら停止
    if (this.isPlaying) {
      this.stopToneInternal();
    }

    const ctx = this.getAudioContext();

    // オシレーター作成
    this.oscillator = ctx.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // ゲインノード（音量制御・フェード処理）
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(
      this.calculateVolume(frequency),
      ctx.currentTime + this.FADE_IN_TIME
    );

    // 接続: oscillator -> gain -> destination
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    this.oscillator.start();
    this.currentFrequency = frequency;
    this.isPlaying = true;
  }

  /**
   * 音を停止（フェードアウト付き）
   */
  stopTone(): void {
    if (!this.isPlaying) {
      return;
    }
    this.stopToneInternal();
  }

  private stopToneInternal(): void {
    if (!this.gainNode || !this.oscillator || !this.audioContext) {
      this.isPlaying = false;
      this.currentFrequency = 0;
      return;
    }

    const ctx = this.audioContext;

    // フェードアウト
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + this.FADE_OUT_TIME);

    // フェードアウト完了後にオシレーターを停止
    const osc = this.oscillator;
    setTimeout(() => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // 既に停止済みの場合を無視
      }
    }, this.FADE_OUT_TIME * 1000 + 10);

    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.currentFrequency = 0;
  }

  /**
   * 周波数に応じた音量補正（等ラウドネス曲線の簡易近似）
   */
  private calculateVolume(frequency: number): number {
    const baseFreq = 1000;
    if (frequency < baseFreq) {
      return Math.max(0.3, Math.min(0.5, 0.4 + (baseFreq - frequency) / baseFreq * 0.1));
    }
    return Math.max(0.3, Math.min(0.45, 0.4 + (frequency - baseFreq) / baseFreq * 0.05));
  }
}

export default registerWebModule(ShamisenAudioModule, 'ShamisenAudioModule');
