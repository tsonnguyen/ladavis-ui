import { PAGE } from '../Interfaces';

export default function reducer(state: PAGE = {name: '', content: {}}, action: any) {
  switch (action.type) {
    case 'AUTHENTICATE_USER_FULFILLED': {   
      let content = {...state.content};
      content.personal_info = {...action.payload.data.content.user};
      if (action.payload.data.content.education && action.payload.data.content.education.length) {
        content.educations = [...action.payload.data.content.education];
      } else {
        content.educations = [];
      }
      if (state.name === 'ProfileInfo') {
        content.countries = action.payload.data.content.countryInterest;
        content.industries = action.payload.data.content.specializedInterest;
        content.topics = action.payload.data.content.supportDemand;
      } else if (state.name === 'Home') {
        content.countries = action.payload.data.content.countryInterest;
        content.industries = action.payload.data.content.specializedInterest;
      }
      return {...state, content: content};
    }
    case 'INIT_PAGE_NAME': {
      if (action.payload === 'Register') {
        let initContent = { process: 0 , error: false};
        return {...state, name: action.payload, content: initContent};
      } else if (action.payload === 'Favorite') {
        let initContent = { sortby: 'default'};
        return {...state, name: action.payload, content: initContent};
      } else {
        return {...state, name: action.payload};
      }
    }
    case 'UPDATE_ERROR_REGISTER': {
      let content = {...state.content};
      content.error = action.payload;
      return {...state, content: content};
    }
    case 'UPDATE_PROCESS_REGISTER': {
      let content = {...state.content};
      content.process = action.payload;
      return {...state, content: content};
    }
    case 'UPDATE_COUNTRY_REGISTER': {
      let content = {...state.content};
      if (state.name === 'Register') {
        content.countries = action.payload;
      } else if (state.name === 'ProfileInfo' || state.name === 'Home') {
        let str = action.payload.join(',');
        if (content.countries) {
          content.countries.countryListName = str;
        } else {
          // todo
        }
      }
      return {...state, content: content};
    }
    case 'UPDATE_INDUSTRY_REGISTER': {
      let content = {...state.content};
      if (state.name === 'Register') {
        content.industries = action.payload;
      } else if (state.name === 'ProfileInfo' || state.name === 'Home') {
        let str = action.payload.join(',');
        if (content.industries) {
          content.industries.speciListName = str;
        } else {
          // todo
        }     
      }
      return {...state, content: content};
    }
    case 'UPDATE_TOPIC_REGISTER': {
      let content = {...state.content};
      if (state.name === 'Register') {
        content.topics = action.payload;
      } else if (state.name === 'ProfileInfo') {
        let str = action.payload.join(',');
        if (content.topics) {
          content.topics.demandListName = str;
        } else {
          // todo
        } 
      }
      return {...state, content: content};
    }
    case 'UPDATE_FIELD_REGISTER': {
      let content = {...state.content};
      if (state.name === 'Register') {
        if (content.process === 1) {
          content.personal_info[action.payload.key] = action.payload.value;
        } else if (content.process === 2) {
          let key = action.payload.key.toString().split('_')[0];
          // tslint:disable-next-line:radix
          let index = parseInt(action.payload.key.toString().split('_')[1]);
          content.educations[index][key] = action.payload.value;
        } 
      } else if (state.name === 'ProfileInfo') {
        if (!action.payload.key.includes('edu')) {
          content.personal_info[action.payload.key] = action.payload.value;
        } else {
          let key = action.payload.key.toString().split('_')[0];
          key = key.replace('edu', '');
          key = key.substr(0, 1).toLowerCase() + key.substr(1);
          // tslint:disable-next-line:radix
          let index = parseInt(action.payload.key.toString().split('_')[1]);
          content.educations[index][key] = action.payload.value;
        }
      }
      return {...state, content: content};
    }
    case 'ADD_NEW_SCHOOL': {
      let content = {...state.content};
      content.educations.push({});
      return {...state, content: content};
    }
    case 'UPDATE_SORT_FAV': {
      let content = {...state.content};
      content.sortby = action.payload;
      return {...state, content: content};
    }
    default: return state;
  }
}