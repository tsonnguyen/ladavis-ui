import { combineReducers } from 'redux';
import user from './userReducer';
import page from './pageReducer';
import storage from './storageReducer';
import ROOTSTATE from '../Interfaces';

export default combineReducers<ROOTSTATE>({
  user,
  page,
  storage
});