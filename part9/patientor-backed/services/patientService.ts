import { v1 as uuid } from 'uuid';
//import patientData from '../data/patients.json';
import { Patient, NewPatient, PublicPatient, HealthCheckEntry, Entry } from '../types';

// const patients: Array<Patient> = patientData as Array<Patient>;
import patients from '../data/patients';

const getEntries = (): Array<PublicPatient> => {
  return patients.map((p: Patient) => {
    return { id: p.id, name: p.name, gender: p.gender, dateOfBirth: p.dateOfBirth, occupation: p.occupation, entries: p.entries };
  });
};

const getOne = (id: string) => {
  return patients.find(p => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: HealthCheckEntry): Patient | undefined => {
  const patientIdx = patients.findIndex(p => p.id === id);
  if (patientIdx === -1) {
    return undefined;
  }
  const patient = patients[patientIdx];
  const newEntry: HealthCheckEntry = {
    ...entry,
    id: uuid()
  };
  patient.entries.push(newEntry as Entry);
  patients[patientIdx] = patient;
  return patient;
};

export default {
  getEntries,
  addPatient,
  getOne,
  addEntry
};