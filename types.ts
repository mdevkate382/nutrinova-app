export type Gender = 'male' | 'female' | 'other';
export type FoodPreference = 'vegetarian' | 'non-vegetarian' | 'egg-focused' | 'custom';
export type FitnessGoal = 'lose-weight' | 'maintain' | 'gain-muscle' | 'improve-endurance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ThemeMode = 'light' | 'dark';
export type UnitSystem = 'metric' | 'imperial';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  targetWeight: number;
  foodPreference: FoodPreference;
  customFoodPreference?: string;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  avatar?: string;
}

export interface MealEntry {
  id: string;
  type: MealType;
  name: string;
  image: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  date: string;
}

export interface WorkoutEntry {
  id: string;
  workoutId: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  date: string;
  time: string;
}

export interface WaterEntry {
  id: string;
  glasses: number;
  date: string;
  time: string;
}

export interface SleepEntry {
  id: string;
  hours: number;
  quality: number;
  date: string;
  bedTime: string;
  wakeTime: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'water' | 'meal' | 'workout' | 'goal' | 'progress';
  read: boolean;
  time: string;
  date: string;
}

export interface ChallengeProgress {
  challengeId: string;
  started: boolean;
  completedDays: number[];
  streak: number;
  lastCompletedDate: string | null;
}

export interface DailyLog {
  date: string;
  weight: number;
  calories: number;
  protein: number;
  water: number;
  sleepHours: number;
  workoutDuration: number;
  bmi: number;
}

export interface AppSettings {
  theme: ThemeMode;
  units: UnitSystem;
  notifications: {
    waterReminders: boolean;
    mealReminders: boolean;
    workoutReminders: boolean;
    goalReminders: boolean;
    progressUpdates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    shareProgress: boolean;
  };
}

export interface Exercise {
  id: string;
  name: string;
  image: string;
  instructions: string;
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
}

export interface Workout {
  id: string;
  name: string;
  category: string;
  image: string;
  difficulty: DifficultyLevel;
  duration: number;
  exerciseCount: number;
  description: string;
  caloriesBurn: number;
  exercises: Exercise[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  difficulty: DifficultyLevel;
  dailyTasks: string[];
  badgeId: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface MealSuggestion {
  id: string;
  name: string;
  image: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: string;
  preference: FoodPreference[];
  description: string;
}
