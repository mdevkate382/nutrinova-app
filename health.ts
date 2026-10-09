import type { Gender } from '@/types';

export function formatTime(time: string): string {
  if (!time) return '';
  const match = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[4]?.toUpperCase();
    if (ampm) {
      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
  }

  const match24 = time.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let h = parseInt(match24[1], 10);
    const m = match24[2];
    const ampm = h >= 12 ? 'PM' : 'AM';
    let displayH = h % 12;
    if (displayH === 0) displayH = 12;
    return `${displayH.toString().padStart(2, '0')}:${m} ${ampm}`;
  }
  return time;
}

export function getCurrentTime12h(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { label: 'Normal Weight', color: '#22c55e' };
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
  return { label: 'Obese', color: '#ef4444' };
}

export function getHealthyWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

export function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: string
): number {
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  const tdee = bmr * (multipliers[activityLevel] || 1.2);
  return Math.round(tdee);
}

export function calculateHealthScore(
  bmi: number,
  waterIntake: number,
  sleepHours: number,
  workoutMinutes: number,
  proteinIntake: number,
  proteinTarget: number,
  caloriesConsumed: number,
  calorieTarget: number
): number {
  let score = 0;

  const bmiCategory = getBMICategory(bmi);
  if (bmiCategory.label === 'Normal Weight') score += 25;
  else if (bmiCategory.label === 'Overweight') score += 15;
  else score += 10;

  const waterScore = Math.min(waterIntake / 8, 1) * 20;
  score += waterScore;

  const sleepScore = Math.min(sleepHours / 8, 1) * 20;
  score += sleepScore;

  const workoutScore = Math.min(workoutMinutes / 30, 1) * 20;
  score += workoutScore;

  const proteinScore = proteinTarget > 0 ? Math.min(proteinIntake / proteinTarget, 1) * 15 : 0;
  score += proteinScore;

  return Math.round(Math.min(score, 100));
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayKey(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function getDayLabel(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => getDayKey(-6 + i));
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => getDayKey(-29 + i));
}

export function getLast3Months(): string[] {
  return Array.from({ length: 90 }, (_, i) => getDayKey(-89 + i));
}
