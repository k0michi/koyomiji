import { formatInTimeZone } from 'date-fns-tz/formatInTimeZone';

export function toISOStringJST(date: Date) {
  return formatInTimeZone(date, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function toDisplayDateString(date: Date) {
  return formatInTimeZone(date, 'Asia/Tokyo', 'yyyy.M.d');
}