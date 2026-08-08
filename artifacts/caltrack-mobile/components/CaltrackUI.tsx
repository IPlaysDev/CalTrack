import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import React, { ReactNode, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({
  children,
  scroll = true,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: object;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.screenContent, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 98 }, contentStyle]}>
      {children}
    </View>
  );
  return scroll ? (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ minHeight: '100%' }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>{content}</View>
  );
}

export function GlassCard({ children, style, strong = false }: { children: ReactNode; style?: object; strong?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.glassCard, { backgroundColor: strong ? colors.glassStrong : colors.glass, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function AppLogo({ size = 42 }: { size?: number }) {
  const colors = useColors();
  return (
    <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: colors.softOrange, borderColor: colors.orangeGlow }]}>
      <View style={[styles.logoRing, { width: size * 0.59, height: size * 0.59, borderRadius: size, borderColor: colors.primary }]}>
        <View style={[styles.logoDrop, { backgroundColor: colors.primary, width: size * 0.16, height: size * 0.29, borderRadius: size }]} />
      </View>
    </View>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  onPress,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.pageHeader}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
      </View>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={10} style={styles.iconButton}>
          <Feather name="settings" size={20} color={colors.foreground} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
        onPress();
      }}
      style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: disabled ? 0.4 : pressed ? 0.82 : 1 }]}
    >
      {icon ? <Ionicons name={icon} size={19} color={colors.primaryForeground} /> : null}
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{label}</Text>
    </Pressable>
  );
}

export function TextButton({ label, onPress, destructive = false }: { label: string; onPress: () => void; destructive?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Text style={[styles.textButton, { color: destructive ? colors.destructive : colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
      />
    </View>
  );
}

export function PhotoPicker({ uri, onChange }: { uri?: string; onChange: (uri?: string) => void }) {
  const colors = useColors();
  const pick = async (camera: boolean) => {
    if (Platform.OS === 'web' && camera) return;
    const result = camera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.75, allowsEditing: true, aspect: [1, 1] })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets[0]?.uri) onChange(result.assets[0].uri);
  };
  return (
    <View style={styles.photoArea}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>PHOTO <Text style={{ color: colors.mutedForeground }}>· OPTIONAL</Text></Text>
      {uri ? (
        <View style={styles.photoPreviewWrap}>
          <Image source={{ uri }} style={styles.photoPreview} />
          <Pressable onPress={() => onChange(undefined)} style={[styles.removePhoto, { backgroundColor: colors.glassStrong }]}>
            <Ionicons name="close" size={17} color={colors.foreground} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.photoButtons}>
          <Pressable onPress={() => pick(true)} style={[styles.photoButton, { borderColor: colors.border, backgroundColor: colors.input }]}>
            <Ionicons name="camera-outline" size={19} color={colors.primary} />
            <Text style={[styles.photoButtonText, { color: colors.foreground }]}>Camera</Text>
          </Pressable>
          <Pressable onPress={() => pick(false)} style={[styles.photoButton, { borderColor: colors.border, backgroundColor: colors.input }]}>
            <Ionicons name="images-outline" size={19} color={colors.primary} />
            <Text style={[styles.photoButtonText, { color: colors.foreground }]}>Gallery</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function CalorieRing({ consumed, goal, size = 270 }: { consumed: number; goal: number; size?: number }) {
  const colors = useColors();
  const progress = Math.min(consumed / Math.max(goal, 1), 1);
  const liquid = useSharedValue(0);
  useEffect(() => {
    liquid.value = withTiming(progress * 100, { duration: 850 });
  }, [progress, liquid]);
  const liquidStyle = useAnimatedStyle(() => ({ height: `${Math.max(liquid.value, 3)}%` }));
  return (
    <View style={[styles.ringOuter, { width: size, height: size, borderRadius: size / 2, borderColor: colors.border, shadowColor: colors.primary }]}>
      <View style={[styles.ringInner, { width: size - 22, height: size - 22, borderRadius: size, backgroundColor: colors.background }]}>
        <Animated.View style={[styles.liquid, { backgroundColor: colors.primary }, liquidStyle]}>
          <View style={[styles.wave, { backgroundColor: colors.primary }]} />
        </Animated.View>
        <View style={styles.ringText}>
          <Text style={[styles.ringAmount, { color: colors.foreground }]}>{consumed.toLocaleString()}</Text>
          <Text style={[styles.ringUnit, { color: colors.mutedForeground }]}>KCAL EATEN</Text>
        </View>
      </View>
    </View>
  );
}

export function EntryRow({ entry, onPress }: { entry: { name: string; calories: number; photoUri?: string; time?: string }; onPress?: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.entryRow, { borderBottomColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
      {entry.photoUri ? <Image source={{ uri: entry.photoUri }} style={styles.entryThumb} /> : <View style={[styles.entryThumb, { backgroundColor: colors.softOrange }]}><Ionicons name="restaurant-outline" size={20} color={colors.primary} /></View>}
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={[styles.entryName, { color: colors.foreground }]}>{entry.name}</Text>
        {entry.time ? <Text style={[styles.entryMeta, { color: colors.mutedForeground }]}>{entry.time}</Text> : null}
      </View>
      <Text style={[styles.entryCalories, { color: colors.primary }]}>{entry.calories} kcal</Text>
    </Pressable>
  );
}

export function Sheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const colors = useColors();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[styles.sheet, { backgroundColor: colors.glassStrong, borderColor: colors.border }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{title}</Text>
            <Pressable onPress={onClose} style={styles.iconButton} hitSlop={8}><Ionicons name="close" size={22} color={colors.foreground} /></Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function EmptyState({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  const colors = useColors();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.softOrange }]}><Ionicons name={icon} size={25} color={colors.primary} /></View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{text}</Text>
    </View>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  const colors = useColors();
  return <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{children}</Text>;
}

export function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniValue, { color: accent ? colors.primary : colors.foreground }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export function LoadingView() {
  const colors = useColors();
  return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenContent: { paddingHorizontal: 20 },
  glassCard: { borderWidth: 1, borderRadius: 24, padding: 18, overflow: 'hidden' },
  logo: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  logoRing: { alignItems: 'center', justifyContent: 'flex-end', borderWidth: 2, paddingBottom: 5 },
  logoDrop: { transform: [{ rotate: '10deg' }] },
  pageHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 25 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.7, marginBottom: 7 },
  pageTitle: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -0.7 },
  pageSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 7 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { minHeight: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, paddingHorizontal: 20 },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  textButton: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  fieldWrap: { marginBottom: 17 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.4, marginBottom: 9 },
  input: { height: 54, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontFamily: 'Inter_500Medium', fontSize: 16 },
  photoArea: { marginBottom: 17 },
  photoButtons: { flexDirection: 'row', gap: 10 },
  photoButton: { flex: 1, height: 54, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  photoButtonText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  photoPreviewWrap: { height: 160, borderRadius: 18, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  removePhoto: { width: 32, height: 32, borderRadius: 16, position: 'absolute', right: 10, top: 10, alignItems: 'center', justifyContent: 'center' },
  ringOuter: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowOpacity: 0.3, shadowRadius: 26, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  ringInner: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  liquid: { position: 'absolute', bottom: 0, width: '100%', opacity: 0.92 },
  wave: { position: 'absolute', top: -12, left: -20, width: '125%', height: 30, borderRadius: 50, opacity: 0.85 },
  ringText: { alignItems: 'center', zIndex: 2 },
  ringAmount: { fontFamily: 'Inter_700Bold', fontSize: 35, letterSpacing: -1.3 },
  ringUnit: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.6, marginTop: 4 },
  entryRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1 },
  entryThumb: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  entryName: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  entryMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 5 },
  entryCalories: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.58)' },
  sheet: { borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 34, maxHeight: '92%' },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'center', marginBottom: 17 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sheetTitle: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  emptyState: { alignItems: 'center', paddingVertical: 44, paddingHorizontal: 25 },
  emptyIcon: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, textAlign: 'center' },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 7 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.5, marginBottom: 12 },
  miniStat: { flex: 1 },
  miniValue: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  miniLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export const uiStyles = styles;
