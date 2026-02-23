import ExpoModulesCore
import AVFoundation

public class ShamisenAudioModule: Module {
  // オーディオエンジンとノード
  private let audioEngine = AVAudioEngine()
  private let audioPlayerNode = AVAudioPlayerNode()
  
  // 現在の音声状態
  private var currentFrequency: Float = 0.0
  private var isPlaying: Bool = false
  private var toneType: String = "electronic" // "electronic" or "pipe"
  
  // フェード処理用
  private let sampleRate: Double = 44100.0
  private let fadeInSamples: Int = 1764 // 約40ms（リード楽器の立ち上がり특성）
  private let fadeOutSamples: Int = 882  // 約20ms
  
  public func definition() -> ModuleDefinition {
    Name("ShamisenAudio")
    
    // オーディオセッションの初期化
    OnCreate {
      self.setupAudioSession()
      self.setupAudioEngine()
    }
    
    // モジュール破棄時のクリーンアップ
    OnDestroy {
      self.stopTone()
      self.audioEngine.stop()
    }
    
    // 指定周波数の音を再生
    Function("playTone") { (frequency: Float) in
      self.playTone(frequency: frequency)
    }
    
    // 音を停止
    Function("stopTone") {
      self.stopTone()
    }

    // 音色タイプを設定
    Function("setToneType") { (type: String) in
      self.setToneType(type: type)
    }
  }
  
  // オーディオセッションのセットアップ
  private func setupAudioSession() {
    do {
      let audioSession = AVAudioSession.sharedInstance()
      try audioSession.setCategory(.playback, mode: .default)
      try audioSession.setActive(true)
    } catch {
      print("オーディオセッションのセットアップに失敗: \(error)")
    }
  }
  
  // オーディオエンジンのセットアップ
  private func setupAudioEngine() {
    // プレイヤーノードをエンジンにアタッチ
    audioEngine.attach(audioPlayerNode)
    
    // ノードをメインミキサーに接続
    let mainMixer = audioEngine.mainMixerNode
    let format = AVAudioFormat(
      standardFormatWithSampleRate: sampleRate,
      channels: 1
    )
    audioEngine.connect(audioPlayerNode, to: mainMixer, format: format)
    
    // エンジンを起動
    do {
      try audioEngine.start()
    } catch {
      print("オーディオエンジンの起動に失敗: \(error)")
    }
  }
  
  // 正弦波または調子笛波形を生成して再生
  private func playTone(frequency: Float) {
    // 既に同じ周波数を再生中の場合は何もしない
    if isPlaying && currentFrequency == frequency {
      return
    }
    
    // 新しい周波数に更新
    currentFrequency = frequency
    
    // 既に再生中なら停止してから再生
    if isPlaying {
      audioPlayerNode.stop()
    }
    
    isPlaying = true
    
    // バッファを生成
    let bufferSize: AVAudioFrameCount = 4410 // 約0.1秒分
    let format = AVAudioFormat(
      standardFormatWithSampleRate: sampleRate,
      channels: 1
    )!
    
    guard let buffer = AVAudioPCMBuffer(
      pcmFormat: format,
      frameCapacity: bufferSize
    ) else {
      return
    }
    
    buffer.frameLength = bufferSize
    
    // 波形を生成（フェードイン処理付き）
    let channels = UnsafeBufferPointer(
      start: buffer.floatChannelData,
      count: Int(format.channelCount)
    )
    
    let isPipe = (toneType == "pipe")
    
    for frame in 0..<Int(bufferSize) {
      let time = Float(frame) / Float(sampleRate)
      let phase = 2.0 * Float.pi * frequency * time
      
      var sample: Float
      if isPipe {
        // ピッチパイプ風波形: 自由リード（フリーリード）の音色特性
        // 基本波強め＋2倍音（オクターブ）強め、高次倍音は急減衰
        sample = sin(phase)                    // 基本波: 1.0
          + 0.60 * sin(2.0 * phase)           // 2倍音（オクターブ）: リードの特徴
          + 0.35 * sin(3.0 * phase)           // 3倍音
          + 0.20 * sin(4.0 * phase)           // 4倍音
          + 0.12 * sin(5.0 * phase)           // 5倍音
          + 0.06 * sin(6.0 * phase)           // 6倍音
          + 0.03 * sin(7.0 * phase)           // 7倍音（急減衰）
        // 正規化（合計振幅 ≈ 2.36 → スケール）
        sample *= 0.42
      } else {
        // 電子音: 正弦波
        sample = sin(phase)
      }
      
      // フェードイン処理
      if frame < fadeInSamples {
        let fadeRatio = Float(frame) / Float(fadeInSamples)
        sample *= fadeRatio
      }
      
      // 音量調整（聴感上のバランスを取る）
      let volume = calculateVolume(frequency: frequency)
      sample *= volume
      
      channels[0][frame] = sample
    }
    
    // ループ再生
    audioPlayerNode.play()
    audioPlayerNode.scheduleBuffer(buffer, at: nil, options: .loops)
  }

  // 音色タイプを設定
  private func setToneType(type: String) {
    toneType = type
    // 再生中なら音色を即座に切り替え
    if isPlaying && currentFrequency > 0 {
      let freq = currentFrequency
      audioPlayerNode.stop()
      isPlaying = false
      playTone(frequency: freq)
    }
  }
  
  // 音を停止（フェードアウト処理あり）
  private func stopTone() {
    if !isPlaying {
      return
    }
    
    // フェードアウトバッファを生成
    let fadeBuffer = createFadeOutBuffer()
    
    // 現在の再生を停止
    audioPlayerNode.stop()
    
    // フェードアウトバッファを再生
    if let buffer = fadeBuffer {
      audioPlayerNode.play()
      audioPlayerNode.scheduleBuffer(buffer, at: nil, options: []) {
        self.isPlaying = false
        self.currentFrequency = 0.0
      }
    } else {
      isPlaying = false
      currentFrequency = 0.0
    }
  }
  
  // フェードアウトバッファを生成
  private func createFadeOutBuffer() -> AVAudioPCMBuffer? {
    let format = AVAudioFormat(
      standardFormatWithSampleRate: sampleRate,
      channels: 1
    )!
    
    guard let buffer = AVAudioPCMBuffer(
      pcmFormat: format,
      frameCapacity: AVAudioFrameCount(fadeOutSamples)
    ) else {
      return nil
    }
    
    buffer.frameLength = AVAudioFrameCount(fadeOutSamples)
    
    let channels = UnsafeBufferPointer(
      start: buffer.floatChannelData,
      count: Int(format.channelCount)
    )
    
    for frame in 0..<fadeOutSamples {
      let time = Float(frame) / Float(sampleRate)
      let phase = 2.0 * Float.pi * currentFrequency * time
      
      var sample: Float
      if toneType == "pipe" {
        sample = (sin(phase)
          + 0.60 * sin(2.0 * phase)
          + 0.35 * sin(3.0 * phase)
          + 0.20 * sin(4.0 * phase)
          + 0.12 * sin(5.0 * phase)
          + 0.06 * sin(6.0 * phase)
          + 0.03 * sin(7.0 * phase)) * 0.42
      } else {
        sample = sin(phase)
      }
      
      // フェードアウト処理
      let fadeRatio = Float(fadeOutSamples - frame) / Float(fadeOutSamples)
      sample *= fadeRatio
      
      let volume = calculateVolume(frequency: currentFrequency)
      sample *= volume
      
      channels[0][frame] = sample
    }
    
    return buffer
  }
  
  // 周波数に応じた音量補正（等ラウドネス曲線の簡易近似）
  private func calculateVolume(frequency: Float) -> Float {
    // 基準周波数（1000Hz付近）を1.0とする
    let baseFreq: Float = 1000.0
    
    // 低音域と高音域を少し増幅
    if frequency < baseFreq {
      // 低音域: 200Hzで約1.2倍
      let ratio = max(0.8, min(1.2, 1.0 + (baseFreq - frequency) / baseFreq * 0.2))
      return ratio
    } else {
      // 高音域: 2000Hzで約1.1倍
      let ratio = max(0.9, min(1.1, 1.0 + (frequency - baseFreq) / baseFreq * 0.1))
      return ratio
    }
  }
}
