export function addPatient(patientId: number) {
  return {
    type: 'ADD_PATIENT',
    payload: patientId
  };
}

export function deletePatient(patientId: number) {
  return {
    type: 'DELETE_PATIENT',
    payload: patientId
  };
}