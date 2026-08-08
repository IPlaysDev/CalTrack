import React, { useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppLogo, Screen } from '@/components/CaltrackUI';
import { useColors } from '@/hooks/useColors';

const links = [
  { label: 'GitHub', url: 'https://github.com/IPlaysDev', icon: 'github' as const },
  { label: 'YouTube', url: 'https://youtube.com/@iplaysdev', icon: 'youtube' as const },
  { label: 'Instagram', url: 'https://www.instagram.com/iplaysdev', icon: 'instagram' as const },
];

export default function CreditsScreen() {
  const colors = useColors();
  const taps = useRef(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  const tapLogo = () => {
    taps.current += 1;
    if (taps.current >= 7) {
      taps.current = 0;
      scale.value = withSequence(withTiming(1.14, { duration: 180 }), withTiming(0.98, { duration: 130 }), withTiming(1, { duration: 260 }));
      opacity.value = withSequence(withTiming(0.08, { duration: 400 }), withTiming(1, { duration: 650 }));
    } else {
      scale.value = withSequence(withTiming(1.07, { duration: 100 }), withTiming(1, { duration: 180 }));
    }
  };
  return (
    <Screen scroll={false} contentStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={21} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>Settings</Text></Pressable>
      <View style={styles.center}>
        <Pressable onPress={tapLogo}><Animated.View style={logoStyle}><AppLogo size={88} /></Animated.View></Pressable>
        <Text style={[styles.brand, { color: colors.foreground }]}>caltrack</Text>
        <Text style={[styles.developed, { color: colors.mutedForeground }]}>DEVELOPED BY</Text>
        <Text style={[styles.creator, { color: colors.primary }]}>IPlaysDev</Text>
        <View style={styles.links}>{links.map((link) => <Pressable key={link.label} onPress={() => Linking.openURL(link.url)} style={[styles.linkRow, { borderBottomColor: colors.border }]}><View style={styles.linkLeft}><Feather name={link.icon} size={18} color={colors.foreground} /><Text style={[styles.linkText, { color: colors.foreground }]}>{link.label}</Text></View><Feather name="arrow-up-right" size={17} color={colors.mutedForeground} /></Pressable>)}</View>
      </View>
      <Text style={[styles.version, { color: colors.mutedForeground }]}>CALTRACK · 1.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'stretch', justifyContent: 'space-between', minHeight: '100%' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 8 },
  backText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  center: { alignItems: 'center', marginTop: 45 },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.5, marginTop: 17 },
  developed: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 2, marginTop: 47 },
  creator: { fontFamily: 'Inter_600SemiBold', fontSize: 18, marginTop: 9 },
  links: { alignSelf: 'stretch', marginTop: 42 },
  linkRow: { minHeight: 58, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  linkText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  version: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 1.2, textAlign: 'center' },
});
