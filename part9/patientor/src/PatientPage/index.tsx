import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Diagnosis, Entry, HealthCheckEntry, Patient } from "../types";
import { updatePatient } from "../state";
import { Formik, Form, Field } from 'formik';
import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';

type EntryProps = {
  entry: Entry,
  diagnoses: { [code: string]: Diagnosis }
};

const computeBonus = (e: Entry) => {
  switch (e.type) {
    case "HealthCheck":
      return <div>health check rating: {e.healthCheckRating}</div>;
    case "OccupationalHealthcare":
      return <div>employer: {e.employerName}{e.sickLeave ? `sick ${e.sickLeave.startDate} - ${e.sickLeave.endDate}` : ''}</div>;
    case "Hospital":
      return <div>{e.discharge.date}: {e.discharge.criteria}</div>;
    default:
      break;
  }
};

const EntryDetails = (props: EntryProps) => {
  const e = props.entry;
  const diagnoses = props.diagnoses;

  const bonus = computeBonus(e);

  return (
  <>
    <div>{e.date}: {e.description}</div>
    <ul>
      {e.diagnosisCodes?.map((c,ii) => (
        <li key={`${c}${ii}`}>{c} {diagnoses[c].name}</li>
      ))}
    </ul>
    {bonus}
    <div>diagnosed by {e.specialist}</div>
  </>
  );
};

type FormValues = Omit<HealthCheckEntry, "id" | "type" | "healthCheckRating"> & {healthCheckRating: string};
type Props ={
  onSubmit: (values: FormValues) => void;
};
const AddEntryForm = ({ onSubmit }: Props) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
    initialValues={{
      description: '',
      date: '',
      specialist: '',
      diagnosisCodes: undefined,
      healthCheckRating: 'Healthy'
    }}
    onSubmit={onSubmit}
  >
    {({ setFieldValue, setFieldTouched }) => {
      return (
        <Form className="form ui">
          <Field name='description' component={TextField} />
          <Field name='date' component={TextField} />
          <Field name='specialist' component={TextField} />
          <DiagnosisSelection setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnoses)} />
          <Field name='healthCheckRating' component={TextField} />
          <button type='submit'>submit</button>
        </Form>
      );
    }}
  </Formik>
  );
};

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  React.useEffect(() => {
    if (id && !patients[id].ssn) {
      const fetchPatient = async () => {
        try {
          const { data: patientFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(updatePatient(patientFromApi));
        } catch (e) {
          console.error(e);
        }
      };
      void fetchPatient();
    }
  }, [id]);

  if (!id) {
    return null;
  }
  const submit = async (values: FormValues) => {
    const { data: patientFromApi } = await axios.post<Patient>(
      `${apiBaseUrl}/patients/${id}/entries`,
      {
        ...values,
        type: "HealthCheck"
      }
    );
    dispatch(updatePatient(patientFromApi));
  };
  const patient = patients[id];
  return (
    <>
      <h2>{patient.name}</h2>
      <div>gender: {patient.gender}</div>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      {patient.entries.map((e,i) => (
        <div key={i}>
          <EntryDetails entry={e} diagnoses={diagnoses} />
        </div>
      ))}
      <AddEntryForm onSubmit={submit} />
    </>
  );
};

export default PatientPage;
