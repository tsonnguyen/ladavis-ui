import { USER, PERSONAL_INFO } from '../Interfaces';
const initUser = {
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
};

export default function reducer(state: USER = initUser, action: any) {
  switch (action.type) {
    case 'AUTHENTICATE_USER_PENDING': {    
      return {
        ...state, 
        authPending: true
      };
    }
    case 'AUTHENTICATE_USER_FULFILLED': {    
      return {
        ...state, 
        authStatus: true, 
        authDone: true,
        data: action.payload.data.content, 
        authPending: false
      };
    }
    case 'AUTHENTICATE_USER_REJECTED': {
      window.location.href = '/';
      return {
        ...state,
        authStatus: false,
        authDone: true, 
        authPending: false
      };
    }
    case 'TRY_LOGIN_PENDING': {
      return {
        ...state, 
        authStatus: false,
        authDone: false
      };
    }
    case 'TRY_LOGIN_REJECTED': {
      return {
        ...state, 
        authStatus: false,
        authDone: true
      };
    }
    case 'INIT_PERSIST_STATUS': {
      return {...state, persistStatus: true};
    }
    case 'INIT_GUEST_USER': {
      return {...state, authDone: true};
    }
    default: return state;
  }
}