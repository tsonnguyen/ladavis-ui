import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './Components/App/App';
import './index.css';
import { compose, applyMiddleware, createStore, Store, StoreEnhancer } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import logger from 'redux-logger';
import reducer from './Reducers/reducers';
import { persistStore, autoRehydrate } from 'redux-persist';
import ROOTSTATE from './Interfaces';

// tslint:disable:no-console
const initialState: ROOTSTATE = {
  patient : {
    info: {
      id: '',
      dob: 0,
      gender: '',
      admittime: '',
      dischtime: '',
      deathtime: '',
      diagnosis: '',
      religion: '',
    },
    systolic: [],
    diastolic: [],
    hemoA1c: [],
    glucoseBlood: [],
    glucoseUrine: [],
    creatinine: [],
    albumin: [],
    choles: [],
    trigly: [],
    simva: [],
    lisin: [],
    RR: [],
    acar: [],
    met: [],
    Glit: [],
    DPP4: [],
    SH: [],
    notes: [],
  }
};

const hydrate: StoreEnhancer<ROOTSTATE> = autoRehydrate() as StoreEnhancer<ROOTSTATE>;
const middleware: StoreEnhancer<ROOTSTATE> = applyMiddleware(promise(), thunk, logger);
export const appStore: Store<ROOTSTATE> = createStore<ROOTSTATE>(reducer, initialState, compose(middleware, hydrate));

persistStore(appStore, { whitelist: ['storage'] }, () => {
  // rehydration complete callback
});

ReactDOM.render(
  <Provider store={appStore}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);