import calculateExercises from './modules/exercises';

interface ExerciseValues {
  hours: number[]
  target: number
}

const parseArgumentsExe = (args: Array<string>): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (args.slice(2).every((n) => !isNaN(Number(n)))) {
    return {
      hours: args.slice(2, -1).map((n) => Number(n)),
      target: Number(args[args.length - 1]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { hours, target } = parseArgumentsExe(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
