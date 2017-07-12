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
import { tryLogin, authUser } from './Actions/userActions';
import ROOTSTATE, { PERSONAL_INFO } from './Interfaces';

// tslint:disable:no-console
const initialState: ROOTSTATE = {
  user: {
    authStatus: false,
    data: {
      user: {} as PERSONAL_INFO,
      education: [],
      countryInterest: [],
      specializedInterest: [],
      supportDemand: [],
      countNotifications: 0
    },
    authDone: false,
    authPending: false
  },
  storage: {
    loginStatus: false,
    persistStatus: false,
    firstLogin: true
  },
  page: {
    name: '',
    content: {}
  }
};
const hydrate: StoreEnhancer<ROOTSTATE> = autoRehydrate() as StoreEnhancer<ROOTSTATE>;
const middleware: StoreEnhancer<ROOTSTATE> = applyMiddleware(promise(), thunk, logger);
export const appStore: Store<ROOTSTATE> = createStore<ROOTSTATE>(reducer, initialState, compose(middleware, hydrate));
persistStore(appStore, { whitelist: ['storage'] }, () => {
  // rehydration complete callback
  const currentState = appStore.getState();
  if (currentState.storage && !currentState.storage.persistStatus) {
    appStore.dispatch({ type: 'INIT_PERSIST_STATUS' });
  }
  if (!currentState.storage.loginStatus) {
    appStore.dispatch({ type: 'INIT_GUEST_USER' });
  }
});
appStore.subscribe(() => {
  const currentState = appStore.getState();
  if (
    !currentState.user.authDone &&
    currentState.storage.loginStatus &&
    currentState.storage.persistStatus &&
    !currentState.user.authPending
  ) {
    appStore.dispatch(authUser());
  }
  if (
    !currentState.storage.loginStatus &&
    currentState.user.authStatus
  ) {
    window.location.href = '/';
  }
});

// tslint:disable-next-line:no-string-literal
window['logincallback'] = (type: string, serverUserAuthToken: string) => {
  appStore.dispatch(tryLogin(type, serverUserAuthToken));
};

console.log('AppStore:');
console.log(appStore);

ReactDOM.render(
  <Provider store={appStore}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

console.error = (function () {
  var error = console.error;
  return function (exception: {}) {
    if ((exception + '').indexOf('Warning: A component is `contentEditable`') !== 0) {
      error.apply(console, arguments);
    }
  };
})();