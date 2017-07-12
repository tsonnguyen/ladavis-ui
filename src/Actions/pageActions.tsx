import { appStore } from '../index';

export function initPageName(pageName: string) {
  appStore.dispatch({
    type: 'INIT_PAGE_NAME',
    payload: pageName
  });
}

export function updateProcessRegister(process: number) {
  return {
    type: 'UPDATE_PROCESS_REGISTER',
    payload: process
  };
}

export function updateProcessError(error: boolean) {
  return {
    type: 'UPDATE_ERROR_REGISTER',
    payload: error
  };
}

export function updateCountriesRegister(countries: string[]) {
  return {
    type: 'UPDATE_COUNTRY_REGISTER',
    payload: countries
  };
}

export function updateIndustriesRegister(industries: string[]) {
  return {
    type: 'UPDATE_INDUSTRY_REGISTER',
    payload: industries
  };
}

export function updateTopicsRegister(topics: string[]) {
  return {
    type: 'UPDATE_TOPIC_REGISTER',
    payload: topics
  };
}

export function updateFieldRegister(content: {}) {
  return {
    type: 'UPDATE_FIELD_REGISTER',
    payload: content
  };
}

export function addNewSchool() {
  return {
    type: 'ADD_NEW_SCHOOL',
  };
}

export function updateSortByFav(sortby: string) {
  return {
    type: 'UPDATE_SORT_FAV',
    payload: sortby
  };
}