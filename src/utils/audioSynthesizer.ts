/**
 * CineFlow Audio Synthesizer (Web Audio API)
 * Generates real playable video editing audio tracks & sound effects (SFX)
 * Exports true 44.1kHz 16-bit PCM WAV files for Premiere / DaVinci Resolve
 */

// Helper to convert AudioBuffer to WAV Blob
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Write audio samples
  let offset = 44;
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      // Clamp sample
      sample = Math.max(-1, Math.min(1, sample));
      // Convert float to 16-bit PCM
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

// Generate Sound Effects (SFX)
export async function synthesizeSfx(type: 'whoosh' | 'chaching' | 'bass_drop' | 'pop' | 'shutter' | 'glitch' | 'ding'): Promise<{ buffer: AudioBuffer; blob: Blob }> {
  const sampleRate = 44100;
  let duration = 0.6;
  if (type === 'whoosh') duration = 0.5;
  if (type === 'chaching') duration = 0.8;
  if (type === 'bass_drop') duration = 1.2;
  if (type === 'pop') duration = 0.15;
  if (type === 'shutter') duration = 0.3;
  if (type === 'glitch') duration = 0.45;
  if (type === 'ding') duration = 0.9;

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const buffer = audioCtx.createBuffer(2, Math.floor(sampleRate * duration), sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  if (type === 'whoosh') {
    // Noise burst with bandpass sweep
    for (let i = 0; i < buffer.length; i++) {
      const t = i / buffer.length;
      const env = Math.sin(t * Math.PI) ** 2;
      const freq = 300 + 2000 * Math.sin(t * Math.PI);
      const noise = (Math.random() * 2 - 1) * 0.8;
      const tone = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * 0.4;
      const s = (noise + tone) * env * 0.7;
      left[i] = s;
      right[i] = s * (0.8 + 0.2 * Math.sin(t * 10));
    }
  } else if (type === 'chaching') {
    // Cash register bell chime (Dual metallic frequencies 1800Hz + 2400Hz + decay)
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const env1 = Math.exp(-t * 6);
      const env2 = t > 0.08 ? Math.exp(-(t - 0.08) * 4) : 0;
      const tone1 = Math.sin(2 * Math.PI * 1920 * t) * env1;
      const tone2 = Math.sin(2 * Math.PI * 2560 * t) * env2;
      const s = (tone1 * 0.5 + tone2 * 0.6) * 0.8;
      left[i] = s;
      right[i] = s;
    }
  } else if (type === 'bass_drop') {
    // Sub bass drop from 140Hz down to 35Hz
    for (let i = 0; i < buffer.length; i++) {
      const t = i / buffer.length;
      const freq = 140 * (1 - t * 0.75);
      const env = (1 - t) ** 0.8;
      const s = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * env * 0.9;
      left[i] = s;
      right[i] = s;
    }
  } else if (type === 'pop') {
    // Bubble pop 750Hz -> 200Hz
    for (let i = 0; i < buffer.length; i++) {
      const t = i / buffer.length;
      const freq = 750 - t * 550;
      const env = Math.exp(-t * 15);
      const s = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * env * 0.8;
      left[i] = s;
      right[i] = s;
    }
  } else if (type === 'shutter') {
    // Camera click double burst
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      let s = 0;
      if (t < 0.06) {
        s = (Math.random() * 2 - 1) * Math.exp(-t * 80) * 0.9;
      } else if (t >= 0.12 && t < 0.22) {
        s = (Math.random() * 2 - 1) * Math.exp(-(t - 0.12) * 60) * 0.8;
      }
      left[i] = s;
      right[i] = s;
    }
  } else if (type === 'glitch') {
    // Cyber glitch stutter
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const squareTone = Math.sin(2 * Math.PI * (1200 + ((i % 50) * 60)) * t) > 0 ? 0.35 : -0.35;
      const noise = (Math.random() * 2 - 1) * 0.45;
      const env = Math.exp(-t * 14);
      const s = (squareTone + noise) * env;
      left[i] = s;
      right[i] = (i % 2 === 0 ? s : -s) * 0.9;
    }
  } else if (type === 'ding') {
    // Notification chime
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const s1 = Math.sin(2 * Math.PI * 2093 * t) * Math.exp(-t * 6);
      const s2 = Math.sin(2 * Math.PI * 3135 * t) * Math.exp(-t * 8);
      const s = (s1 * 0.6 + s2 * 0.4) * 0.8;
      left[i] = s;
      right[i] = s;
    }
  }

  const blob = audioBufferToWav(buffer);
  return { buffer, blob };
}

// Generate Background Music Track (10-15s Beat Loop with configurable BPM & Duration)
export async function synthesizeMusicTrack(
  style: 'dtc_tiktok' | 'vsl_cinematic' | 'lofi_chai' | 'synthwave' | 'luxury_ambient' | 'countdown_tension',
  customBpm?: number,
  customDuration?: number
): Promise<{ buffer: AudioBuffer; blob: Blob }> {
  const sampleRate = 44100;
  const duration = customDuration || 12.0;
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const buffer = audioCtx.createBuffer(2, Math.floor(sampleRate * duration), sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const defaultBpms: Record<string, number> = {
    dtc_tiktok: 128,
    vsl_cinematic: 100,
    lofi_chai: 84,
    synthwave: 120,
    luxury_ambient: 75,
    countdown_tension: 130,
  };
  const bpm = customBpm || defaultBpms[style] || 120;
  const beatDuration = 60 / bpm;

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    const beatPos = (t % beatDuration) / beatDuration;
    const barPos = (t % (beatDuration * 4)) / (beatDuration * 4);
    let sampleL = 0;
    let sampleR = 0;

    if (style === 'dtc_tiktok') {
      // 128 BPM Punchy TikTok Beat
      const isKick = beatPos < 0.2;
      const isSnare = (barPos > 0.23 && barPos < 0.28) || (barPos > 0.73 && barPos < 0.78);
      
      if (isKick) {
        const kFreq = 150 * Math.exp(-beatPos * 25);
        sampleL += Math.sin(2 * Math.PI * kFreq * beatPos) * Math.exp(-beatPos * 12) * 0.8;
      }
      if (isSnare) {
        const snareEnv = Math.exp(-(barPos % 0.25) * 20);
        const noise = (Math.random() * 2 - 1) * snareEnv * 0.5;
        sampleL += noise;
        sampleR += noise;
      }
      const bassNote = barPos < 0.5 ? 55 : 65.4;
      const bass = Math.sin(2 * Math.PI * bassNote * t) * 0.35 + Math.sin(2 * Math.PI * bassNote * 2 * t) * 0.15;
      sampleL += bass * 0.5;
      sampleR += bass * 0.5;

      const isHat = beatPos > 0.45 && beatPos < 0.65;
      if (isHat) {
        const hat = (Math.random() * 2 - 1) * Math.exp(-(beatPos - 0.45) * 35) * 0.25;
        sampleL += hat;
        sampleR += hat * 0.8;
      }
    } else if (style === 'vsl_cinematic') {
      const drone1 = Math.sin(2 * Math.PI * 43.65 * t);
      const drone2 = Math.sin(2 * Math.PI * 65.41 * t) * 0.4;
      const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * (bpm / 60) * t);
      const riser = (t / duration) ** 2 * 0.3;
      const noise = (Math.random() * 2 - 1) * 0.05 * (t / duration);

      const s = (drone1 * 0.4 + drone2 * 0.2) * pulse * 0.7 + riser + noise;
      sampleL = s;
      sampleR = s;
    } else if (style === 'lofi_chai') {
      const chordRoot = barPos < 0.5 ? 130.81 : 146.83;
      const vinyl = (Math.random() > 0.995 ? (Math.random() * 2 - 1) * 0.15 : 0) + (Math.random() * 2 - 1) * 0.015;
      const chord = (Math.sin(2 * Math.PI * chordRoot * t) + Math.sin(2 * Math.PI * (chordRoot * 1.25) * t) * 0.6) * 0.3;
      const beatEnv = Math.exp(-beatPos * 8);
      const softKick = Math.sin(2 * Math.PI * 80 * beatPos) * beatEnv * 0.4;

      sampleL = (chord + softKick + vinyl) * 0.7;
      sampleR = (chord * 0.9 + softKick + vinyl) * 0.7;
    } else if (style === 'luxury_ambient') {
      const bellFreq = [523.25, 659.25, 783.99, 1046.5][Math.floor((t * 2) % 4)];
      const bell = Math.sin(2 * Math.PI * bellFreq * t) * Math.exp(-((t * 2) % 1) * 4) * 0.3;
      const pad = Math.sin(2 * Math.PI * 130.81 * t) * (0.5 + 0.5 * Math.sin(t * 1.5)) * 0.35;
      sampleL = bell + pad;
      sampleR = bell * 0.8 + pad;
    } else if (style === 'countdown_tension') {
      const tick = beatPos < 0.08 ? (Math.random() * 2 - 1) * Math.exp(-beatPos * 40) * 0.6 : 0;
      const heart = (barPos < 0.15 || (barPos > 0.25 && barPos < 0.4)) ? Math.sin(2 * Math.PI * 55 * t) * 0.5 : 0;
      sampleL = tick + heart;
      sampleR = tick + heart;
    } else {
      const noteFreqs = [110, 130.8, 164.8, 196, 220, 261.6];
      const noteIdx = Math.floor((t * 8) % noteFreqs.length);
      const arpFreq = noteFreqs[noteIdx];
      const arpEnv = Math.exp(-((t * 8) % 1) * 6);
      const arp = Math.sin(2 * Math.PI * arpFreq * t) * arpEnv * 0.4;
      const kick = beatPos < 0.25 ? Math.sin(2 * Math.PI * 110 * beatPos) * Math.exp(-beatPos * 14) * 0.7 : 0;

      sampleL = arp + kick;
      sampleR = arp * 0.8 + kick;
    }

    left[i] = Math.max(-1, Math.min(1, sampleL));
    right[i] = Math.max(-1, Math.min(1, sampleR));
  }

  const blob = audioBufferToWav(buffer);
  return { buffer, blob };
}
