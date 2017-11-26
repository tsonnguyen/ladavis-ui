import axios, { AxiosRequestConfig } from 'axios';

export function convertedTime (time: string) {
  return Date.parse(time) * 25 / 9 / 10000000 / 4;
}

export function renvertedTime (time: number) {
  return time / 25 * 9 * 10000000 * 4;
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

export function getAllPatient() {
  let config: AxiosRequestConfig = { headers: {} };
  let url: string = '/all-patients';
  return instanceAxios.get(url, config);
}

const shiftYear = 87;
function pad(d: number) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}

export function formatDate (dateString: string, isGetTime: boolean = false) {
  let data = new Date(dateString);
  let day = pad(data.getDate());
  let month = pad(data.getMonth() + 1);
  let year = (data.getFullYear() > 10) ? data.getFullYear() - shiftYear : data.getFullYear();
  let hour = pad(data.getHours());
  let minute = pad(data.getMinutes());
  let second = pad(data.getSeconds());
  if (isGetTime) {
    return day + '/' + month + '/' + year + ' '
          + hour + ':' + minute + ':' + second;
  } else {
    return day + '/' + month + '/' + year;
  }
}

export function addDays (date: Date, days: number) {
  var newDate: Date = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function getDatesBetween(startDate: Date, stopDate: Date) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate));
      currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}

export function calculateMiddlePoint(x1: number, y1: number, x2: number, y2: number, x: number) {
  let a = (y2 - y1) / (x2 - x1);
  let b = y1 - a * x1;
  return a * x + b;
}

export function unifyTwoPeriod(start1: any, end1: any, start2: any, end2: any) {
  start1 = new Date(start1);
  end1 = new Date(end1);
  let range1 = end1.getFullYear() - start1.getFullYear();
  start2 = new Date(start2);
  end2 = new Date(end2);
  let range2 = end2.getFullYear() - start2.getFullYear();
  start1.setFullYear(1);
  end1.setFullYear(1 + range1);
  start2.setFullYear(1);
  end2.setFullYear(1 + range2);
  
  let start = (start1 < start2) ? start1 : start2;
  let end = (end1 > end2) ? end1 : end2;

  return [start, end];
}

export function transformYear(endYear: number, data: any) {
  // let year = new Date(data[0].time).getFullYear();
  // tslint:disable-next-line:forin
  for (let i = 0; i < data.length; i++) {
    let date;
    if (data[i].startdate) {
      date = (new Date(data[i].startdate));
    } else {
      date = (new Date(data[i].time));
    }
    
    let newYear = endYear - date.getFullYear() + 1;
    if (newYear < 0 || date.getFullYear() - 2000 < 10) {
      newYear = 1;
    }
    date.setFullYear(newYear);

    if (data[i].startdate) {
      data[i].startdate = date.toString();
    } else {
      data[i].time = date.toString();
    }
  }

  return data;
}