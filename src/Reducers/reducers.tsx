import { combineReducers } from 'redux';
import patient from './patientReducer';
import zoom from './zoomReducer';
import ROOTSTATE from '../Interfaces';

export default combineReducers<ROOTSTATE>({
  patient: patient,
  zoom: zoom
});