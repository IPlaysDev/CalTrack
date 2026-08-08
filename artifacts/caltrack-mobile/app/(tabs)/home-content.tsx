import React, { useEffect, useMemo, useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { CalorieEntry, getDayKey, useApp } from '@/context/AppContext';
import { CalorieRing, EmptyState, EntryRow, GlassCard, PageHeader, PrimaryButton, Screen, SectionLabel, Sheet, Field, PhotoPicker } from '@/components/CaltrackUI';

export default function HomeScreen() {
  const colors = useColors();
  const { profile, entries, foods, addEntry } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [manual, setManual] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const today = getDayKey(now);
  const dateLabel = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const todayEntries = useMemo(() => entries.filter((entry) => entry.date === today), [entries, today]);
  const consumed = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const remaining = Math.max((profile?.calorieGoal ?? 0) - consumed, 0);

  const closeSheet = () => {
    setShowAdd(false);
    setManual(false);
    setName('');
    setCalories('');
    setPhotoUri(undefined);
  };
  const saveManual = async () => {
    if (!name.trim() || Number(calories) <= 0) return;
    await addEntry({ name: name.trim(), calories: Number(calories), photoUri });
    closeSheet();
  };
  const addSaved = async (food: { name: string; calories: number; photoUri?: string }) => {
    await addEntry(food);
    closeSheet();
  };

  return (
    <Screen>
      <PageHeader eyebrow={dateLabel} title={`Hello, ${profile?.name ?? 'there'}.`} subtitle="Stay curious about what fuels you." onPress={() => router.push('/settings')} />
      <View style={styles.ringWrap}>
        <CalorieRing consumed={consumed} goal={profile?.calorieGoal ?? 2000} />
        <View style={[styles.remainingPill, { backgroundColor: colors.softOrange, borderColor: colors.orangeGlow }]}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.remainingText, { color: colors.accent }]}>{remaining.toLocaleString()} kcal remaining</Text>
        </View>
      </View>
      <GlassCard style={styles.summaryCard}>
        <View style={styles.summaryTop}><Text style={[styles.summaryTitle, { color: colors.foreground }]}>Your daily balance</Text><Ionicons name="pulse-outline" size={20} color={colors.primary} /></View>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={[styles.statValue, { color: colors.foreground }]}>{consumed.toLocaleString()}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>EATEN</Text></View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}><Text style={[styles.statValue, { color: colors.foreground }]}>{(profile?.calorieGoal ?? 0).toLocaleString()}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>GOAL</Text></View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}><Text style={[styles.statValue, { color: colors.primary }]}>{todayEntries.length}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>ITEMS</Text></View>
        </View>
      </GlassCard>
      {consumed > (profile?.calorieGoal ?? 0) ? (
        <GlassCard style={[styles.warningCard, { backgroundColor: colors.softOrange, borderColor: colors.orangeGlow }]}>
          <View style={[styles.warningIcon, { backgroundColor: colors.primary }]}><Ionicons name="warning-outline" size={18} color={colors.primaryForeground} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.warningTitle, { color: colors.accent }]}>Calorie limit exceeded</Text>
            <Text style={[styles.warningMeta, { color: colors.mutedForeground }]}>{consumed.toLocaleString()} / {profile?.calorieGoal.toLocaleString()} kcal</Text>
            <Text style={[styles.warningOver, { color: colors.primary }]}>{(consumed - (profile?.calorieGoal ?? 0)).toLocaleString()} kcal over your daily goal</Text>
          </View>
        </GlassCard>
      ) : null}
      <PrimaryButton label="Calorie Intake" icon="add" onPress={() => setShowAdd(true)} />
      <View style={styles.sectionHeader}><SectionLabel>TODAY’S INTAKE</SectionLabel>{todayEntries.length > 0 ? <Text style={[styles.itemCount, { color: colors.mutedForeground }]}>{todayEntries.length} items</Text> : null}</View>
      <GlassCard style={styles.listCard}>
        {todayEntries.length ? todayEntries.slice(0, 4).map((entry: CalorieEntry) => <EntryRow key={entry.id} entry={entry} />) : <EmptyState icon="restaurant-outline" title="Nothing logged yet" text="Your first bite of the day belongs here." />}
      </GlassCard>
      <Sheet visible={showAdd} title={manual ? 'Log something new' : 'Add calories'} onClose={closeSheet}>
        {manual ? (
          <View>
            <Field label="FOOD OR BEVERAGE" value={name} onChangeText={setName} placeholder="e.g. Avocado toast" />
            <Field label="CALORIES · KCAL" value={calories} onChangeText={setCalories} placeholder="e.g. 340" keyboardType="numeric" />
            <PhotoPicker uri={photoUri} onChange={setPhotoUri} />
            <PrimaryButton label="Add to today" onPress={saveManual} icon="checkmark" disabled={!name.trim() || Number(calories) <= 0} />
          </View>
        ) : (
          <View>
            <PrimaryButton label="Enter manually" onPress={() => setManual(true)} icon="create-outline" />
            <View style={styles.sheetSection}><SectionLabel>MY FOODS</SectionLabel></View>
            {foods.length ? foods.map((food) => <Pressable key={food.id} onPress={() => addSaved(food)} style={[styles.quickFood, { borderBottomColor: colors.border }]}><View style={{ flex: 1 }}><Text style={[styles.quickName, { color: colors.foreground }]}>{food.name}</Text><Text style={[styles.quickMeta, { color: colors.mutedForeground }]}>Tap to add quickly</Text></View><Text style={[styles.quickCalories, { color: colors.primary }]}>{food.calories} kcal</Text><Feather name="plus-circle" size={19} color={colors.primary} /></Pressable>) : <EmptyState icon="bookmark-outline" title="Your library is empty" text="Save favorite foods in the Foods tab for one-tap logging." />}
          </View>
        )}
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ringWrap: { alignItems: 'center', marginTop: 2, marginBottom: 22 },
  remainingPill: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  remainingText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  summaryCard: { paddingVertical: 16, marginBottom: 14 },
  warningCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, padding: 15 },
  warningIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  warningTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  warningMeta: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
  warningOver: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 4 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summaryTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.1, marginTop: 5 },
  statDivider: { height: 25, width: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 27 },
  itemCount: { fontFamily: 'Inter_400Regular', fontSize: 11, marginBottom: 12 },
  listCard: { paddingVertical: 0, paddingHorizontal: 16, marginBottom: 10 },
  sheetSection: { marginTop: 26 },
  quickFood: { minHeight: 66, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 11 },
  quickName: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  quickMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  quickCalories: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginRight: 3 },
});