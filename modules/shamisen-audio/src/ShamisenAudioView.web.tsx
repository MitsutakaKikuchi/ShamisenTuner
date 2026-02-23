import * as React from 'react';

import { ShamisenAudioViewProps } from './ShamisenAudio.types';

export default function ShamisenAudioView(props: ShamisenAudioViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
