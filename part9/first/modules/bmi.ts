export default function calculateBmi(height: number, weight: number): string {
  const meters = height / 100;
  const bmi = weight / (meters * meters);
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal (healthy weight)';
  } else return 'Obese';
}
