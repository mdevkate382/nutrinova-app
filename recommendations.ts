import type { User } from '@/types';

export interface RecommendationResult {
  food: string[];
  protein: string[];
  workout: string[];
  water: string[];
  lifestyle: string[];
}

export function generateRecommendations(user: User, bmi: number): RecommendationResult {
  const result: RecommendationResult = {
    food: [],
    protein: [],
    workout: [],
    water: [],
    lifestyle: [],
  };

  const bmiCategory = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';

  // Food recommendations based on preference
  if (user.foodPreference === 'vegetarian') {
    result.food.push(
      'Include a variety of colorful vegetables in every meal for essential vitamins and minerals.',
      'Add legumes like lentils, chickpeas, and beans for plant-based protein and fiber.',
      'Incorporate whole grains like quinoa, brown rice, and oats for sustained energy.',
      'Add nuts and seeds like almonds, chia seeds, and flaxseeds for healthy fats.'
    );
  } else if (user.foodPreference === 'non-vegetarian') {
    result.food.push(
      'Lean chicken breast is an excellent high-protein, low-fat option for muscle building.',
      'Include fatty fish like salmon twice a week for omega-3 fatty acids and heart health.',
      'Add lean red meat in moderation for iron and vitamin B12.',
      'Pair proteins with plenty of vegetables and whole grains for balanced nutrition.'
    );
  } else if (user.foodPreference === 'egg-focused') {
    result.food.push(
      'Start your day with protein-rich eggs — boiled, scrambled, or as an omelette with veggies.',
      'Add egg whites to smoothies for a protein boost without extra fat.',
      'Combine eggs with whole grain toast and avocado for a complete breakfast.',
      'Hard-boiled eggs make excellent post-workout snacks with ~6g protein each.'
    );
  } else {
    result.food.push(
      'Maintain a balanced diet with a mix of proteins, carbohydrates, and healthy fats.',
      'Fill half your plate with vegetables at every meal.',
      'Choose whole grains over refined grains whenever possible.',
      'Include a variety of protein sources throughout the week.'
    );
  }

  // Food recommendations based on BMI
  if (bmiCategory === 'underweight') {
    result.food.push(
      'Increase calorie intake with nutrient-dense foods like nuts, dried fruits, and healthy oils.',
      'Eat more frequently — aim for 5-6 smaller meals throughout the day.'
    );
  } else if (bmiCategory === 'overweight' || bmiCategory === 'obese') {
    result.food.push(
      'Focus on portion control and choose foods with high fiber to feel full longer.',
      'Limit processed foods, sugary drinks, and refined carbohydrates.'
    );
  }

  // Protein recommendations based on goal
  const targetWeight = user.targetWeight;
  if (user.fitnessGoal === 'gain-muscle') {
    result.protein.push(
      `Aim for 1.6-2.2g of protein per kg of body weight (${Math.round(user.weight * 1.8)}g daily).`,
      'Distribute protein evenly across 4-5 meals for optimal muscle protein synthesis.',
      'Consume protein within 30 minutes after workouts for recovery.'
    );
  } else if (user.fitnessGoal === 'lose-weight') {
    result.protein.push(
      `Aim for 1.2-1.6g of protein per kg of body weight (${Math.round(user.weight * 1.4)}g daily).`,
      'Higher protein intake helps preserve muscle mass during weight loss.',
      'Protein-rich meals keep you fuller longer, reducing overall calorie intake.'
    );
  } else {
    result.protein.push(
      `Aim for 0.8-1.2g of protein per kg of body weight (${Math.round(user.weight * 1.0)}g daily).`,
      'Include a protein source with each main meal for balanced nutrition.'
    );
  }

  // Workout recommendations based on goal and activity level
  if (user.fitnessGoal === 'lose-weight') {
    result.workout.push(
      'Combine cardio (30-45 min) with strength training 4-5 times per week.',
      'Try HIIT workouts 2-3 times per week for maximum calorie burn.',
      'Include full-body strength training to build metabolism-boosting muscle.',
      'Aim for 150+ minutes of moderate cardio weekly.'
    );
  } else if (user.fitnessGoal === 'gain-muscle') {
    result.workout.push(
      'Focus on progressive overload with 4-6 strength training sessions per week.',
      'Prioritize compound movements: squats, deadlifts, bench press, and rows.',
      'Keep rest periods between 60-90 seconds for hypertrophy.',
      'Allow 48 hours recovery between training the same muscle group.'
    );
  } else if (user.fitnessGoal === 'improve-endurance') {
    result.workout.push(
      'Build cardio gradually — increase weekly volume by no more than 10%.',
      'Mix steady-state cardio with interval training for best results.',
      'Include 2-3 strength sessions weekly to prevent injuries.',
      'Consider cross-training activities like swimming or cycling.'
    );
  } else {
    result.workout.push(
      'Aim for 150 minutes of moderate exercise or 75 minutes of vigorous exercise weekly.',
      'Include 2-3 strength training sessions to maintain muscle and bone health.',
      'Add flexibility and mobility work 2-3 times per week.',
      'Find activities you enjoy to make exercise sustainable long-term.'
    );
  }

  if (user.activityLevel === 'sedentary') {
    result.workout.push('Start slowly with 15-20 minute walks and gradually increase duration.');
  }

  // Water recommendations
  const baseWater = user.weight * 0.033;
  result.water.push(
    `Aim to drink approximately ${Math.round(baseWater)} liters of water daily based on your weight.`,
    'Drink a glass of water upon waking up to rehydrate after sleep.',
    'Carry a reusable water bottle to track intake throughout the day.',
    'Increase water intake on workout days and in hot weather.'
  );

  if (bmiCategory === 'overweight' || bmiCategory === 'obese') {
    result.water.push('Drinking water before meals can help with portion control and weight management.');
  }

  // Lifestyle tips based on BMI and age
  if (bmiCategory === 'underweight') {
    result.lifestyle.push(
      'Focus on nutrient-dense foods rather than empty calories.',
      'Consider strength training to build healthy muscle mass.',
      'Track your food intake to ensure you are eating enough.'
    );
  } else if (bmiCategory === 'overweight' || bmiCategory === 'obese') {
    result.lifestyle.push(
      'Aim for a gradual weight loss of 0.5-1 kg per week for sustainable results.',
      'Keep a food journal to identify patterns and areas for improvement.',
      'Prioritize sleep — poor sleep can increase hunger hormones.'
    );
  } else {
    result.lifestyle.push(
      'Maintain your healthy habits and focus on consistency.',
      'Challenge yourself with new fitness goals to stay motivated.',
      'Continue monitoring your nutrition to maintain your healthy weight.'
    );
  }

  result.lifestyle.push(
    'Aim for 7-9 hours of quality sleep each night for optimal recovery.',
    'Manage stress through meditation, deep breathing, or yoga.',
    'Limit screen time before bed to improve sleep quality.'
  );

  if (user.age > 40) {
    result.lifestyle.push(
      'Include calcium and vitamin D rich foods for bone health.',
      'Regular check-ups are important — monitor blood pressure and cholesterol.',
      'Consider lower-impact exercises to protect joints.'
    );
  }

  return result;
}
