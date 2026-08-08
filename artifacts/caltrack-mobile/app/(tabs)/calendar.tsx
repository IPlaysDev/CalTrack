import React, { useMemo, useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp, getDayKey } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { EmptyState, EntryRow, GlassCard, MiniStat, PageHeader, Screen, SectionLabel } from '@/components/CaltrackUI';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarScreen() {
  const colors = useColors();
  const { profile, entries } = useApp();
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(getDayKey(today));
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : index - firstDay + 1);
  const selectedEntries = useMemo(() => entries.filter((entry) => entry.date === selected), [entries, selected]);
  const consumed = selectedEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const selectedDate = new Date(`${selected}T12:00:00`);
  const changeMonth = (delta: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  const selectDay = (day: number) => setSelected(getDayKey(new Date(month.getFullYear(), month.getMonth(), day)));
  return (
    <Screen>
      <PageHeader eyebrow="LOOKING BACK" title="Calendar" subtitle="A clear view of your rhythm over time." />
      <GlassCard style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => changeMonth(-1)} style={styles.arrow}><Feather name="chevron-left" size={19} color={colors.foreground} /></Pressable>
          <Text style={[styles.monthTitle, { color: colors.foreground }]}>{monthNames[month.getMonth()]} {month.getFullYear()}</Text>
          <Pressable onPress={() => changeMonth(1)} style={styles.arrow}><Feather name="chevron-right" size={19} color={colors.foreground} /></Pressable>
        </View>
        <View style={styles.weekRow}>{weekDays.map((day, index) => <Text key={`${day}-${index}`} style={[styles.weekDay, { color: colors.mutedForeground }]}>{day}</Text>)}</View>
        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => {
            if (!day) return <View key={`blank-${index}`} style={styles.dayCell} />;
            const dateKey = getDayKey(new Date(month.getFullYear(), month.getMonth(), day));
            const isSelected = dateKey === selected;
            const hasEntry = entries.some((entry) => entry.date === dateKey);
            const isToday = dateKey === getDayKey(today);
            return <Pressable key={dateKey} onPress={() => selectDay(day)} style={[styles.dayCell, isSelected && { backgroundColor: colors.primary, borderRadius: 15 }]}><Text style={[styles.dayNumber, { color: isSelected ? colors.primaryForeground : colors.foreground }, isToday && !isSelected && { color: colors.primary }]}>{day}</Text>{hasEntry ? <View style={[styles.dayDot, { backgroundColor: isSelected ? colors.primaryForeground : colors.primary }]} /> : null}</Pressable>;
          })}
        </View>
      </GlassCard>
      <View style={styles.selectedHeader}><View><Text style={[styles.selectedTitle, { color: colors.foreground }]}>{selectedDate.toLocaleDateString([], { month: 'long', day: 'numeric' })}</Text><Text style={[styles.selectedSubtitle, { color: colors.mutedForeground }]}>{selected === getDayKey(today) ? 'Today' : selectedDate.toLocaleDateString([], { weekday: 'long' })}</Text></View><Pressable onPress={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(getDayKey(today)); }}><Text style={[styles.todayLink, { color: colors.primary }]}>Today</Text></Pressable></View>
      <GlassCard style={styles.statsCard}><MiniStat label="EATEN" value={`${consumed.toLocaleString()} kcal`} accent /><MiniStat label="DAILY GOAL" value={`${profile?.calorieGoal.toLocaleString() ?? '—'} kcal`} /><MiniStat label="REMAINING" value={`${Math.max((profile?.calorieGoal ?? 0) - consumed, 0).toLocaleString()} kcal`} /></GlassCard>
      <View style={styles.sectionHeader}><SectionLabel>FOOD LOG</SectionLabel>{selectedEntries.length ? <Text style={[styles.count, { color: colors.mutedForeground }]}>{selectedEntries.length} items</Text> : null}</View>
      <GlassCard style={styles.entriesCard}>{selectedEntries.length ? selectedEntries.map((entry) => <EntryRow key={entry.id} entry={entry} />) : <EmptyState icon="calendar-outline" title="A quiet day" text="Nothing was logged on this date." />}</GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  calendarCard: { paddingHorizontal: 12, paddingTop: 14 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2, marginBottom: 21 },
  monthTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  arrow: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { width: `${100 / 7}%`, textAlign: 'center', fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, height: 43, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  dayNumber: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  dayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
  selectedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 27, marginBottom: 13 },
  selectedTitle: { fontFamily: 'Inter_700Bold', fontSize: 19 },
  selectedSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 3 },
  todayLink: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  statsCard: { flexDirection: 'row', paddingVertical: 16, marginBottom: 26 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontFamily: 'Inter_400Regular', fontSize: 11, marginBottom: 12 },
  entriesCard: { paddingVertical: 0, paddingHorizontal: 16 },
});
