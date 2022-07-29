import { NewPatient, Gender } from '../types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseField = (field: unknown): string => {
  if (!field || !isString(field)) {
    throw new Error('Incorrect or missing field');
  }
  return field;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !(gender === 'female' || gender === 'male' || gender === 'other')) {
    throw new Error('Incorrect or missing field');
  }
  switch (gender) {
    case 'female':
      return Gender.FEMALE;
    case 'male':
      return Gender.MALE;
    case 'other':
      return Gender.OTHER;
  }
};

type Fields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: Fields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseField(name),
    dateOfBirth: parseField(dateOfBirth),
    ssn: parseField(ssn),
    gender: parseGender(gender),
    occupation: parseField(occupation),
    entries: []
  };
  return newPatient;
};
