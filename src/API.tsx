import axios, { AxiosRequestConfig } from 'axios';

export function convertedTime (time: string) {
  return Date.parse(time) * 25 / 9 / 10000000 / 4;
}

export const serverUrl = 'http://localhost:4000/ladavis/rest-api';
var instanceAxios = axios.create({
  baseURL: serverUrl
});

export function getPatientInfoById(userId: number ) {
  let config: AxiosRequestConfig = { headers: {} };
  let url: string = '/patient?id=' + userId;
  return instanceAxios.get(url, config);
}

// export function newPost(content: string, hashtags: string, imgs?: string[], previewUrl?: string, files?: string[]) {
//   const body = {
//     content: content,
//     hashtags: hashtags,
//     picture: imgs ? imgs.map((img) => (serverUrl + '/file' + img)).join(',') : '',
//     previewURL: previewUrl
//   };
//   return instanceAxios.post('/feed', body, { headers: { sessionId: userToken } });
// }
