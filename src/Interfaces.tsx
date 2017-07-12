interface ROOTSTATE {
  user: USER;
  page: PAGE;
  storage: STORAGE; // remand when everything
}
export default ROOTSTATE;
export interface USER {
  authStatus: boolean; // login or not
  data: USER_DATA;
  authDone: boolean;
  authPending: boolean;
}
export interface USER_DATA_STORAGE {
  name: string;
  ava: string;
  email: string;
  id: number;
}
export interface STORAGE {
  user?: USER;
  userData?: USER_DATA_STORAGE;
  loginStatus: boolean;
  persistStatus: boolean;
  firstLogin: boolean;
}
export interface PAGE {
  name: string;
  content: any;
}
export interface Action<T> {
  type: string;
  payload: T;
  error?: boolean;
  meta?: any;
}
export interface PostJSON {
  id: number;
  picture: string;
  content: string;
  hashtags: string;
  countView: number;
  countComment: number;
  countLike: number;
  countFavorite: number;
  countLove: number;
  comments: CommentJSON[];
  love: boolean;
  favorite: boolean;
  creator: any;
  previewURL?: string;
}
export interface CommentJSON {
  id: number;
  content: string;
  feedId: number;
  creator: any;
  creatorId?: any;
  countLove?: any;
  love?: any;
}
export interface UserJSON {
  accessToken: string;
  email: string;
  expiresIn: number;
  id: string;
  name: string;
  picture: {
    data: {
      is_silhouette: boolean;
      url: string;
    }
  };
  signedRequest: string;
  userID: string;
}
export interface USER_DATA {
  user: PERSONAL_INFO;
  education: EDUCATION[];
  countryInterest: EDUCATION[];
  specializedInterest: EDUCATION[];
  supportDemand: EDUCATION[];
  countNotifications: number;
}
export interface PERSONAL_INFO {
  id: number;
  email: string;
  fullname: string;
  phone: string;
  picture: string;
  address: string;
  description: string;
  sex: true;
  birthday: string;
  passport: string;
  countPost: number;
  urlFacebook: string;
  yearBirth: number;
  currentJob: string;
  currentCompany: string;
  countryName: string;
  cityName: string;
  thirdPartyId: string;
}
interface EDUCATION {
  id: number;
  userId: number;
  universityName: string;
  cityName: string;
  countryName: string;
  educationLevelName: string;
  majorName: string;
  yearGraducation: string;
}
export interface PUBLIC_POST_PROPS {
  postInfo: PostJSON;
  loginStatus?: boolean;
  currentUserInfo?: PERSONAL_INFO;
  type?: string;
}
export interface PUBLIC_COMMENT_PROPS {
  commentInfo: CommentJSON;
  loginStatus?: boolean;
  currentUserInfo?: PERSONAL_INFO;
}

export interface NOTI_PROPS {
  notiInfo: NotiJSON;
  type: boolean;
}

export interface NotiJSON {
  commentContent: string;
  countUnseen: number;
  creatorAva: string;
  feedContent: string;
  fullname: string;
  notification: {
    commentId: number,
    creatorId: number,
    feedId: number,
    id: number,
    seen: number,
    type: number,
    userId: number,
    smCreatedTime: Date
  };
  picture: string;
}