import { combineReducers } from 'redux';
import storage from './storageReducer';
import ROOTSTATE from '../Interfaces';

export default combineReducers<ROOTSTATE>({
  patient: storage
});