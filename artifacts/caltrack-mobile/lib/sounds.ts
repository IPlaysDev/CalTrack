import { Audio } from 'expo-av';

let soundEffectsEnabled = true;

const tapSound = require('../assets/sounds/ui-tap.mp3');
const addedSound = require('../assets/sounds/calorie-added.mp3');

export function setSoundEffectsEnabled(enabled: boolean) {
  soundEffectsEnabled = enabled;
}

async function playAsset(asset: number, unloadAfterMs: number) {
  if (!soundEffectsEnabled) return;
  try {
    const { sound } = await Audio.Sound.createAsync(asset, { shouldPlay: true, volume: 0.28 });
    setTimeout(() => {
      sound.unloadAsync().catch(() => undefined);
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
