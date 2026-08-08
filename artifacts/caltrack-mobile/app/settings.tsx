import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { Field, GlassCard, PageHeader, PrimaryButton, Screen, Sheet, TextButton } from '@/components/CaltrackUI';

export default function SettingsScreen() {
  const colors = useColors();
  const { profile, soundEffects, setSoundEffects, updateProfile, resetData } = useApp();
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(String(profile?.age ?? ''));
  const [weight, setWeight] = useState(String(profile?.weight ?? ''));
  const [goal, setGoal] = useState(String(profile?.calorieGoal ?? ''));
  const save = async () => { if (!profile || Number(goal) <= 0) return; await updateProfile({ ...profile, name: name.trim() || profile.name, age: Number(age) || profile.age, weight: Number(weight) || profile.weight, calorieGoal: Number(goal) }); setShowEdit(false); };
  const reset = () => Alert.alert('Reset Caltrack?', 'This removes your profile, saved foods, and calorie history from this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset data', style: 'destructive', onPress: async () => { await resetData(); router.replace('/'); } }]);
  return (
    <Screen>
      <PageHeader eyebrow="PERSONALIZE" title="Settings" subtitle="Make Caltrack fit your life." />
      <GlassCard style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.softOrange }]}><Text style={[styles.avatarText, { color: colors.primary }]}>{profile?.name?.slice(0, 1).toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}><Text style={[styles.profileName, { color: colors.foreground }]}>{profile?.name}</Text><Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>{profile?.age} years · {profile?.gender}</Text></View>
        <Pressable onPress={() => setShowEdit(true)} style={[styles.editPill, { backgroundColor: colors.softOrange }]}><Feather name="edit-2" size={14} color={colors.primary} /></Pressable>
      </GlassCard>
      <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>YOUR DETAILS</Text>
      <GlassCard style={styles.settingsCard}>
        <SettingRow icon="activity" label="Weight" value={`${profile?.weight ?? '—'} kg`} onPress={() => setShowEdit(true)} />
        <SettingRow icon="target" label="Daily calorie goal" value={`${profile?.calorieGoal?.toLocaleString() ?? '—'} kcal`} onPress={() => setShowEdit(true)} />
      </GlassCard>
      <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>ABOUT CALTRACK</Text>
      <GlassCard style={styles.settingsCard}>
        <SettingRow icon="heart" label="Credits" value="IPlaysDev" onPress={() => router.push('/credits')} />
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.softOrange }]}><Feather name="volume-2" size={17} color={colors.primary} /></View>
          <View style={{ flex: 1 }}><Text style={[styles.settingLabel, { color: colors.foreground }]}>Sound Effects</Text><Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{soundEffects ? 'ON' : 'OFF'}</Text></View>
          <Switch value={soundEffects} onValueChange={setSoundEffects} trackColor={{ false: colors.border, true: colors.orangeGlow }} thumbColor={soundEffects ? colors.primary : colors.mutedForeground} />
        </View>
      </GlassCard>
      <Pressable onPress={reset} style={({ pressed }) => [styles.resetButton, { opacity: pressed ? 0.55 : 1 }]}><Ionicons name="trash-outline" size={17} color={colors.destructive} /><Text style={[styles.resetText, { color: colors.destructive }]}>Reset all data</Text></Pressable>
      <Sheet visible={showEdit} title="Edit profile" onClose={() => setShowEdit(false)}>
        <Field label="YOUR NAME" value={name} onChangeText={setName} placeholder="Your name" />
        <Field label="AGE" value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" />
        <Field label="WEIGHT · KG" value={weight} onChangeText={setWeight} placeholder="Weight" keyboardType="decimal-pad" />
        <Field label="DAILY CALORIE GOAL · KCAL" value={goal} onChangeText={setGoal} placeholder="2000" keyboardType="numeric" />
        <PrimaryButton label="Save changes" onPress={save} icon="checkmark" />
      </Sheet>
    </Screen>
  );
}

function SettingRow({ icon, label, value, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={[styles.settingRow, { borderBottomColor: colors.border }]}><View style={[styles.settingIcon, { backgroundColor: colors.softOrange }]}><Feather name={icon} size={17} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text><Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{value}</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>;
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 29 },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  profileName: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  profileMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  editPill: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  groupLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.5, marginBottom: 11 },
  settingsCard: { paddingVertical: 0, paddingHorizontal: 16, marginBottom: 27 },
  settingRow: { minHeight: 72, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  settingValue: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  resetButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 4 },
  resetText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
