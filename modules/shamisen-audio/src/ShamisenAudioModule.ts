import { NativeModule, requireNativeModule } from 'expo';

import { ShamisenAudioModuleEvents } from './ShamisenAudio.types';

declare class ShamisenAudioModule extends NativeModule<ShamisenAudioModuleEvents> {
  /**
   * 指定した周波数の正弦波を再生
   * @param frequency 周波数（Hz）
   */
  playTone(frequency: number): void;
  
  /**
   * 現在再生中の音を停止
   */
  stopTone(): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ShamisenAudioModule>('ShamisenAudio');
