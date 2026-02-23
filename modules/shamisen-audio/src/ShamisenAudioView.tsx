import { requireNativeView } from 'expo';
import * as React from 'react';

import { ShamisenAudioViewProps } from './ShamisenAudio.types';

const NativeView: React.ComponentType<ShamisenAudioViewProps> =
  requireNativeView('ShamisenAudio');

export default function ShamisenAudioView(props: ShamisenAudioViewProps) {
  return <NativeView {...props} />;
}
