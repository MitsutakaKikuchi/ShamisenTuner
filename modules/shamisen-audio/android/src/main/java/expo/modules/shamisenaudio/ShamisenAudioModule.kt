package expo.modules.shamisenaudio

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlin.math.sin
import kotlin.math.PI
import kotlin.math.max
import kotlin.math.min

class ShamisenAudioModule : Module() {
  private var audioTrack: AudioTrack? = null
  private var isPlaying = false
  private var currentFrequency = 0f
  private var toneType = "electronic"
  private var playThread: Thread? = null

  private val sampleRate = 44100
  private val fadeInSamples = 1764 // 約40ms（リード楽器の立ち上がり特性）
  private val fadeOutSamples = 882  // 約20ms

  override fun definition() = ModuleDefinition {
    Name("ShamisenAudio")

    Function("playTone") { frequency: Float ->
      playTone(frequency)
    }

    Function("stopTone") {
      stopTone()
    }

    Function("setToneType") { type: String ->
      setToneType(type)
    }

    OnDestroy {
      stopTone()
    }
  }

  private fun setToneType(type: String) {
    toneType = type
    if (isPlaying && currentFrequency > 0) {
      val freq = currentFrequency
      stopTone()
      playTone(freq)
    }
  }

  private fun playTone(frequency: Float) {
    if (isPlaying && currentFrequency == frequency) return

    if (isPlaying) {
      stopTone()
    }

    currentFrequency = frequency
    isPlaying = true

    val bufferSize = AudioTrack.getMinBufferSize(
      sampleRate,
      AudioFormat.CHANNEL_OUT_MONO,
      AudioFormat.ENCODING_PCM_16BIT
    )

    audioTrack = AudioTrack.Builder()
      .setAudioAttributes(
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_MEDIA)
          .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
          .build()
      )
      .setAudioFormat(
        AudioFormat.Builder()
          .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
          .setSampleRate(sampleRate)
          .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
          .build()
      )
      .setBufferSizeInBytes(bufferSize)
      .build()

    audioTrack?.play()

    playThread = Thread {
      val buffer = ShortArray(bufferSize / 2)
      val isPipe = toneType == "pipe"
      var frameOffset = 0

      while (isPlaying) {
        for (i in buffer.indices) {
          val frame = frameOffset + i
          val time = frame.toFloat() / sampleRate
          val phase = (2.0 * PI * frequency * time).toFloat()

          var sample = if (isPipe) {
            // ピッチパイプ風: 自由リードの音色特性（2倍音強め、急減衰）
            (sin(phase.toDouble())
              + 0.60 * sin(2.0 * phase)
              + 0.35 * sin(3.0 * phase)
              + 0.20 * sin(4.0 * phase)
              + 0.12 * sin(5.0 * phase)
              + 0.06 * sin(6.0 * phase)
              + 0.03 * sin(7.0 * phase)).toFloat() * 0.42f
          } else {
            sin(phase.toDouble()).toFloat()
          }

          // フェードイン
          if (frame < fadeInSamples) {
            sample *= frame.toFloat() / fadeInSamples
          }

          val volume = calculateVolume(frequency)
          sample *= volume

          buffer[i] = (sample * Short.MAX_VALUE).toInt().toShort()
        }

        frameOffset += buffer.size

        try {
          audioTrack?.write(buffer, 0, buffer.size)
        } catch (e: Exception) {
          break
        }
      }
    }
    playThread?.start()
  }

  private fun stopTone() {
    isPlaying = false
    try {
      playThread?.join(100)
      audioTrack?.stop()
      audioTrack?.release()
    } catch (e: Exception) {
      // ignore
    }
    audioTrack = null
    playThread = null
    currentFrequency = 0f
  }

  private fun calculateVolume(frequency: Float): Float {
    val baseFreq = 1000f
    return if (frequency < baseFreq) {
      max(0.8f, min(1.2f, 1.0f + (baseFreq - frequency) / baseFreq * 0.2f))
    } else {
      max(0.9f, min(1.1f, 1.0f + (frequency - baseFreq) / baseFreq * 0.1f))
    }
  }
}
