import React from 'react';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"><Icon sf={{ default: 'house', selected: 'house.fill' }} /><Label>Home</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="foods"><Icon sf={{ default: 'fork.knife', selected: 'fork.knife' }} /><Label>Foods</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar"><Icon sf={{ default: 'calendar', selected: 'calendar' }} /><Label>Calendar</Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10, marginBottom: isWeb ? 4 : 0 },
        tabBarStyle: { position: 'absolute', backgroundColor: isIOS ? 'transparent' : colors.background, borderTopWidth: isWeb ? 1 : 0, borderTopColor: colors.border, elevation: 0, height: isWeb ? 84 : 70 },
        tabBarBackground: () => isIOS ? <BlurView intensity={85} tint="dark" style={StyleSheet.absoluteFill} /> : isWeb ? <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} /> : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Feather name="home" size={21} color={color} /> }} />
      <Tabs.Screen name="foods" options={{ title: 'Foods', tabBarIcon: ({ color }) => <Feather name="grid" size={21} color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ({ color }) => <Feather name="calendar" size={21} color={color} /> }} />
      <Tabs.Screen name="home-content" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
