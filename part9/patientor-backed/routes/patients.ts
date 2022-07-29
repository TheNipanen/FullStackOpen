import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient } from '../utils';
import { HealthCheckEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json(patientService.getEntries());
});

router.get('/:id', (req, res) => {
  const found = patientService.getOne(req.params.id);
  if (found) {
    res.status(200).json(found);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const entry = req.body as HealthCheckEntry;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const found = patientService.addEntry(req.params.id, entry);
  if (found) {
    res.json(found);
  } else {
    res.sendStatus(404);
  }
});

export default router;
