import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ShamisenAudio.types';

type ShamisenAudioModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ShamisenAudioModule extends NativeModule<ShamisenAudioModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ShamisenAudioModule, 'ShamisenAudioModule');
