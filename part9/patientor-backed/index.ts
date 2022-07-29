import express from 'express';
const app = express();
app.use(express.json());
import cors from 'cors';
app.use(cors());
import diagnoseRouter from './routes/diagnoses';
app.use('/api/diagnoses', diagnoseRouter);
import patientRouter from './routes/patients';
app.use('/api/patients', patientRouter);

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});