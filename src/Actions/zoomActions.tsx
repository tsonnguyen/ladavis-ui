
export function updateZoomRange(zoomRange: [number, number]) {
  return {
    type: 'UPDATE_ZOOM_RANGE',
    payload: zoomRange
  };
}