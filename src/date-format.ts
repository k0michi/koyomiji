import formatInTimeZone from 'date-fns-tz/esm/formatInTimeZone';

export function toISOStringJST(date: Date) {
  return formatInTimeZone(date, 'Asia/Tokyo', "yyyy-mm-dd'T'HH:MM:ssXXX");
}

export function toDisplayDateString(date: Date) {
  return formatInTimeZone(date, 'Asia/Tokyo', 'yyyy.M.d');
}