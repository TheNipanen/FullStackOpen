interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export default function calculateExercises(hours: number[], target: number): Result {
  const periodLength = hours.length;
  const trainingDays = hours.filter((n) => n !== 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const rating = average === 0 ? 1 : average < target ? 2 : 3;
  const ratingDescription =
    rating === 1
      ? 'Terrible'
      : rating === 2
      ? 'Not bad but could be better'
      : 'Great!';
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}