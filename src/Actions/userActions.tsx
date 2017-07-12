import axios, { AxiosRequestConfig } from 'axios';
// import {appStore} from '../index';

const storage: Storage = localStorage || window.localStorage;
var userToken: string | null = getUserStorageToken();
export const serverUrl = 'http://192.168.0.214:8080/smartdatics-saola-api/restapi';
var instanceAxios = axios.create({
  baseURL: serverUrl
});

export function getUserStorageToken(): (string | null) {
  if (storage) {
    return storage.getItem('user_token');
  } else { return null; }
}

export function setUserStorageToken(token: string | null): void {
  if (storage) {
    if (token) {
      storage.setItem('user_token', token);
    } else { storage.removeItem('user_token'); }
    userToken = token;
  }
}

export function authUser() {
  return {
    type: 'AUTHENTICATE_USER',
    payload: instanceAxios.get('/user/info', { headers: { sessionId: userToken } })
  };
}

export function tryLogin(type: string, serverUserAuthToken: string) {
  return {
    type: 'TRY_LOGIN',
    payload: instanceAxios.get('/login/' + type + '/?code=' + serverUserAuthToken)
  };
}

export function logOut() {
  return {
    type: 'TRY_LOGOUT',
    payload: instanceAxios.get('/user/logout', { headers: { sessionId: userToken } })
  };
}

export function getUserInfoById(userId: number | undefined) {
  let config: AxiosRequestConfig = { headers: {} };
  let url: string = '/user/info?user-id=' + userId;
  return instanceAxios.get(url, config);
}

export function getUserPost(lastPostId: number | undefined) {
  let config: AxiosRequestConfig = { headers: {} };
  if (userToken) { config.headers.sessionId = userToken; }
  let url: string = '/feed/user';
  url += lastPostId ? ('?last-id=' + lastPostId.toString()) : '';
  return instanceAxios.get(url, config);
}

export function getPostByType(type: string, lastPostId: number | undefined, data?: any) {
  let config: AxiosRequestConfig = { headers: {} };
  if (userToken) { config.headers.sessionId = userToken; }
  let url: string = '/feed/' + type;
  url += lastPostId 
      ? ( (type.includes('?')) ? '&token=' + lastPostId.toString() : '?token=' + lastPostId.toString() ) 
      : '';
  if (type === 'tag') {
    url += lastPostId ? '&' : '?';
    url += 'tag=' + window.location.pathname.split('/hashtag/')[1];
  }
  return instanceAxios.get(url, config);
}

export function getPostComment(feedId: number, lastCommentId: number | undefined) {
  let config: AxiosRequestConfig = { headers: {} };
  if (userToken) { config.headers.sessionId = userToken; }
  let url: string = '/comment/feed?feed-id=' + feedId;
  url += lastCommentId ? ('&token=' + lastCommentId.toString()) : '';
  return instanceAxios.get(url, config);
}

export function getPostById(id: string) {
  let config: AxiosRequestConfig = { headers: {} };
  if (userToken) { config.headers.sessionId = userToken; }
  return instanceAxios.get('/feed?id=' + id, config);
}
export function newPost(content: string, hashtags: string, imgs?: string[], previewUrl?: string, files?: string[]) {
  const body = {
    content: content,
    hashtags: hashtags,
    picture: imgs ? imgs.map((img) => (serverUrl + '/file' + img)).join(',') : '',
    previewURL: previewUrl
  };
  return instanceAxios.post('/feed', body, { headers: { sessionId: userToken } });
}

export function updateUserPersonalInfo(info: any) {
  let body = {
    fullname: info.fullname,
    description: info.description,
    sex: info.sex,
    yearBirth: info.yearBirth,
    currentJob: info.currentJob,
    currentCompany: info.currentCompany,
    countryName: info.countryName,
    cityName: info.cityName,
    type: info.type
  };
  instanceAxios.put('/user/info/', body, { headers: { sessionId: userToken } });
}
export function updateRegisterStatus(status: number) {
  let body = {
    registerStatus: status
  };
  return instanceAxios.put('/user/info/', body, { headers: { sessionId: userToken } });
}

export function updateUserEducation(educations: any) {
  for (let i = 0; i < educations.length; i++) {
    let body = {
      id: null,
      universityName: educations[i].universityName,
      cityName: educations[i].cityName,
      countryName: educations[i].countryName,
      educationLevelName: educations[i].educationLevelName,
      majorName: educations[i].majorName,
      yearGraducation: educations[i].yearGraducation
    };
    if (educations[i].id != null) {
      body.id = educations[i].id;
      instanceAxios.put('/user/education/', body, { headers: { sessionId: userToken } });
    } else {
      instanceAxios.post('/user/education/', body, { headers: { sessionId: userToken } });
    }
  }
}

export function updateUserCountries(countries: string[], id: number = -1) {
  if (countries.length === 0) { return; }

  if (id === -1) {
    let body = {
      countryListName: countries.join(',')
    };
    instanceAxios.post('/user/country-interest/', body, { headers: { sessionId: userToken } });
  } else {
    let body = {
      id: id,
      countryListName: countries.join(',')
    };
    instanceAxios.put('/user/country-interest/', body, { headers: { sessionId: userToken } });
  }
}

export function updateUserIndustries(industries: string[], id: number = -1) {
  if (industries.length === 0) { return; }

  if (id === -1) {
    let body = {
      speciListName: industries.join(',')
    };
    instanceAxios.post('/user/specialized-interest/', body, { headers: { sessionId: userToken } });
  } else {
    let body = {
      id: id,
      speciListName: industries.join(',')
    };
    instanceAxios.put('/user/specialized-interest/', body, { headers: { sessionId: userToken } });
  }
}

export function updateUserTopics(topics: string[], id: number = -1) {
  if (topics.length === 0) { return; }

  if (id === -1) {
    let body = {
      demandListName: topics.join(',')
    };
    instanceAxios.post('/user/support-demand/', body, { headers: { sessionId: userToken } });
  } else {
    let body = {
      id: id,
      demandListName: topics.join(',')
    };
    instanceAxios.put('/user/support-demand/', body, { headers: { sessionId: userToken } });
  }
}

export function handleError(error: any, type?: string) {
  if (error.response && error.response.data && error.response.data.content === 'Session not found') {
    setUserStorageToken(null);
    window.location.href = '/';
  }
  if (
    error.response &&
    error.response.data &&
    error.response.data.messageList &&
    error.response.data.messageList[0] === 'Session not found') {
    setUserStorageToken(null);
    window.location.href = '/';
  }
}

export function postComment(content: string, postId: number) {
  const body = {
    content: content,
    feedId: postId
  };
  return instanceAxios.post('/comment', body, { headers: { sessionId: userToken } });
}
export function lovePost(postId: number, type: number = 1) {
  const body = {
    rowId: postId,
    type: type
  };
  return instanceAxios.post('/feed-love', body, { headers: { sessionId: userToken } });
}
export function unLovePost(postId: number, type: number = 1) {
  return instanceAxios.delete('/feed-love?type=' + type + '&rowId=' + postId, { headers: { sessionId: userToken } });
}

export function favPost(postId: number) {
  const body = {
    feedId: postId,
  };
  return instanceAxios.post('/feed-favorite', body, { headers: { sessionId: userToken } });
}
export function unFavPost(postId: number) {
  return instanceAxios.delete('/feed-favorite/?feedId=' + postId, { headers: { sessionId: userToken } });
}

export function getUserComment(lastCommentId: number | undefined) {
  let config: AxiosRequestConfig = { headers: {} };
  if (userToken) { config.headers.sessionId = userToken; }
  let url: string = '/comment/user';
  url += lastCommentId ? ('?last-id=' + lastCommentId.toString()) : '';
  return instanceAxios.get(url, config);
}

export function uploadImg(file: File) {
  const data = new FormData();

  data.append('file', file);

  return instanceAxios.post('/file/image', data, {
    headers: {
      sessionId: userToken
    }
  });
}

export function getNoti(lastNotiId: string | undefined) {
  let url: string = '/notification';
  url += lastNotiId ? ('?token=' + lastNotiId) : '';
  return instanceAxios.get(url, { headers: { sessionId: userToken } });
}

export function updateNotiStatus(notiId: number) {
  let config: AxiosRequestConfig = { headers: { sessionId: userToken } };
  if (userToken) { config.headers.sessionId = userToken; }
  let url: string = '/notification';
  url += notiId ? ('?notiId=' + notiId.toString()) : '';
  instanceAxios.put(url, {}, config);
}
export function getYoutubeThumbnail(url: string) {
  return instanceAxios.get('/forward?serviceId=youtube-preview&params=url=' + url + '&format=json');
}
export function getCountry(id: string) {
  return instanceAxios.get('/forward?serviceId=youtube-preview&params=url=' + id + '&format=json');
}