import express from 'express';
const app = express();
import calculateBmi from './modules/bmi';
import calculateExercises from './modules/exercises';

app.use(express.json())

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const h = req.query.height;
  const w = req.query.weight;
  const height = Number(h);
  const weight = Number(w);
  if (h && !isNaN(height) && w && !isNaN(weight)) {
    res.status(200).json({ weight, height, bmi: calculateBmi(height, weight) });
  } else {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' });
  }
  // eslint-disable-next-line
  if (!daily_exercises.length || !daily_exercises.every((n: any) => !isNaN(Number(n))) || isNaN(Number(target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  // eslint-disable-next-line
  const result = calculateExercises(daily_exercises.map((n: any) => Number(n)), Number(target));
  return res.status(200).json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
