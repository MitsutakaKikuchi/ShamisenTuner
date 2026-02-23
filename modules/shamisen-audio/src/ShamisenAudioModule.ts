import { NativeModule, requireNativeModule } from 'expo';

import { ShamisenAudioModuleEvents } from './ShamisenAudio.types';

declare class ShamisenAudioModule extends NativeModule<ShamisenAudioModuleEvents> {
  /**
   * 指定した周波数の音を再生
   * @param frequency 周波数（Hz）
   */
  playTone(frequency: number): void;
  
  /**
   * 現在再生中の音を停止
   */
  stopTone(): void;

  /**
   * 音色タイプを設定
   * @param type 'electronic'（正弦波）または 'pipe'（調子笛風）
   */
  setToneType(type: string): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ShamisenAudioModule>('ShamisenAudio');
