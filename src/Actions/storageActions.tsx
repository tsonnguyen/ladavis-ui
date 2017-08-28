
import { getPatientInfoById } from '../API';

export function getPatientById(userId: number) {
  return {
    type: 'GET_PATIENT_BY_ID',
    payload: getPatientInfoById(userId)
  };
}