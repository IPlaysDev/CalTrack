import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { playCalorieAddedSound, playTapSound, setSoundEffectsEnabled } from '@/lib/sounds';

export type Gender = 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';

export type Profile = {
  name: string;
  age: number;
  gender: Gender;
  weight: number;
  calorieGoal: number;
};

export type Food = {
  id: string;
  name: string;
  calories: number;
  photoUri?: string;
};

export type CalorieEntry = Food & {
  date: string;
  time: string;
};

type StoredState = {
  profile: Profile | null;
  foods: Food[];
  entries: CalorieEntry[];
  soundEffects: boolean;
};

type AppContextValue = StoredState & {
  isReady: boolean;
  completeSetup: (profile: Profile) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  addFood: (food: Omit<Food, 'id'>) => Promise<void>;
  addEntry: (food: Omit<Food, 'id'>, date?: Date) => Promise<void>;
  setSoundEffects: (enabled: boolean) => Promise<void>;
  resetData: () => Promise<void>;
};

const STORAGE_KEY = '@caltrack/state';
const AppContext = createContext<AppContextValue | null>(null);
const emptyState: StoredState = { profile: null, foods: [], entries: [], soundEffects: true };

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used within AppProvider');
  return value;
}

export function getDayKey(date: Date) {
  return dayKey(date);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(emptyState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          const stored = JSON.parse(saved) as Partial<StoredState>;
          const next = { ...emptyState, ...stored };
          setState(next);
          setSoundEffectsEnabled(next.soundEffects);
        } else {
          setSoundEffectsEnabled(true);
        }
      })
      .catch(() => undefined)
      .finally(() => setIsReady(true));
  }, []);

  const persist = async (next: StoredState) => {
    setState(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const completeSetup = async (profile: Profile) => persist({ ...state, profile });
  const updateProfile = async (profile: Profile) => persist({ ...state, profile });
  const addFood = async (food: Omit<Food, 'id'>) => {
    playTapSound();
    await persist({ ...state, foods: [{ ...food, id: makeId() }, ...state.foods] });
  };
  const addEntry = async (food: Omit<Food, 'id'>, date = new Date()) => {
    const entry: CalorieEntry = {
      ...food,
      id: makeId(),
      date: dayKey(date),
      time: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    playCalorieAddedSound();
    await persist({ ...state, entries: [entry, ...state.entries] });
  };
  const setSoundEffects = async (enabled: boolean) => {
    setSoundEffectsEnabled(enabled);
    await persist({ ...state, soundEffects: enabled });
  };
  const resetData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSoundEffectsEnabled(true);
    setState(emptyState);
  };

  const value = useMemo(
    () => ({ ...state, isReady, completeSetup, updateProfile, addFood, addEntry, setSoundEffects, resetData }),
    [state, isReady],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
