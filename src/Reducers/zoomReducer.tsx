export default function reducer(
  state: [number, number] = [0, 100], 
  action: any) {
  switch (action.type) {
    case 'UPDATE_ZOOM_RANGE': {
      return action.payload;
    }
    default: return state;
  }
}