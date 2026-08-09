import { createAudioPlayer } from 'expo-audio';

let soundEffectsEnabled = true;

const tapSound = require('../assets/sounds/ui-tap.mp3');
const addedSound = require('../assets/sounds/calorie-added.mp3');

export function setSoundEffectsEnabled(enabled: boolean) {
  soundEffectsEnabled = enabled;
}

async function playAsset(asset: number, unloadAfterMs: number) {
  if (!soundEffectsEnabled) return;
  try {
    const player = createAudioPlayer(asset, { downloadFirst: true });
    player.volume = 0.28;
    player.play();
    setTimeout(() => {
      player.remove();
    }, unloadAfterMs);
  } catch {
    // Audio is enhancement-only; logging and tracking remain fully offline.
  }
}

export function playTapSound() {
  return playAsset(tapSound, 900);
}

export function playCalorieAddedSound() {
  return playAsset(addedSound, 1400);
}
