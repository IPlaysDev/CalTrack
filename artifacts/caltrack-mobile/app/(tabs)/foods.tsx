import React, { useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp, Food } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { EmptyState, Field, GlassCard, PageHeader, PhotoPicker, PrimaryButton, Screen, SectionLabel, Sheet } from '@/components/CaltrackUI';

export default function FoodsScreen() {
  const colors = useColors();
  const { foods, addFood, addEntry } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const close = () => { setShowAdd(false); setName(''); setCalories(''); setPhotoUri(undefined); };
  const save = async () => { if (!name.trim() || Number(calories) <= 0) return; await addFood({ name: name.trim(), calories: Number(calories), photoUri }); close(); };
  const quickAdd = async (food: Food) => addEntry(food);
  return (
    <Screen>
      <PageHeader eyebrow="YOUR LIBRARY" title="Foods" subtitle="Your go-to fuel, ready in one tap." />
      <GlassCard style={styles.heroCard}>
        <View style={[styles.heroIcon, { backgroundColor: colors.softOrange }]}><Ionicons name="bookmark" size={21} color={colors.primary} /></View>
        <View style={{ flex: 1 }}><Text style={[styles.heroTitle, { color: colors.foreground }]}>Build your shortcuts</Text><Text style={[styles.heroText, { color: colors.mutedForeground }]}>Save foods you reach for often and log them without the math.</Text></View>
      </GlassCard>
      <PrimaryButton label="Add Food" icon="add" onPress={() => setShowAdd(true)} />
      <View style={styles.section}><SectionLabel>SAVED FOODS · {foods.length}</SectionLabel></View>
      {foods.length ? <GlassCard style={styles.foodCard}>{foods.map((food) => <FoodRow key={food.id} food={food} onQuickAdd={() => quickAdd(food)} />)}</GlassCard> : <GlassCard style={styles.emptyCard}><EmptyState icon="nutrition-outline" title="No saved foods yet" text="Add your first food to quickly track it later." /></GlassCard>}
      <Sheet visible={showAdd} title="Save a food" onClose={close}>
        <Field label="FOOD OR BEVERAGE" value={name} onChangeText={setName} placeholder="e.g. Chicken Biryani" />
        <Field label="CALORIES · KCAL" value={calories} onChangeText={setCalories} placeholder="e.g. 650" keyboardType="numeric" />
        <PhotoPicker uri={photoUri} onChange={setPhotoUri} />
        <PrimaryButton label="Save food" onPress={save} icon="bookmark" disabled={!name.trim() || Number(calories) <= 0} />
      </Sheet>
    </Screen>
  );
}

function FoodRow({ food, onQuickAdd }: { food: Food; onQuickAdd: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.foodRow, { borderBottomColor: colors.border }]}>
      {food.photoUri ? <Image source={{ uri: food.photoUri }} style={styles.foodPhoto} /> : <View style={[styles.foodPhoto, { backgroundColor: colors.softOrange }]}><Ionicons name="restaurant-outline" size={21} color={colors.primary} /></View>}
      <View style={{ flex: 1 }}><Text style={[styles.foodName, { color: colors.foreground }]}>{food.name}</Text><Text style={[styles.foodHint, { color: colors.mutedForeground }]}>Saved shortcut</Text></View>
      <Text style={[styles.foodCalories, { color: colors.primary }]}>{food.calories} kcal</Text>
      <Pressable accessibilityLabel={`Add ${food.name}`} onPress={onQuickAdd} hitSlop={8} style={({ pressed }) => [styles.quickAdd, { backgroundColor: colors.softOrange, opacity: pressed ? 0.55 : 1 }]}>
        <Feather name="plus" size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 15 },
  heroIcon: { width: 47, height: 47, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  heroText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 5 },
  section: { marginTop: 29 },
  foodCard: { paddingHorizontal: 16, paddingVertical: 0 },
  emptyCard: { paddingVertical: 0 },
  foodRow: { minHeight: 78, flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1 },
  foodPhoto: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  foodName: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  foodHint: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  foodCalories: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  quickAdd: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
