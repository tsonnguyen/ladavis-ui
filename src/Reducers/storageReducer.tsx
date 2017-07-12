import { STORAGE } from '../Interfaces';
import { setUserStorageToken } from '../Actions/userActions';
export default function reducer(
  state: STORAGE = {
    loginStatus: false, 
    persistStatus: false,
    firstLogin: true
  }, 
  
  action: any) {
  switch (action.type) {
    case 'TRY_LOGIN_FULFILLED': {
      setUserStorageToken(action.payload.data.content.session);
      return {...state, loginStatus: true};
    }
    case 'AUTHENTICATE_USER_FULFILLED': {
      let userInfo = action.payload.data.content;
      if (userInfo.user.registerStatus !== 5) {
        if (window.location.pathname !== '/register' && state.firstLogin) {
          window.location.href = '/register';
        }
      }
      return {...state, firstLogin: false};
    }
    case 'AUTHENTICATE_USER_REJECTED': {
      window.location.href = '/';
      return {...state, loginStatus: false, firstLogin: true};
    }
    case 'INIT_PERSIST_STATUS': {
      return {...state, persistStatus: true};
    }
    case 'TRY_LOGOUT_FULFILLED': {
      setUserStorageToken(null);
      return {...state, loginStatus: false, firstLogin: true};
    }
    default: return state;
  }
}