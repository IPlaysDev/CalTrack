---
name: Expo audio compatibility
description: The current Expo SDK audio package and the lightweight playback pattern used for short local UI sounds.
---

Use `expo-audio` for short local sound effects in this project. The older `expo-av` package emits a deprecation warning under Expo SDK 54 even though it can still play audio.

**Why:** Expo SDK 54 reports `expo-av` as deprecated and directs apps to `expo-audio`/`expo-video`; keeping the current package avoids warning noise and is the safer path toward native builds.

**How to apply:** Keep generated local MP3s as static assets, create a short-lived player with `createAudioPlayer(require(...))`, set a low volume, call `play()`, and remove the player after playback. Keep sound enablement in the existing AsyncStorage-backed app state.