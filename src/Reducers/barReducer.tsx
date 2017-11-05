export default function reducer(
  state: [number] = [2345], 
  action: any) {
  switch (action.type) {
    case 'ADD_PATIENT': {
      let newState = state.slice();
      for (let i = 0; i < newState.length; i++) {
        if (newState[i] === action.payload) {
          return newState;
        }
      }
      newState.push(action.payload);
      return newState;
    }
    case 'DELETE_PATIENT': {
      let newState = state.slice();
      for (let i = 0; i < newState.length; i++) {
        if (newState[i] === action.payload) {
          newState.splice(i, 1);
          break;
        }
      }
      return newState;
    }
    default: return state;
  }
}