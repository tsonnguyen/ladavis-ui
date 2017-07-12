export function initPageName(pageName: string){
  return {
    type: 'INIT_PAGE_NAME',
    payload: pageName
  };
}