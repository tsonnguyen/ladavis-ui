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

export function addPatientCompare(patientId1: number, patientId2: number) {
  return {
    type: 'ADD_PATIENT_COMAPRE',
    payload: {
      patientId1: patientId1, 
      patientId2: patientId2
    }
  };
}
