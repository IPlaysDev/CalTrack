import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppLogo, Field, PrimaryButton } from '@/components/CaltrackUI';
import { Gender, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const genders: Gender[] = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, isReady, completeSetup } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Prefer not to say');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('2000');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isReady && profile) router.replace('/(tabs)');
  }, [isReady, profile]);

  if (!isReady || profile) return <View style={[styles.loading, { backgroundColor: colors.background }]} />;

  const goNext = () => {
    if (!name.trim() || !age.trim()) {
      setError('Add your name and age to continue.');
      return;
    }
    setError('');
    setStep(2);
  };

  const finish = async () => {
    if (!weight.trim() || !goal.trim() || Number(goal) <= 0) {
      setError('Add your weight and a daily calorie goal.');
      return;
    }
    await completeSetup({ name: name.trim(), age: Number(age), gender, weight: Number(weight), calorieGoal: Number(goal) });
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.glow, { backgroundColor: colors.orangeGlow }]} />
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={{ paddingTop: insets.top + 34, paddingBottom: insets.bottom + 35 }}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={30}
      >
        <View style={styles.brandRow}><AppLogo size={45} /><Text style={[styles.brand, { color: colors.foreground }]}>caltrack</Text></View>
        <View style={styles.hero}>
          <Text style={[styles.kicker, { color: colors.primary }]}>YOUR DAILY RITUAL</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>{step === 1 ? 'Let’s make\nit personal.' : 'Set your\nrhythm.'}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{step === 1 ? 'A calmer, clearer way to understand what fuels you.' : 'A goal that fits your body and your everyday.'}</Text>
        </View>
        <View style={styles.stepRow}>
          <View style={[styles.stepLine, { backgroundColor: colors.primary }]} /><View style={[styles.stepLine, { backgroundColor: step === 2 ? colors.primary : colors.border }]} />
          <Text style={[styles.stepText, { color: colors.mutedForeground }]}>0{step} / 02</Text>
        </View>
        <View style={styles.form}>
          {step === 1 ? (
            <>
              <Field label="YOUR NAME" value={name} onChangeText={setName} placeholder="e.g. Alex" />
              <Field label="AGE" value={age} onChangeText={setAge} placeholder="e.g. 28" keyboardType="numeric" />
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>GENDER</Text>
              <View style={styles.genderGrid}>
                {genders.map((item) => (
                  <Pressable key={item} onPress={() => setGender(item)} style={[styles.genderChip, { backgroundColor: gender === item ? colors.softOrange : colors.input, borderColor: gender === item ? colors.primary : colors.border }]}>
                    <Text style={[styles.genderText, { color: gender === item ? colors.primary : colors.mutedForeground }]}>{item}</Text>
                    {gender === item ? <Ionicons name="checkmark-circle" size={16} color={colors.primary} /> : null}
                  </Pressable>
                ))}
              </View>
              {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
              <PrimaryButton label="Continue" onPress={goNext} icon="arrow-forward" />
            </>
          ) : (
            <>
              <Field label="WEIGHT · KG" value={weight} onChangeText={setWeight} placeholder="e.g. 68" keyboardType="decimal-pad" />
              <Field label="DAILY CALORIE GOAL · KCAL" value={goal} onChangeText={setGoal} placeholder="2000" keyboardType="numeric" />
              <View style={[styles.tip, { backgroundColor: colors.softOrange, borderColor: colors.orangeGlow }]}>
                <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
                <Text style={[styles.tipText, { color: colors.accent }]}>You can fine-tune this anytime in Settings.</Text>
              </View>
              {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
              <PrimaryButton label="Start tracking" onPress={finish} icon="checkmark" />
              <Pressable onPress={() => { setError(''); setStep(1); }} style={styles.backButton}><Text style={[styles.backText, { color: colors.mutedForeground }]}>Back</Text></Pressable>
            </>
          )}
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  loading: { flex: 1 },
  glow: { position: 'absolute', width: 290, height: 290, borderRadius: 150, top: -110, right: -110, opacity: 0.45 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 22 },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: -0.4 },
  hero: { paddingHorizontal: 22, marginTop: 55, marginBottom: 32 },
  kicker: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, marginBottom: 14 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 44, letterSpacing: -1.7, lineHeight: 46 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 16, maxWidth: 290 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 22, marginBottom: 31 },
  stepLine: { height: 3, borderRadius: 2, width: 44 },
  stepText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.2, marginLeft: 5 },
  form: { paddingHorizontal: 22 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.4, marginBottom: 9 },
  genderGrid: { gap: 9, marginBottom: 20 },
  genderChip: { minHeight: 48, borderWidth: 1, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  genderText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 13 },
  tip: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 20 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, flex: 1 },
  backButton: { alignItems: 'center', paddingVertical: 18 },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});
