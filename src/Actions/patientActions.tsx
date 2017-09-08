
import { getPatientInfoById } from '../api';

export function getPatientById(userId: number) {
  return {
    type: 'GET_PATIENT_BY_ID',
    payload: getPatientInfoById(userId)
  };
}